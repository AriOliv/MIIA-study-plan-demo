import React, { useState } from 'react';
import { 
  GanttProvider, 
  GanttSidebar, 
  GanttSidebarGroup, 
  GanttSidebarItem, 
  GanttTimeline, 
  GanttHeader, 
  GanttFeatureList, 
  GanttFeatureListGroup, 
  GanttFeatureItem, 
  GanttToday,
  GanttMarker,
  GanttCreateMarkerTrigger,
  GanttStatus,
  GanttFeature
} from '../ui/gantt';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from '../ui/context-menu';
import { EyeIcon, LinkIcon, TrashIcon, Clock, Calendar } from 'lucide-react';
import { StudyBlock, Course, StudySession } from '../../types';
import { format, parseISO, addDays, startOfDay, endOfDay } from 'date-fns';

interface ScheduleGanttProps {
  studyBlocks: StudyBlock[];
  courses: Course[];
  onToggleSessionCompletion: (blockId: string, sessionId: string) => void;
}

const ScheduleGantt: React.FC<ScheduleGanttProps> = ({ 
  studyBlocks, 
  courses, 
  onToggleSessionCompletion 
}) => {
  // Create status types for different session types
  const sessionStatuses: Record<string, GanttStatus> = {
    'initial-learning': { 
      id: 'initial-learning', 
      name: 'Initial Learning', 
      color: '#4F46E5' // indigo
    },
    'review': { 
      id: 'review', 
      name: 'Review', 
      color: '#F59E0B' // amber
    },
    'practice': { 
      id: 'practice', 
      name: 'Practice', 
      color: '#10B981' // emerald
    },
    'exam-prep': { 
      id: 'exam-prep', 
      name: 'Exam Prep', 
      color: '#EF4444' // red
    }
  };

  // Convert study sessions to Gantt features
  const convertToGanttFeatures = (): GanttFeature[] => {
    return studyBlocks.flatMap(block => 
      block.sessions.map(session => {
        const course = courses.find(c => c.id === session.courseId);
        return {
          id: `${block.id}-${session.id}`,
          name: session.title,
          startAt: parseISO(session.startTime),
          endAt: parseISO(session.endTime),
          status: sessionStatuses[session.type] || sessionStatuses['initial-learning'],
          blockId: block.id,
          sessionId: session.id,
          completed: session.completed,
          courseColor: course?.color || '#6366f1'
        } as GanttFeature & { blockId: string; sessionId: string; completed: boolean; courseColor: string }
      })
    );
  };

  const [features, setFeatures] = useState<(GanttFeature & { 
    blockId: string; 
    sessionId: string; 
    completed: boolean;
    courseColor: string;
  })[]>(convertToGanttFeatures());

  // Group features by session type
  const groupedFeatures = features.reduce<Record<string, typeof features>>(
    (groups, feature) => {
      const groupName = feature.status.name;
      return {
        ...groups,
        [groupName]: [...(groups[groupName] || []), feature],
      };
    },
    {}
  );

  // Sort groups alphabetically
  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  // Create markers for important dates (e.g., exam dates)
  const today = new Date();
  const markers = [
    {
      id: 'today',
      date: today,
      label: 'Today',
      className: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300'
    }
  ];

  // Handle session completion toggle
  const handleToggleCompletion = (id: string) => {
    const feature = features.find(f => `${f.blockId}-${f.sessionId}` === id);
    if (feature) {
      onToggleSessionCompletion(feature.blockId, feature.sessionId);
      
      // Update local state for immediate UI feedback
      setFeatures(prev => 
        prev.map(f => 
          f.id === id ? { ...f, completed: !f.completed } : f
        )
      );
    }
  };

  // Handle session view
  const handleViewSession = (id: string) => {
    console.log(`View session: ${id}`);
  };

  // Handle session move
  const handleMoveSession = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) return;
    
    console.log(`Move session: ${id} from ${startAt} to ${endAt}`);
    
    // Update local state
    setFeatures(prev => 
      prev.map(f => 
        f.id === id ? { ...f, startAt, endAt } : f
      )
    );
  };

  // Handle adding a new session
  const handleAddSession = (date: Date) => {
    console.log(`Add session at: ${date}`);
    // In a real implementation, this would open a modal to create a new session
  };

  return (
    <GanttProvider 
      onAddItem={handleAddSession} 
      range="daily" 
      zoom={100} 
      className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-xl mt-6"
    >
      <GanttSidebar>
        {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
          <GanttSidebarGroup key={group} name={group}>
            {features.map((feature) => (
              <GanttSidebarItem
                key={feature.id}
                feature={feature}
                onSelectItem={handleViewSession}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <GanttFeatureListGroup key={group}>
              {features.map((feature) => (
                <div className="flex" key={feature.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleViewSession(feature.id)}
                        className={feature.completed ? 'opacity-60' : ''}
                      >
                        <GanttFeatureItem
                          onMove={handleMoveSession}
                          {...feature}
                        >
                          <div 
                            className="h-2 w-2 rounded-full mr-2" 
                            style={{ backgroundColor: feature.courseColor }}
                          />
                          <span className="flex-1 truncate">{feature.name}</span>
                          {feature.completed && (
                            <span className="text-green-500 dark:text-green-400 text-xs">Completed</span>
                          )}
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleViewSession(feature.id)}
                      >
                        <EyeIcon size={16} className="text-muted-foreground" />
                        View details
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleToggleCompletion(feature.id)}
                      >
                        <Clock size={16} className="text-muted-foreground" />
                        {feature.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        {markers.map((marker) => (
          <GanttMarker
            key={marker.id}
            {...marker}
          />
        ))}
        <GanttToday className="bg-indigo-500 text-white dark:bg-indigo-600" />
        <GanttCreateMarkerTrigger onCreateMarker={handleAddSession} />
      </GanttTimeline>
    </GanttProvider>
  );
};

export default ScheduleGantt;
