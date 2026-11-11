const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Session = require('./models/Session');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/peerskillswap');
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany({});
    await Session.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.create([
      {
        name: 'Devansh Arora',
        email: 'devansh@reva.edu.in',
        password: hashedPassword,
        department: 'B.Tech - Computer Science',
        credits: 12,
        reputation: 4.9,
        skillsToTeach: [{ skill: 'C++', level: 'Advanced' }, { skill: 'DSA', level: 'Intermediate' }],
        skillsToLearn: ['Figma', 'UI/UX']
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya@reva.edu.in',
        password: hashedPassword,
        department: 'BCA - Computer Applications',
        credits: 15,
        reputation: 4.8,
        skillsToTeach: [{ skill: 'Web Development', level: 'Advanced' }, { skill: 'Python', level: 'Intermediate' }],
        skillsToLearn: ['Machine Learning', 'Data Science']
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@reva.edu.in',
        password: hashedPassword,
        department: 'B.Sc - Data Science / AI',
        credits: 10,
        reputation: 5.0,
        skillsToTeach: [{ skill: 'SQL & Databases', level: 'Advanced' }, { skill: 'Data Visualization', level: 'Advanced' }],
        skillsToLearn: ['React', 'Node.js']
      },
      {
        name: 'Priya Nair',
        email: 'priya@reva.edu.in',
        password: hashedPassword,
        department: 'B.Com / BBA',
        credits: 14,
        reputation: 4.7,
        skillsToTeach: [{ skill: 'Financial Modeling', level: 'Advanced' }, { skill: 'Excel Automation', level: 'Intermediate' }],
        skillsToLearn: ['Python for Finance', 'SQL']
      }
    ]);

    console.log(`Successfully seeded ${users.length} accounts with hashed passwords!`);
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
