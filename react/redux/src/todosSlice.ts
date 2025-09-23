import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { BENCHMARK_DEBOUNCE_TIME, BENCHMARK_SIZE, BENCHMARK_TOGGLE_SIZE, type Todo } from '@anchor-benchmark/shared';

// Utility function to generate short IDs (similar to Anchor's shortId)
export const shortId = () => Math.random().toString(36).substring(2, 9);

// Convert Todo with Date objects to Todo with ISO strings for Redux serialization
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

// Convert Todo to SerializableTodo
export const toSerializableTodo = (todo: Todo): SerializableTodo => ({
  ...todo,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString(),
});

// Convert SerializableTodo back to Todo
export const fromSerializableTodo = (todo: SerializableTodo): Todo => ({
  ...todo,
  createdAt: new Date(todo.createdAt),
  updatedAt: new Date(todo.updatedAt),
});

// Todo slice
interface TodosState {
  items: SerializableTodo[];
  newTitle: string;
}

const initialTodosState: TodosState = {
  items: [
    {
      id: '1',
      title: 'Learn React state',
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'high',
      tags: ['learning'],
    },
    {
      id: '2',
      title: 'Learn Redux states',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'high',
      tags: ['learning', 'redux'],
    },
    {
      id: '3',
      title: 'Master Redux state',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'medium',
      tags: ['learning', 'redux', 'mastery'],
    },
  ],
  newTitle: '',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState: initialTodosState,
  reducers: {
    setNewTitle: (state, action: PayloadAction<string>) => {
      state.newTitle = action.payload;
    },
    addTodo: (state) => {
      if (state.newTitle.trim()) {
        const newTodo: SerializableTodo = {
          id: shortId(),
          title: state.newTitle,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          priority: 'medium',
          tags: [],
        };

        state.items.push(newTodo);
        state.newTitle = '';
      }
    },
    addTodoWithTitle: (state, action: PayloadAction<string>) => {
      const newTodo: SerializableTodo = {
        id: shortId(),
        title: action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: 'medium',
        tags: [],
      };

      state.items.push(newTodo);
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items[action.payload];
      todo.completed = !todo.completed;
      todo.updatedAt = new Date().toISOString();
    },
  },
});

// Thunk for benchmark add operation
export const benchmarkAdd = createAsyncThunk(
  'todos/benchmarkAdd',
  async (_, { dispatch }) => {
    const start = performance.now();
    let count = 0;

    return new Promise<void>((resolve) => {
      const addNext = () => {
        if (count < BENCHMARK_SIZE) {
          // Add one item
          dispatch(todosSlice.actions.addTodoWithTitle(`New Todo (${count + 1})`));
          count++;

          // Schedule next addition with debounce
          setTimeout(addNext, BENCHMARK_DEBOUNCE_TIME);
        } else {
          // Log the time it took to complete the benchmark
          const end = performance.now();
          console.log(`Profiling done in ${end - start}ms.`);
          resolve();
        }
      };

      // Start the benchmark
      addNext();
    });
  }
);

// Thunk for toggle benchmark operation
export const toggleBenchmark = createAsyncThunk(
  'todos/toggleBenchmark',
  async (index: number, { dispatch }) => {
    const start = performance.now();
    let count = 0;

    return new Promise<void>((resolve) => {
      const toggleNext = () => {
        if (count < BENCHMARK_TOGGLE_SIZE) {
          // Toggle the item
          dispatch(todosSlice.actions.toggleTodo(index));
          count++;

          // Schedule next toggle with debounce
          setTimeout(toggleNext, BENCHMARK_DEBOUNCE_TIME);
        } else {
          // Log the time it took to complete the toggle benchmark
          const end = performance.now();
          console.log(`Toggle profiling done in ${end - start}ms.`);
          resolve();
        }
      };

      // Start the toggle benchmark
      toggleNext();
    });
  }
);

export const { setNewTitle, addTodo, removeTodo, toggleTodo } = todosSlice.actions;
export const todosReducer = todosSlice.reducer;

// Export helper functions for converting between Todo and SerializableTodo
export { type SerializableTodo };