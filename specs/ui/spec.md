# UI Specification for Phase II Full-Stack Todo Web Application

## Overview
This specification defines the user interface requirements for the Phase II Full-Stack Todo Web Application. The UI will be built using Next.js 16+ with App Router and styled with Tailwind CSS. The design emphasizes usability, accessibility, and visual appeal with a modern aesthetic.

## Target Audience
End users of the Todo App (multi-device, tech-savvy and casual users)

## Success Criteria
- Implements all frontend pages and components for task CRUD operations
- Fully responsive for desktop, tablet, and mobile
- Modern design patterns (glassmorphism, subtle shadows, smooth transitions, hover effects)
- Interactive and user-friendly forms for task creation/updating
- Auth flow integrated with Better Auth
- Clear visual feedback for actions (task added, updated, deleted, marked complete)
- Consistent styling and layout across pages
- Navigation bar for easy access to tasks and auth pages
- Component reuse and clean structure following Next.js App Router conventions
- Adheres to project constitution principles: accuracy, clarity, reproducibility, and rigor

## Page Structure

### 1. Landing Page (`/`)
- Hero section with app description
- Call-to-action buttons for sign up/in
- Preview of the todo interface
- Features overview

### 2. Authentication Pages (`/auth`)
#### Sign Up Page (`/auth/signup`)
- Email and password fields
- Password strength indicator
- Terms and conditions checkbox
- Sign up button with loading state
- Link to sign in page

#### Sign In Page (`/auth/signin`)
- Email and password fields
- Remember me checkbox
- Forgot password link
- Sign in button with loading state
- Link to sign up page

### 3. Dashboard/Tasks Page (`/dashboard` or `/tasks`)
- Welcome message with user name
- Task statistics summary
- Search/filter controls
- Main task list area
- Add new task button
- Empty state when no tasks exist

### 4. Task Detail Page (`/tasks/[id]`)
- Task title and description
- Status (complete/incomplete)
- Due date and priority
- Edit/delete actions
- Back to dashboard button

### 5. Profile Page (`/profile`)
- User information display
- Account settings
- Logout button
- Theme preference toggle

## Component Specifications

### 1. Header Component
- Logo and app name
- Navigation links (Dashboard, Profile)
- User profile dropdown (when logged in)
- Sign in/up buttons (when logged out)

### 2. Task Card Component
- Task title with strikethrough when complete
- Description preview
- Due date display with color coding (past due, today, future)
- Priority indicator
- Completion checkbox
- Edit and delete buttons
- Hover effects and animations

### 3. Task Form Component
- Title input field
- Description textarea
- Due date picker
- Priority selection dropdown
- Save and cancel buttons
- Validation error display
- Loading states for submission

### 4. Navigation Sidebar Component
- Dashboard link
- Task management links
- Profile link
- Logout button (mobile view)
- Collapsible on smaller screens

### 5. Notification Toast Component
- Success/error messages
- Auto-dismiss functionality
- Position at top-right of screen
- Different colors for different message types

## Design System

### Colors
- Primary: Blue shades for main actions and highlights
- Secondary: Gray shades for backgrounds and neutral elements
- Success: Green for positive actions and confirmations
- Warning: Yellow for cautionary information
- Danger: Red for errors and destructive actions
- Background: Light mode and dark mode variants

### Typography
- Primary font: Inter or similar clean sans-serif
- Headings: Bold weights with appropriate sizing hierarchy
- Body text: Regular weight for readability
- Monospace: For code snippets or technical information

### Spacing
- Consistent spacing using Tailwind's spacing scale
- 4px base unit (spacing-1) for small elements
- Larger units for sections and containers
- Responsive padding and margins

### Shadows and Effects
- Subtle shadows for depth (glassmorphism effect)
- Smooth transitions for interactive elements
- Focus states for accessibility
- Hover and active states for buttons and cards

## Authentication Flows

### Sign Up Flow
1. User visits landing page or clicks sign up
2. User navigates to `/auth/signup`
3. User fills in email, password, and confirms password
4. Form validates inputs
5. User submits form
6. Success: Redirect to dashboard
7. Error: Display error message and allow retry

### Sign In Flow
1. User visits landing page or clicks sign in
2. User navigates to `/auth/signin`
3. User enters email and password
4. Form validates inputs
5. User submits form
6. Success: Redirect to dashboard with JWT token stored
7. Error: Display error message and allow retry

### Protected Route Behavior
1. Unauthenticated user attempts to access protected route
2. User redirected to sign in page
3. After successful sign in, user redirected back to original destination

## Task Management Flows

### Create Task Flow
1. User on dashboard clicks "Add Task" button
2. Modal or new page opens with task form
3. User fills in task details
4. User submits form
5. Success: Task appears in list with success notification
6. Error: Display error message and allow correction

### View Task Flow
1. User clicks on a task card
2. User navigated to task detail page
3. All task details displayed
4. User can edit or delete task

### Update Task Flow
1. User on task detail page or in task list
2. User clicks edit button
3. Form appears with current values
4. User modifies values
5. User saves changes
6. Success: Updates reflected in UI with success notification
7. Error: Display error message and allow correction

### Delete Task Flow
1. User on task detail page or in task list
2. User clicks delete button
3. Confirmation modal appears
4. User confirms deletion
5. Success: Task removed from list with success notification
6. Error: Display error message

### Mark Complete/Incomplete Flow
1. User toggles completion checkbox on task card
2. Visual change immediately reflects status
3. API call updates server state
4. Success: No additional feedback needed
5. Error: Revert visual change and display error

## Responsive Design Requirements

### Mobile (320px - 767px)
- Stacked layout for main content
- Hamburger menu for navigation
- Full-width form elements
- Touch-friendly button sizes (minimum 44px)
- Vertical task list layout

### Tablet (768px - 1023px)
- Hybrid layout with some horizontal elements
- Collapsible sidebar navigation
- Medium-width form elements
- Grid layout for task cards (2 columns)

### Desktop (1024px+)
- Full sidebar navigation
- Horizontal layout for main content
- Full-width form elements
- Grid layout for task cards (3+ columns)

## Accessibility Requirements

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators for interactive elements
- Skip to main content link
- Accessible form labels

### Screen Reader Compatibility
- Proper ARIA labels and roles
- Semantic HTML elements
- Alternative text for images
- Announcements for dynamic content changes

### Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- 3:1 for large text
- Sufficient contrast in both light and dark modes

## API Integration Requirements

### Authentication Headers
- All API requests must include JWT token in Authorization header
- Token retrieved from browser storage
- Automatic token refresh if expired

### Error Handling
- Network error notifications
- Invalid token handling (redirect to login)
- Validation error display in forms

### Loading States
- Skeleton loaders for initial content
- Button loading states during submissions
- Progress indicators for longer operations

## Technical Implementation Notes

### File Structure
```
/frontend
  /app
    /auth
      /signin
        page.tsx
      /signup
        page.tsx
    /dashboard
      page.tsx
    /tasks
      /page.tsx
      /[id]
        page.tsx
    /profile
      page.tsx
    layout.tsx
    page.tsx
    globals.css
  /components
    /ui
    /auth
    /tasks
    /navigation
  /lib
    /api.ts
    /auth.ts
  /types
    /index.ts
```

### Component Reusability
- Shared UI components in `/components/ui`
- Feature-specific components grouped by domain
- Hooks for common functionality
- Utility functions for formatting and validation

### State Management
- Local component state for form inputs
- Global auth state management
- Task list state management
- Error and notification state

## Testing Requirements

### Visual Regression
- Component snapshots for UI consistency
- Responsive design verification
- Cross-browser compatibility

### Interaction Testing
- Form submission flows
- Authentication flows
- Task management operations
- Error state handling

### Accessibility Testing
- Keyboard navigation verification
- Screen reader compatibility
- Color contrast validation

## Dependencies
- Next.js 16+ with App Router
- Tailwind CSS for styling
- Better Auth for authentication
- React Hook Form for form management
- React Query or SWR for data fetching
- Framer Motion for animations (optional)

## Performance Considerations
- Code splitting for route-level components
- Image optimization
- Lazy loading for non-critical components
- Efficient state updates to prevent unnecessary renders