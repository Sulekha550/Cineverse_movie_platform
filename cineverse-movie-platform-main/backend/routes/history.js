const express = require('express');
const router = express.Router();
const { getHistory, addHistory, clearHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getHistory);
router.post('/', addHistory);
router.delete('/', clearHistory);

module.exports = router;
