import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Task, TaskStatus, Accomplishment, TimelineEntry, DashboardStats } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { createTask, deleteTaskById, getAllTasks, getTasksByDate, updateTaskById } from '@/api/tasks';
import { getDashboardStats } from '@/api/dashboard';


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
  stats: DashboardStats | null;
  fetchStats: () => void;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>(initialAccomplishments);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats | null>({
    plannedTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    discardedTasks: 0,
    totalEstimatedMinutes: 0,
    totalActualMinutes: 0,
    completionRate: 0,
  });


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

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await createTask(taskData);   
      setTasks(prev => [...prev, newTask]);
      addTimelineEntry('Task Created', `Created task: ${newTask.title}`, newTask.id);
      toast({
        title: "Task created",
        description: `"${newTask.title}" has been added to your board.`,
      });
    } catch (err) {
      console.error(err);
    }
  }, [addTimelineEntry]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      await updateTaskById(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ));
      addTimelineEntry('Task Updated', `Updated task details`, id);
    } catch (err) {
      console.error(err);
    }
  }, [addTimelineEntry]);

  const moveTask = useCallback(async (id: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask: Partial<Task> = {
      status: newStatus,
      updatedAt: new Date(),
    };
    if (newStatus === 'completed') {
      updatedTask.completedAt = new Date();
      return;
    }
    try {
      await updateTaskById(id, updatedTask);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      ));
  
      addTimelineEntry('Task Moved', `Moved to ${newStatus}`, id);
      
      toast({
        title: `Task ${newStatus}`,
        description: `"${task.title}" moved to ${newStatus}.`,
      });
    } catch (err) {
      console.error(err);
    }
  }, [tasks, addTimelineEntry]);

  const deleteTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      await deleteTaskById(id);
      addTimelineEntry('Task Deleted', `Deleted task: ${task.title}`, id);
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been removed.`,
      });
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error(err);
    }
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


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasks = await getTasksByDate(selectedDate.toISOString())
        setTasks(allTasks);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchTasks();
  }, [updateTask, selectedDate]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getDashboardStats(selectedDate.toISOString().split('T')[0]);
      console.log('Stats: ', result);
      setStats(result);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  }, [selectedDate]);

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
    stats,
    fetchStats,
  };

  return (
    <FocusBoardContext.Provider value={value}>
      {children}
    </FocusBoardContext.Provider>
  );
};