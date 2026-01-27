"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TodoPreview = () => {
  // Mock tasks data
  const mockTasks = [
    { id: 1, title: "Complete project proposal", completed: false, priority: "high" },
    { id: 2, title: "Schedule team meeting", completed: true, priority: "medium" },
    { id: 3, title: "Review documentation", completed: false, priority: "low" },
  ];

  return (
    <div className="bg-black text-white rounded-xl shadow-xl overflow-hidden border border-gray-700 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Your Tasks</h3>
      </div>

      {/* Tasks List */}
      <div className="p-6 space-y-4">
        <AnimatePresence>
          {mockTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center p-4 rounded-lg border ${
                task.completed
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-900 border-gray-700"
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
                readOnly
              />
              <span
                className={`ml-4 flex-1 ${
                  task.completed ? "line-through text-gray-500" : "text-white"
                }`}
              >
                {task.title}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === "high"
                    ? "bg-red-800 text-red-100"
                    : task.priority === "medium"
                    ? "bg-yellow-800 text-yellow-100"
                    : "bg-green-800 text-green-100"
                }`}
              >
                {task.priority}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex space-x-3">
        <button className="flex-1 bg-white text-black py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 shadow-lg transition-all duration-300">
          Add Task
        </button>
        <button className="bg-gray-700 text-gray-200 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-600 transition-all duration-300">
          Filter
        </button>
      </div>
    </div>
  );
};

export default TodoPreview;
