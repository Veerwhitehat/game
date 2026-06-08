import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB, FriendRequest, MeetingRequest } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/friend-requests', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const enriched = db.friendRequests.filter(r => r.fromId === req.user.id || r.toId === req.user.id).map(r => {
    const other = db.users.find(u => u.id === (r.fromId === req.user.id ? r.toId : r.fromId));
    return { ...r, otherUser: { id: other?.id, username: other?.username, displayName: other?.displayName, profilePic: other?.profilePic } };
  });
  res.json(enriched);
});

router.post('/friend-requests', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  if (db.friendRequests.find(r => (r.fromId === req.user.id && r.toId === req.body.toId) || (r.fromId === req.body.toId && r.toId === req.user.id))) return res.status(400).json({ message: 'Exists' });
  const newReq: FriendRequest = { id: uuidv4(), fromId: req.user.id, toId: req.body.toId, status: 'PENDING' };
  db.friendRequests.push(newReq);
  writeDB(db);
  res.json(newReq);
});

router.put('/friend-requests/:id', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const r = db.friendRequests.find(req_ => req_.id === req.params.id && req_.toId === req.user.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  r.status = req.body.status;
  writeDB(db);
  res.json(r);
});

router.get('/meeting-requests', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const enriched = db.meetingRequests.filter(r => r.fromId === req.user.id || r.toId === req.user.id).map(r => {
    const other = db.users.find(u => u.id === (r.fromId === req.user.id ? r.toId : r.fromId));
    return { ...r, otherUser: { id: other?.id, username: other?.username, displayName: other?.displayName, profilePic: other?.profilePic } };
  });
  res.json(enriched);
});

router.post('/meeting-requests', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const newReq: MeetingRequest = { id: uuidv4(), fromId: req.user.id, toId: req.body.toId, status: 'PENDING' };
  db.meetingRequests.push(newReq);
  writeDB(db);
  res.json(newReq);
});

router.put('/meeting-requests/:id', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const r = db.meetingRequests.find(req_ => req_.id === req.params.id && req_.toId === req.user.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  r.status = req.body.status;
  writeDB(db);
  res.json(r);
});

router.get('/friends', authenticateToken, (req: any, res: Response) => {
  const db = readDB();
  const ids = db.friendRequests.filter(r => r.status === 'ACCEPTED' && (r.fromId === req.user.id || r.toId === req.user.id)).map(r => r.fromId === req.user.id ? r.toId : r.fromId);
  res.json(db.users.filter(u => ids.includes(u.id)).map(u => ({ id: u.id, username: u.username, displayName: u.displayName, profilePic: u.profilePic })));
});

export default router;
