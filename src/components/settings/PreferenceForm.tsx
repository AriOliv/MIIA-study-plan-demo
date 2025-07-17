import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface PreferenceFormProps {
  user: User;
  onUpdate: (user: User) => void;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ user, onUpdate }) => {
  const [preferredStudyTime, setPreferredStudyTime] = useState(user.preferences.preferredStudyTime);
  const [preferredSessionLength, setPreferredSessionLength] = useState(user.preferences.preferredSessionLength);
  const [learningStyle, setLearningStyle] = useState(user.preferences.learningStyle);
  const [learningPace, setLearningPace] = useState(user.preferences.learningPace);
  const [breakFrequency, setBreakFrequency] = useState(user.preferences.breakFrequency);
  const [breakDuration, setBreakDuration] = useState(user.preferences.breakDuration);
  
  useEffect(() => {
    setPreferredStudyTime(user.preferences.preferredStudyTime);
    setPreferredSessionLength(user.preferences.preferredSessionLength);
    setLearningStyle(user.preferences.learningStyle);
    setLearningPace(user.preferences.learningPace);
    setBreakFrequency(user.preferences.breakFrequency);
    setBreakDuration(user.preferences.breakDuration);
  }, [user]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser: User = {
      ...user,
      preferences: {
        ...user.preferences,
        preferredStudyTime,
        preferredSessionLength,
        learningStyle,
        learningPace,
        breakFrequency,
        breakDuration
      }
    };
    
    onUpdate(updatedUser);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="preferredStudyTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Preferred Study Time
          </label>
          <select
            id="preferredStudyTime"
            value={preferredStudyTime}
            onChange={(e) => setPreferredStudyTime(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 5PM)</option>
            <option value="evening">Evening (5PM - 10PM)</option>
            <option value="night">Night (10PM - 6AM)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="preferredSessionLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Preferred Session Length (minutes)
          </label>
          <input
            type="number"
            id="preferredSessionLength"
            min="15"
            max="120"
            step="5"
            value={preferredSessionLength}
            onChange={(e) => setPreferredSessionLength(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Learning Style
          </label>
          <select
            id="learningStyle"
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="visual">Visual (learn through seeing)</option>
            <option value="auditory">Auditory (learn through hearing)</option>
            <option value="reading">Reading/Writing (learn through text)</option>
            <option value="kinesthetic">Kinesthetic (learn through doing)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="learningPace" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Learning Pace
          </label>
          <select
            id="learningPace"
            value={learningPace}
            onChange={(e) => setLearningPace(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="slow">Slow (thorough understanding)</option>
            <option value="moderate">Moderate (balanced approach)</option>
            <option value="fast">Fast (cover more material)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="breakFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Break Frequency (minutes between breaks)
          </label>
          <input
            type="number"
            id="breakFrequency"
            min="15"
            max="120"
            step="5"
            value={breakFrequency}
            onChange={(e) => setBreakFrequency(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="breakDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Break Duration (minutes)
          </label>
          <input
            type="number"
            id="breakDuration"
            min="5"
            max="30"
            step="5"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </form>
  );
};

export default PreferenceForm;
