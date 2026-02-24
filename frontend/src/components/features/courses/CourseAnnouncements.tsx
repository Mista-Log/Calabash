"use client";

import * as React from "react";
import {
  MegaphoneIcon,
  Calendar01Icon,
  CircleIcon,
  InformationCircleIcon,
  UserAccountIcon,
  ArrowRight01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, Button, Badge } from "@/components/core";
import { motion } from "framer-motion";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "urgent" | "general" | "update";
  author: string;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule",
    content:
      "The mid-semester examination will take place on March 15th at Hall A. Please ensure you bring your student ID and a scientific calculator. The coverage includes Lectures 1-6.",
    date: "March 1, 2026",
    type: "urgent",
    author: "Dr. Robert Smith",
  },
  {
    id: "2",
    title: "Reading Materials for Week 5",
    content:
      "Additional reading materials on Quantum Effects have been uploaded to the Digital Library. Please review them before Wednesday's lecture.",
    date: "Feb 25, 2026",
    type: "update",
    author: "Dr. Robert Smith",
  },
  {
    id: "3",
    title: "Change in Tutorial Times",
    content:
      "Due to departmental meetings, Thursday's tutorial sessions will be moved from 10 AM to 2 PM. Please check your personalized calendar for the updated room number.",
    date: "Feb 20, 2026",
    type: "general",
    author: "Admin Office",
  },
];

export function CourseAnnouncements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
          <p className="text-sm text-muted-foreground">
            Keep track of important course updates and notices.
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <HugeiconsIcon icon={Notification01Icon} size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((ann, i) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`overflow-hidden border-muted/10 hover:shadow-md transition-all ${ann.type === "urgent" ? "border-l-4 border-l-red-500" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`
                        text-xs font-black uppercase tracking-widest border-none
                        ${
                          ann.type === "urgent"
                            ? "bg-red-500/10 text-red-600"
                            : ann.type === "update"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-muted/10 text-muted-foreground"
                        }
                      `}
                      >
                        {ann.type}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                        <HugeiconsIcon icon={Calendar01Icon} size={12} />
                        {ann.date}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {ann.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed italic pr-10">
                        "{ann.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                        <HugeiconsIcon
                          icon={UserAccountIcon}
                          size={14}
                          className="text-accent-foreground"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-foreground">
                          Posted by
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground">
                          {ann.author}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="h-10 rounded-xl gap-2 font-bold px-6 shrink-0 md:self-center"
                  >
                    Read More
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
