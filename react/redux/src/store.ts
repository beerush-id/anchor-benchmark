import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './counterSlice.js';
import { todosReducer } from './todosSlice.js';
import { complexReducer } from './complexSlice.js';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    complex: complexReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks for convenience
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
