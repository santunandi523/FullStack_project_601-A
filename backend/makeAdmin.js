const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

// 👇 Your admin email
const ADMIN_EMAIL = 'santunandi523@gmail.com';

const makeAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const user = await User.findOne({ email: ADMIN_EMAIL });

  if (!user) {
    console.log(`❌ No user found with email: ${ADMIN_EMAIL}`);
    console.log('💡 Register first on the website, then run this script.');
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();

  console.log(`🎉 Success! "${user.name}" (${user.email}) is now an ADMIN`);
  process.exit(0);
};

makeAdmin().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
