export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  preferredSessionLength: number; // in minutes
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  learningPace: 'slow' | 'moderate' | 'fast';
  breakFrequency: number; // in minutes
  breakDuration: number; // in minutes
  theme: 'light' | 'dark';
}

export interface Course {
  id: string;
  name: string;
  color: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  priority: 1 | 2 | 3;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  estimatedHours: number;
  completed: boolean;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  date: string;
  importance: 1 | 2 | 3;
  topics: string[];
}

export interface StudySession {
  id: string;
  courseId: string;
  title: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  type: 'initial-learning' | 'review' | 'practice' | 'exam-prep';
}

export interface StudyBlock {
  id: string;
  date: string;
  sessions: StudySession[];
}

export interface ProgressData {
  planned: number;
  completed: number;
  date: string;
}

export interface PerformanceMetric {
  courseId: string;
  score: number;
  date: string;
}
