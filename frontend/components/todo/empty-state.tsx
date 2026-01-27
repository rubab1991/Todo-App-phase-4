'use client';

import { motion } from 'framer-motion';
import { FilterType } from '@/types/todo';

interface EmptyStateProps {
  filter: FilterType;
}

export const EmptyState = ({ filter }: EmptyStateProps) => {
  let message = '';
  let subMessage = '';

  switch (filter) {
    case 'active':
      message = 'No active tasks';
      subMessage = 'All your tasks are completed!';
      break;
    case 'completed':
      message = 'No completed tasks';
      subMessage = 'Complete some tasks to see them here.';
      break;
    case 'all':
    default:
      message = 'No tasks yet';
      subMessage = 'Add your first task to get started.';
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-12"
    >
      <div className="text-gray-400 mb-2">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mx-auto"
        >
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-subheading text-gray-700 mb-1">{message}</h3>
      <p className="text-gray-500 text-small">{subMessage}</p>
    </motion.div>
  );
};