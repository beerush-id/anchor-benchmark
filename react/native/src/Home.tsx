import { Plus } from 'lucide-react';
import {
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  evaluate,
  shortId,
  type Todo,
  type TodosState,
} from '@anchor-benchmark/shared';
import { type FormEvent, memo, useEffect, useReducer, useRef, useState } from 'react';

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

// Initial todo state
const initialTodoState: TodosState = {
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
      title: 'Learn Native states',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning', 'native'],
    },
    {
      id: '3',
      title: 'Master Native state',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: ['learning', 'native', 'mastery'],
    },
  ],
  filter: 'all',
  sortOrder: 'asc',
  sortBy: 'createdAt',
};

// Initial stats
const initialStats = {
  total: 3,
  completed: 1,
  active: 2,
};

// Actions for todo state
type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string };

// Actions for stats
type StatsAction =
  | { type: 'INCREMENT_TOTAL_AND_ACTIVE' }
  | { type: 'INCREMENT_COMPLETED_AND_DECREMENT_ACTIVE' }
  | { type: 'DECREMENT_COMPLETED_AND_INCREMENT_ACTIVE' }
  | { type: 'DECREMENT_TOTAL_AND_ACTIVE' }
  | { type: 'DECREMENT_TOTAL_AND_COMPLETED' }
  | { type: 'RESET' };

// Todo reducer
const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'TOGGLE_TODO': {
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
      );
    }
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
};

// Stats reducer
const statsReducer = (state: typeof initialStats, action: StatsAction) => {
  switch (action.type) {
    case 'INCREMENT_TOTAL_AND_ACTIVE':
      return {
        ...state,
        total: state.total + 1,
        active: state.active + 1,
      };
    case 'INCREMENT_COMPLETED_AND_DECREMENT_ACTIVE':
      return {
        ...state,
        completed: state.completed + 1,
        active: state.active - 1,
      };
    case 'DECREMENT_COMPLETED_AND_INCREMENT_ACTIVE':
      return {
        ...state,
        completed: state.completed - 1,
        active: state.active + 1,
      };
    case 'DECREMENT_TOTAL_AND_ACTIVE':
      return {
        ...state,
        total: state.total - 1,
        active: state.active - 1,
      };
    case 'DECREMENT_TOTAL_AND_COMPLETED':
      return {
        ...state,
        total: state.total - 1,
        completed: state.completed - 1,
      };
    case 'RESET':
      return initialStats;
    default:
      return state;
  }
};

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
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const [count, setCount] = useState(0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the Native Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{count}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={() => setCount(0)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              Increment
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">Using Native React state management</div>
      </div>
    </div>
  );
};

const TodoApp = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  // Todo state
  const [todos, dispatchTodos] = useReducer(todoReducer, initialTodoState.items);
  const [stats, dispatchStats] = useReducer(statsReducer, initialStats);

  // Keep a ref to the current todos state for accurate reads in batch operations
  const todosRef = useRef(todos);
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  // Form state
  const [newTitle, setNewTitle] = useState('');

  // Filtered todos
  const filteredTodos = todos; // No filtering in this implementation to match Anchor

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (newTitle.trim()) {
      const newTodo: Todo = {
        id: shortId(),
        title: newTitle,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        tags: [],
      };

      dispatchTodos({ type: 'ADD_TODO', payload: newTodo });
      dispatchStats({ type: 'INCREMENT_TOTAL_AND_ACTIVE' });
      setNewTitle('');
    }
  };

  const addTodoBenchmark = () => {
    return evaluate(() => {
      const newTodo: Todo = {
        id: shortId(),
        title: `New Todo (${todosRef.current.length + 1})`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        tags: [],
      };

      dispatchTodos({ type: 'ADD_TODO', payload: newTodo });
      dispatchStats({ type: 'INCREMENT_TOTAL_AND_ACTIVE' });
    }, BENCHMARK_SIZE);
  };

  const toggleTodo = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    dispatchTodos({ type: 'TOGGLE_TODO', payload: id });

    if (todo.completed) {
      dispatchStats({ type: 'DECREMENT_COMPLETED_AND_INCREMENT_ACTIVE' });
    } else {
      dispatchStats({ type: 'INCREMENT_COMPLETED_AND_DECREMENT_ACTIVE' });
    }
  };

  const toggleTodoBenchmark = (id: string) => {
    return evaluate(() => {
      // Get the current state of todos to determine the current completed status
      const currentTodos = todosRef.current;
      const todo = currentTodos.find((t) => t.id === id);
      if (!todo) return;

      dispatchTodos({ type: 'TOGGLE_TODO', payload: id });

      if (todo.completed) {
        dispatchStats({ type: 'DECREMENT_COMPLETED_AND_INCREMENT_ACTIVE' });
      } else {
        dispatchStats({ type: 'INCREMENT_COMPLETED_AND_DECREMENT_ACTIVE' });
      }
    }, BENCHMARK_TOGGLE_SIZE);
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    dispatchTodos({ type: 'DELETE_TODO', payload: id });

    if (todo.completed) {
      dispatchStats({ type: 'DECREMENT_TOTAL_AND_COMPLETED' });
    } else {
      dispatchStats({ type: 'DECREMENT_TOTAL_AND_ACTIVE' });
    }
  };

  return (
    <div ref={ref} className="bg-slate-900 rounded-2xl shadow-xl max-w-md w-full mx-4 flex flex-col gap-4">
      <div className="px-4 mt-4">
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">Native Todo List</h3>
        <TodoForm newTitle={newTitle} setNewTitle={setNewTitle} addTodo={addTodo} addTodoBenchmark={addTodoBenchmark} />
      </div>
      <div className="px-4 max-h-[512px] overflow-y-auto">
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          toggleTodoBenchmark={toggleTodoBenchmark}
          deleteTodo={deleteTodo}
        />
      </div>
      <div className="px-4">
        <TodoStats stats={stats} />
      </div>
      <p className="text-slate-500 text-xs text-center px-10 mb-4">
        Stats are computed during mutation to prevent extensive resource usage from filtering. This also to showcase the
        complexity level of the optimization.
      </p>
    </div>
  );
};

const TodoForm = ({
  newTitle,
  setNewTitle,
  addTodo,
  addTodoBenchmark,
}: {
  newTitle: string;
  setNewTitle: (title: string) => void;
  addTodo: (e: FormEvent) => void;
  addTodoBenchmark: () => void;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  useDebugRender(ref);

  return (
    <form ref={ref} className="flex gap-3" onSubmit={addTodo}>
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
        onClick={addTodoBenchmark}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
};

const TodoItem = memo(
  ({
    item,
    toggleTodo,
    toggleTodoBenchmark,
    deleteTodo,
  }: {
    item: Todo;
    toggleTodo: (id: string) => void;
    toggleTodoBenchmark: (id: string) => void;
    deleteTodo: (id: string) => void;
  }) => {
    const ref = useRef<HTMLLIElement>(null);
    useDebugRender(ref);

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
          <span
            className={`text-semibold text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
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
  }
);

const TodoList = ({
  todos,
  toggleTodo,
  toggleTodoBenchmark,
  deleteTodo,
}: {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  toggleTodoBenchmark: (id: string) => void;
  deleteTodo: (id: string) => void;
}) => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  if (!todos.length) {
    return <p className="text-slate-400 text-sm flex items-center justify-center mt-4">No todos yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-4 space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          item={todo}
          toggleTodo={toggleTodo}
          toggleTodoBenchmark={toggleTodoBenchmark}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
};

const TodoStats = ({ stats }: { stats: { total: number; active: number; completed: number } }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const { total, active, completed } = stats;

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
