const User = require('../models/User');
const Movie = require('../models/Movie');
const Favorite = require('../models/Favorite');
const History = require('../models/History');

// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalMovies, totalFavorites] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Favorite.countDocuments()
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    res.json({
      success: true,
      stats: { totalUsers, totalMovies, totalFavorites },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments();
    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Clean up user data
    await Favorite.deleteMany({ user: req.params.id });
    await History.deleteMany({ user: req.params.id });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/admin/users/ban/:id
exports.banUser = async (req, res) => {
  try {
    const { isBanned, banReason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned, banReason: banReason || '' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user, message: isBanned ? 'User banned' : 'User unbanned' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
