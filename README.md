# 3legant - MERN Stack E-Commerce Platform

## Overview
A full-stack e-commerce solution built with:
- **Frontend**: React 19, Vite, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, MongoDB
- **State Management**: Zustand

## Features
### Client
- Responsive design with mobile-first approach
- Product catalog with filtering and search
- Shopping cart functionality
- User authentication flows
- Admin dashboard

### Server
- RESTful API endpoints
- JWT authentication
- CRUD operations for products, users, orders
- Shopping cart functionality
- Error handling middleware

## Project Structure
```
3legant/
├── client/            # React frontend
│   ├── src/          # Application source
│   ├── public/       # Static assets
│   └── vite.config.js
└── server/           # Node.js backend
    ├── config/       # Database config
    ├── controllers/  # Route handlers
    ├── models/       # MongoDB models
    └── routes/       # API endpoints
```

## Getting Started
### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account or local MongoDB

### Installation
1. Clone the repository
2. Install dependencies for both client and server:
```bash
cd client && npm install
cd ../server && npm install
```

### Running the Application
1. Start the development servers:
```bash
# In one terminal:
cd client && npm run dev

# In another terminal:
cd ../server && npm start
```

2. Access the application at `http://localhost:5173`

## Available Scripts
### Client
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

### Server
- `npm start` - Start server
- `npm run dev` - Start in dev mode

## License
MIT