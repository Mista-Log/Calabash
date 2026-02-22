"use client";

import * as React from "react";
import {
  Calendar01Icon,
  UserAccountIcon,
  ArrowRight01Icon,
  Notification01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Card, CardContent, M3Button, Badge } from "@/components/core";
import { motion } from "@/lib/motion-foundations";

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
          <h2 className="text-[24px] font-bold tracking-tight">
            Announcements
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Keep track of important course updates and notices.
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <MaterialSymbol icon={Notification01Icon} size={20} />
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
              className={`overflow-hidden border-muted/10 transition-colors hover:bg-[color:var(--md-sys-color-surface-container-low)] ${ann.type === "urgent" ? "border-l-4 border-l-[color:var(--md-sys-color-error)]" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`
                        text-[13px] font-black uppercase tracking-widest border-none
                        ${
                          ann.type === "urgent"
                            ? "bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)]"
                            : ann.type === "update"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted/10 text-muted-foreground"
                        }
                      `}
                      >
                        {ann.type}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        <MaterialSymbol icon={Calendar01Icon} size={12} />
                        {ann.date}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-[18px] font-bold text-foreground">
                        {ann.title}
                      </h3>
                      <p className="text-[14px] text-muted-foreground leading-relaxed italic pr-10">
                        "{ann.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                        <MaterialSymbol
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

                  <M3Button
                    variant="outlined"
                    className="h-10 rounded-xl gap-2 font-bold px-6 shrink-0 md:self-center"
                  >
                    Read More
                    <MaterialSymbol icon={ArrowRight01Icon} size={16} />
                  </M3Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
