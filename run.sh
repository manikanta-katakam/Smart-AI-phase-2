#!/bin/bash

# Kill background processes on exit
trap "kill 0" EXIT

echo "Starting SmartShield AI Services..."

# 1. Start AI Service
echo "Starting AI Service on http://localhost:5001..."
(cd ai-service && source venv/bin/activate && python3 app.py) &

# 2. Start Backend Server
echo "Starting Backend Server on http://localhost:5002..."
(cd server && npm run dev) &

# 3. Start Frontend Client
echo "Starting Frontend Client on http://localhost:5173..."
(cd client && npm run dev) &

# Wait for all background processes
wait
