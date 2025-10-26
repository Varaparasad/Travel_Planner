# 🤖 LangGraph AI Travel Planner

A full-stack **AI Travel Planner** application that uses a **LangGraph agent** running on a **FastAPI** backend to generate detailed, personalized travel itineraries based on user preferences.  
It features **JWT authentication**, **MongoDB caching**, and a sleek **React frontend** with smooth animations.

---

## ✨ Features

- 🧠 **AI Itinerary Generation**  
  Uses a **LangGraph agent** powered by **Groq (Llama 3)** to generate detailed, day-by-day travel plans.

- 🔐 **User Authentication**  
  Secure **JWT-based login and signup** with password hashing using **bcrypt (Passlib)** and user data stored in MongoDB.

- ⚡ **Smart Plan Caching**  
  Automatically checks MongoDB for existing plans based on destination and trip type.  
  If found, reuses and adapts cached plans — reducing API calls and improving speed.

- 🔄 **Dynamic Plan Adaptation**  
  Even cached plans are customized per user (budget, dates, group size) using an LLM adaptation step.

- 🌐 **Full-Stack Architecture**
  - **Backend:** FastAPI + LangGraph + Groq API +different thrid party apis for fecthing real time data like flights hotels locations weather
  - **Frontend:** React (Vite) + Framer Motion  
  - **Database:** MongoDB (via async motor driver)

---

## 🚀 Tech Stack

| Area | Technology |
|------|-------------|
| **Backend** | FastAPI, LangGraph, LangChain, Groq API, Uvicorn |
| **Frontend** | React, React Router, Framer Motion, Axios, CSS |
| **Database** | MongoDB (motor async driver) |
| **Authentication** | JWT (python-jose), Passlib (bcrypt) |

---

## 📁 Project Structure

/ai-travel-planner
├── /backend
│ ├── .env # --- Stores all API keys and secrets ---
│ ├── requirements.txt # Backend Python dependencies
│ ├── db.py # MongoDB connection setup
│ ├── auth.py # Handles user registration & login logic
│ ├── plan_cache.py # Handles MongoDB plan caching & similarity search
│ └── main.py # Main FastAPI app: routes, LangGraph agent
│
└── /frontend
├── package.json # Frontend Node.js dependencies
├── /src
│ ├── /components # Reusable React components (Header, Routes)
│ ├── /context # AppContext.jsx (Global state for auth & plans)
│ ├── /pages # Main pages (HomePage, PlanPage, LoginPage)
│ ├── App.jsx # Main router setup
│ ├── main.jsx # React entry point
│ └── App.css # Global styles
└── README.md # This file


---

## 🛠️ Setup and Installation

### Prerequisites
- 🐍 **Python 3.10+**
- 🟢 **Node.js 18+**
- 🍃 **MongoDB** (Local or Atlas instance)

---

### 1️⃣ Backend Setup

```bash
cd backend


GROQ_API_KEY="your-groq-api-key-here"
AVIATION_STACK_API_KEY='your-aviation-api-key'
SECRET_KEY="your-strong-random-jwt-secret-key"

MONGO_DETAILS="mongodb://localhost:27017"


pip install -r requirements.txt

## Running the Application

You must have three services running simultaneously:

MongoDB database
FastAPI backend
React frontend

Ensure your MongoDB server is running locally or remotely (e.g., via Docker or MongoDB Atlas).
Run the Backend (Terminal 1)
cd backend
uvicorn main:app --host 127.0.0.1 --port 5000 --reload
Run the Frontend (Terminal 2)
cd frontend
npm run dev