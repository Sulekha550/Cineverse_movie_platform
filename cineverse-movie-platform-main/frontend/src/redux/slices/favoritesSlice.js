import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '../../services/tmdb';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async () => {
  const { data } = await favoritesApi.getAll();
  return data.favorites;
});

export const addFavorite = createAsyncThunk('favorites/add', async (movieData, { rejectWithValue }) => {
  try {
    const { data } = await favoritesApi.add(movieData);
    return data.favorite;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (tmdbId) => {
  await favoritesApi.remove(tmdbId);
  return tmdbId;
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchFavorites.rejected, (state) => { state.loading = false; })
      .addCase(addFavorite.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(f => f.tmdbId !== String(action.payload));
      });
  }
});

export default favoritesSlice.reducer;
