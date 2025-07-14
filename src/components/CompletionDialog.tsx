import React, { useState } from 'react';
import { Task } from '@/types/task';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Upload, Link, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletionDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: CompletionData) => void;
}

export interface CompletionData {
  timeTaken: number;
  challenges: string;
  comments: string;
  attachments: {
    type: 'screenshot' | 'pr' | 'document';
    title: string;
    url?: string;
    content?: string;
  }[];
}

export const CompletionDialog: React.FC<CompletionDialogProps> = ({
  task,
  isOpen,
  onClose,
  onComplete
}) => {
  const [formData, setFormData] = useState<CompletionData>({
    timeTaken: task?.estimatedMinutes || 0,
    challenges: '',
    comments: '',
    attachments: []
  });

  const [newAttachment, setNewAttachment] = useState({
    type: 'pr' as const,
    title: '',
    url: ''
  });

  const handleSubmit = () => {
    onComplete(formData);
    onClose();
    // Reset form
    setFormData({
      timeTaken: 0,
      challenges: '',
      comments: '',
      attachments: []
    });
  };

  const addAttachment = () => {
    if (newAttachment.title.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, {
          ...newAttachment,
          url: newAttachment.url || undefined
        }]
      }));
      setNewAttachment({ type: 'pr', title: '', url: '' });
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-completed rounded-full"></div>
            Task Completed
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{task.title}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Taken */}
          <div className="space-y-2">
            <Label htmlFor="timeTaken" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Taken (minutes)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="timeTaken"
                type="number"
                value={formData.timeTaken}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timeTaken: parseInt(e.target.value) || 0
                }))}
                className="max-w-32"
              />
              <span className="text-sm text-muted-foreground">
                (Estimated: {task.estimatedMinutes}m)
              </span>
            </div>
          </div>

          {/* Challenges */}
          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges Faced</Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                challenges: e.target.value
              }))}
              placeholder="What challenges did you encounter while working on this task?"
              className="min-h-20"
            />
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Comments & Follow-ups</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                comments: e.target.value
              }))}
              placeholder="Any additional comments, next steps, or follow-up tasks?"
              className="min-h-20"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <Label>Attached Proofs</Label>
            
            {/* Add new attachment */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <select
                  value={newAttachment.type}
                  onChange={(e) => setNewAttachment(prev => ({
                    ...prev,
                    type: e.target.value as any
                  }))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pr">Pull Request</option>
                  <option value="screenshot">Screenshot</option>
                  <option value="document">Document</option>
                </select>
                <Input
                  placeholder="Title"
                  value={newAttachment.title}
                  onChange={(e) => setNewAttachment(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="URL (optional)"
                  value={newAttachment.url}
                  onChange={(e) => setNewAttachment(prev => ({
                    ...prev,
                    url: e.target.value
                  }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addAttachment}
                  disabled={!newAttachment.title.trim()}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Existing attachments */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    {attachment.type === 'pr' && <Link className="h-4 w-4" />}
                    {attachment.type === 'screenshot' && <Upload className="h-4 w-4" />}
                    {attachment.type === 'document' && <FileText className="h-4 w-4" />}
                    
                    <span className="flex-1 text-sm">{attachment.title}</span>
                    {attachment.url && (
                      <Badge variant="outline" className="text-xs">Has URL</Badge>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAttachment(index)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-completed hover:bg-completed/90">
              Complete Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
