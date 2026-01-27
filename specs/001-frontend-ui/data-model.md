# Data Model: Frontend UI for Phase II Full-Stack Todo Web Application

**Feature**: Frontend UI Implementation
**Date**: 2026-01-16
**Branch**: 001-frontend-ui

## Overview

This document describes the frontend data structures and state management patterns for the todo application. Since the frontend consumes data from the backend API, the data models here represent the client-side state and UI-specific data structures rather than the backend data models.

## Key Entities

### User Session
**Description**: Represents an authenticated user's interaction with the application, including their authentication token and preferences

**Fields**:
- `id`: string - Unique identifier for the user
- `email`: string - User's email address
- `token`: string - JWT authentication token
- `isLoggedIn`: boolean - Authentication status
- `isLoading`: boolean - Loading state for authentication operations

**Validation Rules**:
- `email` must be a valid email format
- `token` must be present when `isLoggedIn` is true
- `id` must be non-empty when `isLoggedIn` is true

### Task
**Description**: Represents a user's task item as received from the backend API and managed in the frontend state

**Fields**:
- `id`: string - Unique identifier for the task
- `title`: string - Task title (required)
- `description`: string - Task description (optional)
- `dueDate`: string | null - Due date in ISO format (optional)
- `priority`: 'low' | 'medium' | 'high' - Task priority level
- `isComplete`: boolean - Completion status
- `userId`: string - Associated user ID
- `createdAt`: string - Creation timestamp
- `updatedAt`: string - Last update timestamp

**Validation Rules**:
- `title` must be 1-200 characters
- `description` can be 0-1000 characters
- `priority` must be one of the allowed values
- `userId` must match the currently authenticated user

### Filter/Sort Configuration
**Description**: Represents user-selected options for organizing task display

**Fields**:
- `filterBy`: 'all' | 'active' | 'completed' - Filter tasks by completion status
- `sortBy`: 'dueDate' | 'priority' | 'createdAt' | 'title' - Sort tasks by property
- `sortOrder`: 'asc' | 'desc' - Sort direction
- `searchQuery`: string - Text search filter

**Validation Rules**:
- `filterBy` must be one of the allowed values
- `sortBy` must be one of the allowed values
- `sortOrder` must be one of the allowed values

### API Response State
**Description**: Represents the state of API requests and responses for proper UI feedback

**Fields**:
- `isLoading`: boolean - Whether a request is in progress
- `isSuccess`: boolean - Whether the last request was successful
- `isError`: boolean - Whether the last request resulted in an error
- `error`: string | null - Error message if request failed
- `data`: any - Response data if successful

**Validation Rules**:
- Only one of `isLoading`, `isSuccess`, or `isError` should be true at any time
- `error` must be present when `isError` is true

## State Management Patterns

### Task Management State
The frontend will maintain a normalized state structure for tasks to ensure efficient updates and rendering:

```typescript
interface TaskState {
  tasks: Record<string, Task>; // Dictionary of tasks by ID
  ids: string[]; // Ordered list of task IDs
  isLoading: boolean;
  error: string | null;
}
```

### Form State
For task creation and updates, the frontend will maintain form-specific state:

```typescript
interface TaskFormState {
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  isValid: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
```

## UI-Specific Data Structures

### Task Display Options
Options for how tasks are displayed in the UI:

```typescript
interface TaskDisplayOptions {
  showCompleted: boolean;
  compactView: boolean;
  groupBy: 'none' | 'priority' | 'dueDate';
}
```

### Navigation State
State for managing navigation and UI layout:

```typescript
interface NavigationState {
  currentPage: 'dashboard' | 'signin' | 'signup' | 'task-detail';
  mobileMenuOpen: boolean;
  userMenuOpen: boolean;
}
```