import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/desks/location/:locationId - Get all desks for a location
router.get('/location/:locationId', async (req, res) => {
  try {
    const desks = await prisma.desk.findMany({
      where: { location_id: req.params.locationId }
    });
    res.json({
      success: true,
      data: desks
    });
  } catch (error) {
    console.error('Error fetching desks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch desks'
    });
  }
});

// GET /api/desks/:id/availability - Get desk availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required'
      });
    }

    const availability = await prisma.deskAvailability.findMany({
      where: {
        desk_id: req.params.id,
        date: date
      },
      include: {
        timeSlot: true
      }
    });

    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error fetching desk availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch desk availability'
    });
  }
});

// POST /api/desks/hold - Hold a desk
router.post('/hold', async (req, res) => {
  try {
    const { deskId, timeSlotId, date } = req.body;

    // Check if desk is available
    const availability = await prisma.deskAvailability.findFirst({
      where: {
        desk_id: deskId,
        time_slot_id: timeSlotId,
        date: date,
        status: 'available'
      }
    });

    if (!availability) {
      return res.status(400).json({
        success: false,
        error: 'Desk is not available for the selected time slot'
      });
    }

    // Create hold
    const hold = await prisma.hold.create({
      data: {
        id: `hold_${Date.now()}`,
        desk_availability_id: availability.id,
        user_email: 'placeholder@example.com',
        expires_at: new Date(Date.now() + 60 * 1000) // 60 seconds from now
      }
    });

    // Update availability status
    await prisma.deskAvailability.update({
      where: { id: availability.id },
      data: { status: 'held' }
    });

    res.json({
      success: true,
      data: {
        holdId: hold.id,
        expiresAt: hold.expires_at
      }
    });
  } catch (error) {
    console.error('Error holding desk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to hold desk'
    });
  }
});

// DELETE /api/desks/hold/:holdId - Release a hold
router.delete('/hold/:holdId', async (req, res) => {
  try {
    const { holdId } = req.params;

    const hold = await prisma.hold.findUnique({
      where: { id: holdId },
      include: {
        availability: true
      }
    });

    if (!hold) {
      return res.status(404).json({
        success: false,
        error: 'Hold not found'
      });
    }

    // Update desk availability status back to available
    await prisma.deskAvailability.update({
      where: { id: hold.availability.id },
      data: { status: 'available' }
    });

    // Delete the hold record
    await prisma.hold.delete({
      where: { id: holdId }
    });

    res.json({
      success: true,
      message: 'Hold released successfully'
    });
  } catch (error) {
    console.error('Error releasing hold:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to release hold'
    });
  }
});

// POST /api/desks/book - Book a desk
router.post('/book', async (req, res) => {
  try {
    const { holdId } = req.body;
    console.log('Received holdId for booking:', holdId);

    // Get hold details
    const hold = await prisma.hold.findUnique({
      where: { id: holdId },
      include: {
        availability: {
          include: {
            desk: {
              include: {
                location: true
              }
            },
            timeSlot: true
          }
        }
      }
    });
    console.log('Retrieved hold object:', hold);

    if (!hold) {
      return res.status(404).json({
        success: false,
        error: 'Hold not found'
      });
    }

    if (hold.expires_at < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Hold has expired'
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        id: `booking_${Date.now()}`,
        hold_id: holdId,
        qr_code: `qr_${Date.now()}`,
        pdf_ticket_url: `/tickets/${Date.now()}.pdf`
      }
    });

    // Update availability status
    await prisma.deskAvailability.update({
      where: { id: hold.availability.id },
      data: { status: 'booked' }
    });

    res.json({
      success: true,
      data: {
        bookingId: booking.id,
        qrCode: booking.qr_code,
        pdfTicketUrl: booking.pdf_ticket_url,
        deskName: hold.availability.desk.name,
        locationName: hold.availability.desk.location.name,
        date: hold.availability.date, // Assuming date is stored as string YYYY-MM-DD
        timeSlot: `${hold.availability.timeSlot.startTime} - ${hold.availability.timeSlot.endTime}`,
        price: hold.availability.timeSlot.price
      }
    });
  } catch (error) {
    console.error('Error booking desk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book desk'
    });
  }
});

export default router; 