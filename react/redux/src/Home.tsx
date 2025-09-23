import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { 
  increment, 
  decrement, 
  reset
} from './counterSlice';
import { 
  setNewTitle,
  addTodo,
  removeTodo,
  toggleTodo,
  benchmarkAdd,
  toggleBenchmark
} from './todosSlice';
import type { RootState, AppDispatch } from './store';
import type { SerializableTodo } from './todosSlice';
import { BENCHMARK_TOGGLE_SIZE } from '@anchor-benchmark/shared';

// Debug render function to visualize re-renders
const debugRender = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  if (ref.current) {
    // Check if this is the first render or a re-render
    if (!ref.current.hasAttribute('data-rendered')) {
      // First render - red box shadow
      ref.current.setAttribute('data-rendered', 'true');
      ref.current.style.boxShadow = '0 0 0 2px red';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.boxShadow = 'none';
        }
      }, 300);
    } else {
      // Re-render - blue box shadow
      ref.current.style.boxShadow = '0 0 0 2px blue';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.boxShadow = 'none';
        }
      }, 300);
    }
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
  const counter = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the Redux Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{counter}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => dispatch(decrement())}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={() => dispatch(reset())}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={() => dispatch(increment())}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              Increment
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">Using Redux state management</div>
      </div>
    </div>
  );
};

const TodoApp = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="bg-slate-900 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="p-4">
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">Redux Todo List</h3>
        <TodoForm />
        <TodoList />
      </div>
      <TodoStats />
      <p className="text-slate-500 text-xs text-center px-10 mb-4">
        Stats are computed during mutation to prevent extensive resource usage from filtering. This also to showcase the
        complexity level of the optimization.
      </p>
    </div>
  );
};

const TodoForm = () => {
  const newTitle = useSelector((state: RootState) => state.todos.newTitle);
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLFormElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addTodo());
  };

  return (
    <form ref={ref} className="flex gap-3" onSubmit={handleAddTodo}>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => dispatch(setNewTitle(e.target.value))}
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
        onClick={() => dispatch(benchmarkAdd())}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
};

const TodoItem = ({ item, index }: { item: SerializableTodo; index: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLLIElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <li ref={ref} className="flex items-center gap-2">
      <div className="flex items-center flex-1 gap-3 bg-slate-800/70 p-2 rounded-md">
        <label className="text-slate-300">
          <input 
            type="checkbox" 
            checked={item.completed} 
            onChange={() => dispatch(toggleTodo(index))} 
            className="sr-only" 
          />
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
        onClick={() => dispatch(toggleBenchmark(index))}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
        Toggle {BENCHMARK_TOGGLE_SIZE}x
      </button>
      <button 
        onClick={() => dispatch(removeTodo(index))} 
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
        Delete
      </button>
    </li>
  );
};

const TodoList = () => {
  const todoItems = useSelector((state: RootState) => state.todos.items);
  const ref = useRef<HTMLUListElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  if (!todoItems.length) {
    return <p className="text-slate-400 text-sm flex items-center justify-center mt-4">No todos yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-4 space-y-2">
      {todoItems.map((todo, index) => (
        <TodoItem key={todo.id} item={todo} index={index} />
      ))}
    </ul>
  );
};

const TodoStats = () => {
  const todoItems = useSelector((state: RootState) => state.todos.items);
  const ref = useRef<HTMLDivElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  const total = todoItems.length;
  const completed = todoItems.filter(todo => todo.completed).length;
  const active = total - completed;

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