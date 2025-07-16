import React, { useState } from 'react';
import { Accomplishment } from '@/types/task';
import { useFocusBoard } from '@/contexts/FocusBoardContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trophy, 
  Clock, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  ExternalLink,
  FileText,
  Image,
  Link,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const AccomplishmentsPanel: React.FC = () => {
  const { accomplishments, addAccomplishment, updateAccomplishment } = useFocusBoard();
  const [showNewAccomplishmentDialog, setShowNewAccomplishmentDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [newAccomplishmentData, setNewAccomplishmentData] = useState({
    title: '',
    description: '',
    timeTaken: 0,
    challenges: '',
    comments: '',
  });

  const handleCreateAccomplishment = () => {
    if (!newAccomplishmentData.title.trim()) return;

    addAccomplishment(newAccomplishmentData);
    setNewAccomplishmentData({
      title: '',
      description: '',
      timeTaken: 0,
      challenges: '',
      comments: '',
    });
    setShowNewAccomplishmentDialog(false);
  };

  const handleEditAccomplishment = (accomplishment: Accomplishment) => {
    setEditingId(accomplishment.taskId);
  };

  const handleSaveAccomplishment = (id: string, data: Partial<Accomplishment>) => {
    updateAccomplishment(id, data);
    setEditingId(null);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Accomplishments</h2>
              <p className="text-sm text-muted-foreground">
                Track your wins and learn from your journey
              </p>
            </div>
          </div>

          <Dialog open={showNewAccomplishmentDialog} onOpenChange={setShowNewAccomplishmentDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Accomplishment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Accomplishment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={newAccomplishmentData.title}
                    onChange={(e) => setNewAccomplishmentData({ ...newAccomplishmentData, title: e.target.value })}
                    placeholder="What did you accomplish?"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newAccomplishmentData.description}
                    onChange={(e) => setNewAccomplishmentData({ ...newAccomplishmentData, description: e.target.value })}
                    placeholder="Describe what you achieved"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Time Taken (minutes)</label>
                  <Input
                    type="number"
                    value={newAccomplishmentData.timeTaken}
                    onChange={(e) => setNewAccomplishmentData({ ...newAccomplishmentData, timeTaken: parseInt(e.target.value) || 0 })}
                    placeholder="How long did it take?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Challenges</label>
                  <Textarea
                    value={newAccomplishmentData.challenges}
                    onChange={(e) => setNewAccomplishmentData({ ...newAccomplishmentData, challenges: e.target.value })}
                    placeholder="What obstacles did you overcome?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Comments & Follow-ups</label>
                  <Textarea
                    value={newAccomplishmentData.comments}
                    onChange={(e) => setNewAccomplishmentData({ ...newAccomplishmentData, comments: e.target.value })}
                    placeholder="Any thoughts for next time?"
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewAccomplishmentDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateAccomplishment}
                    disabled={!newAccomplishmentData.title.trim()}
                  >
                    Add Accomplishment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Accomplishments List */}
      <div className="space-y-4">
        {accomplishments.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No accomplishments yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete some tasks or add manual accomplishments to get started!
            </p>
            <Button onClick={() => setShowNewAccomplishmentDialog(true)} variant="outline">
              Add Your First Accomplishment
            </Button>
          </Card>
        ) : (
          accomplishments.map((accomplishment) => (
            <AccomplishmentCard
              key={accomplishment.id}
              accomplishment={accomplishment}
              isEditing={editingId === accomplishment.id}
              isExpanded={expandedCards.has(accomplishment.id)}
              onEdit={() => handleEditAccomplishment(accomplishment)}
              onSave={(data) => handleSaveAccomplishment(accomplishment.id, data)}
              onCancel={() => setEditingId(null)}
              onToggleExpanded={() => toggleExpanded(accomplishment.id)}
              formatTime={formatTime}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface AccomplishmentCardProps {
  accomplishment: Accomplishment;
  isEditing: boolean;
  isExpanded: boolean;
  onEdit: () => void;
  onSave: (data: Partial<Accomplishment>) => void;
  onCancel: () => void;
  onToggleExpanded: () => void;
  formatTime: (minutes: number) => string;
}

const AccomplishmentCard: React.FC<AccomplishmentCardProps> = ({
  accomplishment,
  isEditing,
  isExpanded,
  onEdit,
  onSave,
  onCancel,
  onToggleExpanded,
  formatTime
}) => {
  const [editData, setEditData] = useState({
    title: accomplishment.title,
    description: accomplishment.description || '',
    timeTaken: accomplishment.timeTaken || 0,
    challenges: accomplishment.challenges || '',
    comments: accomplishment.comments || '',
  });

  const handleSave = () => {
    onSave(editData);
  };

  const hasExtendedContent = accomplishment.challenges || accomplishment.comments || accomplishment.attachments?.length;

  return (
    <Card className="p-6 border-l-4 border-l-completed bg-completed-bg/30 hover:shadow-medium transition-all duration-300 animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Trophy className="h-5 w-5 text-completed mt-0.5" />
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="font-semibold text-lg"
                />
              ) : (
                <h3 className="font-semibold text-lg text-foreground">{accomplishment.title}</h3>
              )}
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{format(accomplishment.timeTaken, 'MMM d, yyyy • h:mm a')}</span>
                {accomplishment.timeTaken && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(accomplishment.timeTaken)}</span>
                  </div>
                )}
                {accomplishment.taskId && (
                  <Badge variant="outline" className="text-xs">
                    From Task
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={handleSave}>
                  <Save className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={onEdit}>
                  <Edit2 className="h-3 w-3" />
                </Button>
                {hasExtendedContent && (
                  <Button size="sm" variant="ghost" onClick={onToggleExpanded}>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {(accomplishment.description || isEditing) && (
          <div>
            {isEditing ? (
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Describe the accomplishment"
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-muted-foreground">{accomplishment.description}</p>
            )}
          </div>
        )}

        {/* Extended Content */}
        {(isExpanded || isEditing) && (
          <div className="space-y-4 pt-2 border-t">
            {isEditing && (
              <div>
                <label className="text-sm font-medium">Time Taken (minutes)</label>
                <Input
                  type="number"
                  value={editData.timeTaken}
                  onChange={(e) => setEditData({ ...editData, timeTaken: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            )}

            {(accomplishment.challenges || isEditing) && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Challenges</h4>
                {isEditing ? (
                  <Textarea
                    value={editData.challenges}
                    onChange={(e) => setEditData({ ...editData, challenges: e.target.value })}
                    placeholder="What obstacles did you overcome?"
                    className="min-h-[60px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{accomplishment.challenges}</p>
                )}
              </div>
            )}

            {(accomplishment.comments || isEditing) && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Comments & Follow-ups</h4>
                {isEditing ? (
                  <Textarea
                    value={editData.comments}
                    onChange={(e) => setEditData({ ...editData, comments: e.target.value })}
                    placeholder="Any thoughts for next time?"
                    className="min-h-[60px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{accomplishment.comments}</p>
                )}
              </div>
            )}

            {accomplishment.attachments && accomplishment.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Attachments</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accomplishment.attachments.map((attachment) => (
                    <Card key={attachment.title} className="p-3 bg-background">
                      <div className="flex items-center gap-2">
                        {attachment.type === 'pull_request' && <ExternalLink className="h-4 w-4 text-primary" />}
                        {attachment.type === 'screenshot' && <Image className="h-4 w-4 text-primary" />}
                        {attachment.type === 'document' && <FileText className="h-4 w-4 text-primary" />}
                        <span className="text-sm font-medium">{attachment.title}</span>
                        {attachment.url && (
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};