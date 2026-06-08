import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB, Post } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const postsWithUser = db.posts.map(post => {
    const user = db.users.find(u => u.id === post.userId);
    return { ...post, username: user?.username, displayName: user?.displayName, profilePic: user?.profilePic };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(postsWithUser);
});

router.post('/', authenticateToken, (req: any, res: Response) => {
  const { title, content, type } = req.body;
  const db = readDB();
  const newPost: Post = { id: uuidv4(), userId: req.user.id, title, content, type, createdAt: new Date().toISOString(), likes: [], comments: [] };
  db.posts.push(newPost);
  writeDB(db);
  res.json(newPost);
});

router.post('/:id/like', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const index = post.likes.indexOf(req.user.id);
  index > -1 ? post.likes.splice(index, 1) : post.likes.push(req.user.id);
  writeDB(db);
  res.json({ likes: post.likes });
});

router.post('/:id/comment', authenticateToken, (req: any, res: Response) => {
  const { text } = req.body;
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const newComment = { id: uuidv4(), userId: req.user.id, text, createdAt: new Date().toISOString() };
  post.comments.push(newComment);
  writeDB(db);
  res.json(newComment);
});

export default router;
