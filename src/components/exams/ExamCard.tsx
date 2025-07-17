import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Star } from 'lucide-react';
import { Exam, Course } from '../../types';

interface ExamCardProps {
  exam: Exam;
  course: Course;
  onEdit: (exam: Exam) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, course, onEdit }) => {
  const examDate = parseISO(exam.date);
  const isUpcoming = new Date() < examDate;
  
  const getImportanceLabel = (importance: number) => {
    switch (importance) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Unknown';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="h-2" 
        style={{ backgroundColor: course.color }}
      ></div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {course.name}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="mr-2" />
            <span>
              {format(examDate, 'MMM d, yyyy')} at {format(examDate, 'h:mm a')}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Star size={16} className="mr-2" />
            <span>Importance: {getImportanceLabel(exam.importance)}</span>
          </div>
        </div>
        
        {exam.topics.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topics:</p>
            <div className="flex flex-wrap gap-2">
              {exam.topics.map((topic, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={() => onEdit(exam)}
          className="w-full mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm font-medium"
        >
          Edit Exam
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
