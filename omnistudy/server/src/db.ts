import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../data.json');

export interface User {
    id: string;
    username: string;
    passwordHash: string;
    displayName: string;
    avatar?: string;
    theme: 'light' | 'dark';
}

export interface Post {
    id: string;
    userId: string;
    username: string;
    avatar?: string;
    title: string;
    content: string; // File URL or text
    type: 'image' | 'document' | 'text';
    likes: string[]; // Array of userIds
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    id: string;
    userId: string;
    username: string;
    text: string;
    createdAt: string;
}

export interface Request {
    id: string;
    senderId: string;
    receiverId: string;
    type: 'friend' | 'meeting';
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
}

export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    createdAt: string;
}

export interface Database {
    users: User[];
    posts: Post[];
    requests: Request[];
    notes: Note[];
    messages: Message[];
}

const initialData: Database = {
    users: [],
    posts: [],
    requests: [],
    notes: [],
    messages: []
};

export const readDB = (): Database => {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
};

export const writeDB = (data: Database): void => {
    const tempPath = DATA_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, DATA_PATH);
};
