import React from "react";
import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  date: string;
  icon?: React.ReactNode;
  metadata?: React.ReactNode;
  action?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Timeline connector line */}
      <div className="absolute left-[15px] top-8 bottom-8 w-[2px] bg-border/40" />

      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="relative flex gap-6 group">
            {/* Timeline dot */}
            <div className="relative shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                {item.icon || (
                  <div className="h-3 w-3 rounded-full bg-primary" />
                )}
              </div>
            </div>

            {/* Timeline content */}
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <h4 className="text-[16px] font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <div className="text-[16px] text-foreground/70 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
                <time className="text-[13px] font-bold text-foreground/60 whitespace-nowrap italic">
                  {item.date}
                </time>
              </div>

              {item.metadata && (
                <div className="text-[13px] font-medium text-foreground/60 mb-3">
                  {item.metadata}
                </div>
              )}

              {item.action && <div className="mt-3">{item.action}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
