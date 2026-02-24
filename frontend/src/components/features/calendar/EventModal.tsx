"use client";

import * as React from "react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Calendar03Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Badge,
} from "@/components/core";
import { useCalendarStore, EventCategory } from "@/store/useCalendarStore";
import { format } from "date-fns";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: EventCategory[] = [
  "Lecture",
  "Exam",
  "Deadline",
  "Holiday",
  "Other",
];

export function EventModal({ isOpen, onClose }: EventModalProps) {
  const { selectedDate, addEvent } = useCalendarStore();
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<EventCategory>("Lecture");
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("10:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !title) return;

    addEvent({
      title,
      category,
      date: selectedDate,
      startTime,
      endTime,
    });

    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-black">
              Add New Event
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl size-8"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </div>
          {selectedDate && (
            <p className="text-xs font-bold text-primary flex items-center gap-1.5 mt-1">
              <HugeiconsIcon icon={Calendar03Icon} size={14} />
              {format(new Date(selectedDate), "MMMM do, yyyy")}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Event Title
              </label>
              <Input
                placeholder="e.g. Midterm Exam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-base font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                      category === cat
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Start Time
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/30 border-none pl-10 font-bold"
                  />
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  End Time
                </label>
                <div className="relative">
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/30 border-none pl-10 font-bold"
                  />
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl font-bold border-primary/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 gap-2"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
