import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProfileForm from '../components/settings/ProfileForm';
import PreferenceForm from '../components/settings/PreferenceForm';

const Settings: React.FC = () => {
  const { user, updateUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and study preferences
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Study Preferences
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' ? (
            <ProfileForm user={user} onUpdate={updateUser} />
          ) : (
            <PreferenceForm user={user} onUpdate={updateUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
