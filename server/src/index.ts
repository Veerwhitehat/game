import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, '../data.json');
const JWT_SECRET = 'your-very-secure-secret'; // Should be in .env

// Initial data structure
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    users: [],
    posts: [],
    friends: [],
    requests: [],
    messages: [],
    notes: []
  }, null, 2));
}

const getData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const saveData = (data: any) => {
    // Atomic-ish write
    const tmpFile = DATA_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2));
    fs.renameSync(tmpFile, DATA_FILE);
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { username, displayName, password } = req.body;
  const data = getData();

  if (data.users.find((u: any) => u.username === username)) {
    return res.status(400).json({ message: "Username taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    displayName,
    password: hashedPassword,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  saveData(data);

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const data = getData();
  const user = data.users.find((u: any) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

// User Update
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { displayName, avatar } = req.body;
    const data = getData();
    const userIndex = data.users.findIndex((u: any) => u.id === id);
    if (userIndex === -1) return res.status(404).send('User not found');

    data.users[userIndex] = { ...data.users[userIndex], displayName: displayName || data.users[userIndex].displayName, avatar: avatar || data.users[userIndex].avatar };
    saveData(data);
    const { password: _, ...userWithoutPassword } = data.users[userIndex];
    res.json(userWithoutPassword);
});

// Posts Routes
app.get('/api/posts', (req, res) => {
  const data = getData();
  const postsWithUsers = data.posts.map((post: any) => ({
    ...post,
    user: data.users.find((u: any) => u.id === post.userId)
  })).reverse();
  res.json(postsWithUsers);
});

app.post('/api/posts', (req, res) => {
  const { userId, title, content, type } = req.body;
  const data = getData();
  const newPost = {
    id: Date.now().toString(),
    userId,
    title,
    content,
    type,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  };
  data.posts.push(newPost);
  saveData(data);
  res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const data = getData();
    const post = data.posts.find((p: any) => p.id === id);
    if (post) {
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((uid: string) => uid !== userId);
        } else {
            post.likes.push(userId);
        }
        saveData(data);
    }
    res.json(post);
});

app.post('/api/posts/:id/comment', (req, res) => {
    const { id } = req.params;
    const { userId, text } = req.body;
    const data = getData();
    const post = data.posts.find((p: any) => p.id === id);
    if (post) {
        const user = data.users.find((u: any) => u.id === userId);
        post.comments.push({
            id: Date.now().toString(),
            userId,
            username: user?.username,
            text,
            createdAt: new Date().toISOString()
        });
        saveData(data);
    }
    res.json(post);
});

// Requests Routes
app.get('/api/requests/:userId', (req, res) => {
    const { userId } = req.params;
    const data = getData();
    const requests = data.requests.filter((r: any) => r.toId === userId && r.status === 'PENDING').map((r: any) => ({
        ...r,
        fromUser: data.users.find((u: any) => u.id === r.fromId)
    }));
    res.json(requests);
});

app.post('/api/requests', (req, res) => {
    const { fromId, toId, type } = req.body;
    const data = getData();

    // Avoid duplicates
    if (data.requests.find((r: any) => r.fromId === fromId && r.toId === toId && r.type === type && r.status === 'PENDING')) {
        return res.status(400).json({ message: "Request already pending" });
    }

    const newRequest = {
        id: Date.now().toString(),
        fromId,
        toId,
        type,
        status: 'PENDING',
        createdAt: new Date().toISOString()
    };
    data.requests.push(newRequest);
    saveData(data);
    res.status(201).json(newRequest);
});

app.put('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const data = getData();
    const request = data.requests.find((r: any) => r.id === id);
    if (request) {
        request.status = status;
        if (status === 'ACCEPTED' && request.type === 'FRIEND') {
            data.friends.push({ user1: request.fromId, user2: request.toId });
        }
        saveData(data);
    }
    res.json(request);
});

// Friends Routes
app.get('/api/friends/:userId', (req, res) => {
    const { userId } = req.params;
    const data = getData();
    const friendIds = data.friends.filter((f: any) => f.user1 === userId || f.user2 === userId)
        .map((f: any) => f.user1 === userId ? f.user2 : f.user1);
    const friends = data.users.filter((u: any) => friendIds.includes(u.id)).map((u: any) => {
        const { password, ...uWithoutPassword } = u;
        return uWithoutPassword;
    });
    res.json(friends);
});

// Notes Routes
app.get('/api/notes/:userId', (req, res) => {
    const { userId } = req.params;
    const data = getData();
    res.json(data.notes.filter((n: any) => n.userId === userId));
});

app.post('/api/notes', (req, res) => {
    const { userId, title, content } = req.body;
    const data = getData();
    const newNote = {
        id: Date.now().toString(),
        userId,
        title,
        content,
        createdAt: new Date().toISOString()
    };
    data.notes.push(newNote);
    saveData(data);
    res.status(201).json(newNote);
});

// Profile route
app.get('/api/users/:username/profile', (req, res) => {
    const { username } = req.params;
    const data = getData();
    const user = data.users.find((u: any) => u.username === username);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, ...userWithoutPassword } = user;
    const userPosts = data.posts.filter((p: any) => p.userId === user.id);
    res.json({ user: userWithoutPassword, posts: userPosts });
});

// Socket.io logic
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('send-message', (message) => {
    io.to(message.receiverId).emit('receive-message', message);
    const data = getData();
    data.messages.push(message);
    saveData(data);
  });

  socket.on('webrtc-signal', ({ to, from, signal }) => {
    io.to(to).emit('webrtc-signal', { from, signal });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
