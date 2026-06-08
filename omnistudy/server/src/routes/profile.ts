import { Router, Response } from 'express';
import { readDB, writeDB } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:username', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const user = db.users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user: { id: user.id, username: user.username, displayName: user.displayName, profilePic: user.profilePic }, posts: db.posts.filter(p => p.userId === user.id) });
});

router.put('/', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  if (req.body.displayName) user.displayName = req.body.displayName;
  if (req.body.profilePic) user.profilePic = req.body.profilePic;
  writeDB(db);
  res.json({ id: user.id, username: user.username, displayName: user.displayName, profilePic: user.profilePic });
});

export default router;
