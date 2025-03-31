# 3legant - E-Commerce Client

<div align="center">

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-161618?logo=radix-ui)](https://www.radix-ui.com/)
[![Zustand](https://img.shields.io/badge/Zustand-Latest-FF69B4)](https://github.com/pmndrs/zustand)

</div>

Modern e-commerce frontend built with React, Vite, and Tailwind CSS, featuring a sleek and responsive design.

## Features

### User Interface

- Responsive design with mobile-first approach
- Modern and intuitive UI components built with Radix UI
- Smooth animations and transitions
- Dark/Light mode support

### Shopping Experience

- Product catalog with advanced filtering and search
- Real-time product availability
- Shopping cart with persistent storage
- Wishlist functionality
- Secure checkout process

### User Management

- User authentication with JWT
- Profile management
- Order history tracking
- Address book management

### Admin Features

- Dashboard for sales analytics
- Product management (CRUD operations)
- Order management system
- Customer data management

## Tech Stack

### Core

- **React 19** - Latest version with improved performance and features
- **Vite** - Next-generation frontend tooling with instant HMR
- **Tailwind CSS** - Utility-first CSS framework

### UI Components

- **Radix UI** - Headless UI components
- **Lucide React** - Beautiful icons
- **Tailwind Merge** - Utility for merging Tailwind classes

### State Management & Routing

- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nainee99/3legant.git
   ```

2. Navigate to the client directory:

   ```bash
   cd 3legant-platform/client
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Setup

Create a `.env` file in the client directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=3legant
VITE_APP_DESCRIPTION="Modern E-Commerce Platform"
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Basic UI elements
│   │   └── shared/    # Shared components
│   ├── pages/         # Page components
│   ├── routers/       # Routing configuration
│   ├── store/         # Zustand store and slices
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Third-party integrations
│   ├── utils/         # Utility functions
│   ├── assets/        # Static assets
│   ├── styles/        # Global styles
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── public/            # Public assets
└── vite.config.js     # Vite configuration
```

## Development Guidelines

### Code Style

- Follow the ESLint configuration
- Use TypeScript for type safety
- Follow component composition patterns
- Implement proper error boundaries

### State Management

- Use Zustand for global state
- Implement proper data fetching patterns
- Handle loading and error states

### Testing

- Write unit tests for utilities
- Write integration tests for components
- Test error scenarios

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Preview the build:

   ```bash
   npm run preview
   ```

3. Deploy the `dist` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

### Pull Request Guidelines

- Follow the existing code style
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass

## License

MIT

## Support

For support nainee909@gmail.com or join our Slack channel.
