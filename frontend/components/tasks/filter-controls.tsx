import { FilterSortConfig } from '@/types';

interface FilterControlsProps {
  config: FilterSortConfig;
  onConfigChange: (config: FilterSortConfig) => void;
}

export function FilterControls({ config, onConfigChange }: FilterControlsProps) {
  const handleFilterChange = (filterBy: 'all' | 'active' | 'completed') => {
    onConfigChange({
      ...config,
      filterBy,
    });
  };

  const handleSortChange = (sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title') => {
    onConfigChange({
      ...config,
      sortBy,
    });
  };

  const handleSortOrderChange = (sortOrder: 'asc' | 'desc') => {
    onConfigChange({
      ...config,
      sortOrder,
    });
  };

  const handleSearchChange = (searchQuery: string) => {
    onConfigChange({
      ...config,
      searchQuery,
    });
  };

  return (
    <div className="bg-soft-white border border-gray-200 rounded-md shadow-subtle mb-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter by completion status */}
        <div>
          <label className="block text-small font-medium text-gray-500 mb-1">Filter</label>
          <div className="flex space-x-1">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1.5 text-small rounded-md ${
                config.filterBy === 'all'
                  ? 'bg-gray-900 text-soft-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('active')}
              className={`px-3 py-1.5 text-small rounded-md ${
                config.filterBy === 'active'
                  ? 'bg-gray-900 text-soft-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`px-3 py-1.5 text-small rounded-md ${
                config.filterBy === 'completed'
                  ? 'bg-gray-900 text-soft-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-small font-medium text-gray-500 mb-1">Sort By</label>
          <select
            value={config.sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="w-full px-3 py-2 bg-soft-white border border-gray-200 rounded-md shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-small text-gray-900"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-small font-medium text-gray-500 mb-1">Order</label>
          <div className="flex space-x-1">
            <button
              onClick={() => handleSortOrderChange('asc')}
              className={`px-3 py-1.5 text-small rounded-md ${
                config.sortOrder === 'asc'
                  ? 'bg-gray-900 text-soft-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Asc
            </button>
            <button
              onClick={() => handleSortOrderChange('desc')}
              className={`px-3 py-1.5 text-small rounded-md ${
                config.sortOrder === 'desc'
                  ? 'bg-gray-900 text-soft-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Desc
            </button>
          </div>
        </div>

        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-small font-medium text-gray-500 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search tasks..."
            value={config.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 bg-soft-white border border-gray-200 rounded-md shadow-subtle focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-small text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}