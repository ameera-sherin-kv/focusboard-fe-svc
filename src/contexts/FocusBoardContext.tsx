import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, TaskStatus, Accomplishment, TimelineEntry, DashboardStats } from '@/types/task';
import { toast } from '@/hooks/use-toast';

interface FocusBoardContextType {
  tasks: Task[];
  accomplishments: Accomplishment[];
  timeline: TimelineEntry[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addAccomplishment: (accomplishment: Omit<Accomplishment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccomplishment: (id: string, updates: Partial<Accomplishment>) => void;
  getStats: () => DashboardStats;
}

const FocusBoardContext = createContext<FocusBoardContextType | undefined>(undefined);

export const useFocusBoard = () => {
  const context = useContext(FocusBoardContext);
  if (!context) {
    throw new Error('useFocusBoard must be used within a FocusBoardProvider');
  }
  return context;
};

// Sample data for demo
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Set up login/logout functionality with JWT tokens',
    status: 'planned',
    priority: 'high',
    estimatedMinutes: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: 'Need to research best practices for JWT storage'
  },
  {
    id: '2',
    title: 'Design API endpoints',
    description: 'Create REST API documentation for user management',
    status: 'in-progress',
    priority: 'medium',
    estimatedMinutes: 90,
    actualMinutes: 45,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Set up database migrations',
    description: 'Create initial schema for users and tasks',
    status: 'completed',
    priority: 'high',
    estimatedMinutes: 60,
    actualMinutes: 75,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(),
    completedAt: new Date(),
  }
];

const initialAccomplishments: Accomplishment[] = [
  {
    id: '1',
    taskId: '3',
    title: 'Database schema completed',
    description: 'Successfully set up user and task tables with proper relationships',
    timeTaken: 75,
    challenges: 'Had to refactor the initial design to handle foreign key constraints',
    comments: 'Ready for next phase of development',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const FocusBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>(initialAccomplishments);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addTimelineEntry = useCallback((action: string, description?: string, taskId?: string, accomplishmentId?: string) => {
    const entry: TimelineEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      description,
      taskId,
      accomplishmentId,
    };
    setTimeline(prev => [entry, ...prev]);
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    addTimelineEntry('Task Created', `Created task: ${newTask.title}`, newTask.id);
    toast({
      title: "Task created",
      description: `"${newTask.title}" has been added to your board.`,
    });
  }, [addTimelineEntry]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
    addTimelineEntry('Task Updated', `Updated task details`, id);
  }, [addTimelineEntry]);

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask: Partial<Task> = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (newStatus === 'completed') {
      updatedTask.completedAt = new Date();
      
      // Auto-create accomplishment for completed task
      const accomplishment: Omit<Accomplishment, 'id' | 'createdAt' | 'updatedAt'> = {
        taskId: id,
        title: `Completed: ${task.title}`,
        description: task.description,
        timeTaken: task.actualMinutes || task.estimatedMinutes,
      };
      addAccomplishment(accomplishment);
    }

    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));

    addTimelineEntry('Task Moved', `Moved to ${newStatus}`, id);
    
    toast({
      title: `Task ${newStatus}`,
      description: `"${task.title}" moved to ${newStatus}.`,
    });
  }, [tasks, addTimelineEntry]);

  const deleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(prev => prev.filter(task => task.id !== id));
    addTimelineEntry('Task Deleted', `Deleted task: ${task.title}`, id);
    
    toast({
      title: "Task deleted",
      description: `"${task.title}" has been removed.`,
    });
  }, [tasks, addTimelineEntry]);

  const addAccomplishment = useCallback((accomplishmentData: Omit<Accomplishment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccomplishment: Accomplishment = {
      ...accomplishmentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAccomplishments(prev => [...prev, newAccomplishment]);
    addTimelineEntry('Accomplishment Added', `Added accomplishment: ${newAccomplishment.title}`, newAccomplishment.taskId, newAccomplishment.id);
  }, [addTimelineEntry]);

  const updateAccomplishment = useCallback((id: string, updates: Partial<Accomplishment>) => {
    setAccomplishments(prev => prev.map(acc => 
      acc.id === id 
        ? { ...acc, ...updates, updatedAt: new Date() }
        : acc
    ));
    addTimelineEntry('Accomplishment Updated', `Updated accomplishment details`, undefined, id);
  }, [addTimelineEntry]);

  const getStats = useCallback((): DashboardStats => {
    const plannedTasks = tasks.filter(t => t.status === 'planned').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const discardedTasks = tasks.filter(t => t.status === 'discarded').length;
    
    const totalEstimatedMinutes = tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
    const totalActualMinutes = tasks.reduce((sum, task) => sum + (task.actualMinutes || 0), 0);
    
    const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return {
      plannedTasks,
      inProgressTasks,
      completedTasks,
      discardedTasks,
      totalEstimatedMinutes,
      totalActualMinutes,
      completionRate,
    };
  }, [tasks]);

  const value: FocusBoardContextType = {
    tasks,
    accomplishments,
    timeline,
    selectedDate,
    setSelectedDate,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    addAccomplishment,
    updateAccomplishment,
    getStats,
  };

  return (
    <FocusBoardContext.Provider value={value}>
      {children}
    </FocusBoardContext.Provider>
  );
};