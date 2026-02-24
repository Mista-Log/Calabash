"use client";

import * as React from "react";
<<<<<<< HEAD
import { useCalendarStore, CalendarEvent } from "@/store/useCalendarStore";
import { isBefore, startOfDay } from "date-fns";

interface CalendarDayProps {
  day: number | null;
  dayDate: Date;
=======
import { CalendarEvent } from "@/store/useCalendarStore";

interface CalendarDayProps {
  day: number | null;
>>>>>>> origin/main
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  onClick: () => void;
}

<<<<<<< HEAD
const CATEGORY_STYLES: Record<
  string,
  { chip: string; text: string; dot: string; border: string }
> = {
  Exam: {
    chip: "bg-[color:var(--md-sys-color-error-container)]",
    text: "text-[color:var(--md-sys-color-on-error-container)]",
    dot: "bg-[color:var(--md-sys-color-error)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
  },
  Lecture: {
    chip: "bg-[color:var(--md-sys-color-primary-container)]",
    text: "text-[color:var(--md-sys-color-on-primary-container)]",
    dot: "bg-[color:var(--md-sys-color-primary)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
  },
  Deadline: {
    chip: "bg-[color:var(--md-sys-color-tertiary-container)]",
    text: "text-[color:var(--md-sys-color-on-tertiary-container)]",
    dot: "bg-[color:var(--md-sys-color-tertiary)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
  },
  Holiday: {
    chip: "bg-[color:var(--md-sys-color-secondary-container)]",
    text: "text-[color:var(--md-sys-color-on-secondary-container)]",
    dot: "bg-[color:var(--md-sys-color-secondary)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
  },
  Other: {
    chip: "bg-[color:var(--md-sys-color-surface-container-high)]",
    text: "text-[color:var(--md-sys-color-on-surface)]",
    dot: "bg-[color:var(--md-sys-color-on-surface-variant)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
  },
=======
const CATEGORY_COLORS: Record<string, string> = {
  Exam: "bg-red-500",
  Lecture: "bg-indigo-500",
  Deadline: "bg-orange-500",
  Holiday: "bg-green-500",
  Other: "bg-slate-500",
>>>>>>> origin/main
};

export function CalendarDay({
  day,
<<<<<<< HEAD
  dayDate,
=======
>>>>>>> origin/main
  isToday,
  isSelected,
  isCurrentMonth,
  events,
  onClick,
}: CalendarDayProps) {
<<<<<<< HEAD
  const { setEditingEventId } = useCalendarStore();
  const todayStart = startOfDay(new Date());
  const dayStart = startOfDay(dayDate);
  const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
  const isPastDay = isCurrentMonth && isBefore(dayStart, todayStart) && !isToday;

  const baseSurfaceClass = !isCurrentMonth
    ? "bg-[color:var(--md-sys-color-surface-container)] opacity-60 cursor-default"
    : isSelected
      ? "bg-[color:var(--md-sys-color-primary-container)] ring-2 ring-inset ring-[color:var(--md-sys-color-primary)]"
      : isToday
        ? "bg-[color:var(--md-sys-color-secondary-container)]"
        : isPastDay
          ? "bg-[color:var(--md-sys-color-surface-container-low)]"
          : isWeekend
            ? "bg-[color:var(--md-sys-color-surface-container-lowest)]"
            : "bg-[color:var(--md-sys-color-surface)]";

  const hoverClass =
    isCurrentMonth && !isSelected
      ? "hover:bg-[color:var(--md-sys-color-surface-container-high)]"
      : "";

  return (
    <div
      onClick={day ? onClick : undefined}
      className={`group relative min-h-[132px] cursor-pointer border-r border-b border-[color:var(--md-sys-color-outline-variant)] p-3 transition-colors [&:nth-child(7n)]:border-r-0 ${baseSurfaceClass} ${hoverClass}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`text-[13px] font-semibold transition-colors ${
            !isCurrentMonth
              ? "text-[color:var(--md-sys-color-on-surface-variant)]/60"
              : isSelected
                ? "text-[color:var(--md-sys-color-primary)]"
                : isToday
              ? "flex size-8 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]"
              : isPastDay
                ? "text-[color:var(--md-sys-color-on-surface-variant)]"
              : "text-[color:var(--md-sys-color-on-surface-variant)] group-hover:text-[color:var(--md-sys-color-on-surface)]"
=======
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
>>>>>>> origin/main
          }`}
        >
          {day}
        </span>
<<<<<<< HEAD
        {events.length > 0 && isCurrentMonth && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              isSelected || isToday
                ? "bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]"
                : "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)]"
            }`}
          >
            {events.length}
          </span>
        )}
=======
>>>>>>> origin/main
      </div>

      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
<<<<<<< HEAD
            onClick={(e) => {
              e.stopPropagation();
              setEditingEventId(event.id);
            }}
            className={`flex items-center gap-2 truncate rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors hover:border-[color:var(--md-sys-color-primary)] ${
              (CATEGORY_STYLES[event.category] || CATEGORY_STYLES.Other).chip
            } ${(CATEGORY_STYLES[event.category] || CATEGORY_STYLES.Other).text} ${
              (CATEGORY_STYLES[event.category] || CATEGORY_STYLES.Other).border
            }`}
          >
            <span
              className={`size-2 shrink-0 rounded-full ${(CATEGORY_STYLES[event.category] || CATEGORY_STYLES.Other).dot}`}
            />
            <span className="truncate">{event.title}</span>
          </div>
        ))}
        {events.length > 3 && (
          <div className="pl-1 text-[11px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
=======
            className={`p-1.5 rounded-lg ${CATEGORY_COLORS[event.category] || "bg-slate-500"}/10 border-l-2 ${CATEGORY_COLORS[event.category] || "bg-slate-500"} text-xs font-bold ${(
              CATEGORY_COLORS[event.category] || "bg-slate-500"
            ).replace("bg-", "text-")} truncate`}
          >
            {event.title}
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-[9px] font-black text-muted-foreground/60 pl-1 uppercase tracking-tighter">
>>>>>>> origin/main
            + {events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
