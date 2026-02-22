"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MdIcon } from "./md-icon";
import { MdIconButton } from "./md-button";
import { MdProgressIndicator } from "./md-progress";

export interface CourseCardProps {
  id: string;
  code: string;
  title: string;
  lecturerName?: string;
  semester?: number;
  progress?: number;
  materialCount?: number;
  studentCount?: number;
  color?: string;
  variant?: "student" | "lecturer";
  className?: string;
}

/**
 * Material 3 Course Card Component
 * 
 * Displays course information with progress tracking
 */
export function CourseCard({
  id,
  code,
  title,
  lecturerName,
  semester: _semester,
  progress = 0,
  materialCount = 0,
  studentCount = 0,
  color,
  variant = "student",
  className,
}: CourseCardProps) {
  const cardColor = color || "var(--md-sys-color-primary)";
  
  return React.createElement(
    Link,
    {
      href: `/courses/${id}`,
      className: cn(
        "md-course-card",
        "block",
        "bg-[color:var(--md-sys-color-surface-container-low)]",
        "rounded-[28px]",
        "border border-[color:var(--md-sys-color-outline-variant)]",
        "overflow-hidden",
        "hover:bg-[color:var(--md-sys-color-surface-container)]",
        "transition-colors",
        className
      ),
    },
    // Header with color accent
    React.createElement(
      "div",
      {
        className: "h-2 w-full",
        style: { backgroundColor: cardColor },
      }
    ),
    // Card Content
    React.createElement(
      "div",
      { className: "p-6 space-y-4" },
      // Course Code and Title
      React.createElement(
        "div",
        { className: "space-y-2" },
        React.createElement(
          "div",
          { className: "flex items-center justify-between" },
          React.createElement(
            "span",
            {
              className: cn(
                "m3-label-large px-3 py-1 rounded-full",
                "bg-[color:var(--md-sys-color-primary-container)]",
                "text-[color:var(--md-sys-color-on-primary-container)]"
              ),
            },
            code
          ),
          variant === "lecturer" && React.createElement(
            MdIconButton,
            {
              icon: "more_vert",
              "aria-label": "More options",
              onClick: (e: React.MouseEvent) => e.preventDefault(),
            }
          )
        ),
        React.createElement(
          "h3",
          { className: "m3-title-large text-[color:var(--md-sys-color-on-surface)]" },
          title
        ),
        lecturerName && React.createElement(
          "p",
          { className: "m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]" },
          lecturerName
        )
      ),
      // Progress Bar (Student View)
      variant === "student" && progress > 0 && React.createElement(
        "div",
        { className: "space-y-2" },
        React.createElement(
          "div",
          { className: "flex items-center justify-between" },
          React.createElement(
            "span",
            { className: "m3-label-medium text-[color:var(--md-sys-color-on-surface-variant)]" },
            "Progress"
          ),
          React.createElement(
            "span",
            { className: "m3-label-large text-[color:var(--md-sys-color-primary)]" },
            progress + "%"
          )
        ),
        <MdProgressIndicator type="linear" value={progress} />
      ),
      // Stats Row
      React.createElement(
        "div",
        { className: "flex items-center gap-4 pt-2" },
        React.createElement(
          "div",
          { className: "flex items-center gap-2" },
          React.createElement(
            MdIcon,
            { className: "text-[18px] text-[color:var(--md-sys-color-on-surface-variant)]" },
            "description"
          ),
          React.createElement(
            "span",
            { className: "m3-label-medium text-[color:var(--md-sys-color-on-surface-variant)]" },
            `${materialCount} materials`
          )
        ),
        variant === "lecturer" && React.createElement(
          "div",
          { className: "flex items-center gap-2" },
          React.createElement(
            MdIcon,
            { className: "text-[18px] text-[color:var(--md-sys-color-on-surface-variant)]" },
            "people"
          ),
          React.createElement(
            "span",
            { className: "m3-label-medium text-[color:var(--md-sys-color-on-surface-variant)]" },
            `${studentCount} students`
          )
        )
      )
    )
  );
}
