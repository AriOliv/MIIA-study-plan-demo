import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { StudyBlock } from '../../types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface CompletionRateChartProps {
  studyBlocks: StudyBlock[];
}

const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ studyBlocks }) => {
  // Calculate completion statistics
  const allSessions = studyBlocks.flatMap(block => block.sessions);
  const totalSessions = allSessions.length;
  const completedSessions = allSessions.filter(session => session.completed).length;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  
  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedSessions, totalSessions - completedSessions],
        backgroundColor: [
          'rgb(16, 185, 129)',
          'rgb(229, 231, 235)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(229, 231, 235)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Study Session Completion</h3>
      <div className="h-64 relative">
        <Doughnut options={options} data={data} />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <p className="text-3xl font-bold">{Math.round(completionRate)}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
        </div>
      </div>
    </div>
  );
};

export default CompletionRateChart;
