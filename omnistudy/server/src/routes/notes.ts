import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB, Note } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, (req: any, res: Response) => {
  res.json(readDB().notes.filter(n => n.userId === req.user.id));
});

router.post('/', authenticateToken, (req: any, res: Response) => {
  const { id, title, content } = req.body;
  const db = readDB();
  if (id) {
    const note = db.notes.find(n => n.id === id && n.userId === req.user.id);
    if (note) {
      note.title = title; note.content = content; note.updatedAt = new Date().toISOString();
      writeDB(db); return res.json(note);
    }
  }
  const newNote: Note = { id: uuidv4(), userId: req.user.id, title, content, updatedAt: new Date().toISOString() };
  db.notes.push(newNote);
  writeDB(db);
  res.json(newNote);
});

router.delete('/:id', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const idx = db.notes.findIndex(n => n.id === req.params.id && n.userId === req.user.id);
  if (idx > -1) { db.notes.splice(idx, 1); writeDB(db); return res.json({ success: true }); }
  res.status(404).json({ message: 'Not found' });
});

export default router;
