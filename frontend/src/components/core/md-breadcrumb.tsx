"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface MdBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Material 3 Breadcrumb Component
 * 
 * Displays navigation hierarchy with proper M3 styling
 */
export function MdBreadcrumb({ items, className }: MdBreadcrumbProps) {
  return React.createElement(
    "nav",
    {
      "aria-label": "Breadcrumb",
      className: cn("flex items-center gap-2 m3-label-medium", className),
    },
    items.map((item, index) => {
      const isLast = index === items.length - 1;
      
      return React.createElement(
        React.Fragment,
        { key: item.href || item.label },
        <>
          {index > 0 && React.createElement(
            "md-icon",
            { className: "text-[color:var(--md-sys-color-on-surface-variant)]" },
            "chevron_right"
          )}
          
          {item.href && !isLast ? (
            React.createElement(
              Link,
              {
                href: item.href,
                className: "text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)] transition-colors",
              },
              item.label
            )
          ) : (
            React.createElement(
              "span",
              {
                className: cn(
                  "text-[color:var(--md-sys-color-on-surface)]",
                  isLast && "font-medium"
                ),
              },
              item.label
            )
          )}
        </>
      );
    })
  );
}
