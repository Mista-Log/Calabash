"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  url: string;
  className?: string;
  autoplay?: boolean;
  title?: string;
}

/**
 * Extracts the YouTube video ID from various URL formats.
 */
export function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Reusable YouTube Embed component with responsive container
 */
export function YouTubeEmbed({
  url,
  className,
  autoplay = false,
  title = "YouTube video player",
}: YouTubeEmbedProps) {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full items-center justify-center rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-6 text-center",
          className,
        )}
      >
        <div className="max-w-[420px]">
          <p className="text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            Video preview unavailable
          </p>
          <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
            This lesson cannot be played right now. Select another item from
            Course Content.
          </p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`;

  return (
    <div
      className={cn(
        "aspect-video w-full overflow-hidden rounded-3xl bg-black",
        className,
      )}
    >
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full border-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
