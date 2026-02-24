"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { CalendarDay } from "./CalendarDay";
import { useCalendarStore, CalendarEvent } from "@/store/useCalendarStore";

export function CalendarGrid() {
  const { viewDate, events, setSelectedDate, selectedDate } =
    useCalendarStore();
  const currentMonth = new Date(viewDate);

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start, end });

  const getDayEvents = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="grid grid-cols-7 border-t border-l border-border/10">
      {days.map((day, i) => {
        const isCurrentMonth = isSameMonth(day, currentMonth);
        const isToday = isSameDay(day, new Date());
        const isSelected = selectedDate
          ? isSameDay(day, new Date(selectedDate))
          : false;
        const dayEvents = getDayEvents(day);

        return (
          <CalendarDay
            key={day.toString()}
            day={day.getDate()}
            isToday={isToday}
            isSelected={isSelected}
            isCurrentMonth={isCurrentMonth}
            events={dayEvents}
            onClick={() => setSelectedDate(day.toISOString())}
          />
        );
      })}
    </div>
  );
}
