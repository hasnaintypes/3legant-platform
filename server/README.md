# 3legant - E-Commerce Server

## Overview
Backend server for the 3legant e-commerce platform built with Node.js, Express, and MongoDB.

## Features
- RESTful API endpoints
- JWT authentication
- CRUD operations for products, users, orders
- Shopping cart functionality
- Error handling middleware

## Tech Stack
- Node.js 18+
- Express.js
- MongoDB (with Mongoose ODM)
- JWT for authentication
- Bcrypt for password hashing

## Getting Started
### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

### Installation
1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the server directory with your environment variables

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Project Structure
```
server/
├── config/        # Database configuration
├── controllers/   # Route controllers
├── middlewares/   # Custom middleware
├── models/        # MongoDB models
├── routes/        # API routes
├── utils/         # Utility functions
├── validators/    # Request validation schemas
├── app.js         # Express app configuration
└── server.js      # Server entry point
```

## API Documentation
Key endpoints:
- `/api/auth` - Authentication routes
- `/api/products` - Product management
- `/api/users` - User management
- `/api/orders` - Order processing
- `/api/cart` - Shopping cart operations

## Environment Variables
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

## Dependencies
Key packages:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing

See `package.json` for complete list.

## Contributing
1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License
MIT