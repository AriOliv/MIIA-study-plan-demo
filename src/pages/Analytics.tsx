import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProgressChart from '../components/dashboard/ProgressChart';
import PerformanceChart from '../components/analytics/PerformanceChart';
import CompletionRateChart from '../components/analytics/CompletionRateChart';

const Analytics: React.FC = () => {
  const { 
    progressData, 
    performanceMetrics, 
    courses, 
    studyBlocks 
  } = useAppContext();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your study progress and performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={progressData} />
        <CompletionRateChart studyBlocks={studyBlocks} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <PerformanceChart metrics={performanceMetrics} courses={courses} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">Study Pattern Analysis</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your most productive study time appears to be in the afternoon. Consider scheduling more challenging subjects during this period for optimal learning efficiency.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Performance Improvement</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your performance in Data Structures & Algorithms has improved by 15% over the last month. Keep up with the current study approach for this subject.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
            <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Attention Needed</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Machine Learning shows lower engagement levels. Consider trying different learning methods or breaking the material into smaller chunks to improve retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
