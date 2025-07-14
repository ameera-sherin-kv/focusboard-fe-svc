import React, { useState } from 'react';
import { useFocusBoard } from '@/contexts/FocusBoardContext';
import { TimelineEntry } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  History, 
  Search, 
  Filter,
  Clock,
  Plus,
  Settings,
  CheckCircle2,
  FileText,
  Trophy,
  Trash2,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';

export const TimelineLog: React.FC = () => {
  const { timeline } = useFocusBoard();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'Task Created': Plus,
    'Task Updated': Edit,
    'Task Moved': Settings,
    'Task Deleted': Trash2,
    'Accomplishment Added': Trophy,
    'Accomplishment Updated': Edit,
  };

  const actionColors: Record<string, string> = {
    'Task Created': 'planned',
    'Task Updated': 'in-progress',
    'Task Moved': 'primary',
    'Task Deleted': 'destructive',
    'Accomplishment Added': 'completed',
    'Accomplishment Updated': 'completed',
  };

  const filteredTimeline = timeline.filter(entry => {
    const matchesSearch = entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.action.toLowerCase().includes(filterType);
    return matchesSearch && matchesFilter;
  });

  const groupedTimeline = groupTimelineByDate(filteredTimeline);

  const formatTimelineDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Timeline Log</h2>
              <p className="text-sm text-muted-foreground">
                Chronological history of all your activities
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search timeline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterType === 'task' ? 'default' : 'outline'}
                onClick={() => setFilterType('task')}
              >
                Tasks
              </Button>
              <Button
                size="sm"
                variant={filterType === 'accomplishment' ? 'default' : 'outline'}
                onClick={() => setFilterType('accomplishment')}
              >
                Achievements
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-6">
        {timeline.length === 0 ? (
          <Card className="p-8 text-center">
            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No activity yet</h3>
            <p className="text-muted-foreground">
              Start creating tasks or adding accomplishments to see your timeline!
            </p>
          </Card>
        ) : filteredTimeline.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No matching activities</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </Card>
        ) : (
          Object.entries(groupedTimeline).map(([dateKey, entries]) => (
            <div key={dateKey} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{formatTimelineDate(new Date(dateKey))}</h3>
                <div className="flex-1 h-px bg-border" />
                <Badge variant="secondary" className="text-xs">
                  {entries.length} activities
                </Badge>
              </div>
              
              <div className="space-y-2 pl-4">
                {entries.map((entry) => {
                  const ActionIcon = actionIcons[entry.action] || FileText;
                  const colorClass = actionColors[entry.action] || 'muted-foreground';
                  
                  return (
                    <Card 
                      key={entry.id} 
                      className="p-4 hover:shadow-soft transition-all duration-200 animate-fade-in"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          colorClass === 'destructive' ? 'bg-destructive/10 text-destructive' :
                          colorClass === 'completed' ? 'bg-completed/10 text-completed' :
                          colorClass === 'planned' ? 'bg-planned/10 text-planned' :
                          colorClass === 'in-progress' ? 'bg-in-progress/10 text-in-progress' :
                          colorClass === 'primary' ? 'bg-primary/10 text-primary' :
                          'bg-muted text-muted-foreground'
                        )}>
                          <ActionIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{entry.action}</span>
                            <Badge variant="outline" className="text-xs">
                              {format(entry.timestamp, 'h:mm a')}
                            </Badge>
                          </div>
                          
                          {entry.description && (
                            <p className="text-sm text-muted-foreground">{entry.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function groupTimelineByDate(timeline: TimelineEntry[]) {
  return timeline.reduce((groups, entry) => {
    const dateKey = format(startOfDay(entry.timestamp), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {} as Record<string, TimelineEntry[]>);
}