import { Router, Response } from 'express';
import { readDB } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:otherId', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  res.json(db.messages.filter(m => (m.fromId === req.user.id && m.toId === req.params.otherId) || (m.fromId === req.params.otherId && m.toId === req.user.id)).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
});

export default router;
