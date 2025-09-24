import { create } from 'zustand';
import { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { 
  BENCHMARK_DEBOUNCE_TIME,
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  type Todo
} from '@anchor-benchmark/shared';

// Utility function to generate short IDs (similar to Anchor's shortId)
const shortId = () => Math.random().toString(36).substring(2, 9);

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

// Counter store
const useCounterStore = create<{
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Todo store
const useTodoStore = create<{
  items: Todo[];
  newTitle: string;
  setNewTitle: (title: string) => void;
  addTodo: () => void;
  removeTodo: (index: number) => void;
  toggleTodo: (index: number) => void;
  benchmarkAdd: () => void;
  toggleBenchmark: (index: number) => void;
}>((set, get) => ({
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
      title: 'Learn Zustand states',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning', 'zustand'],
    },
    {
      id: '3',
      title: 'Master Zustand state',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: ['learning', 'zustand', 'mastery'],
    },
  ],
  newTitle: '',
  setNewTitle: (title) => set({ newTitle: title }),
  addTodo: () => {
    const { newTitle, items } = get();
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
      
      set({ 
        items: [...items, newTodo],
        newTitle: ''
      });
    }
  },
  removeTodo: (index) => {
    const { items } = get();
    const newItems = [...items];
    newItems.splice(index, 1);
    set({ items: newItems });
  },
  toggleTodo: (index) => {
    const { items } = get();
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      completed: !newItems[index].completed,
      updatedAt: new Date(),
    };
    set({ items: newItems });
  },
  benchmarkAdd: () => {
    const start = performance.now();
    let count = 0;
    
    const addNext = () => {
      if (count < BENCHMARK_SIZE) {
        const { items } = get();
        const newTodo: Todo = {
          id: shortId(),
          title: `New Todo (${items.length + 1})`,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'medium',
          tags: [],
        };
        
        set({ items: [...items, newTodo] });
        count++;
        
        // Schedule next addition with debounce
        setTimeout(addNext, BENCHMARK_DEBOUNCE_TIME);
      } else {
        // Log the time it took to complete the benchmark
        const end = performance.now();
        console.log(`Profiling done in ${end - start}ms.`);
      }
    };
    
    // Start the benchmark
    addNext();
  },
  toggleBenchmark: (index) => {
    // Log the start time
    const start = performance.now();
    
    // We need to simulate the exact same behavior as Anchor:
    // Execute the toggle function BENCHMARK_TOGGLE_SIZE times, 
    // with a debounce between each operation
    let count = 0;
    let { items } = get();
    let currentItem = items[index];
    
    const toggleNext = () => {
      if (count < BENCHMARK_TOGGLE_SIZE) {
        // Update the item
        const newItems = [...items];
        newItems[index] = {
          ...newItems[index],
          completed: !newItems[index].completed,
          updatedAt: new Date(),
        };
        set({ items: newItems });
        
        // Update our local reference to current item state
        currentItem = {
          ...currentItem,
          completed: !currentItem.completed,
        };
        
        // Update items for next iteration
        items = newItems;
        
        count++;
        
        // Schedule next toggle with debounce
        setTimeout(toggleNext, BENCHMARK_DEBOUNCE_TIME);
      } else {
        // Log the time it took to complete the toggle benchmark
        const end = performance.now();
        console.log(`Toggle profiling done in ${end - start}ms.`);
      }
    };
    
    // Start the toggle benchmark
    toggleNext();
  }
}));

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
  const { count, increment, decrement, reset } = useCounterStore();
  const ref = useRef<HTMLDivElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the Zustand Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{count}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={decrement}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={increment}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              Increment
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">Using Zustand state management</div>
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
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">Zustand Todo List</h3>
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
  const newTitle = useTodoStore((state) => state.newTitle);
  const { setNewTitle, addTodo, benchmarkAdd } = useTodoStore();
  const ref = useRef<HTMLFormElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addTodo();
  };

  return (
    <form ref={ref} className="flex gap-3" onSubmit={handleAddTodo}>
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
        onClick={benchmarkAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
};

const TodoItem = ({ item, index }: { item: Todo; index: number }) => {
  const { toggleTodo, removeTodo, toggleBenchmark } = useTodoStore();
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
            onChange={() => toggleTodo(index)} 
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
        onClick={() => toggleBenchmark(index)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
        Toggle {BENCHMARK_TOGGLE_SIZE}x
      </button>
      <button 
        onClick={() => removeTodo(index)} 
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
        Delete
      </button>
    </li>
  );
};

const TodoList = () => {
  const todoItems = useTodoStore((state) => state.items);
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
  const todoItems = useTodoStore((state) => state.items);
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