import type { Todo } from '../types/todo';
import { getCategoryColor } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  categories: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, categories, onToggle, onDelete }: TodoItemProps) {
  const color = getCategoryColor(categories, todo.category);

  const textClass = todo.completed
    ? 'line-through text-gray-400'
    : 'text-gray-800';

  return (
    <li className="flex items-center gap-3 py-3 px-4 border-b border-gray-100 last:border-b-0">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`${todo.text} ${todo.completed ? '완료됨' : '미완료'}`}
        className="w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"
      />
      <span
        className={`flex-1 text-sm break-words ${textClass}`}
        aria-label={todo.completed ? `완료: ${todo.text}` : todo.text}
      >
        {todo.text}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${color.badge}`}>
        {todo.category}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`${todo.text} 삭제`}
        className="text-gray-400 hover:text-red-500 transition-colors text-sm flex-shrink-0"
      >
        삭제
      </button>
    </li>
  );
}
