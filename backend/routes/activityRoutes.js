const express = require('express');
const router = express.Router();
const { activities } = require('../db');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  try {
    const logs = await activities.find({ user: req.user.id }).sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
