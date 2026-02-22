"use client";

import * as React from "react";
import {
  Calendar03Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlusSignIcon,
  FilterIcon,
  Clock01Icon,
  GridIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button, Card, CardContent, SectionHeader } from "@/components/core";
import { CalendarGrid } from "@/components/features/calendar/CalendarGrid";
import { EventModal } from "@/components/features/calendar/EventModal";
import { EventCategory, useCalendarStore } from "@/store/useCalendarStore";
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  compareAsc,
} from "date-fns";
import { FilterModal } from "@/components/features/shared/FilterModal";

export default function CalendarPage() {
  const {
    viewDate,
    setViewDate,
    events,
    eventCategories,
    toggleEventCategory,
    setEditingEventId,
    isEventModalOpen,
    setIsEventModalOpen,
  } = useCalendarStore();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentMonth = new Date(viewDate);
  const categories: {
    name: EventCategory;
    color: string;
    softColor: string;
    label: string;
  }[] = [
    {
      name: "Exam",
      color: "bg-[color:var(--md-sys-color-error)]",
      softColor:
        "bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)] border-[color:var(--md-sys-color-outline-variant)]",
      label: "Assessment",
    },
    {
      name: "Lecture",
      color: "bg-[color:var(--md-sys-color-primary)]",
      softColor:
        "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] border-[color:var(--md-sys-color-outline-variant)]",
      label: "Lectures",
    },
    {
      name: "Deadline",
      color: "bg-[color:var(--md-sys-color-tertiary)]",
      softColor:
        "bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)] border-[color:var(--md-sys-color-outline-variant)]",
      label: "Deadlines",
    },
    {
      name: "Holiday",
      color: "bg-[color:var(--md-sys-color-secondary)]",
      softColor:
        "bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)] border-[color:var(--md-sys-color-outline-variant)]",
      label: "Holidays",
    },
    {
      name: "Other",
      color: "bg-[color:var(--md-sys-color-on-surface-variant)]",
      softColor:
        "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--md-sys-color-outline-variant)]",
      label: "Other",
    },
  ];
  const dayStates = [
    {
      label: "Today",
      swatch:
        "bg-[color:var(--md-sys-color-secondary-container)] border-[color:var(--md-sys-color-primary)]",
    },
    {
      label: "Selected",
      swatch:
        "bg-[color:var(--md-sys-color-primary-container)] border-[color:var(--md-sys-color-primary)]",
    },
    {
      label: "Past",
      swatch:
        "bg-[color:var(--md-sys-color-surface-container-low)] border-[color:var(--md-sys-color-outline-variant)]",
    },
    {
      label: "Default",
      swatch:
        "bg-[color:var(--md-sys-color-surface)] border-[color:var(--md-sys-color-outline-variant)]",
    },
    {
      label: "Outside month",
      swatch:
        "bg-[color:var(--md-sys-color-surface-container)] border-[color:var(--md-sys-color-outline-variant)] opacity-70",
    },
  ];

  const nextMonth = () => setViewDate(addMonths(currentMonth, 1).toISOString());
  const prevMonth = () => setViewDate(subMonths(currentMonth, 1).toISOString());
  const goToToday = () => setViewDate(new Date().toISOString());

  const filteredCurrentMonthEvents = events
    .filter((event) => {
      if (
        eventCategories.length > 0 &&
        !eventCategories.includes(event.category)
      ) {
        return false;
      }
      return isSameMonth(new Date(event.date), currentMonth);
    })
    .sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto max-w-[1360px] space-y-6">
        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                <MaterialSymbol icon={Calendar03Icon} size={22} />
              </div>
              <div>
                <h1 className="text-[28px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)] sm:text-[32px]">
                  Academic Calendar
                </h1>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {format(currentMonth, "MMMM yyyy")} • Semester Planner
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <M3Button onClick={() => setIsEventModalOpen(true)} className="h-10 gap-2 px-4">
                <MaterialSymbol icon={PlusSignIcon} size={18} />
                Add Event
              </M3Button>
              <M3Button variant="outlined" className="h-10 px-4" onClick={goToToday}>
                Today
              </M3Button>
              <div className="flex items-center gap-1 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-1">
                <M3Button size="sm" className="size-9" onClick={prevMonth}>
                  <MaterialSymbol icon={ArrowLeft01Icon} size={18} />
                </M3Button>
                <M3Button size="sm" className="size-9" onClick={nextMonth}>
                  <MaterialSymbol icon={ArrowRight01Icon} size={18} />
                </M3Button>
              </div>
              <M3Button
                variant="outlined"
                onClick={() => setIsFilterOpen(true)}
                className="h-10 gap-2 px-4"
              >
                <MaterialSymbol icon={FilterIcon} size={18} />
                Filter
              </M3Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
            <Card className="rounded-2xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
              <CardContent className="space-y-3 p-4">
                <SectionHeader
                  title="Event Categories"
                  className="mb-1"
                  compact
                  action={<MaterialSymbol icon={GridIcon} size={16} className="text-[color:var(--md-sys-color-primary)]" />}
                />
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-2">
                  {dayStates.map((state) => (
                    <div key={state.label} className="flex items-center gap-2 rounded-lg px-1 py-1">
                      <span className={`h-3 w-3 rounded-sm border ${state.swatch}`} />
                      <span className="text-[11px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                        {state.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => toggleEventCategory(cat.name)}
                      className={`w-full rounded-xl border p-2.5 transition-colors ${
                        eventCategories.includes(cat.name) || eventCategories.length === 0
                          ? `${cat.softColor}`
                          : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface-variant)] opacity-70"
                      }`}
                    >
                      <span className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-2">
                          <span className={`size-2.5 rounded-full ${cat.color}`} />
                          {cat.label}
                        </span>
                        <span className="text-[11px] font-semibold uppercase">
                          {eventCategories.length === 0 || eventCategories.includes(cat.name)
                            ? "On"
                            : "Off"}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
              <CardContent className="space-y-3 p-4">
                <SectionHeader
                  title="Upcoming"
                  className="mb-1"
                  compact
                  action={<MaterialSymbol icon={Clock01Icon} size={16} className="text-[color:var(--md-sys-color-primary)]" />}
                />
                {filteredCurrentMonthEvents.length > 0 ? (
                  <div className="space-y-2">
                    {filteredCurrentMonthEvents.slice(0, 6).map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setEditingEventId(event.id)}
                        className="w-full rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] p-2.5 text-left transition-colors hover:border-[color:var(--md-sys-color-primary)]"
                      >
                        <p className="truncate text-xs font-semibold text-[color:var(--md-sys-color-on-surface)]">
                          {event.title}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--md-sys-color-on-surface-variant)]">
                          {format(new Date(event.date), "EEE, MMM d")} • {event.startTime}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                    No events scheduled this month.
                  </p>
                )}
              </CardContent>
            </Card>
          </aside>

          <div>
            <Card className="overflow-hidden rounded-2xl border-[color:var(--md-sys-color-outline-variant)]">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
                {days.map((day, index) => (
                  <div
                    key={day}
                    className={`border-r border-[color:var(--md-sys-color-outline-variant)] py-3 text-center text-[11px] font-semibold uppercase tracking-[0.15em] last:border-r-0 ${
                      index >= 5
                        ? "text-[color:var(--md-sys-color-primary)]"
                        : "text-[color:var(--md-sys-color-on-surface-variant)]"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <CalendarGrid />
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Events"
        description="Show only specific event categories"
        sections={[
          {
            id: "eventCategories",
            label: "Event Categories",
            type: "checkbox",
            options: [
              { value: "Exam", label: "Assessment" },
              { value: "Lecture", label: "Lectures" },
              { value: "Deadline", label: "Deadlines" },
              { value: "Holiday", label: "Holidays" },
              { value: "Other", label: "Other" },
            ],
            selectedValues: eventCategories,
            onToggle: (value) => toggleEventCategory(value as EventCategory),
          },
        ]}
      />
    </div>
  );
}
