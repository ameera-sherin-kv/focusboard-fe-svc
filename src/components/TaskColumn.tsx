import React, { useState } from 'react';
import { TaskStatus, Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { CompletionDialog, CompletionData } from './CompletionDialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Settings, 
  CheckCircle2, 
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFocusBoard } from '@/contexts/FocusBoardContext';
import { getTaskById } from '@/api/tasks';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask?: (status: TaskStatus) => void;
}

const columnConfig = {
  planned: {
    title: '📝 Planned',
    icon: FileText,
    bgColor: 'planned-bg',
    borderColor: 'planned',
    description: 'Tasks ready to start'
  },
  'in_progress': {
    title: '⚙️ In Progress',
    icon: Settings,
    bgColor: 'in-progress-bg',
    borderColor: 'in-progress',
    description: 'Currently working on'
  },
  completed: {
    title: '✅ Completed',
    icon: CheckCircle2,
    bgColor: 'completed-bg',
    borderColor: 'completed',
    description: 'Successfully finished'
  },
  discarded: {
    title: '❌ Discarded',
    icon: X,
    bgColor: 'discarded-bg',
    borderColor: 'discarded',
    description: 'Cancelled or shelved'
  }
};

export const TaskColumn: React.FC<TaskColumnProps> = ({ 
  status, 
  tasks, 
  onTaskMove, 
  onAddTask 
}) => {
  const { updateTask } = useFocusBoard();
  const [completionDialog, setCompletionDialog] = useState<{
    isOpen: boolean;
    task: Task | null;
  }>({ isOpen: false, task: null });
  
  const config = columnConfig[status];
  const Icon = config.icon;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
        if (taskId && status === 'completed') {
      const task = await getTaskById(taskId);
      if (task && task.status !== 'completed') {  
        setCompletionDialog({ isOpen: true, task });
        return;
      }
    }
    if (taskId) {
      onTaskMove(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === 'completed') {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setCompletionDialog({ isOpen: true, task });
        return;
      }
    }
    onTaskMove(taskId, newStatus);
  };

  const handleCompletionSubmit = (data: CompletionData) => {
    if (!completionDialog.task) return;
    
    updateTask(completionDialog.task.id, {
      status: 'completed',
      actualMinutes: data.timeTaken,
      notes: [
        completionDialog.task.notes || '',
        data.challenges && `Challenges: ${data.challenges}`,
        data.comments && `Comments: ${data.comments}`,
        data.attachments.length > 0 && `Attachments: ${data.attachments.map(a => a.title).join(', ')}`
      ].filter(Boolean).join('\n\n'),
      completedAt: new Date()
    });
    
    onTaskMove(completionDialog.task.id, 'completed');
    setCompletionDialog({ isOpen: false, task: null });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <Card className={cn(
        'p-4 mb-4 border-l-4',
        `border-l-${config.borderColor} bg-${config.bgColor}`
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={cn('h-5 w-5', `text-${config.borderColor}`)} />
            <div>
              <h2 className="font-semibold text-base">{config.title}</h2>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
            {onAddTask && status !== 'completed' && status !== 'discarded' && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onAddTask(status)}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Tasks Container */}
      <div 
        className={cn(
          'flex-1 space-y-3 min-h-[200px] rounded-lg border-2 border-dashed border-transparent p-2 transition-all duration-200',
          'hover:border-focus-border hover:bg-focus-bg/50'
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks in {status}</p>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="animate-fade-in"
            >
              <TaskCard 
                task={task} 
                onStatusChange={handleTaskStatusChange}
              />
            </div>
          ))
        )}
      </div>
      
      <CompletionDialog
        task={completionDialog.task}
        isOpen={completionDialog.isOpen}
        onClose={() => setCompletionDialog({ isOpen: false, task: null })}
        onComplete={handleCompletionSubmit}
      />
    </div>
  );
};