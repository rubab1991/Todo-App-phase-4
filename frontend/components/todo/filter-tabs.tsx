'use client';

import { motion } from 'framer-motion';
import { FilterType } from '@/types/todo';

interface FilterTabsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export const FilterTabs = ({ filter, setFilter }: FilterTabsProps) => {
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="bg-gray-100 rounded-md p-1 flex">
      {filters.map(({ id, label }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setFilter(id)}
          className={`flex-1 py-2 px-3 rounded-md text-center text-body font-medium relative z-0 ${
            filter === id
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
          {filter === id && (
            <motion.div
              layoutId="filterIndicator"
              className="absolute inset-0 bg-soft-white rounded-md shadow-subtle z-[-1]"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};