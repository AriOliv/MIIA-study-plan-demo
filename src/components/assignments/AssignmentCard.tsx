import React from 'react';
import { format, parseISO } from 'date-fns';
import { Clock, Calendar, Check } from 'lucide-react';
import { Assignment, Course } from '../../types';

interface AssignmentCardProps {
  assignment: Assignment;
  course: Course;
  onToggleComplete: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ 
  assignment, 
  course, 
  onToggleComplete, 
  onEdit 
}) => {
  const dueDate = parseISO(assignment.dueDate);
  const isOverdue = new Date() > dueDate && !assignment.completed;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="h-2" 
        style={{ backgroundColor: course.color }}
      ></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{assignment.title}</h3>
          <button
            onClick={() => onToggleComplete(assignment)}
            className={`p-1.5 rounded-lg ${
              assignment.completed 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            <Check size={16} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {course.name}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="mr-2" />
            <span className={isOverdue ? 'text-red-500 dark:text-red-400' : ''}>
              Due: {format(dueDate, 'MMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock size={16} className="mr-2" />
            <span>Estimated: {assignment.estimatedHours} hours</span>
          </div>
        </div>
        
        {assignment.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {assignment.description}
          </p>
        )}
        
        <button
          onClick={() => onEdit(assignment)}
          className="w-full mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm font-medium"
        >
          Edit Assignment
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
