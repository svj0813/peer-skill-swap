# Peer Skill Swap 🎓

A full-stack campus micro-mentorship platform engineered for the **Design Thinking for Innovation and Entrepreneurship (DTIE)** course at **REVA University**. **Peer Skill Swap** enables university students to exchange peer-to-peer mentorship, bridge knowledge gaps, and collaborate seamlessly across departments.

---

## 🚀 Key Features

* **Secure Authentication:** User registration and login powered by JSON Web Tokens (JWT) and `bcrypt` password hashing.
* **Peer Discovery & Search:** Dynamic search filter to locate peer mentors by specific skills (e.g., C++, Python, Figma) or academic departments.
* **Micro-Mentorship Sessions:** Flexible booking system for short 15–45 minute help sessions, avoiding the friction of long-term tutoring commitments.
* **Embedded 1-on-1 Video Calls:** Integrated real-time video conferencing via Jitsi Meet for online sessions, complete with screen sharing and instant messaging.
* **Campus Credit Economy:** Gamified credit system where learners start with credits, spend 1 credit to request guidance, and earn credits back by teaching peers.
* **Interactive Mentor Dashboard:** Real-time session status tracking allowing mentors to review, accept, or decline pending requests.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Lucide React Icons
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ORM)
* **Containerization:** Docker / Podman (`peer-skill-mongo`)
* **Authentication:** JSON Web Tokens (JWT) & BcryptJS
* **Video Integration:** Jitsi Meet API

---

## 👥 Project Team

* **Devansh Arora**
* **Jagannati Shauryavardhan**
* **Abhishek Donkennavavar**
* **Atul Kumar Mishra**

**Faculty Mentor:** Prof. Arati C.

---

## 💻 Local Setup & Execution Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Docker](https://www.docker.com/) or [Podman](https://podman.io/)

### 1. Clone the Repository
```bash
git clone [https://github.com/svj0813/peer-skill-swap.git](https://github.com/svj0813/peer-skill-swap.git)
cd peer-skill-swap
```

### 2. Database & Backend Setup
```bash
# Start MongoDB container
sudo docker run -d -p 27017:27017 --name peer-skill-mongo mongo

# Navigate to backend and install dependencies
cd backend
npm install

# Create environment configuration (.env)
cat << EOT > .env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/peerskillswap
JWT_SECRET=supersecretkey123
EOT

# Seed test data and start server
node seed.js
npm run dev
```

### 3. Frontend Setup
Open a new terminal session and run:
```bash
cd peer-skill-swap/frontend
npm install
npm run dev
```

Access the application in your browser at `http://localhost:5173`.
