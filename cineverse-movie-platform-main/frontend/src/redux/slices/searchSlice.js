import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tmdbApi } from '../../services/tmdb';

export const performSearch = createAsyncThunk('search/perform', async ({ query, page = 1 }, { rejectWithValue }) => {
  try {
    if (!query.trim()) return { results: [], query: '', total_pages: 0 };
    const { data } = await tmdbApi.search(query, 'multi', page);
    return { results: data.results || [], query, page, total_pages: data.total_pages || 0 };
  } catch (error) {
    return rejectWithValue('Search failed');
  }
});

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    loading: false,
    error: null,
    page: 1,
    total_pages: 0,
    isOpen: false,
  },
  reducers: {
    setQuery: (state, action) => { state.query = action.payload; },
    openSearch: (state) => { state.isOpen = true; },
    closeSearch: (state) => { state.isOpen = false; state.results = []; state.query = ''; },
    clearResults: (state) => { state.results = []; state.total_pages = 0; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        const { results, page, total_pages } = action.payload;
        state.results = page === 1 ? results : [...state.results, ...results];
        state.page = page;
        state.total_pages = total_pages;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setQuery, openSearch, closeSearch, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
