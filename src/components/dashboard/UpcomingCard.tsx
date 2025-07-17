import React from 'react';
import { format, parseISO } from 'date-fns';

interface UpcomingItem {
  id: string;
  title: string;
  date: string;
  courseId: string;
  courseName: string;
  courseColor: string;
  type: 'assignment' | 'exam';
}

interface UpcomingCardProps {
  title: string;
  items: UpcomingItem[];
}

const UpcomingCard: React.FC<UpcomingCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming items</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex-shrink-0">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.courseColor }}
                ></div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.courseName}</p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format(parseISO(item.date), 'MMM d')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingCard;
