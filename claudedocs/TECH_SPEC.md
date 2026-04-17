# TECH_SPEC: 할일 관리 앱

> PRD 참조: claudedocs/PRD.md

---

## 1. 기술 스택

| 구분 | 기술 | 버전 | 선정 근거 |
|------|------|------|----------|
| Framework | React | 18+ | 컴포넌트 기반 UI, hooks로 상태 관리 충분 |
| 언어 | TypeScript | 5+ | 타입 안전성, props/state 오류 사전 방지 |
| Build Tool | Vite | 5+ | 빠른 개발 서버, CRA 대비 경량 |
| Styling | Tailwind CSS | 3.4+ | 유틸리티 기반, 별도 CSS 파일 최소화 |
| State | React useState/useEffect | - | 외부 라이브러리 없이 MVP 상태 관리 충분 |
| Storage | localStorage | - | 서버 불필요, 오프라인 동작, 새로고침 후 유지 |

---

## 2. 프로젝트 구조

```
src/
├── main.tsx                    # 앱 진입점
├── App.tsx                     # 루트 컴포넌트 (상태/훅 통합)
├── index.css                   # Tailwind 지시문
├── components/
│   ├── TodoInput.tsx           # 할일 입력 폼 (추가 버튼 + Enter)
│   ├── TodoList.tsx            # 할일 목록 렌더링
│   ├── TodoItem.tsx            # 단일 할일 항목 (체크박스 + 삭제 버튼)
│   ├── FilterBar.tsx           # 전체/미완료/완료 필터 탭
│   └── StatusBar.tsx           # 전체 수, 완료 수 진행 현황
├── hooks/
│   └── useTodos.ts             # 할일 CRUD + localStorage 동기화 커스텀 훅
└── types/
    └── todo.ts                 # Todo 타입 인터페이스 정의
```

---

## 3. 데이터 모델 (TypeScript 인터페이스)

```typescript
// src/types/todo.ts

export interface Todo {
  id: string;           // crypto.randomUUID() 생성
  text: string;         // 할일 내용 (최대 200자)
  completed: boolean;   // 완료 여부
  createdAt: string;    // ISO 8601 문자열 (localStorage 직렬화 대응)
}

export type FilterType = 'all' | 'active' | 'completed';
```

---

## 4. 컴포넌트 설계

### App (루트)

**파일**: `src/App.tsx`

**역할**: 전체 상태 소유, useTodos 훅 호출, 하위 컴포넌트에 props 전달

```typescript
// 상태 (useTodos 훅에서 반환)
const {
  todos,
  filter,
  filteredTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  setFilter,
} = useTodos();
```

**렌더 트리**:
```
App
├── StatusBar
├── TodoInput
├── FilterBar
└── TodoList
    └── TodoItem (반복)
```

---

### TodoInput (입력 폼)

**파일**: `src/components/TodoInput.tsx`

**Props 인터페이스**:
```typescript
interface TodoInputProps {
  onAdd: (text: string) => void;
}
```

**내부 상태**:
```typescript
const [inputValue, setInputValue] = useState<string>('');
const [error, setError] = useState<string>('');
```

**핵심 함수**:
```typescript
// Enter 키 및 등록 버튼 공통 처리
function handleSubmit(): void {
  const trimmed = inputValue.trim();
  if (!trimmed) {
    setError('할일을 입력해주세요.');
    return;
  }
  onAdd(trimmed);
  setInputValue('');
  setError('');
}

// input onChange 핸들러 - 200자 제한
function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
  if (e.target.value.length <= 200) {
    setInputValue(e.target.value);
  }
}

// Enter 키 감지
function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (e.key === 'Enter') handleSubmit();
}
```

**수용 기준 매핑**:
| PRD 수용 기준 | 구현 방법 |
|--------------|----------|
| Enter 또는 등록 버튼으로 추가 | handleKeyDown + handleSubmit |
| 빈 텍스트 추가 불가, 안내 문구 표시 | trim() 검사 후 error state 표시 |
| 최대 200자 제한 | handleChange에서 length <= 200 가드 |

---

### TodoList (목록)

**파일**: `src/components/TodoList.tsx`

**Props 인터페이스**:
```typescript
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**핵심 로직**:
```typescript
// todos.length === 0 이면 "등록된 할일이 없습니다" 안내 문구 표시
// todos.map()으로 TodoItem 렌더링
```

**수용 기준 매핑**:
| PRD 수용 기준 | 구현 방법 |
|--------------|----------|
| 앱 진입 시 저장된 항목 표시 | useTodos 훅이 마운트 시 localStorage 로드 |
| 항목 없을 때 안내 문구 | todos.length === 0 조건부 렌더링 |

---

### TodoItem (단일 항목)

**파일**: `src/components/TodoItem.tsx`

**Props 인터페이스**:
```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**핵심 함수**:
```typescript
// 체크박스 클릭 시 토글
function handleToggle(): void {
  onToggle(todo.id);
}

// 삭제 버튼 클릭 시 삭제
function handleDelete(): void {
  onDelete(todo.id);
}
```

**완료 상태 시각적 처리**:
```typescript
// 완료 시 텍스트에 취소선 + 색상 변경 (색약 접근성: 취소선 텍스트 병행)
const textClass = todo.completed
  ? 'line-through text-gray-400'
  : 'text-gray-800';
```

**수용 기준 매핑**:
| PRD 수용 기준 | 구현 방법 |
|--------------|----------|
| 체크박스 클릭 시 완료 전환 + 시각적 구분 | completed 상태에 따라 line-through 클래스 적용 |
| 완료 → 미완료 토글 | onToggle 호출로 boolean 반전 |
| 삭제 버튼으로 해당 항목만 제거 | onDelete(id) 호출 |
| 삭제 후 나머지 순서/상태 유지 | filter(t => t.id !== id) 방식 사용 |
| 색약 접근성: 취소선 텍스트 병행 | line-through + aria-label 병행 |

---

### FilterBar (필터 탭)

**파일**: `src/components/FilterBar.tsx`

**Props 인터페이스**:
```typescript
interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}
```

**탭 구성**:
```typescript
const FILTER_LABELS: Record<FilterType, string> = {
  all: '전체',
  active: '미완료',
  completed: '완료',
};
```

**수용 기준 매핑**:
| PRD 수용 기준 | 구현 방법 |
|--------------|----------|
| 전체/미완료/완료 필터 탭 제공 | FilterType 3개 버튼 렌더링 |
| 선택한 필터에 해당하는 항목만 표시 | filteredTodos를 TodoList에 전달 |
| 키보드로 필터 전환 가능 | button 요소 사용 (기본 키보드 접근성 확보) |

---

### StatusBar (진행 현황)

**파일**: `src/components/StatusBar.tsx`

**Props 인터페이스**:
```typescript
interface StatusBarProps {
  total: number;
  completed: number;
}
```

**렌더 내용**:
```typescript
// "전체 {total}개 | 완료 {completed}개" 형태로 표시
```

**수용 기준 매핑**:
| PRD 수용 기준 | 구현 방법 |
|--------------|----------|
| 전체 할일 수, 완료 수 숫자 표시 | total, completed props 렌더링 |

---

## 5. localStorage 스키마

**키**: `todos`

**값**: `Todo[]` 배열을 JSON 직렬화한 문자열

```typescript
// 저장 형식
localStorage.setItem('todos', JSON.stringify(todos));

// 읽기 형식
const raw = localStorage.getItem('todos');
const todos: Todo[] = raw ? JSON.parse(raw) : [];
```

**저장 데이터 예시**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "장보기",
    "completed": false,
    "createdAt": "2026-04-16T09:00:00.000Z"
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "text": "운동하기",
    "completed": true,
    "createdAt": "2026-04-16T08:30:00.000Z"
  }
]
```

---

## 6. 주요 함수/훅 명세

### useTodos 커스텀 훅

**파일**: `src/hooks/useTodos.ts`

**반환 타입**:
```typescript
interface UseTodosReturn {
  todos: Todo[];
  filter: FilterType;
  filteredTodos: Todo[];
  addTodo: (text: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: FilterType) => void;
}

export function useTodos(): UseTodosReturn;
```

**내부 구현 명세**:

```typescript
// localStorage 초기 로드 (lazy initializer)
const [todos, setTodos] = useState<Todo[]>(() => {
  const raw = localStorage.getItem('todos');
  return raw ? (JSON.parse(raw) as Todo[]) : [];
});

const [filter, setFilter] = useState<FilterType>('all');

// todos 변경 시 localStorage 동기화
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);

// 할일 추가 - PRD 기능 1
function addTodo(text: string): void {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  setTodos(prev => [newTodo, ...prev]);
}

// 할일 삭제 - PRD 기능 1
function deleteTodo(id: string): void {
  setTodos(prev => prev.filter(todo => todo.id !== id));
}

// 완료 토글 - PRD 기능 2
function toggleTodo(id: string): void {
  setTodos(prev =>
    prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
}

// 필터 적용 - PRD 기능 3
const filteredTodos: Todo[] = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
});
```

---

## 7. 파일별 구현 명세

| 파일 | 역할 | 핵심 구현 사항 |
|------|------|--------------|
| `src/types/todo.ts` | 타입 정의 | Todo 인터페이스, FilterType 타입 |
| `src/hooks/useTodos.ts` | 비즈니스 로직 | addTodo, deleteTodo, toggleTodo, localStorage 동기화 |
| `src/App.tsx` | 루트 컴포넌트 | useTodos 훅 사용, 전체 레이아웃, props 분배 |
| `src/components/TodoInput.tsx` | 입력 폼 | 빈값 검증, 200자 제한, Enter/버튼 제출 |
| `src/components/TodoList.tsx` | 목록 렌더링 | 빈 목록 안내 문구, TodoItem 반복 렌더링 |
| `src/components/TodoItem.tsx` | 단일 항목 | 체크박스 토글, 삭제 버튼, 완료 시 취소선 |
| `src/components/FilterBar.tsx` | 필터 탭 | 전체/미완료/완료 버튼, 활성 탭 시각적 표시 |
| `src/components/StatusBar.tsx` | 진행 현황 | 전체 수, 완료 수 표시 |

---

## 8. 검증 매트릭스

| PRD 기능 | TECH_SPEC 구현 | 파일 | 테스트 기준 |
|----------|---------------|------|-----------|
| 기능 1: 할일 추가 | addTodo() + handleSubmit() | useTodos.ts, TodoInput.tsx | 텍스트 입력 후 Enter/버튼 클릭 시 목록에 항목 추가 확인 |
| 기능 1: 빈값 추가 방지 | handleSubmit()의 trim() 검사 | TodoInput.tsx | 빈 입력 제출 시 error 문구 표시, 목록 변화 없음 |
| 기능 1: 200자 제한 | handleChange()의 length 가드 | TodoInput.tsx | 201번째 문자 입력 시 무시 확인 |
| 기능 1: 할일 삭제 | deleteTodo() + handleDelete() | useTodos.ts, TodoItem.tsx | 삭제 버튼 클릭 시 해당 항목만 제거, 나머지 유지 |
| 기능 2: 완료 체크 | toggleTodo() + completed 상태 | useTodos.ts, TodoItem.tsx | 체크박스 클릭 시 취소선 표시, 재클릭 시 복구 |
| 기능 2: 새로고침 후 상태 유지 | useEffect로 localStorage 동기화 | useTodos.ts | 페이지 새로고침 후 완료 상태 동일하게 유지 확인 |
| 기능 3: 필터 조회 | filteredTodos + FilterBar | useTodos.ts, FilterBar.tsx | 각 필터 탭 클릭 시 해당 항목만 표시 |
| 기능 3: 진행 현황 표시 | StatusBar props | StatusBar.tsx | 전체/완료 수가 실시간으로 정확히 반영 |
| 기능 3: 빈 목록 안내 | todos.length === 0 조건부 렌더링 | TodoList.tsx | 항목 없을 때 "등록된 할일이 없습니다" 문구 표시 |
