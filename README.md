# 💬 NexChat — Real-Time MERN Chat Application

A full-stack real-time chat application.



---

## ✨ Features

| Feature | Status |
|---|---|
| User Registration & Login | ✅ |
| JWT Authentication (cookie + header) | ✅ |
| Real-time 1-to-1 messaging via Socket.IO | ✅ |
| Online / offline user status 
| Typing indicators 
| Message timestamps 
| Chat history stored in MongoDB 
| Message deletion 
| User search 
| Password strength indicator 
| Emoji picker 
| Responsive UI (mobile + desktop) 
| Protected routes 
| Auto-scroll to latest message 
| Date separators in chat



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

> **Generate a strong JWT secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

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

**Register response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "profilePic": "https://api.dicebear.com/...",
    "token": "eyJhbGci..."
  }
}
```

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

---

## 🌐 Deployment Guide

### 1. MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Add a database user (username + password)
3. Whitelist `0.0.0.0/0` (or your server IP) in Network Access
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/chatapp?retryWrites=true&w=majority
   ```

---

### 2. Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root directory:** *(leave blank — Render uses repo root)*
   - **Build command:** `npm install`
   - **Start command:** `node backend/server.js`
   - **Environment:** Node
5. Add Environment Variables:
   ```
   PORT            = 10000          (Render sets this automatically)
   NODE_ENV        = production
   MONGO_URI       = mongodb+srv://...
   JWT_SECRET      = your_secret
   CLIENT_URL      = https://your-app.vercel.app
   ```
6. Deploy — note your backend URL: `https://nexchat-api.onrender.com`

---

### 3. Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Settings:
   - **Framework:** Vite
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL = https://nexchat-api.onrender.com
   ```
5. Deploy

> **Update Render** — go back to your Render service and set `CLIENT_URL` to your Vercel URL.

---

### 4. Final checklist

- [ ] MongoDB Atlas whitelist includes `0.0.0.0/0`
- [ ] `MONGO_URI` is set in Render
- [ ] `JWT_SECRET` is set in Render (64+ random chars)
- [ ] `CLIENT_URL` in Render matches exact Vercel URL (no trailing slash)
- [ ] `VITE_API_URL` in Vercel matches exact Render URL (no trailing slash)
- [ ] CORS allows your Vercel domain

---

## 🔒 Security Notes

- Passwords hashed with **bcrypt** (cost factor 12)
- JWT stored in both **HTTP-only cookie** and **localStorage** for flexibility
- `password` field excluded from all DB queries by default (`select: false`)
- Environment variables never committed to git
- Input validation on both client and server

---

## 🛠 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run frontend + backend together |
| `npm run server` | Backend only (nodemon) |
| `npm run client` | Frontend only (Vite) |
| `npm run build` | Build frontend for production |
| `npm run install-all` | Install all dependencies |

---

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
