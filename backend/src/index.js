import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import locationRouter from './routes/locationRoutes.js';
import deskRouter from './routes/deskRoutes.js';
import timeSlotRouter from './routes/timeSlotRoutes.js';
import dayPlanRouter from './routes/dayPlanRoutes.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use('/api/locations', locationRouter);
app.use('/api/desks', deskRouter);
app.use('/api/time-slots', timeSlotRouter);
app.use('/api/day-plan', dayPlanRouter);

app.get('/', (req, res) => {
  res.send('Desk Booking Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
