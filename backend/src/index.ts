import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Create an Express app
const app = express();
const port = process.env.PORT || 5000;

// Create an HTTP server and integrate it with Express
const server = http.createServer(app);

// Set up Socket.io with the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/journals", require("./routes/journalRoutes"));
app.use("/api/spots", require("./routes/dataSourceRoute"));

// Socket.io functionality
io.on('connection', (socket) => {
  console.log('A user connected');

  // User joins a room (e.g., 'Koel Bay')
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
    io.to(room).emit('message', { user: 'system', text: `A new user has joined ${room}` });
  });

  // Listen for chat messages
  socket.on('chatMessage', (data) => {
    io.to(data.room).emit('message', { user: data.user, text: data.text });
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server with Socket.io enabled
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
