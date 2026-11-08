const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const dummyMentors = [
  {
    name: "Devansh Arora",
    email: "devansh@reva.edu.in",
    department: "Mechanical Engineering",
    reputation: 4.9,
    credits: 12,
    skillsToTeach: [
      { skill: "Pitch Deck & Framing", level: "Advanced", category: "Soft Skills" },
      { skill: "Design Thinking", level: "Intermediate", category: "Academics" }
    ]
  },
  {
    name: "Abhishek Donkennavavar",
    email: "abhishek@reva.edu.in",
    department: "Computer Science & IT",
    reputation: 5.0,
    credits: 15,
    skillsToTeach: [
      { skill: "C++ & Data Structures", level: "Advanced", category: "Coding" },
      { skill: "Node.js Backend", level: "Intermediate", category: "Coding" }
    ]
  },
  {
    name: "Jagannati Shauryavardhan",
    email: "jagannati@reva.edu.in",
    department: "Computer Science & IT",
    reputation: 4.8,
    credits: 8,
    skillsToTeach: [
      { skill: "Figma UI/UX", level: "Advanced", category: "Design" },
      { skill: "Market Research", level: "Intermediate", category: "Business" }
    ]
  },
  {
    name: "Atul Kumar Mishra",
    email: "atul@reva.edu.in",
    department: "Computer Science & IT",
    reputation: 4.7,
    credits: 10,
    skillsToTeach: [
      { skill: "Technical Documentation", level: "Advanced", category: "Academics" },
      { skill: "Python Basics", level: "Intermediate", category: "Coding" }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo for seeding...");
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    for (let mentor of dummyMentors) {
      mentor.password = hashedPassword;
      await User.findOneAndUpdate({ email: mentor.email }, mentor, { upsert: true, new: true });
    }

    console.log("Seed data successfully inserted!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
