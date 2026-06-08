import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/signup', async (req: Request, res: Response) => {
  const { username, password, displayName } = req.body;
  const db = readDB();
  if (db.users.find(u => u.username === username)) return res.status(400).json({ message: 'Username taken' });
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), username, displayName: displayName || username, passwordHash };
  db.users.push(newUser);
  writeDB(db);
  const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);
  res.json({ token, user: { id: newUser.id, username: newUser.username, displayName: newUser.displayName } });
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token, user: { id: user.id, username: user.username, displayName: user.displayName } });
});

export default router;
