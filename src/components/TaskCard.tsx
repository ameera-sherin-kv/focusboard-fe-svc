import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Edit2, 
  Save, 
  X,
  GripVertical,
  AlertCircle,
  CheckCircle2,
  Circle,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFocusBoard } from '@/contexts/FocusBoardContext';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isDragging?: boolean;
}

const priorityConfig = {
  low: { color: 'priority-low', label: 'Low' },
  medium: { color: 'priority-medium', label: 'Medium' },
  high: { color: 'priority-high', label: 'High' },
};

const statusConfig = {
  planned: { icon: Circle, bgColor: 'planned-bg', borderColor: 'planned' },
  'in_progress': { icon: AlertCircle, bgColor: 'in-progress-bg', borderColor: 'in-progress' },
  completed: { icon: CheckCircle2, bgColor: 'completed-bg', borderColor: 'completed' },
  discarded: { icon: X, bgColor: 'discarded-bg', borderColor: 'discarded' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, isDragging = false }) => {
  const { updateTask, deleteTask } = useFocusBoard();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    estimatedMinutes: task.estimatedMinutes,
    actualMinutes: task.actualMinutes || 0,
    notes: task.notes || '',
  });

  const StatusIcon = statusConfig[task.status].icon;
  const config = statusConfig[task.status];

  const handleSave = () => {
    updateTask(task.id, {
      title: editData.title,
      description: editData.description,
      estimatedMinutes: editData.estimatedMinutes,
      actualMinutes: editData.actualMinutes,
      notes: editData.notes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      estimatedMinutes: task.estimatedMinutes,
      actualMinutes: task.actualMinutes || 0,
      notes: task.notes || '',
    });
    setIsEditing(false);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card 
      className={cn(
        'p-4 border-l-4 transition-all duration-300 cursor-pointer group hover:shadow-medium',
        `border-l-${config.borderColor} bg-${config.bgColor}`,
        isDragging && 'opacity-50 transform rotate-2',
        task.status === 'discarded' && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          <StatusIcon className={cn(
            'h-4 w-4 mt-1',
            `text-${config.borderColor}`
          )} />
          
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="font-medium"
                placeholder="Task title"
              />
            ) : (
              <h3 className={cn(
                'font-medium leading-tight',
                task.status === 'completed' && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </h3>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                className={cn(
                  'text-xs px-2 py-1 text-white border-0',
                  task.priority === 'high' && 'bg-priority-high',
                  task.priority === 'medium' && 'bg-priority-medium',
                  task.priority === 'low' && 'bg-priority-low'
                )}
              >
                {priorityConfig[task.priority].label}
              </Badge>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {task.actualMinutes && task.status === 'completed' ? (
                  <span className="flex gap-1">
                    <span className="line-through">{formatTime(task.estimatedMinutes)}</span>
                    <span className="font-medium">{formatTime(task.actualMinutes)}</span>
                  </span>
                ) : (
                  <span>{formatTime(task.estimatedMinutes)}</span>
                )}
              </div>
            </div>

            {(task.description || isEditing) && (
              <div className={cn(
                'text-sm text-muted-foreground',
                !isExpanded && !isEditing && 'line-clamp-2'
              )}>
                {isEditing ? (
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Task description"
                    className="min-h-[60px]"
                  />
                ) : (
                  task.description
                )}
              </div>
            )}

            {isExpanded && !isEditing && task.notes && (
              <div className="text-sm">
                <span className="font-medium text-foreground">Notes: </span>
                <span className="text-muted-foreground">{task.notes}</span>
              </div>
            )}

            {isEditing && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Estimated (min)</label>
                    <Input
                      type="number"
                      value={editData.estimatedMinutes}
                      onChange={(e) => setEditData({ ...editData, estimatedMinutes: parseInt(e.target.value) || 0 })}
                      className="text-xs"
                    />
                  </div>
                  {task.status !== 'planned' && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Actual (min)</label>
                      <Input
                        type="number"
                        value={editData.actualMinutes}
                        onChange={(e) => setEditData({ ...editData, actualMinutes: parseInt(e.target.value) || 0 })}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Notes</label>
                  <Textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    placeholder="Add notes..."
                    className="min-h-[60px] text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {isEditing ? (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={handleSave} className="h-6 w-6 p-0">
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => deleteTask(task.id)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {(task.description || task.notes) && !isEditing && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};