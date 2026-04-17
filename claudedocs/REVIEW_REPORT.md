# 스펙 검증 리포트

> 검증 일시: 2026-04-16
> 프로젝트: 할일 관리 앱 (Todo List)
> 검증 대상: PRD (claudedocs/PRD.md), TECH_SPEC (claudedocs/TECH_SPEC.md), 소스 코드 (src/)

---

## Stage 1: PRD 수용 기준

### 기능 1: 할일 추가 및 삭제

| # | 수용 기준 | 판정 | 위치 |
|---|----------|------|------|
| 1 | 텍스트 입력 후 등록 버튼 또는 Enter 키로 할일 추가 | PASS | TodoInput.tsx:29, 44 |
| 2 | 빈 텍스트(공백 포함) 추가 불가, 입력 필요 안내 문구 표시 | PASS | TodoInput.tsx:12-15, 52-56 |
| 3 | 각 할일 항목에 삭제 버튼 존재, 클릭 시 해당 항목만 제거 | PASS | TodoItem.tsx:37-43, useTodos.ts:36-38 |
| 4 | 삭제 후 나머지 항목의 순서와 상태는 변경되지 않는다 | PASS | useTodos.ts:37 (filter 방식 사용) |
| 5 | 할일 텍스트 최대 200자, 초과 시 더 이상 입력되지 않음 | PASS | TodoInput.tsx:22-25 |

### 기능 2: 할일 완료 체크

| # | 수용 기준 | 판정 | 위치 |
|---|----------|------|------|
| 6 | 체크박스 클릭 시 완료 상태 전환, 취소선으로 시각 구분 | PASS | TodoItem.tsx:24-30, 18-20 |
| 7 | 완료 상태 재클릭 시 미완료로 토글 | PASS | useTodos.ts:40-46 |
| 8 | 완료 상태가 페이지 새로고침 후에도 유지 | PASS | useTodos.ts:15-18, 22-24 (localStorage 동기화) |
| 9 | 완료 상태 전환은 즉시 반영, 별도 저장 버튼 불필요 | PASS | useTodos.ts:40-46 (useState 즉시 반영) |

### 기능 3: 할일 목록 조회

| # | 수용 기준 | 판정 | 위치 |
|---|----------|------|------|
| 10 | 앱 진입 시 저장된 모든 할일 항목이 목록 형태로 표시 | PASS | useTodos.ts:15-18 (lazy initializer로 localStorage 로드) |
| 11 | 전체/미완료/완료 필터 제공, 선택 필터에 해당 항목만 표시 | PASS | FilterBar.tsx:19-35, useTodos.ts:48-52 |
| 12 | 전체 할일 수, 완료된 할일 수가 숫자로 표시 | PASS | StatusBar.tsx:6-14, App.tsx:18, 24 |
| 13 | 항목 없을 경우 "등록된 할일이 없습니다" 안내 문구 표시 | PASS | TodoList.tsx:13-17 |

**Stage 1 결과: 13/13 PASS**

---

## Stage 2: TECH_SPEC 일치

### 파일 구조

| TECH_SPEC 명세 | 실제 파일 | 판정 |
|---------------|----------|------|
| src/main.tsx | 존재 확인 | PASS |
| src/App.tsx | 존재 확인 | PASS |
| src/index.css | 존재 확인 | PASS |
| src/components/TodoInput.tsx | 존재 확인 | PASS |
| src/components/TodoList.tsx | 존재 확인 | PASS |
| src/components/TodoItem.tsx | 존재 확인 | PASS |
| src/components/FilterBar.tsx | 존재 확인 | PASS |
| src/components/StatusBar.tsx | 존재 확인 | PASS |
| src/hooks/useTodos.ts | 존재 확인 | PASS |
| src/types/todo.ts | 존재 확인 | PASS |

### 데이터 모델 (Todo 인터페이스, FilterType)

| 항목 | 판정 | 비고 |
|------|------|------|
| Todo.id: string | PASS | todo.ts:2 |
| Todo.text: string | PASS | todo.ts:3 |
| Todo.completed: boolean | PASS | todo.ts:4 |
| Todo.createdAt: string | PASS | todo.ts:5 |
| FilterType: 'all' \| 'active' \| 'completed' | PASS | todo.ts:8 |

### 컴포넌트 Props 인터페이스

| 항목 | 판정 | 비고 |
|------|------|------|
| TodoInputProps.onAdd: (text: string) => void | PASS | TodoInput.tsx:3-5 |
| TodoListProps.todos: Todo[] | PASS | TodoList.tsx:6-10 |
| TodoListProps.onToggle: (id: string) => void | PASS | TodoList.tsx:7 |
| TodoListProps.onDelete: (id: string) => void | PASS | TodoList.tsx:8 |
| TodoItemProps.todo: Todo | PASS | TodoItem.tsx:3-7 |
| TodoItemProps.onToggle: (id: string) => void | PASS | TodoItem.tsx:5 |
| TodoItemProps.onDelete: (id: string) => void | PASS | TodoItem.tsx:6 |
| FilterBarProps.currentFilter: FilterType | PASS | FilterBar.tsx:12-14 |
| FilterBarProps.onFilterChange: (filter: FilterType) => void | PASS | FilterBar.tsx:13 |
| StatusBarProps.total: number | PASS | StatusBar.tsx:1-4 |
| StatusBarProps.completed: number | PASS | StatusBar.tsx:3 |

### useTodos 훅 반환 타입

| 항목 | 판정 | 비고 |
|------|------|------|
| todos: Todo[] | PASS | useTodos.ts:5 |
| filter: FilterType | PASS | useTodos.ts:6 |
| filteredTodos: Todo[] | PASS | useTodos.ts:7 |
| addTodo: (text: string) => void | PASS | useTodos.ts:8 |
| deleteTodo: (id: string) => void | PASS | useTodos.ts:9 |
| toggleTodo: (id: string) => void | PASS | useTodos.ts:10 |
| setFilter: (filter: FilterType) => void | PASS | useTodos.ts:11 |

### localStorage 스키마

| 항목 | 판정 | 비고 |
|------|------|------|
| 키: 'todos' | PASS | useTodos.ts:16, 23 |
| 값: JSON.stringify(Todo[]) 직렬화 | PASS | useTodos.ts:23 |
| 읽기: JSON.parse + Todo[] 타입 캐스팅 | PASS | useTodos.ts:17 |
| lazy initializer로 초기 로드 | PASS | useTodos.ts:15-18 |
| useEffect로 todos 변경 시 동기화 | PASS | useTodos.ts:22-24 |

**Stage 2 결과: 27/27 PASS**

---

## Stage 3: 코드 품질

| 항목 | 판정 | 비고 |
|------|------|------|
| TypeScript any 미사용 | PASS | 전체 파일에 any 없음, 모든 타입 명시적으로 정의됨 |
| Props 인터페이스 명시 | PASS | 전체 컴포넌트에 Props 인터페이스 정의 |
| 접근성: aria-label 적용 | PASS | TodoInput.tsx:41, TodoItem.tsx:28, 33, 39, FilterBar.tsx:18 |
| 접근성: role 속성 적용 | PASS | FilterBar.tsx:18 (role="tablist"), 20 (role="tab"), TodoInput.tsx:53 (role="alert") |
| 접근성: 키보드 조작 (Enter 키 추가) | PASS | TodoInput.tsx:28-30 |
| 접근성: 키보드 조작 (필터/삭제 button 요소) | PASS | button 시맨틱 요소 사용으로 기본 키보드 접근성 확보 |
| 접근성: 색약 대응 (취소선 + 텍스트 병행) | PASS | TodoItem.tsx:18-20, 33 (aria-label 병행) |
| 빈 상태 처리 | PASS | TodoList.tsx:13-17 ("등록된 할일이 없습니다") |
| 에러 처리: 빈 입력 | PASS | TodoInput.tsx:12-15 (trim + error state) |
| 에러 처리: localStorage 파싱 실패 | FAIL | useTodos.ts:17 - JSON.parse 실패 시 try-catch 없음, 예외 발생 가능 |
| 문자 카운터 표시 | PASS | TodoInput.tsx:57-59 (스펙 외 추가 구현, 긍정 평가) |
| 컴포넌트 단일 책임 | PASS | 각 컴포넌트가 명확한 단일 역할 수행 |
| 상수 하드코딩 방지 | PASS | TodoList.tsx:4 (EMPTY_MESSAGE), FilterBar.tsx:3-7 (FILTER_LABELS), FilterBar.tsx:9 (FILTER_KEYS) |

**Stage 3 결과: 12/13 PASS (1 FAIL)**

---

## 종합 결과

| 단계 | 결과 | 점수 |
|------|------|------|
| Stage 1: PRD 일치 | PASS | 13/13 |
| Stage 2: TECH_SPEC 일치 | PASS | 27/27 |
| Stage 3: 코드 품질 | WARNING | 12/13 |
| **종합** | **PASS** | **96%** |

---

## FAIL 항목 상세

### localStorage JSON.parse 예외 처리 미흡

- **스펙**: TECH_SPEC 7항 - useTodos.ts의 localStorage 읽기 구현
- **실제**: `useTodos.ts:17` - `JSON.parse(raw) as Todo[]` 를 try-catch 없이 직접 호출
- **차이**: localStorage에 손상된 데이터 또는 잘못된 형식의 값이 저장된 경우 `SyntaxError`가 발생하여 앱 전체가 렌더링되지 않을 수 있음
- **개선 제안**:

```typescript
// useTodos.ts:15-18 수정 예시
const [todos, setTodos] = useState<Todo[]>(() => {
  try {
    const raw = localStorage.getItem('todos');
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
});
```

---

## 개선 권고사항

### 우선순위 낮음 (코드 품질 개선)

1. **localStorage 파싱 예외 처리 추가** (useTodos.ts:15-18)
   - JSON.parse 호출을 try-catch로 감싸 손상된 데이터에 대한 방어 처리 추가
   - 파싱 실패 시 빈 배열로 초기화하여 앱 정상 동작 보장
   - 예상 수정 범위: useTodos.ts 3줄 수정

---

## 잘 구현된 부분 (긍정 평가)

1. **완전한 TypeScript 타입 안전성**: 전체 코드에서 `any` 미사용, 모든 인터페이스 명시적 정의
2. **접근성 완성도**: `role="tablist"`, `role="tab"`, `aria-selected`, `role="alert"` 등 ARIA 속성을 적절히 적용하여 스크린리더 호환성 확보
3. **상수 분리**: `EMPTY_MESSAGE`, `FILTER_LABELS`, `FILTER_KEYS` 등 하드코딩 문자열을 상수로 분리
4. **문자 카운터 UI**: PRD 스펙 외 추가 구현으로 사용자 경험 향상 (TodoInput.tsx:57-59)
5. **색약 접근성**: 취소선(시각) + aria-label(텍스트) 병행 제공으로 색상만으로 상태 구분하지 않음
6. **localStorage lazy initializer**: useState 초기값을 lazy initializer 방식으로 구현하여 불필요한 재실행 방지
