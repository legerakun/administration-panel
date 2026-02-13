import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { getProductsThunk, searchProductsThunk } from './thunks';
import { Products } from '@/axios/types';
import { ProductsState } from './types';
import { DataErrors } from './config';

const initialState: ProductsState = {
  products: undefined,
  loading: false,
  error: undefined
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, { payload: products }: PayloadAction<Products>) {
      state.products = products;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductsThunk.pending, (state) => {
        state.products = undefined;
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getProductsThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = undefined;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.products = undefined;
        state.loading = false;
        state.error = action.payload as DataErrors;
      })
      .addCase(searchProductsThunk.pending, (state) => {
        state.products = undefined;
        state.loading = true;
        state.error = undefined;
      })
      .addCase(searchProductsThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = undefined;
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.products = undefined;
        state.loading = false;
        state.error = action.payload as DataErrors;
      });
  }
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
