import React from 'react';
import { format, parseISO } from 'date-fns';
import { Check, Clock } from 'lucide-react';
import { StudyBlock, Course } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface DayScheduleProps {
  block: StudyBlock;
  courses: Course[];
}

const DaySchedule: React.FC<DayScheduleProps> = ({ block, courses }) => {
  const { toggleSessionCompletion } = useAppContext();
  
  const getCourseById = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };
  
  const formatTime = (timeString: string) => {
    return format(parseISO(timeString), 'h:mm a');
  };
  
  const isToday = new Date().toISOString().split('T')[0] === block.date;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">
          {format(new Date(block.date), 'EEEE, MMMM d')}
          {isToday && (
            <span className="ml-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">Today</span>
          )}
        </h3>
      </div>
      
      {block.sessions.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>No study sessions scheduled</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {block.sessions.map((session) => {
            const course = getCourseById(session.courseId);
            
            return (
              <li key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-1 h-16 rounded-full mr-4" 
                    style={{ backgroundColor: course?.color || '#6366f1' }}
                  ></div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course?.name || 'Unknown Course'}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleSessionCompletion(block.id, session.id)}
                    className={`p-2 rounded-lg ${
                      session.completed 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Check size={18} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DaySchedule;
