import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

const EMPTY_MESSAGE = '등록된 할일이 없습니다';

interface TodoListProps {
  todos: Todo[];
  categories: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, categories, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-8">{EMPTY_MESSAGE}</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          categories={categories}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
