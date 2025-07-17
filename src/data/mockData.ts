import { User, Course, Assignment, Exam, StudyBlock, ProgressData, PerformanceMetric } from '../types';
import { addDays, format, addHours, addMinutes } from 'date-fns';

// Helper function to generate dates
const today = new Date();
const formatDate = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

// Mock User
export const mockUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  preferences: {
    preferredStudyTime: 'afternoon',
    preferredSessionLength: 45,
    learningStyle: 'visual',
    learningPace: 'moderate',
    breakFrequency: 45,
    breakDuration: 10,
    theme: 'light'
  }
};

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course1',
    name: 'Data Structures & Algorithms',
    color: '#4F46E5',
    difficulty: 4,
    priority: 1
  },
  {
    id: 'course2',
    name: 'Machine Learning',
    color: '#10B981',
    difficulty: 5,
    priority: 2
  },
  {
    id: 'course3',
    name: 'Web Development',
    color: '#F59E0B',
    difficulty: 3,
    priority: 2
  },
  {
    id: 'course4',
    name: 'Database Systems',
    color: '#EF4444',
    difficulty: 3,
    priority: 3
  }
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'assignment1',
    courseId: 'course1',
    title: 'Implement Red-Black Tree',
    description: 'Create a working implementation with insert, delete, and search operations',
    dueDate: formatDate(addDays(today, 7)),
    estimatedHours: 6,
    completed: false
  },
  {
    id: 'assignment2',
    courseId: 'course2',
    title: 'Neural Network Project',
    description: 'Build a CNN for image classification',
    dueDate: formatDate(addDays(today, 14)),
    estimatedHours: 10,
    completed: false
  },
  {
    id: 'assignment3',
    courseId: 'course3',
    title: 'React Portfolio',
    description: 'Create a personal portfolio using React',
    dueDate: formatDate(addDays(today, 5)),
    estimatedHours: 8,
    completed: false
  },
  {
    id: 'assignment4',
    courseId: 'course4',
    title: 'SQL Query Optimization',
    description: 'Optimize given queries for better performance',
    dueDate: formatDate(addDays(today, 10)),
    estimatedHours: 4,
    completed: false
  }
];

// Mock Exams
export const mockExams: Exam[] = [
  {
    id: 'exam1',
    courseId: 'course1',
    title: 'Midterm Exam',
    date: formatDate(addDays(today, 21)),
    importance: 3,
    topics: ['Trees', 'Graphs', 'Dynamic Programming', 'Sorting Algorithms']
  },
  {
    id: 'exam2',
    courseId: 'course2',
    title: 'Final Project Presentation',
    date: formatDate(addDays(today, 30)),
    importance: 3,
    topics: ['Neural Networks', 'Model Evaluation', 'Hyperparameter Tuning']
  },
  {
    id: 'exam3',
    courseId: 'course3',
    title: 'Quiz 2',
    date: formatDate(addDays(today, 9)),
    importance: 2,
    topics: ['React Hooks', 'State Management', 'API Integration']
  },
  {
    id: 'exam4',
    courseId: 'course4',
    title: 'Final Exam',
    date: formatDate(addDays(today, 45)),
    importance: 3,
    topics: ['Normalization', 'Indexing', 'Transactions', 'Query Optimization']
  }
];

// Generate study blocks for the next 7 days
export const generateMockStudyBlocks = (): StudyBlock[] => {
  const blocks: StudyBlock[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const sessions = [];
    let sessionId = 1;
    
    // Morning session
    if (Math.random() > 0.3) {
      const startTime = new Date(date);
      startTime.setHours(9, 0, 0);
      
      sessions.push({
        id: `session${i}-${sessionId++}`,
        courseId: mockCourses[0].id,
        title: `${mockCourses[0].name} Study`,
        startTime: formatDate(startTime),
        endTime: formatDate(addMinutes(startTime, 45)),
        completed: i === 0 ? Math.random() > 0.5 : false,
        type: 'initial-learning'
      });
    }
    
    // Afternoon session
    if (Math.random() > 0.2) {
      const startTime = new Date(date);
      startTime.setHours(14, 0, 0);
      
      sessions.push({
        id: `session${i}-${sessionId++}`,
        courseId: mockCourses[1].id,
        title: `${mockCourses[1].name} Study`,
        startTime: formatDate(startTime),
        endTime: formatDate(addMinutes(startTime, 45)),
        completed: i === 0 ? Math.random() > 0.5 : false,
        type: 'practice'
      });
    }
    
    // Evening session
    if (Math.random() > 0.3) {
      const startTime = new Date(date);
      startTime.setHours(19, 0, 0);
      
      sessions.push({
        id: `session${i}-${sessionId++}`,
        courseId: mockCourses[2].id,
        title: `${mockCourses[2].name} Review`,
        startTime: formatDate(startTime),
        endTime: formatDate(addMinutes(startTime, 45)),
        completed: i === 0 ? Math.random() > 0.5 : false,
        type: 'review'
      });
    }
    
    blocks.push({
      id: `block${i}`,
      date: formattedDate,
      sessions
    });
  }
  
  return blocks;
};

export const mockStudyBlocks = generateMockStudyBlocks();

// Mock Progress Data
export const mockProgressData: ProgressData[] = Array.from({ length: 14 }, (_, i) => {
  const date = format(addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13 + i), 0), 'yyyy-MM-dd');
  const planned = Math.floor(Math.random() * 5) + 3;
  const completed = Math.floor(Math.random() * (planned + 1));
  
  return {
    date,
    planned,
    completed
  };
});

// Mock Performance Metrics
export const mockPerformanceMetrics: PerformanceMetric[] = mockCourses.map((course, index) => {
  return {
    courseId: course.id,
    score: 65 + Math.floor(Math.random() * 30),
    date: formatDate(new Date())
  };
});
