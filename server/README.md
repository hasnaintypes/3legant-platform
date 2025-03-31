# 3legant - E-Commerce Server

## Overview

Backend server for the 3legant e-commerce platform built with Node.js, Express, and MongoDB. This server provides a robust API for managing products, users, orders, and shopping cart functionality with secure authentication.

## Features

- RESTful API endpoints with comprehensive documentation
- JWT-based authentication and authorization
- CRUD operations for products, users, orders, and reviews
- Shopping cart and wishlist management
- Order processing and tracking
- Input validation and sanitization
- Error handling middleware
- Rate limiting and security features

## Tech Stack

- Node.js 18+
- Express.js 4.x
- MongoDB (with Mongoose ODM)
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for request validation

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
4. Create a `.env` file in the server directory with required environment variables
5. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
server/
├── config/        # Database and app configuration
├── controllers/   # Route controllers (business logic)
├── middlewares/   # Custom middleware
│   ├── auth/      # Authentication middleware
│   └── validate/  # Request validation
├── models/        # MongoDB models and schemas
├── routes/        # API routes
├── utils/         # Utility functions and helpers
├── validators/    # Request validation schemas
├── app.js         # Express app configuration
└── server.js      # Server entry point
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
  ```json
  // Request body
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Product Endpoints

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - List all users (Admin)

### Order Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Cart Endpoints

- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_FROM=your_email@domain.com
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Request rate limiting
- Input validation and sanitization
- CORS configuration
- HTTP security headers
- Error handling middleware

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  }
}
```

## Dependencies

Key packages:

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing
- `express-validator` - Request validation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `nodemailer` - Email sending

See `package.json` for complete list.

## Development Guidelines

1. Follow ESLint and Prettier configurations
2. Write unit tests for new features
3. Use async/await for asynchronous operations
4. Follow REST API best practices
5. Document new endpoints and changes

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## Testing

- Unit tests with Jest
- API endpoint testing with Supertest
- Run tests with `npm test`

## Deployment

1. Set up environment variables
2. Build the application
3. Start the server with PM2 or similar process manager
4. Configure reverse proxy (Nginx recommended)

## License

MIT
