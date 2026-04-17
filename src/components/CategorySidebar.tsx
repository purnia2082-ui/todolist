import { useState } from 'react';
import { getCategoryColor } from '../types/todo';

interface CategorySidebarProps {
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  todoCounts: Record<string, number>;
  totalCount: number;
}

export function CategorySidebar({
  categories,
  currentCategory,
  onCategoryChange,
  onAddCategory,
  onDeleteCategory,
  todoCounts,
  totalCount,
}: CategorySidebarProps) {
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  function handleAdd(): void {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setInputValue('');
    setIsAdding(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setInputValue('');
    }
  }

  return (
    <aside className="w-40 flex-shrink-0 flex flex-col bg-gray-50 rounded-l-2xl p-4 border-r border-gray-100">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">카테고리</h2>

      {/* 전체 */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`flex items-center justify-between w-full text-left text-sm px-3 py-2 rounded-lg mb-1 transition-colors ${
          currentCategory === 'all'
            ? 'bg-gray-700 text-white font-medium'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span>전체</span>
        <span className={`text-xs ${currentCategory === 'all' ? 'text-gray-300' : 'text-gray-400'}`}>
          {totalCount}
        </span>
      </button>

      {/* 카테고리 목록 */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {categories.map(cat => {
          const color = getCategoryColor(categories, cat);
          const isActive = currentCategory === cat;
          return (
            <div key={cat} className="group relative">
              <button
                onClick={() => onCategoryChange(cat)}
                className={`flex items-center justify-between w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  isActive ? color.active : `text-gray-600 hover:bg-gray-200`
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color.active}`} />
                  <span className="truncate">{cat}</span>
                </span>
                <span className={`text-xs flex-shrink-0 ml-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                  {todoCounts[cat] ?? 0}
                </span>
              </button>
              {/* 삭제 버튼 */}
              <button
                onClick={() => onDeleteCategory(cat)}
                aria-label={`${cat} 카테고리 삭제`}
                className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-5 h-5 text-gray-400 hover:text-red-500 transition-colors text-xs rounded"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* 새 카테고리 추가 */}
      <div className="mt-3">
        {isAdding ? (
          <div>
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => { if (!inputValue.trim()) setIsAdding(false); }}
              placeholder="카테고리명"
              className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1"
            />
            <div className="flex gap-1">
              <button
                onClick={handleAdd}
                className="flex-1 text-xs bg-blue-500 text-white rounded-lg py-1 hover:bg-blue-600 transition-colors"
              >
                추가
              </button>
              <button
                onClick={() => { setIsAdding(false); setInputValue(''); }}
                className="flex-1 text-xs bg-gray-200 text-gray-600 rounded-lg py-1 hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 w-full text-sm text-gray-400 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span>새 카테고리</span>
          </button>
        )}
      </div>
    </aside>
  );
}
