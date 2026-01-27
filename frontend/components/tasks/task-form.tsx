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
    <div className="bg-soft-white border border-gray-200 rounded-md shadow-subtle">
      <div className="p-6">
        <h3 className="text-subheading font-medium text-gray-900">
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        <div className="mt-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-small font-medium text-gray-500 mb-1">
                  Title *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 bg-soft-white border rounded-md shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-body text-gray-900 ${
                      errors.title ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-small text-red-500">{errors.title}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-small font-medium text-gray-500 mb-1">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-soft-white border border-gray-200 rounded-md shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-body text-gray-900"
                  />
                  {errors.description && (
                    <p className="mt-1 text-small text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-small font-medium text-gray-500 mb-1">
                    Due Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-soft-white border border-gray-200 rounded-md shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-body text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-small font-medium text-gray-500 mb-1">
                    Priority
                  </label>
                  <div className="mt-1">
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-3 py-2 bg-soft-white border border-gray-200 rounded-md shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-body text-gray-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-subtle text-body font-medium text-soft-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-subtle text-body font-medium text-gray-700 bg-soft-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}