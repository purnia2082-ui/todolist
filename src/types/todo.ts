export const DEFAULT_CATEGORIES: string[] = ['개인', '업무', '쇼핑', '기타'];

export const COLOR_PALETTE = [
  { badge: 'bg-blue-100 text-blue-700',   active: 'bg-blue-500 text-white',   hover: 'hover:bg-blue-200' },
  { badge: 'bg-purple-100 text-purple-700', active: 'bg-purple-500 text-white', hover: 'hover:bg-purple-200' },
  { badge: 'bg-green-100 text-green-700',  active: 'bg-green-500 text-white',  hover: 'hover:bg-green-200' },
  { badge: 'bg-amber-100 text-amber-700',  active: 'bg-amber-500 text-white',  hover: 'hover:bg-amber-200' },
  { badge: 'bg-red-100 text-red-700',      active: 'bg-red-500 text-white',    hover: 'hover:bg-red-200' },
  { badge: 'bg-pink-100 text-pink-700',    active: 'bg-pink-500 text-white',   hover: 'hover:bg-pink-200' },
  { badge: 'bg-indigo-100 text-indigo-700',active: 'bg-indigo-500 text-white', hover: 'hover:bg-indigo-200' },
  { badge: 'bg-teal-100 text-teal-700',    active: 'bg-teal-500 text-white',   hover: 'hover:bg-teal-200' },
];

export function getCategoryColor(categories: string[], name: string) {
  const idx = categories.indexOf(name);
  return COLOR_PALETTE[(idx >= 0 ? idx : 0) % COLOR_PALETTE.length];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  category: string;
}

export type FilterType = 'all' | 'active' | 'completed';
