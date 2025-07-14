import React from 'react';
import { useFocusBoard } from '@/contexts/FocusBoardContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = {
  planned: 'hsl(var(--planned))',
  inProgress: 'hsl(var(--in-progress))',
  completed: 'hsl(var(--completed))',
  discarded: 'hsl(var(--discarded))',
};

export const StatusDashboard: React.FC = () => {
  const { tasks, getStats } = useFocusBoard();
  const stats = getStats();

  const taskDistributionData = [
    { name: 'Planned', value: stats.plannedTasks, color: COLORS.planned },
    { name: 'In Progress', value: stats.inProgressTasks, color: COLORS.inProgress },
    { name: 'Completed', value: stats.completedTasks, color: COLORS.completed },
    { name: 'Discarded', value: stats.discardedTasks, color: COLORS.discarded },
  ].filter(item => item.value > 0);

  const timeComparisonData = [
    {
      name: 'Estimated vs Actual',
      estimated: stats.totalEstimatedMinutes,
      actual: stats.totalActualMinutes,
    }
  ];

  const weeklyData = [
    { day: 'Mon', completed: 3, planned: 5 },
    { day: 'Tue', completed: 4, planned: 6 },
    { day: 'Wed', completed: 2, planned: 4 },
    { day: 'Thu', completed: 5, planned: 5 },
    { day: 'Fri', completed: 4, planned: 6 },
    { day: 'Sat', completed: 2, planned: 3 },
    { day: 'Sun', completed: 1, planned: 2 },
  ];

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
        <div className="flex items-center gap-3">
          <BarChart className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Status Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Visual overview of your productivity metrics
            </p>
          </div>
        </div>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Completion Rate"
          value={`${Math.round(stats.completionRate)}%`}
          icon={Target}
          color="primary"
          progress={stats.completionRate}
        />
        <MetricCard
          title="Total Time"
          value={formatTime(stats.totalActualMinutes || stats.totalEstimatedMinutes)}
          icon={Clock}
          color="in-progress"
          subtitle={stats.totalActualMinutes ? `Est: ${formatTime(stats.totalEstimatedMinutes)}` : 'Estimated'}
        />
        <MetricCard
          title="Completed Today"
          value={stats.completedTasks.toString()}
          icon={CheckCircle2}
          color="completed"
          subtitle={`of ${tasks.length} total tasks`}
        />
        <MetricCard
          title="Active Tasks"
          value={(stats.plannedTasks + stats.inProgressTasks).toString()}
          icon={AlertCircle}
          color="in-progress"
          subtitle={`${stats.plannedTasks} planned, ${stats.inProgressTasks} active`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Task Distribution
          </h3>
          {taskDistributionData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {taskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tasks to display</p>
              </div>
            </div>
          )}
        </Card>

        {/* Time Comparison Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracking
          </h3>
          {stats.totalEstimatedMinutes > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatTime(value)} />
                  <Bar dataKey="estimated" fill={COLORS.planned} name="Estimated" />
                  <Bar dataKey="actual" fill={COLORS.completed} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-planned rounded" />
                  <span className="text-sm">Estimated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-completed rounded" />
                  <span className="text-sm">Actual</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No time data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Weekly Productivity Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Area 
                type="monotone" 
                dataKey="planned" 
                stackId="1" 
                stroke={COLORS.planned} 
                fill={COLORS.planned}
                fillOpacity={0.3}
                name="Planned"
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stackId="2" 
                stroke={COLORS.completed} 
                fill={COLORS.completed}
                fillOpacity={0.8}
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-planned rounded opacity-50" />
              <span className="text-sm">Planned Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-completed rounded" />
              <span className="text-sm">Completed Tasks</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'completed' | 'in-progress' | 'planned';
  subtitle?: string;
  progress?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle, 
  progress 
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    completed: 'text-completed bg-completed/10',
    'in-progress': 'text-in-progress bg-in-progress/10',
    planned: 'text-planned bg-planned/10',
  };

  return (
    <Card className="p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {progress !== undefined && (
            <Progress value={progress} className="mt-2 h-2" />
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          colorClasses[color]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};