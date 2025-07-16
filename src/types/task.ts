export type TaskStatus = 'planned' | 'in_progress' | 'completed' | 'discarded';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedMinutes: number;
  actualMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
  date: string;
  projectId?: string;
}

export interface Accomplishment {
  id: string;
  taskId?: string;
  title: string;
  description?: string;
  timeTaken?: number;
  challenges?: string;
  comments?: string;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  type: 'pull_request' | 'screenshot' | 'document';
  title: string;
  url?: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: Date;
  action: string;
  description?: string;
  taskId?: string;
  accomplishmentId?: string;
}

export interface DashboardStats {
  plannedTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  discardedTasks: number;
  totalEstimatedMinutes: number;
  totalActualMinutes: number;
  completionRate: number;
}