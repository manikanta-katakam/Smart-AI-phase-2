# SmartShield AI

SmartShield AI is an AI-powered parametric insurance platform designed for gig delivery workers (Zomato, Swiggy, Amazon, etc.) to protect their income from external disruptions like weather, pollution, and curfews.

## Project Structure
- `/client`: React.js + Tailwind CSS frontend
- `/server`: Node.js + Express.js backend (REST API & Socket.IO)
- `/ai-service`: Python Flask microservice for AI risk predictions

## Features
- AI-based Risk Prediction & Premium Calculation
- Automatic Claim Triggering via Simulation Engine
- Fraud Detection
- Real-time SOS alerts and Chat System (Worker ↔ Admin)
- Admin Dashboard with visual analytics & control over workers

## Setup Instructions

### 1. Database Setup
Ensure you have MongoDB running locally on port `27017` or update the `MONGO_URI` in `server/.env`.

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory: `cd server`
2. Run `npm install`
3. Start the server: `npm run dev` (or `node index.js`)
   *The server will run on `http://localhost:5000`*

### 3. AI Service Setup
1. Open a terminal and navigate to the `ai-service` directory: `cd ai-service`
2. Activate the virtual environment:
   `source venv/bin/activate`
3. Start the service: `python app.py`
   *The AI service will run on `http://127.0.0.1:5001`*

### 4. Frontend Setup
1. Open a terminal and navigate to the `client` directory: `cd client`
2. Run `npm install`
3. Start the Vite development server: `npm run dev`
   *The frontend will run on `http://localhost:5173`*

## How to use
1. Open the frontend URL in your browser.
2. Register an account. Choose role `worker` or `admin`.
3. **If Worker**: You can activate an insurance policy, chat with AI/Admins, view claims, and trigger SOS.
4. **If Admin**: You can view the dashboard analytics, manage workers, broadcast announcements, view chats, and **simulate risk events** (Flood/Rain/Roadblock) which automatically process payouts!
