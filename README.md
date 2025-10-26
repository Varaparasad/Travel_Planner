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

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your system:

* Node.js (LTS version recommended)
* npm (comes with Node.js) or Yarn
* MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Varaparasad/Travel_Planner.git
    ```
2.  **Install Python Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3.  **Install Frontend Dependencies:**

    ```bash
    cd Frontend
    npm install
    # or yarn install
    ```

4.  **Install Backend Dependencies:**

    ```bash
    cd Backend
    npm install
    # or yarn install
    ```
    Create a .env file with:
    ```bash
    GROQ_API_KEY="your-groq-api-key-here"
    AVIATION_STACK_API_KEY='your-aviation-api-key'
    SECRET_KEY="your-strong-random-jwt-secret-key"
    MONGO_DETAILS="mongodb://localhost:27017"
     ```

### Running the Application

1.  **Start the Backend Server:**

    From the `backend` directory:

    ```bash
    uvicorn main:app --host 127.0.0.1 --port 5000 --reload
    ```

    The backend server will typically run on `http://127.0.0.1:5000`.

2.  **Start the Frontend Development Server:**

    From the `frontend` directory:

    ```bash
    npm run dev
    ```

    The frontend application will typically open in your browser at `http://localhost:5173`.
