import { Router } from 'express';
import { readDB, writeDB } from '../db.ts';
import { authMiddleware } from '../middleware/auth.ts';
import multer from 'multer';
import path from 'path';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Tab 1: Home Feed
router.get('/posts', authMiddleware, (req: any, res: any) => {
    const db = readDB();
    res.json(db.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

router.post('/posts', authMiddleware, upload.single('file'), (req: any, res: any) => {
    const { title, type, content: textContent } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id === req.userId);

    const newPost: any = {
        id: Date.now().toString(),
        userId: req.userId,
        username: user?.username,
        avatar: user?.avatar,
        title,
        content: req.file ? `/uploads/${req.file.filename}` : textContent,
        type: type || (req.file ? 'image' : 'text'),
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
    };

    db.posts.push(newPost);
    writeDB(db);
    res.json(newPost);
});

router.post('/posts/:id/like', authMiddleware, (req: any, res: any) => {
    const db = readDB();
    const post = db.posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.userId);
    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes.splice(index, 1);
    }

    writeDB(db);
    res.json(post);
});

router.post('/posts/:id/comments', authMiddleware, (req: any, res: any) => {
    const { text } = req.body;
    const db = readDB();
    const post = db.posts.find(p => p.id === req.params.id);
    const user = db.users.find(u => u.id === req.userId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
        id: Date.now().toString(),
        userId: req.userId,
        username: user?.username,
        text,
        createdAt: new Date().toISOString()
    };

    post.comments.push(comment);
    writeDB(db);
    res.json(post);
});

// Tab 5: Personal Notes
router.get('/notes', authMiddleware, (req: any, res: any) => {
    const db = readDB();
    res.json(db.notes.filter(n => n.userId === req.userId));
});

router.post('/notes', authMiddleware, (req: any, res: any) => {
    const { title, content } = req.body;
    const db = readDB();
    const newNote = {
        id: Date.now().toString(),
        userId: req.userId,
        title,
        content,
        updatedAt: new Date().toISOString()
    };
    db.notes.push(newNote);
    writeDB(db);
    res.json(newNote);
});

router.put('/notes/:id', authMiddleware, (req: any, res: any) => {
    const { title, content } = req.body;
    const db = readDB();
    const note = db.notes.find(n => n.id === req.params.id && n.userId === req.userId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title || note.title;
    note.content = content || note.content;
    note.updatedAt = new Date().toISOString();

    writeDB(db);
    res.json(note);
});

// Tab 3: Requests & Friends
router.get('/requests', authMiddleware, (req: any, res: any) => {
    const db = readDB();
    res.json(db.requests.filter(r => r.receiverId === req.userId));
});

router.post('/requests', authMiddleware, (req: any, res: any) => {
    const { receiverId, type } = req.body;
    const db = readDB();
    const request = {
        id: Date.now().toString(),
        senderId: req.userId,
        receiverId,
        type,
        status: 'PENDING',
        createdAt: new Date().toISOString()
    };
    db.requests.push(request);
    writeDB(db);
    res.json(request);
});

router.put('/requests/:id', authMiddleware, (req: any, res: any) => {
    const { status } = req.body;
    const db = readDB();
    const request = db.requests.find(r => r.id === req.params.id && r.receiverId === req.userId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    writeDB(db);
    res.json(request);
});

// Profile Update
router.get('/users/:id', authMiddleware, (req: any, res: any) => {
    const db = readDB();
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
});

router.put('/profile', authMiddleware, upload.single('avatar'), (req: any, res: any) => {
    const { displayName, theme } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (displayName) user.displayName = displayName;
    if (theme) user.theme = theme;
    if (req.file) user.avatar = `/uploads/${req.file.filename}`;

    writeDB(db);
    res.json(user);
});

export default router;
