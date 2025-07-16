import React, { useEffect, useState } from 'react';
import { TaskColumn } from './TaskColumn';
import { TaskStatus } from '@/types/task';
import { useFocusBoard } from '@/contexts/FocusBoardContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createProject, getAllProjects } from '@/api/projects';
import { Project } from '@/types/projects';

export const DailyPlannerBoard: React.FC = () => {
  const { tasks, selectedDate, setSelectedDate, addTask, moveTask } = useFocusBoard();
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('planned');
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    estimatedMinutes: 240,
    notes: '',
    date: selectedDate.toISOString(),
    projectId: ''
  });
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: ''
  });


  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setShowNewTaskDialog(true);
  };

  const handleCreateTask = () => {
    if (!newTaskData.title.trim() || !newTaskData.projectId) return;
    console.log('newTaskData', newTaskData);

    addTask({
      ...newTaskData,
      status: newTaskStatus,
      date: selectedDate.toISOString()
    });

    // Reset form
    setNewTaskData({
      title: '',
      description: '',
      priority: 'medium',
      estimatedMinutes: 60,
      notes: '',
      date: selectedDate.toISOString(),
      projectId: '',
    });
    setShowNewTaskDialog(false);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h1>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            {/* Add Project Dialog */}
            <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowNewProjectDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium">Project Name *</label>
                    <Input
                      value={newProjectData.name}
                      onChange={(e) =>
                        setNewProjectData({ ...newProjectData, name: e.target.value })
                      }
                      placeholder="Enter project name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Project Description</label>
                    <Textarea
                      value={newProjectData.description}
                      onChange={(e) =>
                        setNewProjectData({ ...newProjectData, description: e.target.value })
                      }
                      placeholder="Describe the project (optional)"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (!newProjectData.name.trim()) return;
                        try {
                          createProject({
                            name: newProjectData.name,
                            description: newProjectData.description,
                          });
                        } catch (error) {
                          throw new Error('Failed to create project');
                        }
                        setNewProjectData({ name: '', description: '' });
                        setShowNewProjectDialog(false);
                      }}
                      disabled={!newProjectData.name.trim()}
                    >
                      Create Project
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Task Dialog */}
            <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => handleAddTask('planned')} className="gap-2" variant="default">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={newTaskData.title}
                      onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                      placeholder="Enter task title"
                      className="mt-1"
                    />
                  </div>

                  {/* Project Selection */}
                  <div>
                    <label className="text-sm font-medium">Project *</label>
                    <Select
                      value={newTaskData.projectId}
                      onValueChange={(value) =>
                        setNewTaskData({ ...newTaskData, projectId: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={`Select a project`} />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.length === 0 ? (
                          <SelectItem disabled value="">
                            No projects available
                          </SelectItem>
                        ) : (
                          projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>


                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newTaskData.description}
                      onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                      placeholder="Describe the task (optional)"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={newTaskData.priority}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onValueChange={(value: any) => setNewTaskData({ ...newTaskData, priority: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Estimated Time (minutes)</label>
                      <Input
                        type="number"
                        value={newTaskData.estimatedMinutes}
                        onChange={(e) =>
                          setNewTaskData({ ...newTaskData, estimatedMinutes: parseInt(e.target.value) || 0 })
                        }
                        placeholder="60"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Starting Column</label>
                    <Select
                      value={newTaskStatus}
                      onValueChange={(value: TaskStatus) => setNewTaskStatus(value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">📝 Planned</SelectItem>
                        <SelectItem value="in-progress">⚙️ In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={newTaskData.notes}
                      onChange={(e) => setNewTaskData({ ...newTaskData, notes: e.target.value })}
                      placeholder="Add any additional notes"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask} disabled={!newTaskData.title.trim() || !newTaskData.projectId}>
                      Create Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
        <TaskColumn
          status="planned"
          tasks={getTasksByStatus('planned')}
          onTaskMove={moveTask}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          status="in_progress"
          tasks={getTasksByStatus('in_progress')}
          onTaskMove={moveTask}
          onAddTask={handleAddTask}
        />
        <TaskColumn
          status="completed"
          tasks={getTasksByStatus('completed')}
          onTaskMove={moveTask}
        />
        <TaskColumn
          status="discarded"
          tasks={getTasksByStatus('discarded')}
          onTaskMove={moveTask}
        />
      </div>
    </div>
  );
};