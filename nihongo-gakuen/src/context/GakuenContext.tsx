import React, { createContext, useContext, useState } from 'react';

type Role = 'Instructor' | 'Student';
type Rank = 'Class 1-C' | 'Class 1-B' | 'Class 1-A';

interface Slide {
  id: number;
  title: string;
  content: string;
  image?: string;
}

interface StudentSubmission {
  studentName: string;
  rank: Rank;
  date: string;
  imageUrl: string;
  score?: number;
  maxScore: number;
  status: 'Pending' | 'Pass' | 'Fail';
  feedback?: string;
  rotation: number;
}

interface GakuenState {
  userRole: Role;
  setUserRole: (role: Role) => void;
  userName: string;
  setUserName: (name: string) => void;
  userRank: Rank;
  setUserRank: (rank: Rank) => void;
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
  slides: Slide[];
  studentScores: Record<string, { score: number; timestamp: string }>;
  submitScore: (studentName: string, score: number) => void;
  submissions: StudentSubmission[];
  addSubmission: (submission: StudentSubmission) => void;
  updateSubmission: (index: number, updates: Partial<StudentSubmission>) => void;
  pushRemedial: (studentName: string) => void;
  notifications: string[];
}

const GakuenContext = createContext<GakuenState | undefined>(undefined);

export const GakuenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<Role>('Student');
  const [userName, setUserName] = useState<string>('Cadet Shinji');
  const [userRank, setUserRank] = useState<Rank>('Class 1-C');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [studentScores, setStudentScores] = useState<Record<string, { score: number; timestamp: string }>>({});
  const [notifications, setNotifications] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  const slides: Slide[] = [
    { id: 0, title: "Linguistic Foundations", content: "Welcome to Nihongo Gakuen. Today we master the core syntax of the elite." },
    { id: 1, title: "Particle Dynamics", content: "Understanding 'Wa' vs 'Ga' is the difference between a cadet and a commander." },
    { id: 2, title: "The Honorific Engine", content: "Mastering Keigo is mandatory for Gakuen elite." },
  ];

  const submitScore = (studentName: string, score: number) => {
    setStudentScores(prev => ({
      ...prev,
      [studentName]: { score, timestamp: new Date().toLocaleTimeString() }
    }));
  };

  const addSubmission = (submission: StudentSubmission) => {
    setSubmissions(prev => [...prev, submission]);
  };

  const updateSubmission = (index: number, updates: Partial<StudentSubmission>) => {
    setSubmissions(prev => {
      const newSubmissions = [...prev];
      newSubmissions[index] = { ...newSubmissions[index], ...updates };
      return newSubmissions;
    });
  };

  const pushRemedial = (studentName: string) => {
      if (studentName === userName && userRole === 'Student') {
          setNotifications(prev => [...prev, "REMEDIAL ALERT: Low score detected. Strategic remedy deployed to your dashboard."]);
      }
      console.log(`Pushing remedial to ${studentName}`);
  };

  return (
    <GakuenContext.Provider value={{
      userRole, setUserRole,
      userName, setUserName,
      userRank, setUserRank,
      activeSlideIndex, setActiveSlideIndex,
      isQuizActive, setIsQuizActive,
      slides,
      studentScores, submitScore,
      submissions, addSubmission, updateSubmission,
      pushRemedial,
      notifications
    }}>
      {children}
    </GakuenContext.Provider>
  );
};

export const useGakuen = () => {
  const context = useContext(GakuenContext);
  if (context === undefined) {
    throw new Error('useGakuen must be used within a GakuenProvider');
  }
  return context;
};
