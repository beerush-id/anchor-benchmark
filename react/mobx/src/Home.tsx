import { observer } from 'mobx-react-lite';
import { makeAutoObservable, observable, runInAction } from 'mobx';
import { Plus } from 'lucide-react';
import {
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  evaluate,
  shortId,
  type Todo,
  type TodosState,
} from '@anchor-benchmark/shared';
import { type FormEvent, useEffect, useRef } from 'react';

// Debug render function to visualize re-renders
const useDebugRender = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  useEffect(() => {
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
  });
};

// MobX Store
class TodoStore {
  todoState: TodosState;
  todoStats: { total: number; completed: number; active: number };
  newTitle = '';

  constructor() {
    this.todoState = observable({
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
      ],
      filter: 'all',
      sortOrder: 'asc',
      sortBy: 'createdAt',
    });

    this.todoStats = observable({
      total: 3,
      completed: 1,
      active: 2,
    });

    makeAutoObservable(this);
  }

  // Actions
  addTodo(title: string) {
    const newTodo: Todo = {
      id: shortId(),
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: [],
    };

    this.todoState.items.push(newTodo);

    this.todoStats.total++;
    this.todoStats.active++;
    this.newTitle = '';
  }

  addTodoBenchmark() {
    return evaluate(() => {
      const newTodo: Todo = {
        id: shortId(),
        title: `New Todo (${this.todoState.items.length + 1})`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        tags: [],
      };

      runInAction(() => {
        this.todoState.items.push(newTodo);
        this.todoStats.total++;
        this.todoStats.active++;
      });
    }, BENCHMARK_SIZE);
  }

  toggleTodo(id: string) {
    const todo = this.todoState.items.find((item) => item.id === id);
    if (!todo) return;

    todo.completed = !todo.completed;
    todo.updatedAt = new Date();

    if (todo.completed) {
      this.todoStats.completed++;
      this.todoStats.active--;
    } else {
      this.todoStats.completed--;
      this.todoStats.active++;
    }
  }

  toggleTodoBenchmark(id: string) {
    return evaluate(() => {
      runInAction(() => {
        this.toggleTodo(id);
      });
    }, BENCHMARK_TOGGLE_SIZE);
  }

  deleteTodo(id: string) {
    const todoIndex = this.todoState.items.findIndex((item) => item.id === id);
    if (todoIndex === -1) return;

    const todo = this.todoState.items[todoIndex];
    this.todoState.items.splice(todoIndex, 1);

    if (todo.completed) {
      this.todoStats.completed--;
    } else {
      this.todoStats.active--;
    }

    this.todoStats.total--;
  }

  setNewTitle(title: string) {
    this.newTitle = title;
  }

  get filteredTodos() {
    switch (this.todoState.filter) {
      case 'active':
        return this.todoState.items.filter((todo) => !todo.completed);
      case 'completed':
        return this.todoState.items.filter((todo) => todo.completed);
      default:
        return this.todoState.items;
    }
  }

  get total() {
    return this.todoStats.total;
  }

  get active() {
    return this.todoStats.active;
  }

  get completed() {
    return this.todoStats.completed;
  }
}

// Create store instance
const todoStore = new TodoStore();

// Counter store
class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

const counterStore = new CounterStore();

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

const Counter = observer(() => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the MobX Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{counterStore.count}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => counterStore.decrement()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={() => counterStore.reset()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={() => counterStore.increment()}
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

const TodoForm = observer(() => {
  const ref = useRef<HTMLFormElement>(null);
  useDebugRender(ref);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (todoStore.newTitle.trim()) {
      todoStore.addTodo(todoStore.newTitle);
    }
  };

  return (
    <form ref={ref} className="flex gap-3" onSubmit={handleSubmit}>
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
        onClick={() => todoStore.addTodoBenchmark()}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
});

const TodoItem = observer(({ item }: { item: Todo }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const handleToggle = () => {
    todoStore.toggleTodo(item.id);
  };

  const handleDelete = () => {
    todoStore.deleteTodo(item.id);
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
        onClick={() => todoStore.toggleTodoBenchmark(item.id)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
        Toggle {BENCHMARK_TOGGLE_SIZE}x
      </button>
      <button onClick={handleDelete} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
        Delete
      </button>
    </li>
  );
});

const TodoList = observer(() => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  if (!todoStore.filteredTodos.length) {
    return <p className="text-slate-400 text-sm flex items-center justify-center mt-4">No todos yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-4 space-y-2">
      {todoStore.filteredTodos.map((todo) => (
        <TodoItem key={todo.id} item={todo} />
      ))}
    </ul>
  );
});

const TodoStats = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

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

const TodoApp = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  return (
    <div ref={ref} className="bg-slate-900 rounded-2xl shadow-xl max-w-md w-full mx-4 flex flex-col gap-4">
      <div className="px-4 mt-4">
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">MobX Todo List</h3>
        <TodoForm />
      </div>
      <div className="px-4 max-h-[480px] overflow-y-auto">
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
});
