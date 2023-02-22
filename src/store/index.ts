import { configureStore } from '@reduxjs/toolkit';
import {
  useSelector as rawUseSelector,
  TypedUseSelectorHook,
  useDispatch as useDispatchRedux
} from 'react-redux';
import { chartDataApi } from './queries/chart';
import { shareApi } from './queries/share';

// Middleware: Redux Persist Persisted Reducer

export const store = configureStore({
  reducer: {
    [chartDataApi.reducerPath]: chartDataApi.reducer,
    [shareApi.reducerPath]: shareApi.reducer
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(chartDataApi.middleware)
      .concat(shareApi.middleware);

    return middlewares;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export const useDispatch = () => useDispatchRedux<AppDispatch>(); // Export a hook that can be reused to resolve types
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
