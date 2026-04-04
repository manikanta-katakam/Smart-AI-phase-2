import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const seedWorker = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to seed worker...");

        const worker = await User.findOneAndUpdate(
            { email: 'demo-worker@smartshield.ai' },
            {
                name: 'Demo Worker',
                email: 'demo-worker@smartshield.ai',
                password: 'password123',
                role: 'worker',
                status: 'active',
                location: { lat: 28.6139, lng: 77.2090 },
                wallet: { balance: 1000 }
            },
            { upsert: true, new: true }
        );

        console.log("Seeded Active Worker:", worker.name);
        process.exit();
    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
}

seedWorker();
