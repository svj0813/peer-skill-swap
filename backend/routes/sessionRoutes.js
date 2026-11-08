const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Session = require('../models/Session');
const User = require('../models/User');

// Book a session
router.post('/book', protect, async (req, res) => {
  const { mentorId, topic, duration, mode, scheduledTime, meetingLocation } = req.body;
  try {
    const learner = await User.findById(req.user.id);
    if (learner.credits < 1) return res.status(400).json({ message: 'Insufficient credit balance' });

    const session = await Session.create({
      learner: req.user.id,
      mentor: mentorId,
      topic,
      duration,
      mode,
      scheduledTime,
      meetingLocation
    });

    learner.credits -= 1;
    await learner.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch user's active/completed sessions
router.get('/my-sessions', protect, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ learner: req.user.id }, { mentor: req.user.id }]
    }).populate('learner mentor', 'name email department reputation');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor accepts or declines a session request
router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    
    // Security check: Make sure the person updating it is actually the mentor
    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    session.status = status;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
