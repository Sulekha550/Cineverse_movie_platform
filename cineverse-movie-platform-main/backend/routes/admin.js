const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, banUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/ban/:id', banUser);

module.exports = router;
