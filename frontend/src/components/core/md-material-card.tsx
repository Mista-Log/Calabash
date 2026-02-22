"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MdIcon } from "./md-icon";
import { MdIconButton } from "./md-button";
import { MdBadge } from "./md-badge";

export interface MaterialCardProps {
  id: string;
  title: string;
  courseCode: string;
  type: "pdf" | "video" | "past-question" | "zip" | "image";
  uploadDate: string;
  url?: string;
  size?: string;
  downloads?: number;
  likes?: number;
  duration?: string;
  thumbnailUrl?: string;
  variant?: "grid" | "list";
  className?: string;
  onOpen?: () => void;
  onDownload?: () => void;
  onLike?: () => void;
}

const typeIcons: Record<string, string> = {
  pdf: "picture_as_pdf",
  video: "videocam",
  "past-question": "assignment",
  zip: "folder_zip",
  image: "image",
};

/**
 * Material 3 Material Card Component
 * 
 * Displays academic material (PDF, video, etc.) with metadata
 */
export function MaterialCard({
  id,
  title,
  courseCode,
  type,
  uploadDate,
  size,
  downloads = 0,
  likes = 0,
  duration,
  thumbnailUrl,
  variant = "grid",
  className,
  onOpen,
  onDownload,
  onLike,
}: MaterialCardProps) {
  const icon = typeIcons[type] || "description";
  
  if (variant === "list") {
    return React.createElement(
      "div",
      {
        "data-material-id": id,
        className: cn(
          "md-material-card md-material-card--list",
          "flex items-center gap-4",
          "bg-[color:var(--md-sys-color-surface-container-low)]",
          "rounded-2xl",
          "p-4",
          "border border-[color:var(--md-sys-color-outline-variant)]",
          "hover:bg-[color:var(--md-sys-color-surface-container)]",
          "transition-colors",
          className
        ),
        onClick: onOpen,
      },
      // Type Icon
      React.createElement(
        "div",
        {
          className: cn(
            "flex items-center justify-center w-12 h-12 rounded-xl",
            "bg-[color:var(--md-sys-color-primary-container)]",
            "flex-shrink-0"
          ),
        },
        React.createElement(
          MdIcon,
          { className: "text-[24px] text-[color:var(--md-sys-color-primary)]" },
          icon
        )
      ),
      // Content
      React.createElement(
        "div",
        { className: "flex-1 min-w-0" },
        React.createElement(
          "h4",
          { className: "m3-title-small text-[color:var(--md-sys-color-on-surface)] truncate" },
          title
        ),
        React.createElement(
          "div",
          { className: "flex items-center gap-3 mt-1" },
          React.createElement(
            "span",
            { className: "m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]" },
            courseCode
          ),
          React.createElement(
            "span",
            { className: "m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]" },
            `• ${uploadDate}`
          ),
          size && React.createElement(
            "span",
            { className: "m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]" },
            `• ${size}`
          )
        )
      ),
      // Actions
      React.createElement(
        "div",
        { className: "flex items-center gap-1" },
        React.createElement(
          MdIconButton,
          {
            icon: "download",
            "aria-label": "Download",
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              onDownload?.();
            },
          }
        ),
        React.createElement(
          MdIconButton,
          {
            icon: "favorite",
            "aria-label": "Like",
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              onLike?.();
            },
          }
        ),
        likes > 0 && React.createElement(
          "span",
          { className: "m3-label-small text-[color:var(--md-sys-color-on-surface-variant)] ml-2" },
          likes
        )
      )
    );
  }
  
  // Grid Variant
  return React.createElement(
    "div",
    {
      "data-material-id": id,
      className: cn(
        "md-material-card md-material-card--grid",
        "flex flex-col",
        "bg-[color:var(--md-sys-color-surface-container-low)]",
        "rounded-[28px]",
        "border border-[color:var(--md-sys-color-outline-variant)]",
        "overflow-hidden",
        "hover:bg-[color:var(--md-sys-color-surface-container)]",
        "transition-colors",
        className
      ),
      onClick: onOpen,
    },
    // Thumbnail/Icon Area
    React.createElement(
      "div",
      {
        className: cn(
          "relative h-40",
          "bg-[color:var(--md-sys-color-surface-container-high)]",
          "flex items-center justify-center"
        ),
      },
      thumbnailUrl
        ? React.createElement("img", {
            src: thumbnailUrl,
            alt: title,
            className: "w-full h-full object-cover",
          })
        : React.createElement(
            "div",
            {
              className: cn(
                "flex items-center justify-center w-20 h-20 rounded-2xl",
                "bg-[color:var(--md-sys-color-primary-container)]"
              ),
            },
            React.createElement(
              MdIcon,
              { className: "text-[40px] text-[color:var(--md-sys-color-primary)]" },
              icon
            )
          ),
      // Type Badge
      React.createElement(
        "div",
        {
          className: "absolute top-3 left-3",
        },
        React.createElement(
          MdBadge,
          {
            className: cn(
              "px-2 py-1 rounded-full",
              "bg-[color:var(--md-sys-color-inverse-surface)]",
              "text-[color:var(--md-sys-color-inverse-on-surface)]",
              "m3-label-small"
            ),
          },
          type.toUpperCase()
        )
      ),
      // Duration (for videos)
      duration && React.createElement(
        "div",
        {
          className: "absolute bottom-3 right-3",
        },
        React.createElement(
          "span",
          {
            className: cn(
              "px-2 py-1 rounded-md",
              "bg-[color:var(--md-sys-color-inverse-surface)]",
              "text-[color:var(--md-sys-color-inverse-on-surface)]",
              "m3-label-small"
            ),
          },
          duration
        )
      )
    ),
    // Content
    React.createElement(
      "div",
      { className: "p-4 flex-1 flex flex-col" },
      React.createElement(
        "div",
        { className: "space-y-1 flex-1" },
        React.createElement(
          "h4",
          { className: "m3-title-small text-[color:var(--md-sys-color-on-surface)] line-clamp-2" },
          title
        ),
        React.createElement(
          "p",
          { className: "m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]" },
          courseCode
        ),
        React.createElement(
          "p",
          { className: "m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]" },
          uploadDate + (size ? " • " + size : "")
        )
      ),
      // Stats and Actions
      React.createElement(
        "div",
        { className: "flex items-center justify-between mt-4 pt-4 border-t border-[color:var(--md-sys-color-outline-variant)]" },
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(
            "div",
            { className: "flex items-center gap-1" },
            React.createElement(
              MdIcon,
              { className: "text-[16px] text-[color:var(--md-sys-color-on-surface-variant)]" },
              "download"
            ),
            React.createElement(
              "span",
              { className: "m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]" },
              downloads
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center gap-1" },
            React.createElement(
              MdIcon,
              { className: "text-[16px] text-[color:var(--md-sys-color-on-surface-variant)]" },
              "favorite"
            ),
            React.createElement(
              "span",
              { className: "m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]" },
              likes
            )
          )
        ),
        React.createElement(
          "div",
          { className: "flex items-center gap-1" },
          React.createElement(
            MdIconButton,
            {
              icon: "download",
              "aria-label": "Download",
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                onDownload?.();
              },
            }
          ),
          React.createElement(
            MdIconButton,
            {
              icon: "favorite",
              "aria-label": "Like",
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                onLike?.();
              },
            }
          )
        )
      )
    )
  );
}
