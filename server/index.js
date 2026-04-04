import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import policyRoutes from './routes/policy.js';
import claimRoutes from './routes/claim.js';
import alertRoutes from './routes/alert.js';
import messageRoutes from './routes/message.js';
import chatRoutes from './routes/chat.js';
import reportRoutes from './routes/report.js';
import riskRoutes from './routes/risk.js';
import predictRoutes from './routes/predict.js';
import weatherRoutes from './routes/weather.js';
import heatmapRoutes from './routes/heatmap.js';
import { saveMessage } from './controllers/messageController.js';

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 20,
  message: 'Too many authentication attempts, please try again next hour'
});
app.use('/api/auth', authLimiter, authRoutes);

// Routes
// app.use('/api/auth', authRoutes); <- replaced above with limiter
app.use('/api/users', userRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/heatmap', heatmapRoutes);

import { GoogleGenerativeAI } from "@google/generative-ai";
app.get('/api/test-ai', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Respond with exactly: Hello from AI");
    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Test Route Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Set io instance so controllers can emit events
app.set('io', io);

// Socket.io setup (extend later)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    const savedMsg = await saveMessage(data);
    if (savedMsg) {
      io.to(data.receiverId).emit('receiveMessage', savedMsg);
      socket.emit('receiveMessage', savedMsg);
    }
  });

  socket.on('updateLocation', (data) => {
    socket.broadcast.emit('userLocationUpdate', data);
  });

  socket.on('simulateDemoPhase', (phase) => {
    // Phase 1: Heavy rain detection
    // Phase 2: Risk increase alert
    // Phase 3: Claim triggered automated payout
    if(phase === 1) {
      io.emit('riskAlert', { message: '⚠️ Alert: Sustained heavy rainfall detected in your work zone.', level: 'MEDIUM' });
    } else if (phase === 2) {
      io.emit('riskAlert', { message: '🚨 CRITICAL: Risk level upgraded to HIGH. Avoid navigating outdoor zones.', level: 'HIGH' });
    } else if (phase === 3) {
      io.emit('riskAlert', { message: '✅ CLAIM AUTO-TRIGGERED: SmartShield AI has dispatched ₹300 parametric payout to your wallet for weather disruptions.', level: 'PAYOUT' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
