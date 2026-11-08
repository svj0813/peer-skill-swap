const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, default: 'Computer Science' },
  credits: { type: Number, default: 10 },
  reputation: { type: Number, default: 5.0 },
  skillsToTeach: [{
    skill: String,
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    category: String
  }],
  skillsToLearn: [String],
  bio: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
