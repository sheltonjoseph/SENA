import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/time-slots - Get all time slots
router.get('/', async (req, res) => {
  try {
    const timeSlots = await prisma.timeSlot.findMany();
    res.json({
      success: true,
      data: timeSlots
    });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time slots'
    });
  }
});

export default router; 