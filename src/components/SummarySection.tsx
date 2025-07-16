import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns';
import { DateRangePicker } from './DateRangePicker';
import { ExportOptions } from './ExportOptions';
import { getSummaryTable } from '@/api/summaryTable';

export interface SummaryData {
  deliveryDetails: string;
  accomplishments: string;
  approach: string;
}

export const SummarySection: React.FC = () => {

  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();


  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setIsLoading(true);
      getSummaryTable(dateRange.from.toISOString().split('T')[0], dateRange.to.toISOString().split('T')[0]).then(setSummaryData).finally(() => setIsLoading(false));
    }
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Summary</h2>
            <p className="text-sm text-muted-foreground">AI-generated weekly delivery insights</p>
          </div>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-semibold">Delivery Details</th>
                <th className="px-4 py-2 font-semibold">Highlights of Accomplishments</th>
                <th className="px-4 py-2 font-semibold">Approach / Solution</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton loading state
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2"><Skeleton className="h-4 w-full" /></td>
                    <td className="px-4 py-2"><Skeleton className="h-4 w-full" /></td>
                    <td className="px-4 py-2"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : summaryData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted-foreground py-6">
                    No summary data available for the selected range
                  </td>
                </tr>
              ) : (
                summaryData.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{row.deliveryDetails}</td>
                    <td className="px-4 py-2">{row.accomplishments}</td>
                    <td className="px-4 py-2">{row.approach}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {summaryData.length > 0 && !isLoading && (
        <div className="flex justify-center mt-4">
          <ExportOptions summaryData={summaryData} />
        </div>
      )}
    </div>
  );
};
