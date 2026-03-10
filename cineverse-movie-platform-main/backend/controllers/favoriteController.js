const Favorite = require('../models/Favorite');

// @route GET /api/favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/favorites
exports.addFavorite = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, rating, overview } = req.body;

    const existing = await Favorite.findOne({ user: req.user._id, tmdbId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      tmdbId, mediaType, title, posterPath, releaseDate, rating, overview
    });

    res.status(201).json({ success: true, favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/favorites/:tmdbId
exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ user: req.user._id, tmdbId: req.params.tmdbId });
    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/favorites/check/:tmdbId
exports.checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id, tmdbId: req.params.tmdbId });
    res.json({ success: true, isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
