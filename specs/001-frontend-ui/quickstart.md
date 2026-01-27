# Quickstart Guide: Frontend UI for Phase II Full-Stack Todo Web Application

**Feature**: Frontend UI Implementation
**Date**: 2026-01-16
**Branch**: 001-frontend-ui

## Getting Started

This guide will help you set up and run the frontend for the todo application.

### Prerequisites

- Node.js 18+ (recommended: use LTS version)
- npm 8+ or yarn 1.22+
- Git
- Access to the backend API (assumes running on localhost:8000)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up environment variables**
   Create a `.env.local` file in the frontend directory with the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application

### Available Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code issues
- `npm run test` - Runs unit tests

### Project Structure

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

### Key Technologies

- **Next.js 16+** - React framework with App Router
- **React 19+** - UI library
- **TypeScript 5+** - Type safety
- **Tailwind CSS 3.4+** - Styling framework
- **Better Auth** - Authentication solution
- **Jest & React Testing Library** - Testing frameworks

### Development Workflow

1. **Creating a new page**:
   - Add a new directory in `app/` with a `page.tsx` file
   - Use Server Components by default unless client interactivity is needed

2. **Creating a new component**:
   - Add to the appropriate subdirectory in `components/`
   - Use Client Components only when necessary (event handlers, useState, etc.)

3. **Making API calls**:
   - Use the centralized API client in `lib/api.ts`
   - All authenticated requests automatically include JWT tokens

4. **Handling authentication**:
   - Use the auth utilities in `lib/auth.ts`
   - Components will automatically handle authentication state

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Base URL for Better Auth
- `NEXT_PUBLIC_JWT_SECRET` - Secret for JWT verification (shared with backend)

### Troubleshooting

**Issue**: Cannot connect to backend API
**Solution**: Ensure the backend server is running and the `NEXT_PUBLIC_API_URL` is set correctly

**Issue**: Authentication not working
**Solution**: Verify that Better Auth is properly configured and the JWT secret matches between frontend and backend

**Issue**: Styles not loading
**Solution**: Check that Tailwind CSS is properly configured in `tailwind.config.js` and `globals.css`

### Next Steps

1. Implement authentication pages (sign-in/sign-up)
2. Build the task dashboard with filtering and sorting
3. Create task management components (add, edit, delete)
4. Add responsive navigation
5. Implement error handling and loading states