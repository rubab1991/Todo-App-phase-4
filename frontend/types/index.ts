// User Session Type
export interface UserSession {
  id: string;
  email: string;
  token: string;
  isLoggedIn: boolean;
  isLoading: boolean;
}

// Task Type (Phase V — includes tags, recurring, reminder)
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
  // Phase V fields
  tags: string[];
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | null;
  reminderAt?: string | null;
}

// Filter/Sort Configuration Type (Phase V)
export interface FilterSortConfig {
  filterBy: 'all' | 'active' | 'completed';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  // Phase V filters
  filterPriority?: 'all' | 'low' | 'medium' | 'high';
  filterTag?: string;
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

// WebSocket task update event (Phase V)
export interface TaskUpdateEvent {
  type: 'task_update' | 'reminder';
  event_type?: string;   // "task.created" | "task.updated" | "task.deleted"
  task?: Partial<Task> & { id: string | number };
  task_id?: string;
  title?: string;
  message?: string;
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