import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/slice';
import productsReducer from './products/slice';

const reducer = {
  userStore: userReducer,
  productsStore: productsReducer
};

export const store = configureStore({
  reducer
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
