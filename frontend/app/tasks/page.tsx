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

  // Refetch tasks when chatbot creates/updates/deletes a task
  useEffect(() => {
    const handleTasksUpdated = () => {
      if (session?.isLoggedIn && session.id) {
        fetchTasks();
      }
    };
    window.addEventListener('tasks-updated', handleTasksUpdated);
    return () => window.removeEventListener('tasks-updated', handleTasksUpdated);
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 -z-10" />
        <div className="fixed inset-0 bg-gradient-to-tr from-purple-100/20 via-transparent to-blue-100/20 -z-10" />
        <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-2xl p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xl font-semibold text-gray-800">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthenticated state only when we're certain the user is not authenticated
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 -z-10" />
        <div className="fixed inset-0 bg-gradient-to-tr from-purple-100/20 via-transparent to-blue-100/20 -z-10" />
        <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-800">Authentication Required</p>
            <p className="text-sm text-gray-600">Please sign in to view your tasks</p>
          </div>
        </div>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-tr from-purple-100/20 via-transparent to-blue-100/20 -z-10" />

      {/* Animated Background Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#1BFFFF]/30 to-cyan-400/30 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Premium Navbar */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              ✨ Todo App
            </motion.h1>
            <motion.button
              onClick={signOut}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-white/80 hover:bg-white border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign out
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Header + Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-800">My Tasks</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your tasks efficiently</p>
            </motion.div>

            <motion.button
              onClick={handleAddTask}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </motion.button>
          </div>

          {/* Filter Controls - Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FilterControls config={filterConfig} onConfigChange={setFilterConfig} />
          </motion.div>

          {/* Task Form - Premium Card */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            >
              <TaskForm task={editingTask || undefined} onSave={handleSaveTask} onCancel={handleCancelForm} />
            </motion.div>
          )}

          {/* Task List - Premium Container */}
          {loading ? (
            <motion.div
              className="backdrop-blur-md bg-white/60 border border-white/20 rounded-2xl shadow-2xl p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 font-medium">Loading your tasks...</p>
              </div>
            </motion.div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <motion.div
              className="backdrop-blur-md bg-white/60 border border-white/20 rounded-2xl shadow-2xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium text-lg">No tasks found</p>
                <p className="text-gray-500 text-sm">Create your first task to get started!</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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
