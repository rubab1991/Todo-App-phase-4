import { useState, useEffect } from 'react';
import { Task } from '@/types';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: Partial<Task>) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [priority, setPriority] = useState< 'low' | 'medium' | 'high' >(task?.priority || 'medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setPriority(task.priority);
    }
  }, [task]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (description && description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || null,
      priority,
    };

    onSave(taskData);
  };

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className={`w-full px-4 py-3 bg-white/80 border rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                  errors.title ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add task description (optional)..."
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400 hover:border-gray-300 transition-all duration-200 resize-none"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Due Date & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 hover:border-gray-300 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl shadow-md text-base font-semibold text-gray-700 bg-white/80 hover:bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}