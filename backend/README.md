# Backend Service

This is the backend service for the desk booking application, built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)
- OpenAI API Key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
OPENAI_API_KEY="your-openai-api-key"
PORT=5000
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

1. Start the PostgreSQL container:
```bash
docker run --name postgres-db -e POSTGRES_DB=mydb -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:13
```

2. Wait for the container to start (about 10-15 seconds)

#### Option B: Using Local PostgreSQL

1. Install PostgreSQL if not already installed
2. Create a database named 'mydb'
3. Create a user with the credentials specified in your .env file

### 3. Database Setup with Prisma

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Seed the database with initial data:
```bash
npx prisma db seed
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### Locations
- `GET /api/locations/search` - Search locations
- `GET /api/locations/:id` - Get location details
- `GET /api/locations/:id/availability` - Get desk availability

### Day Plans
- `POST /api/day-plans/generate` - Generate a day plan

## Database Schema

The application uses the following main models:

```prisma
model Location {
  id        String   @id @default(uuid())
  name      String
  address   String
  desks     Desk[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Desk {
  id          String     @id @default(uuid())
  name        String
  locationId  String
  location    Location   @relation(fields: [locationId], references: [id])
  timeSlots   TimeSlot[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model TimeSlot {
  id        String   @id @default(uuid())
  startTime DateTime
  endTime   DateTime
  price     Float
  deskId    String
  desk      Desk     @relation(fields: [deskId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build the application
- `npm test` - Run tests
- `npm run lint` - Run linter

### Prisma Commands

- `npx prisma generate` - Generate Prisma Client
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma db seed` - Seed the database with initial data

## Troubleshooting

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env
   - Verify database credentials

2. **Prisma Issues**
   - Run `npx prisma generate` to regenerate the client
   - Check if database is running and accessible
   - Verify schema.prisma file is correct

3. **Port Already in Use**
   - Change PORT in .env
   - Kill the process using the port

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT 