const express = require('express');
const router = express.Router();
const {
  getTrending, getPopularMovies, getTopRatedMovies, getMovieDetails,
  getPopularTV, getTVDetails, search, getPopularPeople, getPersonDetails,
  getGenres, discoverByGenre
} = require('../controllers/tmdbController');

router.get('/trending/:mediaType/:timeWindow', getTrending);
router.get('/movies/popular', getPopularMovies);
router.get('/movies/top_rated', getTopRatedMovies);
router.get('/movies/:id', getMovieDetails);
router.get('/tv/popular', getPopularTV);
router.get('/tv/:id', getTVDetails);
router.get('/search', search);
router.get('/people/popular', getPopularPeople);
router.get('/person/:id', getPersonDetails);
router.get('/genres', getGenres);
router.get('/discover', discoverByGenre);

module.exports = router;
