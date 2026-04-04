import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  const email = 'admin1234@gmail.com';
  const password = 'password123';
  
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User already exists. Updating password to password123 to be sure...');
    const salt = await bcrypt.genSalt(10);
    existing.password = await bcrypt.hash(password, salt);
    await existing.save();
    console.log('Password reset to password123');
    process.exit(0);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: 'Admin SuperUser',
      email,
      password: hashedPassword,
      role: 'admin',
      location: { lat: 28.7041, lng: 77.1025 },
      trustScore: 100
    });

    console.log('Admin created successfully with password123!');
    process.exit(0);
  }
};

seedAdmin();
