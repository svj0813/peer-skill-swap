const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fetch registered mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await User.find({ 'skillsToTeach.0': { $exists: true } })
      .select('-password')
      .lean();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
