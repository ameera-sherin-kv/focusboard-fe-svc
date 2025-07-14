import React, { useState } from 'react';
import { useFocusBoard } from '@/contexts/FocusBoardContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Download, 
  FileText, 
  FileSpreadsheet,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export const ExportOptions: React.FC = () => {
  const { tasks, accomplishments, getStats, selectedDate } = useFocusBoard();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const stats = getStats();
      const csvData = [
        ['FocusBoard Export', format(selectedDate, 'MMMM d, yyyy')],
        [''],
        ['Summary Statistics'],
        ['Total Tasks', tasks.length],
        ['Planned', stats.plannedTasks],
        ['In Progress', stats.inProgressTasks],
        ['Completed', stats.completedTasks],
        ['Discarded', stats.discardedTasks],
        ['Completion Rate', `${Math.round(stats.completionRate)}%`],
        ['Total Estimated Time (minutes)', stats.totalEstimatedMinutes],
        ['Total Actual Time (minutes)', stats.totalActualMinutes],
        [''],
        ['Tasks'],
        ['Title', 'Status', 'Priority', 'Estimated (min)', 'Actual (min)', 'Created', 'Completed'],
        ...tasks.map(task => [
          task.title,
          task.status,
          task.priority,
          task.estimatedMinutes,
          task.actualMinutes || '',
          format(task.createdAt, 'yyyy-MM-dd HH:mm'),
          task.completedAt ? format(task.completedAt, 'yyyy-MM-dd HH:mm') : ''
        ]),
        [''],
        ['Accomplishments'],
        ['Title', 'Description', 'Time Taken (min)', 'Challenges', 'Comments', 'Created'],
        ...accomplishments.map(acc => [
          acc.title,
          acc.description || '',
          acc.timeTaken || '',
          acc.challenges || '',
          acc.comments || '',
          format(acc.createdAt, 'yyyy-MM-dd HH:mm')
        ])
      ];

      const csvContent = csvData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `focusboard-export-${format(selectedDate, 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: "Your data has been exported to CSV format.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const stats = getStats();
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>FocusBoard Report - ${format(selectedDate, 'MMMM d, yyyy')}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px 20px; 
              line-height: 1.6; 
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #e2e8f0; 
              padding-bottom: 20px; 
            }
            .header h1 { 
              color: #1e40af; 
              margin: 0 0 10px 0; 
              font-size: 2.5rem; 
            }
            .header p { 
              color: #64748b; 
              font-size: 1.1rem; 
              margin: 0; 
            }
            .section { 
              margin: 40px 0; 
            }
            .section h2 { 
              color: #1e40af; 
              border-bottom: 1px solid #e2e8f0; 
              padding-bottom: 10px; 
            }
            .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
              margin: 20px 0; 
            }
            .stat-card { 
              background: #f8fafc; 
              padding: 20px; 
              border-radius: 8px; 
              text-align: center; 
            }
            .stat-value { 
              font-size: 2rem; 
              font-weight: bold; 
              color: #1e40af; 
            }
            .stat-label { 
              color: #64748b; 
              margin-top: 5px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              border: 1px solid #e2e8f0; 
              padding: 12px; 
              text-align: left; 
            }
            th { 
              background: #f1f5f9; 
              font-weight: 600; 
              color: #1e40af; 
            }
            .status-badge { 
              padding: 4px 8px; 
              border-radius: 4px; 
              font-size: 0.75rem; 
              font-weight: 500; 
            }
            .status-planned { background: #fef3c7; color: #92400e; }
            .status-in-progress { background: #fef3c7; color: #92400e; }
            .status-completed { background: #d1fae5; color: #065f46; }
            .status-discarded { background: #fecaca; color: #991b1b; }
            .priority-high { color: #dc2626; font-weight: 600; }
            .priority-medium { color: #d97706; font-weight: 500; }
            .priority-low { color: #059669; font-weight: 500; }
            @media print {
              body { margin: 0; padding: 20px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 FocusBoard Report</h1>
            <p>${format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
          </div>

          <div class="section">
            <h2>📊 Summary Statistics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${stats.completedTasks}</div>
                <div class="stat-label">Completed Tasks</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.round(stats.completionRate)}%</div>
                <div class="stat-label">Completion Rate</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.floor(stats.totalEstimatedMinutes / 60)}h ${stats.totalEstimatedMinutes % 60}m</div>
                <div class="stat-label">Estimated Time</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.floor((stats.totalActualMinutes || 0) / 60)}h ${(stats.totalActualMinutes || 0) % 60}m</div>
                <div class="stat-label">Actual Time</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>📋 Tasks</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Time</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                ${tasks.map(task => `
                  <tr>
                    <td>${task.title}</td>
                    <td><span class="status-badge status-${task.status}">${task.status}</span></td>
                    <td><span class="priority-${task.priority}">${task.priority}</span></td>
                    <td>${task.actualMinutes ? `${task.actualMinutes}m` : `${task.estimatedMinutes}m (est)`}</td>
                    <td>${format(task.createdAt, 'MMM d, h:mm a')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>🏆 Accomplishments</h2>
            ${accomplishments.length === 0 ? '<p>No accomplishments recorded.</p>' : `
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Time Taken</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  ${accomplishments.map(acc => `
                    <tr>
                      <td>${acc.title}</td>
                      <td>${acc.description || '-'}</td>
                      <td>${acc.timeTaken ? `${acc.timeTaken}m` : '-'}</td>
                      <td>${format(acc.createdAt, 'MMM d, h:mm a')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>

          <div style="margin-top: 60px; text-align: center; color: #64748b; font-size: 0.875rem;">
            Generated by FocusBoard on ${format(new Date(), 'MMMM d, yyyy • h:mm a')}
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

      toast({
        title: "PDF export ready",
        description: "Your report is ready for printing or saving as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating your PDF report.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Export Options</h3>
            <p className="text-xs text-muted-foreground">
              Download your productivity data in different formats
            </p>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={isExporting}
              className="w-full justify-start gap-3"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Export as CSV</div>
                <div className="text-xs text-muted-foreground">
                  For spreadsheet analysis
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={isExporting}
              className="w-full justify-start gap-3"
            >
              <FileText className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-muted-foreground">
                  Formatted report for sharing
                </div>
              </div>
            </Button>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Date: {format(selectedDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{tasks.length} tasks, {accomplishments.length} accomplishments</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};