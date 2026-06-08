import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../data.json');

export interface User {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  profilePic?: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'image' | 'internal_note';
  createdAt: string;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface FriendRequest {
  id: string;
  fromId: string;
  toId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface MeetingRequest {
  id: string;
  fromId: string;
  toId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  createdAt: string;
}

export interface Database {
  users: User[];
  posts: Post[];
  notes: Note[];
  friendRequests: FriendRequest[];
  meetingRequests: MeetingRequest[];
  messages: Message[];
}

const initialData: Database = {
  users: [],
  posts: [],
  notes: [],
  friendRequests: [],
  meetingRequests: [],
  messages: []
};

export const readDB = (): Database => {
  if (!fs.existsSync(DATA_FILE)) {
    writeDB(initialData);
    return initialData;
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

export const writeDB = (data: Database): void => {
  const tempPath = DATA_FILE + '.tmp';
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DATA_FILE);
};
