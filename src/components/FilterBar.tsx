import type { FilterType } from '../types/todo';

const FILTER_LABELS: Record<FilterType, string> = {
  all: '전체',
  active: '미완료',
  completed: '완료',
};

const FILTER_KEYS: FilterType[] = ['all', 'active', 'completed'];

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-1 mb-4" role="tablist" aria-label="할일 필터">
      {FILTER_KEYS.map(filter => (
        <button
          key={filter}
          role="tab"
          aria-selected={currentFilter === filter}
          onClick={() => onFilterChange(filter)}
          className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
            currentFilter === filter
              ? 'bg-blue-500 text-white font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {FILTER_LABELS[filter]}
        </button>
      ))}
    </div>
  );
}
