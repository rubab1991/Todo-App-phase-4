'use client';

import { Task } from '@/types';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

// T024: Priority badge colour mapping
const PRIORITY_GRADIENT: Record<string, string> = {
  high: 'from-red-500 to-rose-600',
  medium: 'from-yellow-400 to-amber-500',
  low: 'from-green-400 to-emerald-500',
};
const PRIORITY_ICON: Record<string, string> = { high: '🔴', medium: '🟡', low: '🟢' };
const PRIORITY_BORDER: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-400',
  low: 'border-l-green-400',
};

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return dateString; }
}

// T045: Determine if task is overdue
function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.isComplete) return false;
  try {
    return new Date(task.dueDate) < new Date();
  } catch { return false; }
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const overdue = isOverdue(task);
  const tags: string[] = (task as any).tags ?? [];
  const recurringInterval: string | null = (task as any).recurringInterval ?? null;
  const reminderAt: string | null = (task as any).reminderAt ?? null;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      layout
      className={`group backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 border-l-4 ${PRIORITY_BORDER[task.priority] ?? 'border-l-gray-400'}`}
    >
      {/* Priority top bar */}
      <div className={`h-1.5 bg-gradient-to-r ${PRIORITY_GRADIENT[task.priority] ?? 'from-gray-400 to-gray-500'}`} />

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Checkbox */}
          <div className="relative flex items-center justify-center mt-1">
            <input
              type="checkbox"
              checked={task.isComplete}
              onChange={onToggleComplete}
              className="peer h-6 w-6 appearance-none rounded-lg border-2 border-gray-300 checked:border-purple-600 checked:bg-gradient-to-br checked:from-purple-600 checked:to-blue-500 transition-all duration-300 cursor-pointer hover:border-purple-600 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            />
            <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className={`text-lg font-bold transition-all duration-300 ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              {/* T054: Recurrence indicator */}
              {recurringInterval && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                  🔁 {recurringInterval}
                </span>
              )}
            </div>

            {task.description && (
              <p className={`mt-1.5 text-sm ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            {/* Metadata row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* T024: Priority badge */}
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg text-white bg-gradient-to-r ${PRIORITY_GRADIENT[task.priority] ?? 'from-gray-400 to-gray-500'}`}>
                {PRIORITY_ICON[task.priority]} {task.priority.toUpperCase()}
              </span>

              {/* T045: Due date — overdue in red */}
              {task.dueDate && (
                <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium ${overdue ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600'}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {overdue && <span className="font-bold">OVERDUE — </span>}
                  {formatDate(task.dueDate)}
                </div>
              )}

              {/* Reminder indicator */}
              {reminderAt && (
                <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                  🔔 {formatDate(reminderAt)}
                </div>
              )}
            </div>

            {/* T024: Tag chips */}
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <motion.button onClick={onEdit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white/80 hover:bg-white hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </motion.button>
          <motion.button onClick={onDelete} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
