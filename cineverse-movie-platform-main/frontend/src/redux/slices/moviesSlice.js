import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tmdbApi } from '../../services/tmdb';

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async ({ page = 1 } = {}) => {
  const { data } = await tmdbApi.getTrending('all', 'week', page);
  return { results: data.results, page, total_pages: data.total_pages };
});

export const fetchPopularMovies = createAsyncThunk('movies/fetchPopular', async ({ page = 1 } = {}) => {
  const { data } = await tmdbApi.getPopularMovies(page);
  return { results: data.results, page, total_pages: data.total_pages };
});

export const fetchTopRated = createAsyncThunk('movies/fetchTopRated', async ({ page = 1 } = {}) => {
  const { data } = await tmdbApi.getTopRatedMovies(page);
  return { results: data.results, page, total_pages: data.total_pages };
});

export const fetchPopularTV = createAsyncThunk('movies/fetchPopularTV', async ({ page = 1 } = {}) => {
  const { data } = await tmdbApi.getPopularTV(page);
  return { results: data.results, page, total_pages: data.total_pages };
});

export const fetchPeople = createAsyncThunk('movies/fetchPeople', async ({ page = 1 } = {}) => {
  const { data } = await tmdbApi.getPopularPeople(page);
  return { results: data.results, page, total_pages: data.total_pages };
});

const createSection = () => ({ items: [], page: 0, total_pages: 1, loading: false, error: null });

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: createSection(),
    popular: createSection(),
    topRated: createSection(),
    tvShows: createSection(),
    people: createSection(),
  },
  reducers: {},
  extraReducers: (builder) => {
    const handle = (section, thunk) => {
      builder
        .addCase(thunk.pending, (state) => { state[section].loading = true; state[section].error = null; })
        .addCase(thunk.fulfilled, (state, action) => {
          state[section].loading = false;
          const { results, page, total_pages } = action.payload;
          state[section].items = page === 1 ? results : [...state[section].items, ...results];
          state[section].page = page;
          state[section].total_pages = total_pages;
        })
        .addCase(thunk.rejected, (state, action) => {
          state[section].loading = false;
          state[section].error = action.error.message;
        });
    };

    handle('trending', fetchTrending);
    handle('popular', fetchPopularMovies);
    handle('topRated', fetchTopRated);
    handle('tvShows', fetchPopularTV);
    handle('people', fetchPeople);
  }
});

export default moviesSlice.reducer;
