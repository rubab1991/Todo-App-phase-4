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
    <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Filter by completion status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">Filter Status</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                config.filterBy === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('active')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                config.filterBy === 'active'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                config.filterBy === 'completed'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Done
            </button>
          </div>
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">Sort By</label>
          <div className="relative">
            <select
              value={config.sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm font-medium text-gray-900 hover:border-gray-300 transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="dueDate">📅 Due Date</option>
              <option value="priority">⭐ Priority</option>
              <option value="createdAt">🕒 Created At</option>
              <option value="title">🔤 Title</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">Order</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleSortOrderChange('asc')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${
                config.sortOrder === 'asc'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Asc
            </button>
            <button
              onClick={() => handleSortOrderChange('desc')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${
                config.sortOrder === 'desc'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Desc
            </button>
          </div>
        </div>

        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search tasks..."
              value={config.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 hover:border-gray-300 transition-all duration-200"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}