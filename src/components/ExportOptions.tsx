import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SummaryData } from './SummarySection';

// const summaryData: SummaryData[] = [
//   {
//     deliveryDetails: 'API built for time tracking',
//     accomplishments: 'Endpoints created for tasks and accomplishments',
//     approach: 'Used RESTful design with controller-service-repository pattern',
//   },
//   {
//     deliveryDetails: 'Daily summary export feature',
//     accomplishments: 'Implemented export to CSV and PDF',
//     approach: 'Used Blob for CSV and window.print() for PDF generation',
//   },
// ];

export const ExportOptions: React.FC<{ summaryData: SummaryData[] }> = ({ summaryData }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const csvData = [
        ['Delivery Details', 'Highlights of Accomplishments', 'Approach / Solution (AI-generated)'],
        ...summaryData.map(entry => [
          entry.deliveryDetails,
          entry.accomplishments,
          entry.approach
        ]),
      ];

      const csvContent = csvData.map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `summary-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export successful',
        description: 'Your summary has been exported to CSV.',
      });
    } catch {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting the summary.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    try {
      const htmlContent = `
        <html>
          <head>
            <title>Summary Export</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                color: #333;
              }
              h1 {
                text-align: center;
                color: #1e40af;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 30px;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #f1f5f9;
              }
              @media print {
                body {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <h1>Summary Report</h1>
            <table>
              <thead>
                <tr>
                  <th>Delivery Details</th>
                  <th>Highlights of Accomplishments</th>
                  <th>Approach / Solution (AI-generated)</th>
                </tr>
              </thead>
              <tbody>
                ${summaryData.map(entry => `
                  <tr>
                    <td>${entry.deliveryDetails}</td>
                    <td>${entry.accomplishments}</td>
                    <td>${entry.approach}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error('Popup blocked');

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

      toast({
        title: 'PDF export ready',
        description: 'Your summary is ready to print or save.',
      });
    } catch {
      toast({
        title: 'Export failed',
        description: 'There was an error generating the PDF.',
        variant: 'destructive',
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
            <h3 className="font-semibold text-sm mb-2">Export Summary</h3>
            <p className="text-xs text-muted-foreground">
              Download your selected summary table
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
                  Use with spreadsheets
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
                  Printable formatted report
                </div>
              </div>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
