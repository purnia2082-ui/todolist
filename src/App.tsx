import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import { StatusBar } from './components/StatusBar';
import { CategorySidebar } from './components/CategorySidebar';

export default function App() {
  const {
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
  } = useTodos();

  const completedCount = todos.filter(todo => todo.completed).length;

  // 카테고리별 할일 수
  const todoCounts: Record<string, number> = {};
  for (const cat of categories) {
    todoCounts[cat] = todos.filter(t => t.category === cat).length;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md flex overflow-hidden">
        {/* 왼쪽 카테고리 사이드바 */}
        <CategorySidebar
          categories={categories}
          currentCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          todoCounts={todoCounts}
          totalCount={todos.length}
        />

        {/* 오른쪽 메인 영역 */}
        <main className="flex-1 p-6 min-w-0">
          <h1 className="text-xl font-bold text-gray-800 mb-4">할일 관리</h1>
          <StatusBar total={filteredTodos.length} completed={filteredTodos.filter(t => t.completed).length} />
          <TodoInput categories={categories} onAdd={addTodo} />
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
          <TodoList
            todos={filteredTodos}
            categories={categories}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </main>
      </div>
    </div>
  );
}
