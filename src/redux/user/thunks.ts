import { createAsyncThunk } from '@reduxjs/toolkit';

import { UserData } from '@/axios/types';
import { DataErrors } from './config';
import { setUser } from './slice';
import api from '@/axios/api';

type getUser = {
  userData: UserData;
  remember: boolean;
};

export const getUserThunk = createAsyncThunk(
  'user/getUserThunk',
  async ({ userData, remember }: getUser, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.getUser(userData);

      if (!data.accessToken) {
        return rejectWithValue(DataErrors.DONT_HAVE_TOKEN);
      }

      dispatch(setUser({ user: data, remember: remember }));

      return data;
    } catch (error) {
      console.warn(error);

      return rejectWithValue(DataErrors.NOT_FOUND);
    }
  }
);
