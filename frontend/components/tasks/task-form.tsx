'use client';
// T023/T044/T053: TaskForm with tags, priority, datetime pickers, recurring interval
import { useState, useEffect } from 'react';
import { Task } from '@/types';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: Partial<Task> & { tags?: string[]; recurringInterval?: string | null; reminderAt?: string | null }) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const anyTask = task as any;
  const [title, setTitle] = useState(anyTask?.title || '');
  const [description, setDescription] = useState(anyTask?.description || '');
  const [dueDate, setDueDate] = useState(anyTask?.dueDate || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(anyTask?.priority || 'medium');
  // T023: Tags state — comma-separated input → string[]
  const [tagsInput, setTagsInput] = useState<string>((anyTask?.tags ?? []).join(', '));
  // T044: Reminder datetime
  const [reminderAt, setReminderAt] = useState<string>(anyTask?.reminderAt || '');
  // T053: Recurring interval
  const [recurringInterval, setRecurringInterval] = useState<string>(anyTask?.recurringInterval || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      const t = task as any;
      setTitle(t.title || '');
      setDescription(t.description || '');
      setDueDate(t.dueDate || '');
      setPriority(t.priority || 'medium');
      setTagsInput((t.tags ?? []).join(', '));
      setReminderAt(t.reminderAt || '');
      setRecurringInterval(t.recurringInterval || '');
    }
  }, [task]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.length > 200) errs.title = 'Title must be 200 characters or less';
    if (description && description.length > 1000) errs.description = 'Description must be 1000 characters or less';
    // T044: Reminder must be in the future
    if (reminderAt) {
      try {
        if (new Date(reminderAt) <= new Date()) errs.reminderAt = 'Reminder must be in the future';
      } catch { errs.reminderAt = 'Invalid reminder time'; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // T023: Parse tags from comma-separated input
    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || null,
      priority,
      tags,
      reminderAt: reminderAt || null,
      recurringInterval: recurringInterval || null,
    } as any);
  };

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 px-6 py-4">
        <h3 className="text-xl font-bold text-white">{task ? 'Edit Task' : 'Create New Task'}</h3>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title..."
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900 ${errors.title ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description..."
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900 resize-none" />
          </div>

          {/* Priority + Due Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900" />
            </div>
          </div>

          {/* T023: Tags input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="e.g. work, urgent, personal"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900" />
          </div>

          {/* T044: Reminder + T053: Recurring row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">🔔 Reminder</label>
              <input type="datetime-local" value={reminderAt} onChange={e => setReminderAt(e.target.value)}
                className={`w-full px-4 py-3 bg-white/80 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900 ${errors.reminderAt ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.reminderAt && <p className="mt-1 text-xs text-red-600">{errors.reminderAt}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">🔁 Repeat</label>
              <select value={recurringInterval} onChange={e => setRecurringInterval(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900">
                <option value="">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600">
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button type="button" onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl text-base font-semibold text-gray-700 bg-white/80 border border-gray-300 hover:bg-white hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
