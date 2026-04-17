import { useState } from 'react';

interface TodoInputProps {
  categories: string[];
  onAdd: (text: string, category: string) => void;
}

export function TodoInput({ categories, onAdd }: TodoInputProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [category, setCategory] = useState<string>(categories[0] ?? '개인');
  const [error, setError] = useState<string>('');

  function handleSubmit(): void {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('할일을 입력해주세요.');
      return;
    }
    onAdd(trimmed, category);
    setInputValue('');
    setError('');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.value.length <= 200) {
      setInputValue(e.target.value);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          aria-label="카테고리 선택"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="할일을 입력하세요"
          aria-label="할일 입력"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSubmit}
          aria-label="할일 등록"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          등록
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-400 text-right">
        {inputValue.length} / 200
      </p>
    </div>
  );
}
