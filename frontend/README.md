# Frontend Service

This is the frontend service for the desk booking application, built with React, TypeScript, and Vite.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL="http://localhost:5000/api"
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will start on http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run linter
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client functions
│   │   └── shared/   # Shared components
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── App.tsx       # Main application component
```

## Features

- Location search
- Desk availability checking
- Day plan generation
- Responsive design
- Real-time updates

## Dependencies

- React
- TypeScript
- Vite
- @tanstack/react-query
- @mantine/core
- @mantine/hooks
- date-fns
- axios

## Troubleshooting

1. **Installation Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json
   - Run `npm install` again

2. **Development Server Issues**
   - Check if port 3000 is available
   - Ensure all dependencies are installed
   - Check for TypeScript errors

3. **Build Issues**
   - Check for TypeScript errors
   - Ensure all dependencies are installed
   - Clear build cache

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT
