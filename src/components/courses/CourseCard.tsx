import React from 'react';
import { BookOpen, Clock, BarChart } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Very Easy';
      case 2: return 'Easy';
      case 3: return 'Moderate';
      case 4: return 'Difficult';
      case 5: return 'Very Difficult';
      default: return 'Unknown';
    }
  };
  
  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Unknown';
    }
  };
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div 
        className="h-2" 
        style={{ backgroundColor: course.color }}
      ></div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <BarChart size={16} className="mr-2" />
            <span>Difficulty: {getDifficultyLabel(course.difficulty)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock size={16} className="mr-2" />
            <span>Priority: {getPriorityLabel(course.priority)}</span>
          </div>
        </div>
        
        <button
          onClick={() => onEdit(course)}
          className="w-full mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm font-medium"
        >
          Edit Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
