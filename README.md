# 💬 NexChat — Real-Time MERN Chat Application

A full-stack real-time chat application.

![alt text](<image.jpeg>)



## ✨ Features

Features 

User Registration & Login
JWT Authentication (cookie + header)
Real-time 1-to-1 messaging via Socket.IO
Online / offline user status 
Typing indicators 
Message timestamps 
Chat history stored in MongoDB 
Message deletion 
User search 
Password strength indicator 
Emoji picker 
Responsive UI (mobile + desktop) 
Protected routes 
Auto-scroll to latest message 
Date separators in chat



## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster (M0)

---

### Step 1 — Clone & install

```bash
git clone https://github.com/your-username/nexchat.git
cd nexchat

# Install backend + frontend deps in one command
npm run install-all
```

### Step 2 — Configure environment

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your real values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/chatapp?retryWrites=true&w=majority
JWT_SECRET=your_64_char_random_string_here
CLIENT_URL=http://localhost:5173
```

### Step 3 — Run in development

```bash
# Starts backend (nodemon) + frontend (Vite) concurrently
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

---

## 📡 API Documentation

All routes except `/api/auth/register` and `/api/auth/login` require:
```
Authorization: Bearer <token>
```

### Auth — `/api/auth`

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/register` | `{ name, email, password }` | Create account |
| POST | `/login` | `{ email, password }` | Sign in, returns JWT |
| POST | `/logout` | — | Clears cookie |
| GET | `/me` | — | Get current user |




### Users — `/api/users`

| Method | Path | Query | Description |
|---|---|---|---|
| GET | `/` | — | All users (excl. self) |
| GET | `/search` | `?q=john` | Search by name/email |
| GET | `/:id` | — | Single user |

### Messages — `/api/messages`

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/:userId` | — | Conversation history |
| POST | `/send/:receiverId` | `{ message }` | Send a message |
| DELETE | `/:messageId` | — | Delete own message |

---

## 🔌 Socket.IO Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `connect` | `query: { userId }` | Connect with user ID |
| `typing` | `{ receiverId }` | User started typing |
| `stopTyping` | `{ receiverId }` | User stopped typing |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `getOnlineUsers` | `string[]` | List of online user IDs |
| `newMessage` | `Message` | Incoming message |
| `typing` | `{ senderId }` | Partner is typing |
| `stopTyping` | `{ senderId }` | Partner stopped |


## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| State | Context API (Auth, Socket, Chat) |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| Routing | React Router v6 |
| Backend | Node.js, Express 4 |
| Real-time | Socket.IO Server |
| Database | MongoDB Atlas, Mongoose 8 |
| Auth | JWT, bcryptjs |
| Dev | nodemon, concurrently |



## 📄 License

decodephi © 2026 NexChat
