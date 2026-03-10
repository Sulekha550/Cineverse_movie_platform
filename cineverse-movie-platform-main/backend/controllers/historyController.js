const History = require('../models/History');

// @route GET /api/history
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(50);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/history
exports.addHistory = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, releaseDate, rating } = req.body;

    // Update watchedAt if already exists, else create new
    const history = await History.findOneAndUpdate(
      { user: req.user._id, tmdbId },
      { tmdbId, mediaType, title, posterPath, releaseDate, rating, watchedAt: new Date() },
      { upsert: true, new: true }
    );

    // Keep only 50 latest items per user
    const count = await History.countDocuments({ user: req.user._id });
    if (count > 50) {
      const oldest = await History.find({ user: req.user._id })
        .sort({ watchedAt: 1 })
        .limit(count - 50);
      await History.deleteMany({ _id: { $in: oldest.map(h => h._id) } });
    }

    res.status(201).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/history
exports.clearHistory = async (req, res) => {
  try {
    await History.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
