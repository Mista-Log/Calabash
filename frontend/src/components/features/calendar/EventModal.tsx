<<<<<<< HEAD
﻿"use client";
=======
"use client";
>>>>>>> origin/main

import * as React from "react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Calendar03Icon,
<<<<<<< HEAD
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
=======
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
>>>>>>> origin/main
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
  M3Button,
  Input,
=======
  Button,
  Input,
  Badge,
>>>>>>> origin/main
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
<<<<<<< HEAD
  const {
    selectedDate,
    editingEventId,
    events,
    addEvent,
    updateEvent,
    removeEvent,
    setIsEventModalOpen,
  } = useCalendarStore();
=======
  const { selectedDate, addEvent } = useCalendarStore();
>>>>>>> origin/main
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<EventCategory>("Lecture");
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("10:00");

<<<<<<< HEAD
  const handleClose = React.useCallback(() => {
    setIsEventModalOpen(false);
    setTitle("");
    onClose();
  }, [onClose, setIsEventModalOpen]);

  const editingEvent = React.useMemo(
    () => (editingEventId ? events.find((e) => e.id === editingEventId) : null),
    [editingEventId, events],
  );

  React.useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setCategory(editingEvent.category);
      setStartTime(editingEvent.startTime);
      setEndTime(editingEvent.endTime);
    } else {
      setTitle("");
      setCategory("Lecture");
      setStartTime("09:00");
      setEndTime("10:00");
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!selectedDate && !editingEvent) || !title) return;
    const eventDate = selectedDate ?? editingEvent?.date;
    if (!eventDate) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title,
        category,
        startTime,
        endTime,
      });
    } else {
      addEvent({
        title,
        category,
        date: eventDate,
        startTime,
        endTime,
      });
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingEvent) {
      removeEvent(editingEvent.id);
      handleClose();
    }
  };

  const dateLabel = selectedDate
    ? format(new Date(selectedDate), "MMMM do, yyyy")
    : editingEvent
      ? format(new Date(editingEvent.date), "MMMM do, yyyy")
      : null;

  const handleDialogOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        handleClose();
        return;
      }
      setIsEventModalOpen(true);
    },
    [handleClose, setIsEventModalOpen],
  );

  const formContent = (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[13px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Event Title
          </label>
          <Input
            placeholder="e.g. Midterm Assessment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-black uppercase transition-all ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat === "Exam" ? "Assessment" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[13px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Start Time
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-12 w-full"
              leadingIcon="schedule"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              End Time
            </label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-12 w-full"
              leadingIcon="schedule"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {editingEvent ? (
          <>
            <M3Button
              variant="outlined"
              type="button"
              onClick={handleDelete}
              className="h-11 rounded-2xl border-[color:var(--md-sys-color-error)]/30 text-[color:var(--md-sys-color-error)] font-bold hover:bg-[color:var(--md-sys-color-error-container)]"
            >
              Delete
            </M3Button>
            <M3Button type="submit" className="h-11 rounded-2xl font-bold">
              Update
            </M3Button>
          </>
        ) : (
          <>
            <M3Button
              variant="outlined"
              type="button"
              onClick={handleClose}
              className="h-11 rounded-2xl font-bold border-primary/20"
            >
              Cancel
            </M3Button>
            <M3Button
              type="submit"
              className="h-11 rounded-2xl font-bold gap-2"
            >
              <MaterialSymbol icon={CheckmarkCircle02Icon} size={18} />
              Create Event
            </M3Button>
          </>
        )}
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="calendar-event-dialog w-[min(96vw,40rem)] max-h-[calc(100dvh-2rem)] rounded-3xl overflow-hidden border-none">
        <DialogHeader className="bg-[color:var(--md-sys-color-primary-container)] border-b border-[color:var(--md-sys-color-primary)]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-black">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </DialogTitle>
            <M3Button
              size="sm"
              onClick={handleClose}
              className="rounded-xl size-8"
            >
              <MaterialSymbol icon={Cancel01Icon} size={18} />
            </M3Button>
          </div>
          {dateLabel && (
            <p className="text-[13px] font-bold text-[color:var(--md-sys-color-on-primary-container)] flex items-center gap-1.5 mt-1">
              <MaterialSymbol icon={Calendar03Icon} size={14} />
              {dateLabel}
=======
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
>>>>>>> origin/main
            </p>
          )}
        </DialogHeader>

<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="space-y-6">
          {formContent}
=======
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
>>>>>>> origin/main
        </form>
      </DialogContent>
    </Dialog>
  );
}
