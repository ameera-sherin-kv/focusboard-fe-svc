import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, setDateRange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[260px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'MMM dd')} – {format(dateRange.to, 'MMM dd')}
              </>
            ) : (
              format(dateRange.from, 'MMM dd')
            )
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          disabled={(date) => {
            const day = date.getDay();
            return day === 0 || day === 6; // Disable Sundays (0) and Saturdays (6)
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
