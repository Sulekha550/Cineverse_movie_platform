const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  tmdbId: {
    type: String,
    unique: true,
    sparse: true
  },
  posterUrl: {
    type: String,
    default: ''
  },
  backdropUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: 'Description not available'
  },
  releaseDate: {
    type: String,
    default: ''
  },
  genre: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['movie', 'tv', 'trending', 'popular'],
    default: 'movie'
  },
  isCustom: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
