import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns';
import { DateRangePicker } from './DateRangePicker';
import { ExportOptions } from './ExportOptions';

export const SummarySection: React.FC = () => {
  const dummySummaryData = [
    {
      date: '2025-07-14',
      deliveryDetails: 'Completed task "User Authentication Flow"',
      accomplishments: 'Implemented secure login with JWT, refresh tokens, and role-based access',
      approach: 'Used `bcrypt` for hashing passwords, JWT for token management, and middleware for route protection.',
    },
    {
      date: '2025-07-15',
      deliveryDetails: 'Integrated PostgreSQL with Knex.js',
      accomplishments: 'Set up migration & seed files, established DB connection and tested queries',
      approach: 'Used Knex’s query builder pattern for clean and reusable SQL logic across services.',
    },
    {
      date: '2025-07-16',
      deliveryDetails: 'Built API endpoints for Accomplishments module',
      accomplishments: 'Implemented create, delete, and proof upload routes with service-layer logic',
      approach: 'Followed the Controller-Service-Repository pattern to maintain separation of concerns.',
    },
    {
      date: '2025-07-17',
      deliveryDetails: 'Frontend Time Tracking chart integration',
      accomplishments: 'Fetched weekly stats from backend and displayed estimated vs actual time',
      approach: 'Used Recharts `BarChart` and a responsive container layout with fallback UI when data is missing.',
    },
    {
      date: '2025-07-18',
      deliveryDetails: 'Summary Section UI with Date Range Picker',
      accomplishments: 'Created table to show delivery insights and integrated range picker disabling weekends',
      approach: 'Leveraged `react-day-picker` and custom UI components for consistent UX with Tailwind styling.',
    },
  ];

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredData = dateRange?.from && dateRange?.to
    ? dummySummaryData.filter((entry) =>
        isWithinInterval(parseISO(entry.date), {
          start: dateRange.from,
          end: dateRange.to,
        })
      )
    : dummySummaryData;

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
              {!dummySummaryData ? (
                // Skeleton loading state
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2"><Skeleton className="h-4 w-full" /></td>
                    <td className="px-4 py-2"><Skeleton className="h-4 w-full" /></td>
                    <td className="px-4 py-2"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted-foreground py-6">
                    No summary data available for the selected range
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
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
      {dateRange && (
        <div className="flex justify-center mt-4">
          <ExportOptions />
        </div>
      )}
    </div>
  );
};
