import api from './api';

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getPosterUrl = (path, size = 'w342') => {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getProfileUrl = (path, size = 'w185') => {
  if (!path) return '/placeholder-profile.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// API calls
export const tmdbApi = {
  getTrending: (mediaType = 'all', timeWindow = 'week', page = 1) =>
    api.get(`/tmdb/trending/${mediaType}/${timeWindow}`, { params: { page } }),

  getPopularMovies: (page = 1) =>
    api.get('/tmdb/movies/popular', { params: { page } }),

  getTopRatedMovies: (page = 1) =>
    api.get('/tmdb/movies/top_rated', { params: { page } }),

  getMovieDetails: (id) =>
    api.get(`/tmdb/movies/${id}`),

  getPopularTV: (page = 1) =>
    api.get('/tmdb/tv/popular', { params: { page } }),

  getTVDetails: (id) =>
    api.get(`/tmdb/tv/${id}`),

  search: (query, type = 'multi', page = 1) =>
    api.get('/tmdb/search', { params: { query, type, page } }),

  getPopularPeople: (page = 1) =>
    api.get('/tmdb/people/popular', { params: { page } }),

  getPersonDetails: (id) =>
    api.get(`/tmdb/person/${id}`),

  getGenres: () => api.get('/tmdb/genres'),

  discover: (params) => api.get('/tmdb/discover', { params }),
};

export const favoritesApi = {
  getAll: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  remove: (tmdbId) => api.delete(`/favorites/${tmdbId}`),
  check: (tmdbId) => api.get(`/favorites/check/${tmdbId}`),
};

export const historyApi = {
  getAll: () => api.get('/history'),
  add: (data) => api.post('/history', data),
  clear: () => api.delete('/history'),
};

export const moviesApi = {
  getAll: (params) => api.get('/movies', { params }),
  getOne: (id) => api.get(`/movies/${id}`),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id) => api.delete(`/movies/${id}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  banUser: (id, data) => api.put(`/admin/users/ban/${id}`, data),
};
