"use client";

import * as React from "react";
import { CalendarEvent } from "@/store/useCalendarStore";

interface CalendarDayProps {
  day: number | null;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  onClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Exam: "bg-red-500",
  Lecture: "bg-indigo-500",
  Deadline: "bg-orange-500",
  Holiday: "bg-green-500",
  Other: "bg-slate-500",
};

export function CalendarDay({
  day,
  isToday,
  isSelected,
  isCurrentMonth,
  events,
  onClick,
}: CalendarDayProps) {
  return (
    <div
      onClick={day ? onClick : undefined}
      className={`group p-3 border-r border-b border-border/10 last:border-r-0 transition-all hover:bg-primary/5 cursor-pointer relative min-h-[120px] ${
        !isCurrentMonth
          ? "bg-muted/5 opacity-30 select-none cursor-default"
          : ""
      } ${isSelected ? "bg-primary/10" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-bold transition-all ${
            isToday
              ? "size-7 flex items-center justify-center bg-primary text-primary-foreground rounded-lg -mt-1 -ml-1 shadow-lg shadow-primary/20"
              : isSelected
                ? "text-primary scale-110"
                : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {day}
        </span>
      </div>

      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className={`p-1.5 rounded-lg ${CATEGORY_COLORS[event.category] || "bg-slate-500"}/10 border-l-2 ${CATEGORY_COLORS[event.category] || "bg-slate-500"} text-xs font-bold ${(
              CATEGORY_COLORS[event.category] || "bg-slate-500"
            ).replace("bg-", "text-")} truncate`}
          >
            {event.title}
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-[9px] font-black text-muted-foreground/60 pl-1 uppercase tracking-tighter">
            + {events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
