import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import socialRoutes from './routes/social';
import noteRoutes from './routes/notes';
import profileRoutes from './routes/profile';
import messageRoutes from './routes/messages';
import { readDB, writeDB, Message } from './db';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

const userSocketMap = new Map<string, string>();

io.on('connection', (socket) => {
  socket.on('register', (userId: string) => {
    userSocketMap.set(userId, socket.id);
  });

  socket.on('send_message', (data: { fromId: string, toId: string, text: string }) => {
    const { fromId, toId, text } = data;
    const db = readDB();
    const newMessage: Message = { id: uuidv4(), fromId, toId, text, createdAt: new Date().toISOString() };
    db.messages.push(newMessage);
    writeDB(db);

    const targetSocketId = userSocketMap.get(toId);
    if (targetSocketId) io.to(targetSocketId).emit('receive_message', newMessage);
    socket.emit('message_sent', newMessage);
  });

  socket.on('call_user', (data: { fromId: string, toId: string, offer: any }) => {
    const targetSocketId = userSocketMap.get(data.toId);
    if (targetSocketId) io.to(targetSocketId).emit('incoming_call', { fromId: data.fromId, offer: data.offer });
  });

  socket.on('answer_call', (data: { toId: string, answer: any }) => {
    const targetSocketId = userSocketMap.get(data.toId);
    if (targetSocketId) io.to(targetSocketId).emit('call_answered', { answer: data.answer });
  });

  socket.on('ice_candidate', (data: { toId: string, candidate: any }) => {
    const targetSocketId = userSocketMap.get(data.toId);
    if (targetSocketId) io.to(targetSocketId).emit('ice_candidate', { candidate: data.candidate });
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
