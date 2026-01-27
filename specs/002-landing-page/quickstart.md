# Quickstart: Landing Page Development

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### Setup Instructions

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser** to `http://localhost:3000` to view the landing page.

### Development Workflow

1. **Component Structure**:
   - Landing page components are located in `components/landing/`
   - Main page is in `app/page.tsx`
   - Styles are managed via Tailwind CSS in `globals.css`

2. **Creating New Components**:
   - Add new components to the `components/landing/` directory
   - Use TypeScript with proper typing
   - Follow Tailwind CSS utility-first approach
   - Implement responsive design with mobile-first approach

3. **Running Tests**:
   ```bash
   npm run test
   # or to run tests in watch mode
   npm run test:watch
   ```

4. **Building for Production**:
   ```bash
   npm run build
   ```

### Key Technologies Used

- **Next.js 16+**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React**: UI library

### Common Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run linter
- `npm run format`: Format code with Prettier

### Environment Variables

- No specific environment variables required for the landing page
- Authentication flow uses existing auth configuration