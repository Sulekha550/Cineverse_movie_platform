import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { historyApi } from '../../services/tmdb';

export const fetchHistory = createAsyncThunk('history/fetch', async () => {
  const { data } = await historyApi.getAll();
  return data.history;
});

export const addToHistory = createAsyncThunk('history/add', async (movieData) => {
  const { data } = await historyApi.add(movieData);
  return data.history;
});

export const clearHistory = createAsyncThunk('history/clear', async () => {
  await historyApi.clear();
});

const historySlice = createSlice({
  name: 'history',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(addToHistory.fulfilled, (state, action) => {
        const filtered = state.items.filter(h => h.tmdbId !== action.payload.tmdbId);
        state.items = [action.payload, ...filtered].slice(0, 50);
      })
      .addCase(clearHistory.fulfilled, (state) => { state.items = []; });
  }
});

export default historySlice.reducer;
