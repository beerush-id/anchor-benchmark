import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { Plus } from 'lucide-react';
import {
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  evaluate,
  shortId,
  type Todo,
  type TodosState,
} from '@anchor-benchmark/shared';
import { type FormEvent, memo, useEffect, useRef } from 'react';

// Debug render function to visualize re-renders
const useDebugRender = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  useEffect(() => {
    if (ref.current) {
      // Check if this is the first render or a re-render
      if (!ref.current.hasAttribute('data-rendered')) {
        // First render - red box shadow
        ref.current.setAttribute('data-rendered', 'true');
        ref.current.style.boxShadow = '0 0 0 1px red';
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.boxShadow = 'none';
          }
        }, 300);
      } else {
        // Re-render - blue box shadow
        ref.current.style.boxShadow = '0 0 0 1px blue';
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.boxShadow = 'none';
          }
        }, 300);
      }
    }
  });
};

// Define atoms for state management
const todoStateAtom = atom<TodosState>({
  items: [
    {
      id: '1',
      title: 'Learn React state',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning'],
    },
    {
      id: '2',
      title: 'Learn Jotai states',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning', 'jotai'],
    },
    {
      id: '3',
      title: 'Master Jotai state',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: ['learning', 'jotai', 'mastery'],
    },
  ],
  filter: 'all',
  sortOrder: 'asc',
  sortBy: 'createdAt',
});

const todoStatsAtom = atom({
  total: 3,
  completed: 1,
  active: 2,
});

// Counter atom
const counterAtom = atom({ count: 0 });

// Atoms for derived state
const filteredTodosAtom = atom((get) => {
  const state = get(todoStateAtom);
  const { items, filter } = state;

  switch (filter) {
    case 'active':
      return items.filter((todo) => !todo.completed);
    case 'completed':
      return items.filter((todo) => todo.completed);
    default:
      return items;
  }
});

const totalAtom = selectAtom(todoStatsAtom, (stats) => stats.total);
const activeAtom = selectAtom(todoStatsAtom, (stats) => stats.active);
const completedAtom = selectAtom(todoStatsAtom, (stats) => stats.completed);

// Form title atom
const newTitleAtom = atom('');

// Atoms for actions
const addTodoAtom = atom(null, (_, set, title: string) => {
  const newTodo: Todo = {
    id: shortId(),
    title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'medium',
    tags: [],
  };

  set(todoStateAtom, (prev) => ({
    ...prev,
    items: [...prev.items, newTodo],
  }));

  set(todoStatsAtom, (prev) => ({
    total: prev.total + 1,
    active: prev.active + 1,
    completed: prev.completed,
  }));
});

const addTodoBenchmarkAtom = atom(null, (get, set) => {
  const state = get(todoStateAtom);

  return evaluate(() => {
    const newTodo: Todo = {
      id: shortId(),
      title: `New Todo (${state.items.length + 1})`,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: [],
    };

    set(todoStateAtom, (prev) => ({
      ...prev,
      items: [...prev.items, newTodo],
    }));

    set(todoStatsAtom, (prev) => ({
      total: prev.total + 1,
      active: prev.active + 1,
      completed: prev.completed,
    }));
  }, BENCHMARK_SIZE);
});

const toggleTodoAtom = atom(null, (get, set, id: string) => {
  const state = get(todoStateAtom);
  const todoIndex = state.items.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) return;

  const todo = state.items[todoIndex];
  const newCompleted = !todo.completed;

  const updatedItems = [...state.items];
  updatedItems[todoIndex] = {
    ...todo,
    completed: newCompleted,
    updatedAt: new Date(),
  };

  set(todoStateAtom, (prev) => ({
    ...prev,
    items: updatedItems,
  }));

  set(todoStatsAtom, (prev) => ({
    total: prev.total,
    active: newCompleted ? prev.active - 1 : prev.active + 1,
    completed: newCompleted ? prev.completed + 1 : prev.completed - 1,
  }));
});

const toggleTodoBenchmarkAtom = atom(null, (_, set, id: string) => {
  return evaluate(() => {
    set(toggleTodoAtom, id);
  }, BENCHMARK_TOGGLE_SIZE);
});

const deleteTodoAtom = atom(null, (get, set, id: string) => {
  const state = get(todoStateAtom);
  const todo = state.items.find((item) => item.id === id);

  if (!todo) return;

  const updatedItems = state.items.filter((item) => item.id !== id);

  set(todoStateAtom, (prev) => ({
    ...prev,
    items: updatedItems,
  }));

  set(todoStatsAtom, (prev) => ({
    total: prev.total - 1,
    active: todo.completed ? prev.active : prev.active - 1,
    completed: todo.completed ? prev.completed - 1 : prev.completed,
  }));
});

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center">
        <Counter />
        <TodoApp />
      </div>
    </div>
  );
}

const Counter = () => {
  const [counter, setCounter] = useAtom(counterAtom);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the Jotai Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{counter.count}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCounter((prev) => ({ ...prev, count: prev.count - 1 }))}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={() => setCounter((prev) => ({ ...prev, count: 0 }))}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={() => setCounter((prev) => ({ ...prev, count: prev.count + 1 }))}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              Increment
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">Using Jotai state management</div>
      </div>
    </div>
  );
};

const TodoForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  useDebugRender(ref);

  const [newTitle, setNewTitle] = useAtom(newTitleAtom);
  const addTodo = useSetAtom(addTodoAtom);
  const addTodoBenchmark = useSetAtom(addTodoBenchmarkAtom);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (newTitle.trim()) {
      addTodo(newTitle);
      setNewTitle('');
    }
  };

  return (
    <form ref={ref} className="flex gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="text-white px-4 border border-slate-600 bg-slate-800 rounded-md flex-grow"
      />
      <button
        type="submit"
        disabled={!newTitle.trim()}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50">
        <Plus size={16} />
      </button>
      <button
        type="button"
        onClick={() => addTodoBenchmark()}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
};

const TodoItem = memo(({ item }: { item: Todo }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const toggleTodo = useSetAtom(toggleTodoAtom);
  const toggleTodoBenchmark = useSetAtom(toggleTodoBenchmarkAtom);
  const deleteTodo = useSetAtom(deleteTodoAtom);

  const handleToggle = () => {
    toggleTodo(item.id);
  };

  const handleDelete = () => {
    deleteTodo(item.id);
  };

  return (
    <li ref={ref} className="flex items-center gap-2">
      <div className="flex items-center flex-1 gap-3 bg-slate-800/70 p-2 rounded-md">
        <label className="text-slate-300">
          <input type="checkbox" checked={item.completed} onChange={handleToggle} className="sr-only" />
          {item.completed ? (
            <span className="text-green-500 cursor-pointer">✓</span>
          ) : (
            <span className="border border-slate-300 w-4 h-4 inline-block cursor-pointer"></span>
          )}
        </label>
        <span className={`text-semibold text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
          {item.title}
        </span>
      </div>
      <button
        onClick={() => toggleTodoBenchmark(item.id)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
        Toggle {BENCHMARK_TOGGLE_SIZE}x
      </button>
      <button onClick={handleDelete} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
        Delete
      </button>
    </li>
  );
});

const TodoList = () => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  const todos = useAtomValue(filteredTodosAtom);

  if (!todos.length) {
    return <p className="text-slate-400 text-sm flex items-center justify-center mt-4">No todos yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-4 space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} item={todo} />
      ))}
    </ul>
  );
};

const TodoStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const total = useAtomValue(totalAtom);
  const active = useAtomValue(activeAtom);
  const completed = useAtomValue(completedAtom);

  return (
    <div ref={ref} className="flex items-center justify-between px-10 pb-4">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-slate-400">{total}</span>
        <span className="text-xs text-gray-500">Total</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-600">{active}</span>
        <span className="text-xs text-gray-500">Active</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-green-600">{completed}</span>
        <span className="text-xs text-gray-500">Completed</span>
      </div>
    </div>
  );
};

const TodoApp = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  return (
    <div ref={ref} className="bg-slate-900 rounded-2xl shadow-xl max-w-md w-full mx-4 flex flex-col gap-4">
      <div className="px-4 mt-4">
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">Jotai Todo List</h3>
        <TodoForm />
      </div>
      <div className="px-4 max-h-[512px] overflow-y-auto">
        <TodoList />
      </div>
      <div className="px-4">
        <TodoStats />
      </div>
      <p className="text-slate-500 text-xs text-center px-10 mb-4">
        Stats are computed during mutation to prevent extensive resource usage from filtering. This also to showcase the
        complexity level of the optimization.
      </p>
    </div>
  );
};
