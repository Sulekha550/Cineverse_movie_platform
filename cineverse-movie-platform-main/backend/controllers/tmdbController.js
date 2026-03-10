const axios = require('axios');

const tmdbAxios = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_API_KEY }
});

// Helper to safely call TMDB
const tmdbGet = async (url, params = {}) => {
  const response = await tmdbAxios.get(url, { params });
  return response.data;
};

// @route GET /api/tmdb/trending/:mediaType/:timeWindow
exports.getTrending = async (req, res) => {
  try {
    const { mediaType = 'all', timeWindow = 'week' } = req.params;
    const { page = 1 } = req.query;
    const data = await tmdbGet(`/trending/${mediaType}/${timeWindow}`, { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending content' });
  }
};

// @route GET /api/tmdb/movies/popular
exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbGet('/movie/popular', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch popular movies' });
  }
};

// @route GET /api/tmdb/movies/top_rated
exports.getTopRatedMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbGet('/movie/top_rated', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch top rated movies' });
  }
};

// @route GET /api/tmdb/movies/:id
exports.getMovieDetails = async (req, res) => {
  try {
    const data = await tmdbGet(`/movie/${req.params.id}`, { append_to_response: 'credits,videos,similar' });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch movie details' });
  }
};

// @route GET /api/tmdb/tv/popular
exports.getPopularTV = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbGet('/tv/popular', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch TV shows' });
  }
};

// @route GET /api/tmdb/tv/:id
exports.getTVDetails = async (req, res) => {
  try {
    const data = await tmdbGet(`/tv/${req.params.id}`, { append_to_response: 'credits,videos,similar' });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch TV details' });
  }
};

// @route GET /api/tmdb/search?query=...&type=...
exports.search = async (req, res) => {
  try {
    const { query, type = 'multi', page = 1 } = req.query;
    if (!query) return res.json({ success: true, results: [] });
    const data = await tmdbGet(`/search/${type}`, { query, page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};

// @route GET /api/tmdb/person/popular
exports.getPopularPeople = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbGet('/person/popular', { page });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch people' });
  }
};

// @route GET /api/tmdb/person/:id
exports.getPersonDetails = async (req, res) => {
  try {
    const data = await tmdbGet(`/person/${req.params.id}`, { append_to_response: 'combined_credits,images' });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch person details' });
  }
};

// @route GET /api/tmdb/genres
exports.getGenres = async (req, res) => {
  try {
    const [movies, tv] = await Promise.all([
      tmdbGet('/genre/movie/list'),
      tmdbGet('/genre/tv/list')
    ]);
    res.json({ success: true, movieGenres: movies.genres, tvGenres: tv.genres });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch genres' });
  }
};

// @route GET /api/tmdb/discover?genre=...&type=movie|tv
exports.discoverByGenre = async (req, res) => {
  try {
    const { genre, type = 'movie', page = 1, sort_by = 'popularity.desc' } = req.query;
    const params = { page, sort_by };
    if (genre) params.with_genres = genre;
    const data = await tmdbGet(`/discover/${type}`, params);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to discover content' });
  }
};
