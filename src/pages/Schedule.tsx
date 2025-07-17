import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DaySchedule from '../components/schedule/DaySchedule';
import { WeeklyScheduler } from '../components/schedule/WeeklyScheduler';
import { Calendar, List } from 'lucide-react';

const Schedule: React.FC = () => {
  const { studyBlocks, courses, toggleSessionCompletion } = useAppContext();
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('gantt');
  
  // Sort blocks by date
  const sortedBlocks = [...studyBlocks].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Study Schedule</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Optimized based on your learning preferences and deadlines
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('gantt')}
            className={`flex items-center px-3 py-2 rounded-md ${
              viewMode === 'gantt' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Calendar size={18} className="mr-2" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center px-3 py-2 rounded-md ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <List size={18} className="mr-2" />
            List
          </button>
        </div>
      </div>
      
      {viewMode === 'gantt' ? (
        <WeeklyScheduler 
          studyBlocks={studyBlocks} 
          courses={courses} 
          onToggleSessionCompletion={toggleSessionCompletion}
          startHour={7}
          endHour={22}
          timeSlotInterval={60}
          className="mt-6"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedBlocks.map((block) => (
            <DaySchedule 
              key={block.id} 
              block={block} 
              courses={courses}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
