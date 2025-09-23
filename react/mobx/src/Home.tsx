import { observable, action, makeObservable, computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Plus } from 'lucide-react';
import { 
  BENCHMARK_DEBOUNCE_TIME,
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  type Todo
} from '@anchor-benchmark/shared';
import { type FormEvent, useEffect, useRef, useState } from 'react';

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

// MobX store for todo items and stats
class TodoStore {
  todos: Todo[] = [
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
      title: 'Learn MobX states',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning', 'mobx'],
    },
    {
      id: '3',
      title: 'Master MobX state',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: ['learning', 'mobx', 'mastery'],
    },
  ];

  newTitle = '';

  constructor() {
    makeObservable(this, {
      todos: observable,
      newTitle: observable,
      addTodo: action,
      removeTodo: action,
      toggleTodo: action,
      setNewTitle: action,
      benchmarkAdd: action,
      addBenchmarkItem: action,
      toggleBenchmark: action,
      total: computed,
      completed: computed,
      active: computed,
    });
  }

  get total() {
    return this.todos.length;
  }

  get completed() {
    return this.todos.filter(todo => todo.completed).length;
  }

  get active() {
    return this.total - this.completed;
  }

  setNewTitle(title: string) {
    this.newTitle = title;
  }

  addTodo(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (this.newTitle.trim()) {
      const newTodo: Todo = {
        id: shortId(),
        title: this.newTitle,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        tags: [],
      };

      this.todos.push(newTodo);
      this.newTitle = '';
    }
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }

  toggleTodo(index: number) {
    const todo = this.todos[index];
    // Create a new object with updated properties
    this.todos[index] = {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date(),
    };
  }

  benchmarkAdd() {
    const start = performance.now();
    let count = 0;
    
    const addNext = () => {
      if (count < BENCHMARK_SIZE) {
        // Add one item using an action
        this.addBenchmarkItem();
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
  }

  addBenchmarkItem() {
    const newTodo: Todo = {
      id: shortId(),
      title: `New Todo (${this.todos.length + 1})`,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: [],
    };
    
    this.todos.push(newTodo);
  }

  toggleBenchmark(index: number) {
    // Log the start time
    const start = performance.now();
    
    // We need to simulate the exact same behavior as Anchor:
    // Execute the toggle function BENCHMARK_TOGGLE_SIZE times, 
    // with a debounce between each operation
    let count = 0;
    
    const toggleNext = () => {
      if (count < BENCHMARK_TOGGLE_SIZE) {
        // Toggle the item using an action
        this.toggleTodo(index);
        
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
}

// Counter store
class CounterStore {
  count = 0;

  constructor() {
    makeObservable(this, {
      count: observable,
      increment: action,
      decrement: action,
      reset: action,
    });
  }

  increment = () => {
    this.count += 1;
  };

  decrement = () => {
    this.count -= 1;
  };

  reset = () => {
    this.count = 0;
  };
}

const HomeContent = observer(() => {
  const [todoStore] = useState(() => new TodoStore());
  const [counterStore] = useState(() => new CounterStore());

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center">
        <Counter counterStore={counterStore} />
        <TodoApp todoStore={todoStore} />
      </div>
    </div>
  );
});

const Counter = observer(({ counterStore }: { counterStore: CounterStore }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the MobX Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{counterStore.count}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={counterStore.decrement}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={counterStore.reset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={counterStore.increment}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              Increment
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">Using MobX state management</div>
      </div>
    </div>
  );
});

const TodoApp = observer(({ todoStore }: { todoStore: TodoStore }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="bg-slate-900 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="p-4">
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">MobX Todo List</h3>
        <TodoForm todoStore={todoStore} />
        <TodoList todoStore={todoStore} />
      </div>
      <TodoStats todoStore={todoStore} />
      <p className="text-slate-500 text-xs text-center px-10 mb-4">
        Stats are computed during mutation to prevent extensive resource usage from filtering. This also to showcase the
        complexity level of the optimization.
      </p>
    </div>
  );
});

const TodoForm = observer(({ todoStore }: { todoStore: TodoStore }) => {
  const ref = useRef<HTMLFormElement>(null);

  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <form ref={ref} className="flex gap-3" onSubmit={(e) => todoStore.addTodo(e)}>
      <input
        type="text"
        value={todoStore.newTitle}
        onChange={(e) => todoStore.setNewTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="text-white px-4 border border-slate-600 bg-slate-800 rounded-md flex-grow"
      />
      <button
        type="submit"
        disabled={!todoStore.newTitle.trim()}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50">
        <Plus size={16} />
      </button>
      <button
        type="button"
        onClick={() => todoStore.benchmarkAdd()}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
});

const TodoItem = observer(({ todo, index, todoStore }: { todo: Todo; index: number; todoStore: TodoStore }) => {
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
            checked={todo.completed}
            onChange={() => todoStore.toggleTodo(index)}
            className="sr-only"
          />
          {todo.completed ? (
            <span className="text-green-500 cursor-pointer">✓</span>
          ) : (
            <span className="border border-slate-300 w-4 h-4 inline-block cursor-pointer"></span>
          )}
        </label>
        <span className={`text-semibold text-sm ${todo.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
          {todo.title}
        </span>
      </div>
      <button
        onClick={() => todoStore.toggleBenchmark(index)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
        Toggle {BENCHMARK_TOGGLE_SIZE}x
      </button>
      <button
        onClick={() => todoStore.removeTodo(index)}
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
        Delete
      </button>
    </li>
  );
});

const TodoList = observer(({ todoStore }: { todoStore: TodoStore }) => {
  const ref = useRef<HTMLUListElement>(null);

  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  if (!todoStore.todos.length) {
    return <p className="text-slate-400 text-sm flex items-center justify-center mt-4">No todos yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-4 space-y-2">
      {todoStore.todos.map((todo, index) => (
        <TodoItem key={todo.id} todo={todo} index={index} todoStore={todoStore} />
      ))}
    </ul>
  );
});

const TodoStats = observer(({ todoStore }: { todoStore: TodoStore }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Apply debug render visualization
  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div ref={ref} className="flex items-center justify-between px-10 pb-4">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-slate-400">{todoStore.total}</span>
        <span className="text-xs text-gray-500">Total</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-600">{todoStore.active}</span>
        <span className="text-xs text-gray-500">Active</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-green-600">{todoStore.completed}</span>
        <span className="text-xs text-gray-500">Completed</span>
      </div>
    </div>
  );
});

export default function Home() {
  return <HomeContent />;
}
