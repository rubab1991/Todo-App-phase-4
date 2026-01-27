'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-soft-white border border-gray-200 rounded-md shadow-subtle overflow-hidden"
    >
      <div className="flex items-center p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-md border mr-3 flex items-center justify-center transition-colors duration-200 ${
            todo.completed
              ? 'bg-gray-900 border-gray-900'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <AnimatePresence>
            {todo.completed && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <motion.path d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.span
          className={`flex-1 text-body ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
          animate={{
            color: todo.completed ? '#94A3B8' : '#0F172A',
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}
          transition={{ duration: 0.2 }}
        >
          {todo.title}
        </motion.span>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: '#FEE2E2' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(todo.id)}
          className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Delete todo"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};