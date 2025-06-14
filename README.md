# Desk Booking Application

A modern web application for booking desks and workspaces in various locations. The application allows users to search for locations, check desk availability, and generate day plans based on their preferences.

## Project Overview

### Frontend
- Built with React, TypeScript, and Vite
- Real-time search and filtering capabilities
- Interactive desk selection and booking interface
- Day plan generation with AI assistance

### Backend
- Node.js and Express.js server
- PostgreSQL database with Prisma ORM
- OpenAI integration for day plan generation
- RESTful API endpoints for location and desk management

## Quick Start with Docker

1. Make sure you have Docker and Docker Compose installed
2. Set up your environment variables:
   ```bash
   # Create .env file in the root directory
   echo "OPENAI_API_KEY=your_openai_api_key" > .env
   ```
3. Run the application:
   ```bash
   docker compose up --build
   ```
4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Manual Setup (If Docker is not working)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   # Start PostgreSQL container
   docker run --name postgres-db -e POSTGRES_DB=mydb -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:13
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Location Search**: Find available workspaces near you
- **Desk Availability**: Check real-time availability of desks
- **Smart Booking**: Book desks based on your preferences
- **Day Planning**: AI-powered day plan generation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- @tanstack/react-query
- @tailwindcss
- date-fns
- axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- OpenAI API
- JWT Authentication

## Project Structure
```
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── api/       # API client functions
│   │   ├── components/# React components
│   │   ├── types/     # TypeScript types
│   │   └── utils/     # Utility functions
│   └── package.json
│
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/# Request handlers
│   │   ├── routes/    # API routes
│   │   ├── prisma/    # Database schema
│   │   └── utils/     # Utility functions
│   └── package.json
│
└── docker-compose.yml # Docker configuration
```

## Troubleshooting

### Docker Issues
1. If Docker containers fail to start:
   - Check if ports 3000 and 5000 are available
   - Ensure Docker daemon is running
   - Try running `docker compose down` and then `docker compose up --build`

### Database Issues
1. If the database connection fails:
   - Check if PostgreSQL container is running
   - Verify database credentials in .env files
   - Try restarting the PostgreSQL container

### API Connection Issues
1. If frontend can't connect to backend:
   - Verify backend is running on port 5000
   - Check CORS settings in backend
   - Ensure API_URL in frontend .env is correct


## License

MIT
