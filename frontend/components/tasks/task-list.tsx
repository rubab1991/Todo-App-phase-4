import { Task } from '@/types';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  isFiltered?: boolean;  // T033: distinguish "no results" from "no tasks"
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete, isFiltered }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">{isFiltered ? '🔍' : '📋'}</div>
        <p className="text-gray-500 text-lg font-medium">
          {isFiltered
            ? 'No tasks found matching your criteria.'  // T033: spec-required message
            : 'No tasks yet. Create your first task!'}
        </p>
        {isFiltered && (
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter settings.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
          onToggleComplete={() => onToggleComplete(task.id)}
        />
      ))}
    </div>
  );
}
