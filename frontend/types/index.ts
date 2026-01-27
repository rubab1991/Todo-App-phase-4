// User Session Type
export interface UserSession {
  id: string;
  email: string;
  token: string;
  isLoggedIn: boolean;
  isLoading: boolean;
}

// Task Type
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  isComplete: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Filter/Sort Configuration Type
export interface FilterSortConfig {
  filterBy: 'all' | 'active' | 'completed';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}

// API Response State Type
export interface ApiResponseState<T = any> {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  data: T | null;
}

// Task State Type
export interface TaskState {
  tasks: Record<string, Task>;
  ids: string[];
  isLoading: boolean;
  error: string | null;
}

// Task Form State Type
export interface TaskFormState {
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  isValid: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Task Display Options Type
export interface TaskDisplayOptions {
  showCompleted: boolean;
  compactView: boolean;
  groupBy: 'none' | 'priority' | 'dueDate';
}

// Navigation State Type
export interface NavigationState {
  currentPage: 'dashboard' | 'signin' | 'signup' | 'task-detail';
  mobileMenuOpen: boolean;
  userMenuOpen: boolean;
}