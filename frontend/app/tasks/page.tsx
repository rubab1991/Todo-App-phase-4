'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskForm } from '@/components/tasks/task-form';
import { FilterControls } from '@/components/tasks/filter-controls';
import { Task, FilterSortConfig } from '@/types';
import { taskApi } from '@/lib/api-client';

export default function TasksPage() {
  const { session, loading: authLoading, authStatus, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterConfig, setFilterConfig] = useState<FilterSortConfig>({
    filterBy: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    searchQuery: '',
  });

  // Load tasks from backend when session is available
  useEffect(() => {
    if (session?.isLoggedIn && session.id) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    if (!session?.id) return;

    try {
      setLoading(true);
      const fetchedTasks = await taskApi.getAllTasks(session.id, session.token);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // In a real app, you'd want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while authentication is being resolved
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  // Show unauthenticated state only when we're certain the user is not authenticated
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Please sign in to view tasks</div>
      </div>
    );
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filterConfig.filterBy === 'active') return !task.isComplete;
      if (filterConfig.filterBy === 'completed') return task.isComplete;
      return true;
    })
    .filter(task =>
      task.title.toLowerCase().includes(filterConfig.searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(filterConfig.searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const priorityMap = { high: 2, medium: 1, low: 0 };
      let aValue: string | boolean | number = '';
      let bValue: string | boolean | number = '';

      switch (filterConfig.sortBy) {
        case 'dueDate':
          aValue = a.dueDate || '';
          bValue = b.dueDate || '';
          break;
        case 'priority':
          return priorityMap[b.priority] - priorityMap[a.priority];
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (filterConfig.sortOrder === 'asc') return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

  const handleAddTask = () => { setEditingTask(null); setShowForm(true); };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!session?.id) return;

    try {
      await taskApi.deleteTask(session.id, taskId, session.token);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      // In a real app, you'd want to show an error message to the user
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (!session?.id) return;

    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await taskApi.updateTask(session.id, editingTask.id, taskData, session.token);
        setTasks(tasks.map(task =>
          task.id === editingTask.id ? updatedTask : task
        ));
      } else {
        // Create new task
        const newTask = await taskApi.createTask(session.id, {
          ...taskData,
          isComplete: false,
          dueDate: taskData.dueDate || null,
          description: taskData.description || ''
        } as Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, session.token);
        setTasks([...tasks, newTask]);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      // In a real app, you'd want to show an error message to the user
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleToggleComplete = async (taskId: string) => {
    if (!session?.id) return;

    try {
      const toggledTask = await taskApi.toggleTaskCompletion(session.id, taskId, session.token);
      setTasks(tasks.map(task =>
        task.id === taskId ? toggledTask : task
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // In a real app, you'd want to show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-900 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Header + Add Button */}
          <div className="flex justify-between items-center mb-4">
            <motion.h2
              className="text-xl font-semibold text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              My Tasks
            </motion.h2>

            <motion.button
              onClick={handleAddTask}
              className="px-4 py-2 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Task
            </motion.button>
          </div>

          {/* Filter Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6" // spacing between SortBy and task list
          >
            <FilterControls config={filterConfig} onConfigChange={setFilterConfig} />
          </motion.div>

          {/* Task Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <TaskForm task={editingTask || undefined} onSave={handleSaveTask} onCancel={handleCancelForm} />
            </motion.div>
          )}

          {/* Task List */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading tasks...</div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No tasks found. Create your first task!</div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  layout
                >
                  <TaskCard
                    task={task}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onToggleComplete={() => handleToggleComplete(task.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
