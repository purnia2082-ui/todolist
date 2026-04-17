interface StatusBarProps {
  total: number;
  completed: number;
}

export function StatusBar({ total, completed }: StatusBarProps) {
  return (
    <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
      <span>전체 {total}개</span>
      <span className="text-gray-300">|</span>
      <span>완료 {completed}개</span>
    </div>
  );
}
