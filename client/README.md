# 3legant - E-Commerce Client

Modern e-commerce frontend built with React, Vite, and Tailwind CSS.

## Features

- Responsive design with mobile-first approach
- Product catalog with filtering and search
- Shopping cart functionality
- User authentication flows
- Admin dashboard for management
- Built with modern React (v19) and Vite

## Tech Stack

- React 19
- Vite (with HMR)
- Tailwind CSS
- Radix UI components
- React Router
- Zustand for state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the client directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:5000
# Add other required environment variables here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
client/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── routers/       # Routing configuration
│   ├── store/        # State management
│   ├── lib/          # Utility functions
│   ├── assets/        # Static assets
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── public/            # Public assets
└── vite.config.js     # Vite configuration
```

## Dependencies

Key dependencies:

- `@radix-ui/react-*` - Accessible UI primitives
- `lucide-react` - Icons
- `tailwindcss` - Utility-first CSS
- `zustand` - State management
- `react-router-dom` - Routing

See `package.json` for complete list.

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT
