"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  variant?: "elevated" | "outlined" | "filled";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "elevated", elevation = 0, ...props }, ref) => {
    const variantClassName = cn(
      "m3-card border",
      variant === "filled" &&
        "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-on-surface)]",
      variant === "outlined" &&
        "border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container-lowest)] text-[color:var(--md-sys-color-on-surface)]",
      variant === "elevated" &&
        "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] text-[color:var(--md-sys-color-on-surface)]",
      elevation > 0 && `m3-elevation-${elevation}`,
      className,
    );

    return (
      <div
        ref={ref}
        data-card-variant={variant}
        className={variantClassName}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export interface CardHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  avatar?: React.ReactNode;
  heading?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { className, avatar, heading, subtitle, action, children, ...props },
    ref,
  ) => {
    const resolvedClassName = cn("m3-spacing-4", className);

    if (heading || subtitle || avatar || action) {
      return (
        <div ref={ref} className={resolvedClassName} {...props}>
          {avatar}
          {heading ? <h3>{heading}</h3> : null}
          {subtitle ? <p>{subtitle}</p> : null}
          {children}
          {action}
        </div>
      );
    }

    return (
      <div ref={ref} className={resolvedClassName} {...props}>
        {children}
      </div>
    );
  },
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={className} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={className} {...props} />
));
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "horizontal";
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "m3-spacing-4",
        variant === "horizontal" && "m3-gap-4",
        className,
      )}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: "start" | "end" | "spread";
}

export const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  ),
);
CardActions.displayName = "CardActions";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: "start" | "end" | "spread";
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  aspectRatio?: "square" | "video" | "cinematic";
}

export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ className, src, alt = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        {children}
      </div>
    );
  },
);
CardMedia.displayName = "CardMedia";
