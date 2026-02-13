import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { UserState, setUserPayload } from './types';
import { cookieKey, DataErrors } from './config';
import { getUserThunk } from './thunks';

const initialState: UserState = {
  user: undefined,
  loading: false,
  error: undefined
};

const savedUser = await cookieStore.get(cookieKey);

if (savedUser && savedUser.value) {
  initialState.user = JSON.parse(savedUser.value);
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload: { user, remember } }: PayloadAction<setUserPayload>) {
      state.user = user;

      if (!remember) return;

      const day = 24 * 60 * 60 * 1000;

      cookieStore.set({
        name: cookieKey,
        value: JSON.stringify(user),
        expires: Date.now() + day,
        partitioned: true
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.user = undefined;
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = undefined;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.user = undefined;
        state.loading = false;
        state.error = action.payload as DataErrors;
      });
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
