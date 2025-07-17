import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ExamCard from '../components/exams/ExamCard';
import ExamForm from '../components/exams/ExamForm';
import { Exam } from '../types';
import { parseISO, isBefore } from 'date-fns';

const Exams: React.FC = () => {
  const { exams, courses, addExam, updateExam } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  
  const handleAddExam = () => {
    setEditingExam(undefined);
    setShowForm(true);
  };
  
  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setShowForm(true);
  };
  
  const handleSubmit = (exam: Exam) => {
    if (editingExam) {
      updateExam(exam);
    } else {
      addExam(exam);
    }
    setShowForm(false);
  };
  
  // Filter exams
  const now = new Date();
  const filteredExams = exams.filter(exam => {
    const examDate = parseISO(exam.date);
    if (filter === 'upcoming') return isBefore(now, examDate);
    if (filter === 'past') return isBefore(examDate, now);
    return true;
  });
  
  // Sort by date (closest first)
  const sortedExams = [...filteredExams].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Exams</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and prepare for your upcoming exams
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
            >
              <option value="all">All Exams</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={handleAddExam}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Exam
          </button>
        </div>
      </div>
      
      {sortedExams.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-2">No exams found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filter === 'all' 
              ? 'Add your first exam to start preparing' 
              : filter === 'upcoming' 
                ? 'No upcoming exams. Enjoy the break!' 
                : 'No past exams recorded.'}
          </p>
          {filter === 'all' && (
            <button
              onClick={handleAddExam}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Add Your First Exam
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedExams.map((exam) => {
            const course = courses.find(c => c.id === exam.courseId) || courses[0];
            
            return (
              <ExamCard 
                key={exam.id} 
                exam={exam}
                course={course}
                onEdit={handleEditExam}
              />
            );
          })}
        </div>
      )}
      
      {showForm && (
        <ExamForm 
          exam={editingExam}
          courses={courses}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Exams;
