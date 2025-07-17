import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AssignmentCard from '../components/assignments/AssignmentCard';
import AssignmentForm from '../components/assignments/AssignmentForm';
import { Assignment } from '../types';

const Assignments: React.FC = () => {
  const { assignments, courses, addAssignment, updateAssignment } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const handleAddAssignment = () => {
    setEditingAssignment(undefined);
    setShowForm(true);
  };
  
  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };
  
  const handleToggleComplete = (assignment: Assignment) => {
    updateAssignment({
      ...assignment,
      completed: !assignment.completed
    });
  };
  
  const handleSubmit = (assignment: Assignment) => {
    if (editingAssignment) {
      updateAssignment(assignment);
    } else {
      addAssignment(assignment);
    }
    setShowForm(false);
  };
  
  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'pending') return !assignment.completed;
    if (filter === 'completed') return assignment.completed;
    return true;
  });
  
  // Sort by due date (closest first)
  const sortedAssignments = [...filteredAssignments].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your assignments
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={handleAddAssignment}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Assignment
          </button>
        </div>
      </div>
      
      {sortedAssignments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-2">No assignments found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filter === 'all' 
              ? 'Add your first assignment to start tracking your work' 
              : filter === 'pending' 
                ? 'No pending assignments. Great job!' 
                : 'No completed assignments yet. Keep working!'}
          </p>
          {filter === 'all' && (
            <button
              onClick={handleAddAssignment}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Add Your First Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAssignments.map((assignment) => {
            const course = courses.find(c => c.id === assignment.courseId) || courses[0];
            
            return (
              <AssignmentCard 
                key={assignment.id} 
                assignment={assignment}
                course={course}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditAssignment}
              />
            );
          })}
        </div>
      )}
      
      {showForm && (
        <AssignmentForm 
          assignment={editingAssignment}
          courses={courses}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Assignments;
