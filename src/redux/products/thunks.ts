import { createAsyncThunk } from '@reduxjs/toolkit';

import { DataErrors } from './config';
import { setProducts } from './slice';
import api from '@/axios/api';

type getProducts = {
  limit?: number;
  skip?: number;
};

export const getProductsThunk = createAsyncThunk(
  'products/getProductsThunk',
  async ({ limit, skip }: getProducts, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.getProducts(limit, skip);

      dispatch(setProducts(data));

      return data;
    } catch (error) {
      console.warn(error);

      return rejectWithValue(DataErrors.NOT_FOUND);
    }
  }
);

type searchProducts = {
  query: string;
  limit?: number;
  skip?: number;
};

export const searchProductsThunk = createAsyncThunk(
  'products/searchProductsThunk',
  async ({ query, limit, skip }: searchProducts, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.searchProducts(query, limit, skip);

      dispatch(setProducts(data));

      return data;
    } catch (error) {
      console.warn(error);

      return rejectWithValue(DataErrors.NOT_FOUND);
    }
  }
);
