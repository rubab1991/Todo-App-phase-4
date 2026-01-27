'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, FilterType } from '@/types/todo';
import { TodoItem } from './todo-item';
import { FilterTabs } from './filter-tabs';
import { EmptyState } from './empty-state';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export const TodoDashboard = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert string dates back to Date objects
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
        setTodos(todosWithDates);
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;

    const newTodoItem: Todo = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTodos(prev => [newTodoItem, ...prev]);
    setNewTodo('');

    // Focus the input after adding
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background-light flex flex-col"
    >
      <div className="max-w-2xl w-full mx-auto px-4 py-8">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-heading text-gray-900 mb-2">Todos</h1>
          <p className="text-gray-500 text-small">
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'} total
          </p>
        </motion.header>

        <motion.form
          onSubmit={handleSubmit}
          className="mb-6"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 bg-soft-white border border-gray-200 rounded-md shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-body text-gray-900 placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addTodo();
                }
              }}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!newTodo.trim()}
              className={`px-4 py-3 rounded-md shadow-subtle transition-all duration-200 text-body font-medium ${
                newTodo.trim()
                  ? 'bg-gray-900 text-soft-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add
            </motion.button>
          </div>
        </motion.form>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <FilterTabs filter={filter} setFilter={setFilter} />
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredTodos.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyState filter={filter} />
            </motion.div>
          ) : (
            <motion.div
              key="todo-list"
              layout
              className="space-y-2"
            >
              <AnimatePresence initial={false}>
                {filteredTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};