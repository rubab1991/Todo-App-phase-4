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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
      className={`bg-soft-white border border-gray-200 rounded-lg shadow-md overflow-hidden border-l-4 ${getPriorityColor(task.priority)}`}
    >
      <div className="p-5">
        <div className="flex items-start space-x-4">
          <input
            type="checkbox"
            checked={task.isComplete}
            onChange={onToggleComplete}
            className="h-5 w-5 text-gray-900 rounded mt-1 focus:ring-gray-400"
          />
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            <div className="mt-3 flex items-center space-x-3 text-sm text-gray-500">
              {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'high'
                    ? 'bg-gray-900 text-soft-white'
                    : task.priority === 'medium'
                      ? 'bg-gray-600 text-soft-white'
                      : 'bg-gray-200 text-gray-800'
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex space-x-3">
          <motion.button
            onClick={onEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
          >
            Edit
          </motion.button>

          <motion.button
            onClick={onDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
