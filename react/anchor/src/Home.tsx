import { debugRender, useObservedList, useWriter } from '@anchorlib/react';
import { observable, observe } from '@anchorlib/react/view';
import { anchor } from '@anchorlib/core';
import { Plus } from 'lucide-react';
import {
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  evaluate,
  shortId,
  type Todo,
  type TodosState,
} from '@anchor-benchmark/shared';
import { type FormEvent, memo, useRef } from 'react';

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

const counter = anchor({ count: 0 });

const Counter = observable(() => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
        <p className="text-gray-600 mb-8">Welcome to the Anchor Benchmark</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-6">{counter.count}</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => counter.count--}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300">
              Decrement
            </button>
            <button
              onClick={() => (counter.count = 0)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset
            </button>
            <button
              onClick={() => counter.count++}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              Increment
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">Using Anchor state management</div>
      </div>
    </div>
  );
});

const todoState = anchor.immutable({
  items: [
    {
      id: shortId(),
      title: 'Learn React state',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning'],
    },
    {
      id: shortId(),
      title: 'Learn Anchor states',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning', 'anchor'],
    },
    {
      id: shortId(),
      title: 'Master Anchor state',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: ['learning', 'anchor', 'mastery'],
    },
  ],
  filter: 'all',
  sortOrder: 'asc',
  sortBy: 'createdAt',
} as TodosState);
const todoStats = anchor.immutable({
  total: 3,
  completed: 1,
  active: 2,
});
const todoTitle = anchor({ text: '' });

const stateWriter = anchor.writable(todoState.items, ['push', 'splice']);
const statsWriter = anchor.writable(todoStats);

const benchmark = (fn: () => void) => {
  return evaluate(fn, BENCHMARK_SIZE);
};

const toggleBenchmark = (fn: () => void) => {
  return evaluate(fn, BENCHMARK_TOGGLE_SIZE);
};

const TodoApp = () => {
  const ref = useRef<HTMLDivElement>(null);
  debugRender(ref);

  return (
    <div ref={ref} className="bg-slate-900 rounded-2xl shadow-xl max-w-md w-full mx-4 flex flex-col gap-4">
      <div className="px-4 mt-4">
        <h3 className="font-semibold text-slate-200 flex-1 text-xl mb-10 text-center">Anchor Todo List</h3>
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

const TodoForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  debugRender(ref);

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (todoTitle.text.trim()) {
      stateWriter.push({
        id: shortId(),
        title: todoTitle.text,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        tags: [],
      });

      statsWriter.total++;
      statsWriter.active++;

      todoTitle.text = '';
    }
  };

  const FormInput = observe(() => (
    <>
      <input
        type="text"
        value={todoTitle.text}
        onChange={(e) => (todoTitle.text = e.target.value)}
        placeholder="Add a new todo..."
        className="text-white px-4 border border-slate-600 bg-slate-800 rounded-md flex-grow"
      />
      <button
        type="submit"
        disabled={!todoTitle.text.trim()}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50">
        <Plus size={16} />
      </button>
    </>
  ));

  return (
    <form ref={ref} className="flex gap-3" onSubmit={addTodo}>
      <FormInput />
      <button
        type="button"
        onClick={() =>
          benchmark(() => {
            stateWriter.push({
              id: shortId(),
              title: `New Todo (${todoState.items.length + 1})`,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              priority: 'medium',
              tags: [],
            });

            statsWriter.total++;
            statsWriter.active++;
          })
        }
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
        Benchmark
      </button>
    </form>
  );
};

const TodoList = () => {
  const ref = useRef<HTMLUListElement>(null);
  debugRender(ref);

  const todos = useObservedList(todoState.items as Todo[], 'id');

  if (!todos.length) {
    return <p className="text-slate-400 text-sm flex items-center justify-center mt-4">No todos yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-4 space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.key} item={todo.value} />
      ))}
    </ul>
  );
};

const TodoItem = memo(({ item }: { item: Todo }) => {
  const ref = useRef<HTMLLIElement>(null);
  debugRender(ref);

  const todoWriter = useWriter(item, ['completed']);

  const handleToggle = () => {
    todoWriter.completed = !todoWriter.completed;

    if (item.completed) {
      statsWriter.completed++;
      statsWriter.active--;
    } else {
      statsWriter.completed--;
      statsWriter.active++;
    }
  };

  const handleDelete = () => {
    stateWriter.splice(stateWriter.indexOf(item as (typeof todoState.items)[number]), 1);
    statsWriter.total--;

    if (item.completed) {
      statsWriter.completed--;
    } else {
      statsWriter.active--;
    }
  };

  const ItemView = observe<HTMLDivElement>((ref) => {
    debugRender(ref);

    return (
      <div ref={ref} className="flex items-center flex-1 gap-3 bg-slate-800/70 p-2 rounded-md">
        <label className="text-slate-300">
          <input type="checkbox" checked={todoWriter.completed} onChange={handleToggle} className="sr-only" />
          {todoWriter.completed ? (
            <span className="text-green-500 cursor-pointer">✓</span>
          ) : (
            <span className="border border-slate-300 w-4 h-4 inline-block cursor-pointer"></span>
          )}
        </label>
        <span
          className={`text-semibold text-sm ${todoWriter.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
          {todoWriter.title}
        </span>
      </div>
    );
  });

  return (
    <li ref={ref} className="flex items-center gap-2">
      <ItemView />
      <button
        onClick={() => toggleBenchmark(handleToggle)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
        Toggle {BENCHMARK_TOGGLE_SIZE}x
      </button>
      <button onClick={handleDelete} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
        Delete
      </button>
    </li>
  );
});

const TodoStats = observable(() => {
  const ref = useRef<HTMLDivElement>(null);
  debugRender(ref);

  const { total, active, completed } = todoStats;

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
}, 'TodoStats');
