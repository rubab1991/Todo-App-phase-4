# Todo App Frontend

A modern, responsive todo application with authentication built using Next.js 16+, TypeScript, and Tailwind CSS.

## Features

- User authentication (sign up and sign in)
- Task management (create, read, update, delete)
- Task filtering and sorting
- Responsive design for desktop, tablet, and mobile
- Modern UI with clean aesthetics

## Prerequisites

- Node.js 18+ (recommended: use LTS version)
- npm 8+ or yarn 1.22+

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the frontend directory with the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code issues

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   ├── signin/            # Sign-in page
│   ├── signup/            # Sign-up page
│   └── tasks/             # Tasks dashboard
├── components/            # Reusable UI components
│   ├── ui/               # Generic UI components
│   ├── auth/             # Authentication components
│   ├── tasks/            # Task-related components
│   └── navigation/       # Navigation components
├── lib/                  # Utility functions and API client
│   ├── api.ts            # API client with JWT handling
│   └── auth.ts           # Authentication utilities
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Key Technologies

- **Next.js 16+** - React framework with App Router
- **React 19+** - UI library
- **TypeScript 5+** - Type safety
- **Tailwind CSS 3.4+** - Styling framework
- **Better Auth** - Authentication solution

## API Integration

The frontend communicates with the backend API using the centralized API client in `lib/api.ts`. All authenticated requests automatically include JWT tokens in the Authorization header.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request