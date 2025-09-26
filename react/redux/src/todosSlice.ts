import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Todo, TodosState } from '@anchor-benchmark/shared';
import type { RootState } from './store';

// Convert Todo with Date objects to serializable format
interface SerializableTodo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO string instead of Date object
  updatedAt: string; // ISO string instead of Date object
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  description?: string;
}

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
      title: 'Learn Redux states',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high',
      tags: ['learning', 'redux'],
    },
    {
      id: '3',
      title: 'Master Redux state',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      tags: ['learning', 'redux', 'mastery'],
    },
  ],
  filter: 'all',
  sortOrder: 'asc',
  sortBy: 'createdAt',
};

// Convert Date objects to ISO strings for Redux serialization
export const toSerializableTodo = (todo: Todo): SerializableTodo => ({
  ...todo,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString(),
});

const toTodo = (serializableTodo: SerializableTodo): Todo => ({
  ...serializableTodo,
  createdAt: new Date(serializableTodo.createdAt),
  updatedAt: new Date(serializableTodo.updatedAt),
});

const initialStats = {
  total: 3,
  completed: 1,
  active: 2,
};

// Define the state structure for our slice
interface TodosSliceState {
  items: SerializableTodo[];
  stats: {
    total: number;
    completed: number;
    active: number;
  };
}

const initialState: TodosSliceState = {
  items: initialTodoState.items.map(toSerializableTodo),
  stats: initialStats,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<SerializableTodo>) => {
      state.items.push(action.payload);
      state.stats.total += 1;
      state.stats.active += 1;
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date().toISOString();

        if (todo.completed) {
          state.stats.completed += 1;
          state.stats.active -= 1;
        } else {
          state.stats.completed -= 1;
          state.stats.active += 1;
        }
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        const todo = state.items[index];
        state.items.splice(index, 1);
        state.stats.total -= 1;

        if (todo.completed) {
          state.stats.completed -= 1;
        } else {
          state.stats.active -= 1;
        }
      }
    },
    resetStats: (state) => {
      state.stats = { ...initialStats };
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, resetStats } = todosSlice.actions;

// Memoized selector to get todos as Todo[] (with Date objects)
export const selectTodos = createSelector([(state: RootState) => state.todos.items], (items) => items.map(toTodo));

export const todosReducer = todosSlice.reducer;
