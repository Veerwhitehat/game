import { Server, Socket } from 'socket.io';
import { readDB, writeDB } from '../db.ts';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        socket.on('join', (userId: string) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        socket.on('send_message', (data: { senderId: string, receiverId: string, text: string }) => {
            const db = readDB();
            const newMessage = {
                id: Date.now().toString(),
                senderId: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                createdAt: new Date().toISOString()
            };
            db.messages.push(newMessage);
            writeDB(db);

            io.to(data.receiverId).emit('receive_message', newMessage);
            socket.emit('message_sent', newMessage);
        });

        // WebRTC Signaling
        socket.on('webrtc_signal', (data: { targetId: string, signal: any, senderId: string }) => {
            io.to(data.targetId).emit('webrtc_signal', {
                senderId: data.senderId,
                signal: data.signal
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
