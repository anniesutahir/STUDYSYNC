export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  date: string; // YYYY-MM-DD
  duration: number; // in minutes
  priority: 'Low' | 'Medium' | 'High';
  notes: string;
  color: string;
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
  userId?: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  notes: string;
  color: string;
  userId?: string;
}

export interface Theme {
  name: string;
  isDark: boolean;
}

export enum PomodoroStatus {
    STUDY = 'STUDY',
    SHORT_BREAK = 'SHORT_BREAK',
    LONG_BREAK = 'LONG_BREAK',
    PAUSED = 'PAUSED',
    STOPPED = 'STOPPED',
}

export interface Quote {
    quote: string;
    author: string;
}

// Fix: Export SoundEffect type.
export type SoundEffect = 'click' | 'complete' | 'add' | 'delete' | 'login';

export interface Achievement {
  id:string;
  name: string;
  description: string;
  unlocked: boolean;
  dateUnlocked?: string;
}

export type View = 'dashboard' | 'tasks' | 'calendar' | 'statistics' | 'monthly' | 'exams';