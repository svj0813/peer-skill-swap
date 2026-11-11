const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Session = require('./models/Session');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/peerskillswap');
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany({});
    await Session.deleteMany({});

    const users = await User.create([
      {
        name: 'Devansh Arora',
        email: 'devansh@reva.edu.in',
        password: 'password123',
        department: 'B.Tech - Computer Science',
        credits: 12,
        reputation: 4.9,
        skillsToTeach: [{ skill: 'C++', level: 'Advanced' }, { skill: 'DSA', level: 'Intermediate' }],
        skillsToLearn: [{ skill: 'Figma', level: 'Beginner' }]
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya@reva.edu.in',
        password: 'password123',
        department: 'BCA - Computer Applications',
        credits: 15,
        reputation: 4.8,
        skillsToTeach: [{ skill: 'Web Development', level: 'Advanced' }, { skill: 'Python', level: 'Intermediate' }],
        skillsToLearn: [{ skill: 'Machine Learning', level: 'Beginner' }]
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@reva.edu.in',
        password: 'password123',
        department: 'B.Sc - Data Science / AI',
        credits: 10,
        reputation: 5.0,
        skillsToTeach: [{ skill: 'SQL & Databases', level: 'Advanced' }, { skill: 'Data Visualization', level: 'Advanced' }],
        skillsToLearn: [{ skill: 'React', level: 'Beginner' }]
      },
      {
        name: 'Priya Nair',
        email: 'priya@reva.edu.in',
        password: 'password123',
        department: 'B.Com / BBA',
        credits: 14,
        reputation: 4.7,
        skillsToTeach: [{ skill: 'Financial Modeling', level: 'Advanced' }, { skill: 'Excel Automation', level: 'Intermediate' }],
        skillsToLearn: [{ skill: 'Python for Finance', level: 'Beginner' }]
      }
    ]);

    console.log(`Successfully seeded ${users.length} cross-degree student profiles!`);
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
