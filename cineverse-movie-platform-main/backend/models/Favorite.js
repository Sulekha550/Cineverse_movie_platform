const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tmdbId: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    default: 'movie'
  },
  title: { type: String, required: true },
  posterPath: { type: String, default: '' },
  releaseDate: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  overview: { type: String, default: '' }
}, { timestamps: true });

// Prevent duplicate favorites
favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
