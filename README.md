# 💬 Real-Time Chat Application

Welcome to the full-stack, real-time Chat Application! This project is a feature-rich messaging platform built with a modern tech stack, featuring a React frontend and a distributed backend using Node.js microservices.

![Chat Application Demo](https://res.cloudinary.com/dxe17fztz/image/upload/v1753535728/Screenshot_2025-07-26_184408_j0zqw0.png)

---

## ✨ Features

- **Real-Time Messaging**: Instantaneous message delivery using WebSockets.
- **User Authentication**: Secure user registration and login with JWT.
- **Microservices Architecture**: A scalable and maintainable backend with separate services for users, chat, and mail.
- **Message Queuing**: Asynchronous communication between services using RabbitMQ.
- **File & Image Sharing**: Upload and share images, powered by Cloudinary.
- **Email Notifications**: Receive email notifications for important events.
- **Caching**: Improved performance with Redis for caching user session data.
- **Modern UI**: A sleek, responsive interface built with React, Vite, Tailwind CSS, and shadcn/ui.
- **Dark Mode**: Comfortable viewing in low-light environments.

---

## 🏛️ Architecture Overview

This application is built on a microservices architecture to ensure scalability and separation of concerns. The services communicate asynchronously via a RabbitMQ message broker.

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│      Client      │◀────▶│   Chat Service   │◀────▶│    Cloudinary    │
│ (React + Vite)   │      │ (Express, WS)    │      │  (File Storage)  │
└──────────────────┘      └────────┬─────────┘      └──────────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   User Service   │◀────▶│    RabbitMQ    │◀────▶│   Mail Service   │
│(Express, Redis)  │      │ (Message Broker) │      │   (Nodemailer)   │
└────────┬─────────┘      └──────────────────┘      └──────────────────┘
         │
         │
         ▼
┌──────────────────┐
│     MongoDB      │
│    (Database)    │
└──────────────────┘
```

---

## 🚀 Tech Stack

A quick look at the main technologies used in this project.

### Frontend

<p align="left">
  <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  </a>
  <a href="https://vitejs.dev/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://socket.io/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  </a>
  <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000.svg?style=for-the-badge&logo=shadcn-ui&logoColor=white" alt="shadcn/ui" />
  </a>
  <a href="https://reactrouter.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  </a>
</p>

### Backend & Infrastructure

<p align="left">
  <a href="https://nodejs.org" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  </a>
  <a href="https://expressjs.com" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  </a>
  <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </a>
  <a href="https://redis.io" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  </a>
  <a href="https://www.rabbitmq.com" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" alt="RabbitMQ" />
  </a>
  <a href="https://jwt.io" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  </a>
  <a href="https://cloudinary.com/" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </a>
  <a href="https://nodemailer.com" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/badge/Nodemailer-2B3A4B?style=for-the-badge&logo=nodemailer&logoColor=white" alt="Nodemailer" />
  </a>
</p>

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [RabbitMQ](https://www.rabbitmq.com/download.html)
- [Redis](https://redis.io/docs/getting-started/installation/)

---

## ⚙️ Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chat-application.git
cd chat-application
```

### 2. Install Dependencies

You'll need to install dependencies for the frontend and each of the three backend services.

```bash
# Install frontend dependencies
cd frontend
npm install

# Install user service dependencies
cd ../backend/user
npm install

# Install chat service dependencies
cd ../chat
npm install

# Install mail service dependencies
cd ../mail
npm install

cd ../../ # Return to the root directory
```

### 3. Configure Environment Variables

Each backend service requires its own `.env` file. In each of the `backend/user`, `backend/chat`, and `backend/mail` directories, create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Then, fill in the necessary values in each new `.env` file.

#### `backend/user/.env.example`
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/chat-app-users
JWT_SECRET=your_super_secret_jwt_key
RABBITMQ_URL=amqp://localhost
REDIS_URL=redis://localhost:6379
```

#### `backend/chat/.env.example`
```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/chat-app-messages
JWT_SECRET=your_super_secret_jwt_key
RABBITMQ_URL=amqp://localhost
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

#### `backend/mail/.env.example`
```env
PORT=5003
RABBITMQ_URL=amqp://localhost
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password
```

#### `frontend/.env.local`

Create a `.env.local` file in the `frontend` directory to point to your backend services.

```env
VITE_API_BASE_URL=http://localhost:5001
```

### 4. Run the Application

You can run each part of the application in a separate terminal window.

```bash
# Terminal 1: Run the Frontend
cd frontend
npm run dev

# Terminal 2: Run the User Service
cd backend/user
npm run dev

# Terminal 3: Run the Chat Service
cd backend/chat
npm run dev

# Terminal 4: Run the Mail Service
cd backend/mail
npm run dev
```

Your application should now be running!
- Frontend: `http://localhost:5173` (or as specified by Vite)
- User Service: `http://localhost:5001`
- Chat Service: `http://localhost:5002`
- Mail Service: `http://localhost:5003`
