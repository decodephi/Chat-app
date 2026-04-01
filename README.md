## NexChat — Real-Time MERN Chat Application

NexChat is a full-stack real-time chat application built using the MERN stack with Socket.IO for instant communication. It allows users to connect, chat, and interact seamlessly with a modern and responsive interface.

🔗 Live Demo: https://chat-app-two-zata-52.vercel.app/

## Overview

This project is designed to simulate a real-world messaging platform where users can:

Create accounts and securely log in
Send and receive messages instantly
See online/offline status
Experience smooth and responsive chat interactions

It focuses on building a scalable, production-ready architecture while maintaining a clean user experience.

##  Features

🔐 User authentication (JWT with cookies + headers)
💬 Real-time 1-to-1 messaging using Socket.IO
🟢 Online / offline user status
✍️ Typing indicators
🕒 Message timestamps and chat history
🗑️ Message deletion functionality
🔍 User search feature
😊 Emoji picker integration
🔒 Protected routes for authenticated users
📱 Fully responsive design (mobile + desktop)
⚡ Auto-scroll to latest messages
📅 Date separators for better chat readability
🔑 Password strength indicator



## Tech Stack
Layer	Technology
Frontend	React 18, Vite, Tailwind CSS
State Mgmt	Context API (Auth, Socket, Chat)
API Client	Axios
Real-time	Socket.IO (Client & Server)
Routing	React Router v6
Backend	Node.js, Express.js
Database	MongoDB Atlas, Mongoose
Authentication	JWT, bcryptjs
Dev Tools	nodemon, concurrently


## Preview

![alt text](<image.jpeg>)

## What I Learned

While building NexChat, I gained hands-on experience in:

Implementing real-time communication using WebSockets
Managing authentication securely with JWT and cookies
Handling cross-origin issues (CORS) in production
Structuring a scalable MERN application
Deploying full-stack apps using Vercel and Render
Debugging real-world production issues


##  Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas


## Getting Started (Local Setup)
git clone https://github.com/your-username/nexchat.git
cd nexchat
npm run install-all
npm run dev


## Security Notes
Passwords are hashed using bcrypt
JWT stored securely (HTTP-only cookies + headers)
Sensitive data managed via environment variables
Basic validation implemented on both client and server


## License

© 2026 NexChat — Developed by Pranab Samanta

## Final Note

This project reflects my journey of building a real-world, production-ready chat application.
It helped me strengthen my understanding of full-stack development, real-time systems, and deployment workflows.
