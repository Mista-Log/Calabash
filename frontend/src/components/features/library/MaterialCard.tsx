import * as React from "react";
import Link from "next/link";

import { Material } from "@/services/api";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  M3Button,
} from "@/components/core";

import { cn } from "@/lib/utils";

interface MaterialCardProps {
  material: Material;
  onView?: (material: Material) => void;
  className?: string;
  variant?: "grid" | "list";
}

export function MaterialCard({
  material,
  onView,
  className,
  variant = "grid",
}: MaterialCardProps) {
  const isList = variant === "list";

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/40 bg-card/60 backdrop-blur-md transition-colors hover:bg-[color:var(--md-sys-color-surface-container-low)]",
        isList
          ? "flex flex-row items-center h-28 md:h-24 lg:h-20 p-4"
          : "flex flex-col h-full p-4", // Adjusted padding for grid/list
        className,
      )}
    >
      {/* Icon Section */}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-[color:var(--md-sys-color-surface-container-low)] rounded-lg",
          isList
            ? "h-full w-20 md:w-16 lg:w-14 border-r border-border/10 shrink-0 mr-4" // Adjusted width and margin for list
            : "h-20 w-full mb-4", // Added margin-bottom for grid
        )}
      >
        <div className="transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1 flex items-center justify-center">
          <div className="size-12 rounded-lg bg-[color:var(--md-sys-color-primary-container)] flex items-center justify-center text-[20px] font-black text-[color:var(--md-sys-color-on-primary-container)] group-hover:text-[color:var(--md-sys-color-primary)] transition-colors">
            {material.title.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className={cn("space-y-2 p-0", isList ? "flex-1" : "pb-2")}>
        <div className="flex items-center justify-between flex-wrap gap-y-1">
          <Badge
            variant="secondary"
            className="font-bold text-[13px] tracking-wider uppercase bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] border-none py-1 px-2" // Adjusted padding and tracking
          >
            {material.courseCode}
          </Badge>
          {!isList && (
            <span className="text-[13px] font-bold uppercase tracking-wide text-muted-foreground/50">
              {material.uploadDate}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-[16px] font-extrabold tracking-tight line-clamp-2 group-hover:text-[color:var(--md-sys-color-primary)] transition-colors">
            {material.title}
          </CardTitle>
          <CardDescription className="text-[13px] flex items-center gap-1.5 font-bold uppercase tracking-wide text-muted-foreground/60 leading-normal">
            <span className="w-4 h-4 rounded-full bg-[color:var(--md-sys-color-primary-container)] flex items-center justify-center text-[13px] text-[color:var(--md-sys-color-on-primary-container)] font-bold">
              {material.uploader.charAt(0)}
            </span>
            {material.uploader}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Footer/Action Section */}
      <CardFooter
        className={cn(
          "pt-4 p-0 transition-colors duration-300",
          isList
            ? "h-full flex items-center justify-center border-l border-border/5 bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-0 ml-4" // Adjusted margin for list
            : "mt-auto pt-4 flex items-center justify-end border-t border-border/5 bg-[color:var(--md-sys-color-surface-container-low)]",
        )}
      >
        <Link
          href={`/library/${material.id}`}
          onClick={
            onView
              ? (e) => {
                  e.preventDefault();
                  onView(material);
                }
              : undefined
          }
        >
          <M3Button variant="text"
            size="sm"
            className="h-9 text-[13px] font-bold hover:bg-primary hover:text-primary-foreground rounded-full px-4 transition-all duration-300"
          >
            {isList ? "View" : "Open Resource"}
          </M3Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
