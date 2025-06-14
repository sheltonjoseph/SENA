import { PrismaClient } from '@prisma/client';
import { format, addDays, isWithinInterval } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.hold.deleteMany();
  await prisma.deskAvailability.deleteMany();
  await prisma.desk.deleteMany();
  await prisma.location.deleteMany();
  await prisma.timeSlot.deleteMany();
  console.log('Cleared existing data.');

  // Create Locations
  const locationsData = [
    {
      id: 'loc1', name: 'Downtown Innovation Hub',
      address: '123 Business District, Downtown',
      description: 'Premium workspace in the heart of the financial district'
    },
    {
      id: 'loc2', name: 'Creative Co-Space',
      address: '456 Arts Quarter, Midtown',
      description: 'Inspiring environment for creative professionals'
    },
    {
      id: 'loc3', name: 'Tech Innovation Center',
      address: '789 Silicon Valley, Tech District',
      description: 'State-of-the-art facility for tech companies'
    }
  ];
  await prisma.location.createMany({ data: locationsData });
  console.log(`Created ${locationsData.length} locations.`);

  // Create Time Slots
  const timeSlotsData = [
    { id: 'ts1', start_time: '09:00', end_time: '13:00', label: 'Morning (9AM - 1PM)' },
    { id: 'ts2', start_time: '13:00', end_time: '17:00', label: 'Afternoon (1PM - 5PM)' },
    { id: 'ts3', start_time: '17:00', end_time: '21:00', label: 'Evening (5PM - 9PM)' }
  ];
  await prisma.timeSlot.createMany({ data: timeSlotsData });
  console.log(`Created ${timeSlotsData.length} time slots.`);

  // Generate Desks (20 desks per location, total 60 desks)
  const desksData = [];
  const deskTypes = ['Hot Desk', 'Private Office', 'Meeting Room'];

  locationsData.forEach(location => {
    for (let i = 1; i <= 20; i++) { // 20 desks per location
      desksData.push({
        id: `${location.id}-desk${i}`,
        location_id: location.id,
        name: `Desk ${i}`,
        floor: `Floor ${Math.floor((i - 1) / 10) + 1}`,
        seat_type: deskTypes[Math.floor(Math.random() * deskTypes.length)],
        description: `A comfortable ${deskTypes[Math.floor(Math.random() * deskTypes.length)].toLowerCase()} at ${location.name}.`
      });
    }
  });
  await prisma.desk.createMany({ data: desksData });
  console.log(`Created ${desksData.length} desks.`);

  // Generate Desk Availability for 7 days
  const SEEDING_DAYS_COUNT = 7; // Number of days to seed from today
  const TARGET_START_DATE = new Date('2025-06-14T00:00:00'); // Specific start date for controlled distribution
  const TARGET_END_DATE = addDays(TARGET_START_DATE, SEEDING_DAYS_COUNT - 1); // Specific end date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

  // Define specific available seat targets for the target date range
  const specificDateTargets = {
    'loc1': { ts1: 6, ts2: 6, ts3: 5 }, // 17 available for loc1
    'loc2': { ts1: 6, ts2: 6, ts3: 5 }, // 17 available for loc2
    'loc3': { ts1: 5, ts2: 5, ts3: 6 }, // 16 available for loc3
  };
  const TOTAL_TARGET_AVAILABLE_PER_DAY = 50; // Total 50 seats available per day in the specific range

  for (let d = 0; d < SEEDING_DAYS_COUNT; d++) {
    const currentDay = addDays(today, d);
    currentDay.setHours(0, 0, 0, 0); // Normalize currentDay to start of day
    const dateString = format(currentDay, 'yyyy-MM-dd');
    const date = dateString; // Use the formatted date string

    let allDayAvailabilities = [];

    const isWithinTargetRange = isWithinInterval(currentDay, {
      start: TARGET_START_DATE,
      end: TARGET_END_DATE,
    });

    desksData.forEach(desk => {
      timeSlotsData.forEach(timeSlot => {
        allDayAvailabilities.push({
          desk_id: desk.id,
          date: date,
          time_slot_id: timeSlot.id,
          price: 20.00,
          rating: 4.5,
          status: 'available' // Initially all available
        });
      });
    });

    if (isWithinTargetRange) {
      const finalAvailabilities = [];
      locationsData.forEach(location => {
        timeSlotsData.forEach(timeSlot => {
          const targetAvailable = specificDateTargets[location.id][timeSlot.id];
          const locationTimeSlotAvailabilities = allDayAvailabilities.filter(
            da => da.desk_id.startsWith(location.id) && da.time_slot_id === timeSlot.id
          );

          const shuffled = locationTimeSlotAvailabilities.sort(() => 0.5 - Math.random());

          for (let i = 0; i < shuffled.length; i++) {
            if (i < targetAvailable) {
              shuffled[i].status = 'available';
            } else {
              shuffled[i].status = 'booked';
            }
          }
          finalAvailabilities.push(...shuffled);
        });
      });

      const finalAvailabilitiesWithIds = finalAvailabilities.map(da => ({
        ...da,
        id: `da-${da.desk_id}-${format(da.date, 'yyyyMMdd')}-${da.time_slot_id}`
      }));
      await prisma.deskAvailability.createMany({ data: finalAvailabilitiesWithIds });
      console.log(`Seeded ${finalAvailabilitiesWithIds.length} desk availabilities for ${dateString} (specific distribution).`);

    } else {
      // For days outside the specific range, ensure 50 available seats randomly
      const totalSlots = allDayAvailabilities.length;
      const slotsToBook = totalSlots - TOTAL_TARGET_AVAILABLE_PER_DAY;

      if (slotsToBook > 0) {
        const shuffledAvailabilities = allDayAvailabilities.sort(() => 0.5 - Math.random());
        for (let i = 0; i < slotsToBook; i++) {
          if (shuffledAvailabilities[i]) {
            shuffledAvailabilities[i].status = 'booked';
          }
        }
      }

      const finalAvailabilities = allDayAvailabilities.map(da => ({
        ...da,
        id: `da-${da.desk_id}-${format(da.date, 'yyyyMMdd')}-${da.time_slot_id}`
      }));

      await prisma.deskAvailability.createMany({ data: finalAvailabilities });
      console.log(`Seeded ${finalAvailabilities.length} desk availabilities for ${dateString} (generic distribution).`);
    }
  }

  console.log('Seeding finished.');
}

main().then(() => {
  console.log("Seeded DB successfully");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
