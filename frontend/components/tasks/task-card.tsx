'use client';

import { Task } from '@/types';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-gray-900';
      case 'medium':
        return 'border-l-gray-600';
      case 'low':
        return 'border-l-gray-400';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-purple-600 to-blue-500';
      case 'medium':
        return 'from-purple-500 to-blue-400';
      case 'low':
        return 'from-blue-500 to-indigo-400';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      layout
      className="group backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Priority Indicator - Gradient Top Border */}
      <div className={`h-1.5 bg-gradient-to-r ${getPriorityGradient(task.priority)}`} />

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Custom Animated Checkbox */}
          <div className="relative flex items-center justify-center mt-1">
            <input
              type="checkbox"
              checked={task.isComplete}
              onChange={onToggleComplete}
              className="peer h-6 w-6 appearance-none rounded-lg border-2 border-gray-300 checked:border-purple-600 checked:bg-gradient-to-br checked:from-purple-600 checked:to-blue-500 transition-all duration-300 cursor-pointer hover:border-purple-600 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            />
            <svg
              className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold transition-all duration-300 ${
              task.isComplete
                ? 'line-through text-gray-400'
                : 'text-gray-800 group-hover:text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-2 text-sm transition-all duration-300 ${
                task.isComplete
                  ? 'line-through text-gray-400'
                  : 'text-gray-600 group-hover:text-gray-700'
              }`}>
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formatDate(task.dueDate)}</span>
                </div>
              )}
              <span className={`px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-gradient-to-r ${getPriorityGradient(task.priority)} shadow-md`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <motion.button
            onClick={onEdit}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white/80 hover:bg-white hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </motion.button>

          <motion.button
            onClick={onDelete}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
