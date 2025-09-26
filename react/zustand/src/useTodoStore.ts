import { create } from 'zustand';
import { shortId, type Todo, type TodosState } from '@anchor-benchmark/shared';

interface TodoStats {
  total: number;
  completed: number;
  active: number;
}

interface TodoStoreState {
  // Todo state
  todoState: TodosState;

  // Stats state
  todoStats: TodoStats;

  // Actions
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const initialTodos: Todo[] = [
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
];

const initialStats = {
  total: 3,
  completed: 1,
  active: 2,
};

export const useTodoStore = create<TodoStoreState>()((set, get) => ({
  todoState: {
    items: initialTodos,
    filter: 'all',
    sortOrder: 'asc',
    sortBy: 'createdAt',
  },
  todoStats: initialStats,

  addTodo: (title: string) => {
    const newTodo: Todo = {
      id: shortId(),
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: [],
    };

    set((state) => ({
      todoState: {
        ...state.todoState,
        items: [...state.todoState.items, newTodo],
      },
      todoStats: {
        ...state.todoStats,
        total: state.todoStats.total + 1,
        active: state.todoStats.active + 1,
      },
    }));
  },

  toggleTodo: (id: string) => {
    const state = get();
    const todo = state.todoState.items.find((item) => item.id === id);

    if (!todo) return;

    set((state) => ({
      todoState: {
        ...state.todoState,
        items: state.todoState.items.map((item) =>
          item.id === id ? { ...item, completed: !item.completed, updatedAt: new Date() } : item
        ),
      },
      todoStats: {
        ...state.todoStats,
        completed: todo.completed ? state.todoStats.completed - 1 : state.todoStats.completed + 1,
        active: todo.completed ? state.todoStats.active + 1 : state.todoStats.active - 1,
      },
    }));
  },

  deleteTodo: (id: string) => {
    const state = get();
    const todo = state.todoState.items.find((item) => item.id === id);

    if (!todo) return;

    set((state) => ({
      todoState: {
        ...state.todoState,
        items: state.todoState.items.filter((item) => item.id !== id),
      },
      todoStats: {
        ...state.todoStats,
        total: state.todoStats.total - 1,
        completed: todo.completed ? state.todoStats.completed - 1 : state.todoStats.completed,
        active: todo.completed ? state.todoStats.active : state.todoStats.active - 1,
      },
    }));
  },
}));
