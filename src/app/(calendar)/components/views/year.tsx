"use client";

import type { CalendarEvent } from "../../types";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthSelect: (monthIndex: number) => void;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nodav", "Dec"
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function YearView({ currentDate, events, onMonthSelect }: YearViewProps) {
  const year = currentDate.getFullYear(); 

  const hasEvents = (date: Date) => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date(2026, 1, 1);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const renderMonth = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, monthIndex, i));
    }

    return (
      <button
        key={monthIndex}
        onClick={() => onMonthSelect(monthIndex)}
        className="p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
      >
        <h3 className="text-sm font-semibold text-foreground mb-2">
          {MONTHS[monthIndex]}
        </h3>
        <div className="grid grid-cols-7 gap-0.5">
          {DAYS.map((day, i) => (
            <div
              key={i}
              className="w-6 h-5 flex items-center justify-center text-[10px] text-muted-foreground font-medium"
            >
              {day}
            </div>
          ))}
          {days.map((date, index) => (
            <div
              key={index}
              className={`w-6 h-6 flex items-center justify-center text-[10px] rounded ${
                date
                  ? isToday(date)
                    ? "bg-foreground text-background font-bold"
                    : hasEvents(date)
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground"
                  : ""
              }`}
            >
              {date?.getDate()}
            </div>
          ))}
        </div>
      </button>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-2 max-w-4xl mx-auto">
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>
    </div>
  );
}
