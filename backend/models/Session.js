const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  duration: { type: Number, enum: [15, 30, 45], default: 30 },
  mode: { type: String, enum: ['Online', 'Campus Spot'], default: 'Campus Spot' },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled'], default: 'pending' },
  scheduledTime: { type: Date, required: true },
  meetingLocation: String,
  rating: Number,
  feedback: String
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
