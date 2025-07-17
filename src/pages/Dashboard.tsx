import React from 'react';
import { Calendar, BookOpen, ClipboardList, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/dashboard/StatCard';
import UpcomingCard from '../components/dashboard/UpcomingCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import { format, parseISO, isBefore } from 'date-fns';

const Dashboard: React.FC = () => {
  const { 
    courses, 
    assignments, 
    exams, 
    studyBlocks,
    progressData
  } = useAppContext();
  
  // Calculate statistics
  const totalCourses = courses.length;
  const pendingAssignments = assignments.filter(a => !a.completed).length;
  const upcomingExams = exams.filter(e => isBefore(new Date(), parseISO(e.date))).length;
  
  // Calculate today's study hours
  const today = new Date().toISOString().split('T')[0];
  const todayBlock = studyBlocks.find(block => block.date === today);
  const todayHours = todayBlock 
    ? todayBlock.sessions.reduce((total, session) => {
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }, 0)
    : 0;
  
  // Prepare upcoming items
  const upcomingAssignments = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)
    .map(a => ({
      id: a.id,
      title: a.title,
      date: a.dueDate,
      courseId: a.courseId,
      courseName: courses.find(c => c.id === a.courseId)?.name || 'Unknown Course',
      courseColor: courses.find(c => c.id === a.courseId)?.color || '#6366f1',
      type: 'assignment' as const
    }));
  
  const upcomingExamsList = exams
    .filter(e => isBefore(new Date(), parseISO(e.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    .map(e => ({
      id: e.id,
      title: e.title,
      date: e.date,
      courseId: e.courseId,
      courseName: courses.find(c => c.id === e.courseId)?.name || 'Unknown Course',
      courseColor: courses.find(c => c.id === e.courseId)?.color || '#6366f1',
      type: 'exam' as const
    }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Courses" 
          value={totalCourses} 
          icon={<BookOpen />} 
          color="bg-indigo-600"
        />
        <StatCard 
          title="Pending Assignments" 
          value={pendingAssignments} 
          icon={<ClipboardList />} 
          color="bg-amber-500"
          change={{ value: 10, isPositive: false }}
        />
        <StatCard 
          title="Upcoming Exams" 
          value={upcomingExams} 
          icon={<Award />} 
          color="bg-rose-600"
        />
        <StatCard 
          title="Today's Study Hours" 
          value={todayHours.toFixed(1)} 
          icon={<Calendar />} 
          color="bg-emerald-600"
          change={{ value: 15, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart data={progressData} />
        </div>
        <div className="space-y-6">
          <UpcomingCard 
            title="Upcoming Assignments" 
            items={upcomingAssignments}
          />
          <UpcomingCard 
            title="Upcoming Exams" 
            items={upcomingExamsList}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
