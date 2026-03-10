const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Basic user profile update
router.put('/profile', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: req.body.username, avatar: req.body.avatar },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
