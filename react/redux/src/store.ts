import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './counterSlice.js';
import { todosReducer } from './todosSlice.js';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;