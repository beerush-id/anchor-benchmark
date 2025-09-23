import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atom } from 'jotai';
import { Plus } from 'lucide-react';
import { 
  BENCHMARK_DEBOUNCE_TIME,
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  type Todo
} from '@anchor-benchmark/shared';
import { type FormEvent, memo, useEffect, useRef } from 'react';

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

// Counter atom
const counterAtom = atom(0);

// Todo items atom
const todoItemsAtom = atom<Todo[]>([
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
]);

// Stats atom
const todoStatsAtom = atom({
  total: 3,
  completed: 1,
  active: 2,
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
  const ref = useRef<HTMLDivElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the Jotai Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{counter}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCounter(prev => prev - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={() => setCounter(0)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={() => setCounter(prev => prev + 1)}
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

// Atoms for form
const newTitleAtom = atom('');

const TodoForm = () => {
  const [newTitle, setNewTitle] = useAtom(newTitleAtom);
  const setTodoItems = useSetAtom(todoItemsAtom);
  const setTodoStats = useSetAtom(todoStatsAtom);
  const ref = useRef<HTMLFormElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

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

      setTodoItems(prev => [...prev, newTodo]);
      setTodoStats(prev => ({
        total: prev.total + 1,
        completed: prev.completed,
        active: prev.active + 1,
      }));

      setNewTitle('');
    }
  };

  const benchmarkAdd = () => {
    const start = performance.now();
    let count = 0;
    
    const addNext = () => {
      if (count < BENCHMARK_SIZE) {
        // Add one item
        setTodoItems(prev => {
          const newItems = [...prev];
          newItems.push({
            id: shortId(),
            title: `New Todo (${newItems.length + 1})`,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: 'medium',
            tags: [],
          });
          return newItems;
        });
        
        // Update stats
        setTodoStats(prev => ({
          total: prev.total + 1,
          completed: prev.completed,
          active: prev.active + 1,
        }));
        
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
  };

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
        onClick={benchmarkAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
};

const TodoItem = memo(({ item, index }: { item: Todo; index: number }) => {
  const setTodoItems = useSetAtom(todoItemsAtom);
  const setTodoStats = useSetAtom(todoStatsAtom);
  const ref = useRef<HTMLLIElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  const handleToggle = () => {
    setTodoItems(prev => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        completed: !newItems[index].completed,
        updatedAt: new Date(),
      };
      return newItems;
    });

    setTodoStats(prev => {
      if (item.completed) {
        return {
          total: prev.total,
          completed: prev.completed - 1,
          active: prev.active + 1,
        };
      } else {
        return {
          total: prev.total,
          completed: prev.completed + 1,
          active: prev.active - 1,
        };
      }
    });
  };

  const handleDelete = () => {
    setTodoItems(prev => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });

    setTodoStats(prev => {
      if (item.completed) {
        return {
          total: prev.total - 1,
          completed: prev.completed - 1,
          active: prev.active,
        };
      } else {
        return {
          total: prev.total - 1,
          completed: prev.completed,
          active: prev.active - 1,
        };
      }
    });
  };

  const toggleBenchmark = () => {
    // Log the start time
    const start = performance.now();
    
    // We need to simulate the exact same behavior as Anchor:
    // Execute the toggle function BENCHMARK_TOGGLE_SIZE times, 
    // with a debounce between each operation
    let count = 0;
    let currentItem = item;
    
    const toggleNext = () => {
      if (count < BENCHMARK_TOGGLE_SIZE) {
        // Update the item
        setTodoItems(prev => {
          const newItems = [...prev];
          newItems[index] = {
            ...newItems[index],
            completed: !newItems[index].completed,
            updatedAt: new Date(),
          };
          return newItems;
        });
        
        // Update stats based on current item state
        setTodoStats(prev => {
          if (currentItem.completed) {
            // Was completed, now becomes active
            return {
              total: prev.total,
              completed: prev.completed - 1,
              active: prev.active + 1,
            };
          } else {
            // Was active, now becomes completed
            return {
              total: prev.total,
              completed: prev.completed + 1,
              active: prev.active - 1,
            };
          }
        });
        
        // Update our local reference to current item state
        currentItem = {
          ...currentItem,
          completed: !currentItem.completed,
        };
        
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
        onClick={toggleBenchmark}
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
  const todoItems = useAtomValue(todoItemsAtom); // Use todoItemsAtom directly instead of readOnlyTodoItemsAtom
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
  const stats = useAtomValue(todoStatsAtom);
  const ref = useRef<HTMLDivElement>(null);
  
  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="flex items-center justify-between px-10 pb-4">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-slate-400">{stats.total}</span>
        <span className="text-xs text-gray-500">Total</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-600">{stats.active}</span>
        <span className="text-xs text-gray-500">Active</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-green-600">{stats.completed}</span>
        <span className="text-xs text-gray-500">Completed</span>
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
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">Jotai Todo List</h3>
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