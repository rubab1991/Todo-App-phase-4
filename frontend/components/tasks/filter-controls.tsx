'use client';
// T030/T036: Phase V filter controls — status, priority, tag, sort-by, sort-order, search
import { FilterSortConfig } from '@/types';

interface FilterControlsProps {
  config: FilterSortConfig;
  onConfigChange: (config: FilterSortConfig) => void;
}

export function FilterControls({ config, onConfigChange }: FilterControlsProps) {
  const update = (partial: Partial<FilterSortConfig>) => onConfigChange({ ...config, ...partial });

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        {/* Status filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Status</label>
          <div className="flex gap-1">
            {(['all', 'active', 'completed'] as const).map(f => (
              <button key={f} onClick={() => update({ filterBy: f })}
                className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${config.filterBy === f ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* T030: Priority filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Priority</label>
          <select value={config.filterPriority ?? 'all'} onChange={e => update({ filterPriority: e.target.value as any })}
            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900">
            <option value="all">All priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* T030: Tag filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Tag</label>
          <input type="text" placeholder="Filter by tag…" value={config.filterTag ?? ''}
            onChange={e => update({ filterTag: e.target.value })}
            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900 placeholder-gray-400" />
        </div>

        {/* T036: Sort by */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Sort By</label>
          <select value={config.sortBy} onChange={e => update({ sortBy: e.target.value as any })}
            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900 appearance-none">
            <option value="createdAt">🕒 Created</option>
            <option value="dueDate">📅 Due Date</option>
            <option value="priority">⭐ Priority</option>
            <option value="title">🔤 Title</option>
          </select>
        </div>

        {/* T036: Sort order */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Order</label>
          <div className="flex gap-1">
            {(['asc', 'desc'] as const).map(o => (
              <button key={o} onClick={() => update({ sortOrder: o })}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${config.sortOrder === o ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {o === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Search</label>
          <div className="relative">
            <input type="text" placeholder="Search tasks…" value={config.searchQuery}
              onChange={e => update({ searchQuery: e.target.value })}
              className="w-full pl-8 pr-3 py-2 bg-white/80 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900 placeholder-gray-400" />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
