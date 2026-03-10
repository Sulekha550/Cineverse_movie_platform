// favorites.js
const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:tmdbId', removeFavorite);
router.get('/check/:tmdbId', checkFavorite);

module.exports = router;
