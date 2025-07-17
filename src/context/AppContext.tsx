import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Course, Assignment, Exam, StudyBlock, ProgressData, PerformanceMetric 
} from '../types';
import { 
  mockUser, mockCourses, mockAssignments, mockExams, mockStudyBlocks, 
  mockProgressData, mockPerformanceMetrics 
} from '../data/mockData';

interface AppContextType {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  exams: Exam[];
  studyBlocks: StudyBlock[];
  progressData: ProgressData[];
  performanceMetrics: PerformanceMetric[];
  updateUser: (user: User) => void;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (assignmentId: string) => void;
  addExam: (exam: Exam) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  updateStudyBlock: (block: StudyBlock) => void;
  toggleSessionCompletion: (blockId: string, sessionId: string) => void;
  regenerateSchedule: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [studyBlocks, setStudyBlocks] = useState<StudyBlock[]>(mockStudyBlocks);
  const [progressData, setProgressData] = useState<ProgressData[]>(mockProgressData);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>(mockPerformanceMetrics);

  // Apply theme from user preferences
  useEffect(() => {
    if (user.preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.preferences.theme]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const addCourse = (course: Course) => {
    setCourses([...courses, course]);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const addAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const updateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === updatedAssignment.id ? updatedAssignment : assignment
    ));
  };

  const deleteAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
  };

  const addExam = (exam: Exam) => {
    setExams([...exams, exam]);
  };

  const updateExam = (updatedExam: Exam) => {
    setExams(exams.map(exam => 
      exam.id === updatedExam.id ? updatedExam : exam
    ));
  };

  const deleteExam = (examId: string) => {
    setExams(exams.filter(exam => exam.id !== examId));
  };

  const updateStudyBlock = (updatedBlock: StudyBlock) => {
    setStudyBlocks(studyBlocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };

  const toggleSessionCompletion = (blockId: string, sessionId: string) => {
    setStudyBlocks(studyBlocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          sessions: block.sessions.map(session => {
            if (session.id === sessionId) {
              return { ...session, completed: !session.completed };
            }
            return session;
          })
        };
      }
      return block;
    }));
    
    // Update progress data for today
    const today = new Date().toISOString().split('T')[0];
    setProgressData(progressData.map(data => {
      if (data.date === today) {
        return {
          ...data,
          completed: data.completed + 1
        };
      }
      return data;
    }));
  };

  const regenerateSchedule = () => {
    // In a real app, this would call an AI algorithm to regenerate the schedule
    // For now, we'll just shuffle the existing schedule a bit
    setStudyBlocks(studyBlocks.map(block => ({
      ...block,
      sessions: [...block.sessions].sort(() => Math.random() - 0.5)
    })));
  };

  const toggleTheme = () => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        theme: user.preferences.theme === 'light' ? 'dark' : 'light'
      }
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      courses,
      assignments,
      exams,
      studyBlocks,
      progressData,
      performanceMetrics,
      updateUser,
      addCourse,
      updateCourse,
      deleteCourse,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      addExam,
      updateExam,
      deleteExam,
      updateStudyBlock,
      toggleSessionCompletion,
      regenerateSchedule,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
