const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get user sessions
router.get('/my-sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ learner: req.user.id }, { mentor: req.user.id }]
    }).populate('learner mentor', 'name email department credits reputation');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Book session
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { mentorId, topic, duration, mode, meetingLocation, scheduledTime } = req.body;
    
    const learner = await User.findById(req.user.id);
    if (learner.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits to book session' });
    }

    const session = await Session.create({
      learner: req.user.id,
      mentor: mentorId,
      topic,
      duration,
      mode,
      meetingLocation,
      scheduledTime
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to book session' });
  }
});

// Update status / Complete Session with Credit Transfer & Rating
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, rating } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (status === 'completed' && session.status !== 'completed') {
      // Transfer 1 credit from learner to mentor
      await User.findByIdAndUpdate(session.learner, { $inc: { credits: -1 } });
      await User.findByIdAndUpdate(session.mentor, { $inc: { credits: 1 } });

      // Update mentor reputation if rating provided
      if (rating) {
        const mentor = await User.findById(session.mentor);
        const currentRep = mentor.reputation || 5.0;
        const newRep = Number(((currentRep + rating) / 2).toFixed(1));
        await User.findByIdAndUpdate(session.mentor, { reputation: newRep });
      }
    }

    session.status = status;
    await session.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update session status' });
  }
});

module.exports = router;
