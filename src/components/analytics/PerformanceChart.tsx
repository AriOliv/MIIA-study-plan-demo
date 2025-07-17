import React from 'react';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { PerformanceMetric, Course } from '../../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
  courses: Course[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ metrics, courses }) => {
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
        pointLabels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
        ticks: {
          backdropColor: 'transparent',
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const getCourseById = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  const data = {
    labels: metrics.map(metric => {
      const course = getCourseById(metric.courseId);
      return course ? course.name : 'Unknown';
    }),
    datasets: [
      {
        label: 'Performance',
        data: metrics.map(metric => metric.score),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Performance by Subject</h3>
      <div className="h-64">
        <Radar options={options} data={data} />
      </div>
    </div>
  );
};

export default PerformanceChart;
