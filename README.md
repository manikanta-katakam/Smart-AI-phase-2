# 🚀 SmartShield AI

### AI-Powered Parametric Insurance Platform for Gig Workers

---

## 📌 Overview

**SmartShield AI** is a full-stack AI-driven parametric insurance platform designed to protect gig delivery workers (Zomato, Swiggy, Amazon, etc.) from income loss caused by external disruptions such as weather conditions, pollution, and unexpected events like curfews or roadblocks.

The system leverages **real-time data, artificial intelligence, and automation** to simulate modern insurance workflows, including **risk prediction, claim triggering, and payout simulation**, without manual intervention.

---

## 🎯 Key Features

### 🤖 AI-Based Risk Prediction

* Predicts environmental risk levels using AI models
* Calculates insurance premiums dynamically
* Uses a dedicated AI microservice for intelligent decision-making

### 🔴 Automated Claim Processing

* Automatically triggers claims based on real-time conditions
* Simulates parametric insurance payouts
* Eliminates manual claim verification

### 🛡️ Fraud Detection System

* Detects suspicious user activity and claim patterns
* Ensures system reliability and fairness

### 🔔 Real-Time Alerts & SOS System

* Instant notifications using Socket.IO
* SOS feature for emergency situations
* Real-time communication between workers and admins

### 💬 Chat System (Worker ↔ Admin)

* Two-way real-time messaging
* Integrated AI chatbot for assistance

### 📊 Admin Dashboard

* Visual analytics and insights
* Worker management system
* Event simulation (Rain, Flood, Roadblock)
* Broadcast announcements

---

## 🏗️ Project Structure

```plaintext
SmartShield AI/
├── client/        # React.js + Tailwind CSS frontend
├── server/        # Node.js + Express backend (REST APIs + Socket.IO)
├── ai-service/    # Python Flask microservice for AI predictions
```

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Socket.IO

### AI Service

* Python (Flask)
* Machine Learning models for risk prediction

### Database

* MongoDB

### Other Integrations

* Real-time communication (WebSockets)
* REST APIs
* Docker (for containerization)

---

## ⚙️ Setup Instructions

### 1️⃣ Database Setup

* Ensure MongoDB is running locally on:

```bash
mongodb://localhost:27017
```

* Or update `MONGO_URI` in:

```bash
server/.env
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

👉 Backend runs on:
**http://localhost:5000**

---

### 3️⃣ AI Service Setup

```bash
cd ai-service
source venv/bin/activate
python app.py
```

👉 AI Service runs on:
**http://127.0.0.1:5001**

---

### 4️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

👉 Frontend runs on:
**http://localhost:5173**

---

## 🐳 Docker Support

Run the full application using Docker:

```bash
docker-compose up --build
```

---

## 🚀 How to Use

1. Open the frontend in your browser
2. Register an account
3. Choose your role:

### 👷 Worker

* Activate insurance policy
* View risk predictions
* Chat with AI/Admin
* Trigger SOS alerts
* View claims and payouts

### 🛠️ Admin

* Monitor dashboard analytics
* Manage workers
* Broadcast announcements
* Simulate risk events (Rain, Flood, Roadblock)
* Automatically trigger payouts

---

## 🧠 System Architecture

```plaintext
Frontend (React)
        ↓
Backend (Node.js + Express)
        ↓
AI Service (Python Flask)
        ↓
Database (MongoDB)
```

---

## 🔐 Environment Variables

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🎯 Project Highlights

* Real-time event-driven architecture
* AI-powered insurance decision system
* Microservices-based design (AI service)
* Scalable full-stack implementation
* Secure API handling and role-based access

---

## 🧪 Use Case

SmartShield AI demonstrates a **parametric insurance model**, where claims are triggered automatically based on real-world conditions such as weather or environmental risks, reducing delays and increasing transparency.

---

## 🔮 Future Enhancements

* Integration with live weather and pollution APIs
* Mobile application support
* Advanced fraud detection using deep learning
* Cloud deployment (AWS / GCP)
* Blockchain-based claim validation

---

## 📄 License

This project is developed for academic and educational purposes.
