"use client";

import * as React from "react";
import {
  Calendar03Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlusSignIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button, Card, CardContent } from "@/components/core";
import { CalendarGrid } from "@/components/features/calendar/CalendarGrid";
import { EventModal } from "@/components/features/calendar/EventModal";
import { useCalendarStore } from "@/store/useCalendarStore";
import { format, addMonths, subMonths } from "date-fns";

export default function CalendarPage() {
  const { viewDate, setViewDate } = useCalendarStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentMonth = new Date(viewDate);

  const nextMonth = () => setViewDate(addMonths(currentMonth, 1).toISOString());
  const prevMonth = () => setViewDate(subMonths(currentMonth, 1).toISOString());

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner shadow-primary/10">
              <HugeiconsIcon icon={Calendar03Icon} size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Academic Calendar</h1>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                {format(currentMonth, "MMMM yyyy")}
                <span className="size-1 rounded-full bg-primary/30" />
                University Schedule
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-2xl mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl hover:bg-background shadow-sm transition-all active:scale-95"
                onClick={prevMonth}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl hover:bg-background shadow-sm transition-all active:scale-95"
                onClick={nextMonth}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-primary/25 bg-primary text-primary-foreground font-black active:scale-[0.98] transition-all"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <Card className="border-border/40 overflow-hidden shadow-2xl rounded-3xl group">
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b bg-muted/30 backdrop-blur-sm">
                  {days.map((day) => (
                    <div
                      key={day}
                      className="py-5 text-center text-xs font-black uppercase tracking-[0.15em] text-muted-foreground/80 border-r border-border/10 last:border-0"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <CalendarGrid />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/40 bg-primary/5 rounded-3xl shadow-lg border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150">
                <HugeiconsIcon icon={InformationCircleIcon} size={120} />
              </div>
              <CardContent className="p-6 relative z-10">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-2">
                  Calendar Tips
                </h3>
                <p className="text-xs font-bold leading-relaxed text-muted-foreground">
                  Stay ahead of your academic goals by tracking deadlines,
                  exams, and lecture sessions in one place.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Event Categories
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: "Exams", color: "bg-red-500" },
                  { name: "Lectures", color: "bg-indigo-500" },
                  { name: "Deadlines", color: "bg-orange-500" },
                  { name: "Holidays", color: "bg-green-500" },
                ].map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/5 group hover:border-primary/20 transition-all cursor-default"
                  >
                    <div
                      className={`size-3 rounded-full ${cat.color} group-hover:scale-125 transition-transform`}
                    />
                    <span className="text-xs font-bold">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
