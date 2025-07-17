import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CourseCard from '../components/courses/CourseCard';
import CourseForm from '../components/courses/CourseForm';
import { Course } from '../types';

const Courses: React.FC = () => {
  const { courses, addCourse, updateCourse } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  
  const handleAddCourse = () => {
    setEditingCourse(undefined);
    setShowForm(true);
  };
  
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };
  
  const handleSubmit = (course: Course) => {
    if (editingCourse) {
      updateCourse(course);
    } else {
      addCourse(course);
    }
    setShowForm(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Courses</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your courses and their properties
          </p>
        </div>
        
        <button
          onClick={handleAddCourse}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Course
        </button>
      </div>
      
      {courses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-2">No courses yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add your first course to start planning your study schedule
          </p>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Add Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEdit={handleEditCourse}
            />
          ))}
        </div>
      )}
      
      {showForm && (
        <CourseForm 
          course={editingCourse}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Courses;
