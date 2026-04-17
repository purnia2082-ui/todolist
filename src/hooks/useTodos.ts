import { useState, useEffect } from 'react';
import type { Todo, FilterType } from '../types/todo';
import { DEFAULT_CATEGORIES } from '../types/todo';

interface UseTodosReturn {
  todos: Todo[];
  categories: string[];
  filter: FilterType;
  categoryFilter: string;
  filteredTodos: Todo[];
  addTodo: (text: string, category: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setCategoryFilter: (category: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem('todos');
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('categories');
      return raw ? (JSON.parse(raw) as string[]) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  function addTodo(text: string, category: string): void {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      category,
    };
    setTodos(prev => [newTodo, ...prev]);
  }

  function deleteTodo(id: string): void {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }

  function toggleTodo(id: string): void {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function addCategory(name: string): void {
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories(prev => [...prev, trimmed]);
  }

  function deleteCategory(name: string): void {
    setCategories(prev => prev.filter(c => c !== name));
    if (categoryFilter === name) setCategoryFilter('all');
  }

  const filteredTodos: Todo[] = todos.filter(todo => {
    const matchesFilter =
      filter === 'active' ? !todo.completed :
      filter === 'completed' ? todo.completed :
      true;
    const matchesCategory =
      categoryFilter === 'all' ? true : todo.category === categoryFilter;
    return matchesFilter && matchesCategory;
  });

  return {
    todos,
    categories,
    filter,
    categoryFilter,
    filteredTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    setCategoryFilter,
    addCategory,
    deleteCategory,
  };
}
