import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventCategory = 'Exam' | 'Lecture' | 'Deadline' | 'Holiday' | 'Other';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO string
    startTime: string;
    endTime: string;
    category: EventCategory;
    courseId?: string;
}

interface CalendarState {
    events: CalendarEvent[];
    viewDate: string; // ISO string (usually first of the month)
    selectedDate: string | null;
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    removeEvent: (id: string) => void;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
    setViewDate: (date: string) => void;
    setSelectedDate: (date: string | null) => void;
}

// Initial mock data
const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: 'DB Project Due',
        date: '2025-02-13',
        startTime: '23:59',
        endTime: '23:59',
        category: 'Deadline',
        courseId: 'db-101'
    },
    {
        id: '2',
        title: 'CSC Session',
        date: '2025-02-15',
        startTime: '10:00',
        endTime: '12:00',
        category: 'Lecture',
        courseId: 'csc-202'
    },
    {
        id: '3',
        title: 'Midterm Exam',
        date: '2025-02-20',
        startTime: '09:00',
        endTime: '11:00',
        category: 'Exam',
    }
];

export const useCalendarStore = create<CalendarState>()(
    persist(
        (set) => ({
            events: INITIAL_EVENTS,
            viewDate: new Date(2025, 1, 1).toISOString(), // Start at Feb 2025 as per current UI
            selectedDate: null,

            addEvent: (event) => set((state) => ({
                events: [...state.events, { ...event, id: Math.random().toString(36).substring(7) }]
            })),

            removeEvent: (id) => set((state) => ({
                events: state.events.filter((e) => e.id !== id)
            })),

            updateEvent: (id, updates) => set((state) => ({
                events: state.events.map((e) => e.id === id ? { ...e, ...updates } : e)
            })),

            setViewDate: (date) => set({ viewDate: date }),

            setSelectedDate: (date) => set({ selectedDate: date }),
        }),
        {
            name: 'calabash-calendar-storage',
        }
    )
);
