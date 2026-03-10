const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
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
  watchedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Keep only latest 50 items per user
historySchema.index({ user: 1, watchedAt: -1 });

module.exports = mongoose.model('History', historySchema);
