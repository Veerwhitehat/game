import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { readDB, writeDB } from '../db.ts';
import { generateToken } from '../middleware/auth.ts';

const router = Router();

router.post('/signup', async (req: any, res: any) => {
    const { username, password, displayName } = req.body;
    const db = readDB();

    if (db.users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: any = {
        id: (db.users.length + 1).toString(),
        username,
        passwordHash,
        displayName: displayName || username,
        theme: 'dark'
    };

    db.users.push(newUser);
    writeDB(db);

    const token = generateToken(newUser.id);
    res.json({ token, user: { id: newUser.id, username: newUser.username, displayName: newUser.displayName, theme: newUser.theme } });
});

router.post('/login', async (req: any, res: any) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, username: user.username, displayName: user.displayName, theme: user.theme } });
});

export default router;
