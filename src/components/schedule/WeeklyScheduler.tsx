"use client";

import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  Clock,
  Calendar,
  X,
  Check
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { StudySession, Course } from "../../types";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  day: number;
  category: string;
  color: string;
  blockId?: string;
  sessionId?: string;
  courseId?: string;
}

interface TimeSlot {
  hour: number;
  minute: number;
  display: string;
}

interface WeeklySchedulerProps {
  studyBlocks: any[];
  courses: Course[];
  onToggleSessionCompletion: (blockId: string, sessionId: string) => void;
  onEventCreate?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  timeSlotInterval?: 30 | 60;
  startHour?: number;
  endHour?: number;
  className?: string;
}

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const EVENT_CATEGORIES = [
  { value: "work", label: "Initial Learning", color: "bg-blue-500" },
  { value: "personal", label: "Practice", color: "bg-green-500" },
  { value: "meeting", label: "Review", color: "bg-purple-500" },
  { value: "appointment", label: "Exam Prep", color: "bg-orange-500" },
  { value: "other", label: "Other", color: "bg-gray-500" }
];

function getCategoryColor(category: string): string {
  const foundCategory = EVENT_CATEGORIES.find(cat => cat.value === category);
  return foundCategory ? foundCategory.color : "bg-gray-500";
}

function generateTimeSlots(startHour: number, endHour: number, interval: 30 | 60): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    if (interval === 30) {
      slots.push({
        hour,
        minute: 0,
        display: `${hour.toString().padStart(2, '0')}:00`
      });
      if (hour < endHour) {
        slots.push({
          hour,
          minute: 30,
          display: `${hour.toString().padStart(2, '0')}:30`
        });
      }
    } else {
      slots.push({
        hour,
        minute: 0,
        display: `${hour.toString().padStart(2, '0')}:00`
      });
    }
  }
  return slots;
}

function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}

function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function WeeklyScheduler({
  studyBlocks,
  courses,
  onToggleSessionCompletion,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  timeSlotInterval = 60,
  startHour = 8,
  endHour = 20,
  className = ""
}: WeeklySchedulerProps) {
  // Convert study blocks to calendar events
  const convertStudyBlocksToEvents = (): CalendarEvent[] => {
    return studyBlocks.flatMap(block => {
      // Get the day of week (0-6) from the block date
      const blockDate = new Date(block.date);
      const dayOfWeek = blockDate.getDay();
      
      return block.sessions.map((session: StudySession) => {
        const course = courses.find(c => c.id === session.courseId);
        const startTimeParts = session.startTime.split('T')[1]?.split(':') || ['00', '00'];
        const endTimeParts = session.endTime.split('T')[1]?.split(':') || ['00', '00'];
        
        // Map session type to category
        let category = 'work';
        switch(session.type) {
          case 'initial-learning': category = 'work'; break;
          case 'review': category = 'meeting'; break;
          case 'practice': category = 'personal'; break;
          case 'exam-prep': category = 'appointment'; break;
          default: category = 'other';
        }
        
        return {
          id: `${block.id}-${session.id}`,
          title: session.title,
          description: session.description || '',
          startTime: `${startTimeParts[0]}:${startTimeParts[1]}`,
          endTime: `${endTimeParts[0]}:${endTimeParts[1]}`,
          day: dayOfWeek,
          category,
          color: getCategoryColor(category),
          blockId: block.id,
          sessionId: session.id,
          courseId: session.courseId
        };
      });
    });
  };

  const [events, setEvents] = useState<CalendarEvent[]>(convertStudyBlocksToEvents());
  const [currentWeek, setCurrentWeek] = useState<Date[]>(getCurrentWeekDates());
  const [selectedSlot, setSelectedSlot] = useState<{day: number, time: string} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{x: number, y: number} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{day: number, time: string} | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{day: number, time: string} | null>(null);
  
  const timeSlots = generateTimeSlots(startHour, endHour, timeSlotInterval);
  const gridRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "work",
    startTime: "",
    endTime: "",
    day: 0,
    courseId: ""
  });

  // Update events when study blocks change
  useEffect(() => {
    setEvents(convertStudyBlocksToEvents());
  }, [studyBlocks, courses]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = currentWeek.map(date => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
    setCurrentWeek(newWeek);
  };

  const handleSlotClick = (day: number, time: string) => {
    setSelectedSlot({ day, time });
    setFormData({
      title: "",
      description: "",
      category: "work",
      startTime: time,
      endTime: minutesToTime(timeToMinutes(time) + 60),
      day,
      courseId: courses.length > 0 ? courses[0].id : ""
    });
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      category: event.category,
      startTime: event.startTime,
      endTime: event.endTime,
      day: event.day,
      courseId: event.courseId || (courses.length > 0 ? courses[0].id : "")
    });
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!formData.title.trim() || !formData.courseId) return;

    const eventData: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      day: formData.day,
      category: formData.category,
      color: getCategoryColor(formData.category),
      courseId: formData.courseId,
      blockId: editingEvent?.blockId,
      sessionId: editingEvent?.sessionId
    };

    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? eventData : e));
      onEventUpdate?.(eventData);
      
      // If this is a study session, toggle completion
      if (editingEvent.blockId && editingEvent.sessionId) {
        // This would update the actual study session in the context
        console.log("Updating study session:", eventData);
      }
    } else {
      setEvents(prev => [...prev, eventData]);
      onEventCreate?.(eventData);
      
      // This would create a new study session in the context
      console.log("Creating new study session:", eventData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(prev => prev.filter(e => e.id !== editingEvent.id));
      onEventDelete?.(editingEvent.id);
      
      // If this is a study session, handle deletion
      if (editingEvent.blockId && editingEvent.sessionId) {
        console.log("Deleting study session:", editingEvent);
      }
      
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const handleToggleCompletion = (event: CalendarEvent) => {
    if (event.blockId && event.sessionId) {
      onToggleSessionCompletion(event.blockId, event.sessionId);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "work",
      startTime: "",
      endTime: "",
      day: 0,
      courseId: courses.length > 0 ? courses[0].id : ""
    });
    setEditingEvent(null);
    setSelectedSlot(null);
  };

  const getEventsForDayAndTime = (day: number, time: string) => {
    return events.filter(event => {
      const eventStart = timeToMinutes(event.startTime);
      const eventEnd = timeToMinutes(event.endTime);
      const slotTime = timeToMinutes(time);
      return event.day === day && slotTime >= eventStart && slotTime < eventEnd;
    });
  };

  const getEventHeight = (event: CalendarEvent) => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    const duration = endMinutes - startMinutes;
    const slotHeight = 60; // Height of each time slot in pixels
    return (duration / timeSlotInterval) * slotHeight;
  };

  const getEventTop = (event: CalendarEvent) => {
    const startMinutes = timeToMinutes(event.startTime);
    const firstSlotMinutes = startHour * 60;
    const offsetMinutes = startMinutes - firstSlotMinutes;
    const slotHeight = 60;
    return (offsetMinutes / timeSlotInterval) * slotHeight;
  };

  const handleMouseDown = (e: React.MouseEvent, day: number, time: string) => {
    if (e.button === 0) { // Left click only
      setIsSelecting(true);
      setSelectionStart({ day, time });
      setSelectionEnd({ day, time });
    }
  };

  const handleMouseEnter = (day: number, time: string) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd({ day, time });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectionStart && selectionEnd) {
      // Create event for selected time range
      const startTime = selectionStart.time;
      const endTime = minutesToTime(timeToMinutes(selectionEnd.time) + timeSlotInterval);
      
      setFormData({
        title: "",
        description: "",
        category: "work",
        startTime,
        endTime,
        day: selectionStart.day,
        courseId: courses.length > 0 ? courses[0].id : ""
      });
      setIsDialogOpen(true);
    }
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const isSlotSelected = (day: number, time: string) => {
    if (!isSelecting || !selectionStart || !selectionEnd) return false;
    
    const currentTime = timeToMinutes(time);
    const startTime = timeToMinutes(selectionStart.time);
    const endTime = timeToMinutes(selectionEnd.time);
    
    return day === selectionStart.day && 
           currentTime >= Math.min(startTime, endTime) && 
           currentTime <= Math.max(startTime, endTime);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSelecting, selectionStart, selectionEnd]);

  return (
    <div className={`bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {currentWeek[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Study Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Study Session' : 'Create Study Session'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update your study session details' : 'Add a new study session to your schedule'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Session title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Session description (optional)"
                />
              </div>
              
              <div>
                <Label htmlFor="course">Course</Label>
                <Select value={formData.courseId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }} />
                          {course.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Session Type</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <div>
                {editingEvent && (
                  <Button variant="destructive" onClick={handleDeleteEvent}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEvent}>
                  <Check className="h-4 w-4 mr-2" />
                  {editingEvent ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-auto max-h-[600px]">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
            <div className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Time
            </div>
            {DAYS_OF_WEEK.map((day, index) => (
              <div key={day} className="p-3 text-center border-l border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium">{day}</div>
                <div className={`text-xs mt-1 ${isToday(currentWeek[index]) ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                  {currentWeek[index].getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div ref={gridRef} className="relative">
            {timeSlots.map((slot, slotIndex) => (
              <div key={`${slot.hour}-${slot.minute}`} className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700/50">
                {/* Time Label */}
                <div className="p-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-800/20 border-r border-gray-200 dark:border-gray-700">
                  {slot.display}
                </div>
                
                {/* Day Columns */}
                {DAYS_OF_WEEK.map((_, dayIndex) => {
                  const dayEvents = getEventsForDayAndTime(dayIndex, slot.display);
                  const isCurrentTime = isToday(currentWeek[dayIndex]) && 
                    getCurrentTime() >= slot.display && 
                    getCurrentTime() < (timeSlots[slotIndex + 1]?.display || '23:59');
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`relative h-16 border-l border-gray-200 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                        isCurrentTime ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''
                      } ${isSlotSelected(dayIndex, slot.display) ? 'bg-indigo-100 dark:bg-indigo-900/20' : ''}`}
                      onClick={() => handleSlotClick(dayIndex, slot.display)}
                      onMouseDown={(e) => handleMouseDown(e, dayIndex, slot.display)}
                      onMouseEnter={() => handleMouseEnter(dayIndex, slot.display)}
                    >
                      {/* Current Time Indicator */}
                      {isCurrentTime && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 dark:bg-indigo-400 z-10" />
                      )}
                      
                      {/* Events */}
                      {slotIndex === 0 && events
                        .filter(event => event.day === dayIndex)
                        .map(event => {
                          const course = courses.find(c => c.id === event.courseId);
                          const isCompleted = studyBlocks.some(block => 
                            block.id === event.blockId && 
                            block.sessions.some((s: StudySession) => 
                              s.id === event.sessionId && s.completed
                            )
                          );
                          
                          return (
                            <motion.div
                              key={event.id}
                              className={`absolute left-1 right-1 rounded-md p-2 cursor-pointer shadow-sm border border-white/20 ${event.color} text-white text-xs overflow-hidden ${isCompleted ? 'opacity-60' : ''}`}
                              style={{
                                top: getEventTop(event),
                                height: getEventHeight(event),
                                zIndex: 5
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="font-medium truncate">{event.title}</div>
                              <div className="text-xs opacity-90">
                                {event.startTime} - {event.endTime}
                              </div>
                              {course && (
                                <div className="text-xs mt-1 opacity-90 flex items-center">
                                  <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: course.color }} />
                                  {course.name}
                                </div>
                              )}
                              {isCompleted && (
                                <div className="text-xs mt-1 font-medium">Completed</div>
                              )}
                            </motion.div>
                          );
                        })
                      }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-800/20">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Session Types:</span>
          {EVENT_CATEGORIES.map(category => (
            <div key={category.value} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${category.color}`} />
              <span>{category.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeeklyScheduler;
