"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdFilledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

function renderButtonIcon(icon?: string, loading?: boolean) {
  if (loading) {
    return <md-icon slot="icon">progress_activity</md-icon>;
  }

  if (icon) {
    return <md-icon slot="icon">{icon}</md-icon>;
  }

  return null;
}

export const MdFilledButton = React.forwardRef<
  HTMLButtonElement,
  MdFilledButtonProps
>(({ children, loading, icon, fullWidth, disabled, className, ...props }, ref) => (
  <md-filled-button
    ref={ref}
    disabled={disabled || loading}
    className={cn(fullWidth && "w-full", className)}
    {...props}
  >
    {renderButtonIcon(icon, loading)}
    {loading ? <span className="animate-pulse">Loading...</span> : children}
  </md-filled-button>
));
MdFilledButton.displayName = "MdFilledButton";

export interface MdTonalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export const MdTonalButton = React.forwardRef<
  HTMLButtonElement,
  MdTonalButtonProps
>(({ children, loading, icon, fullWidth, disabled, className, ...props }, ref) => (
  <md-tonal-button
    ref={ref}
    disabled={disabled || loading}
    className={cn(fullWidth && "w-full", className)}
    {...props}
  >
    {renderButtonIcon(icon, loading)}
    {loading ? <span className="animate-pulse">Loading...</span> : children}
  </md-tonal-button>
));
MdTonalButton.displayName = "MdTonalButton";

export interface MdOutlinedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export const MdOutlinedButton = React.forwardRef<
  HTMLButtonElement,
  MdOutlinedButtonProps
>(({ children, loading, icon, fullWidth, disabled, className, ...props }, ref) => (
  <md-outlined-button
    ref={ref}
    disabled={disabled || loading}
    className={cn(fullWidth && "w-full", className)}
    {...props}
  >
    {renderButtonIcon(icon, loading)}
    {loading ? <span className="animate-pulse">Loading...</span> : children}
  </md-outlined-button>
));
MdOutlinedButton.displayName = "MdOutlinedButton";

export interface MdTextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export const MdTextButton = React.forwardRef<
  HTMLButtonElement,
  MdTextButtonProps
>(({ children, loading, icon, fullWidth, disabled, className, ...props }, ref) => (
  <md-text-button
    ref={ref}
    disabled={disabled || loading}
    className={cn(fullWidth && "w-full", className)}
    {...props}
  >
    {renderButtonIcon(icon, loading)}
    {loading ? <span className="animate-pulse">Loading...</span> : children}
  </md-text-button>
));
MdTextButton.displayName = "MdTextButton";

export interface MdElevatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export const MdElevatedButton = React.forwardRef<
  HTMLButtonElement,
  MdElevatedButtonProps
>(({ children, loading, icon, fullWidth, disabled, className, ...props }, ref) => (
  <md-elevated-button
    ref={ref}
    disabled={disabled || loading}
    className={cn(fullWidth && "w-full", className)}
    {...props}
  >
    {renderButtonIcon(icon, loading)}
    {loading ? <span className="animate-pulse">Loading...</span> : children}
  </md-elevated-button>
));
MdElevatedButton.displayName = "MdElevatedButton";

export interface MdIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  selected?: boolean;
  toggle?: boolean;
  label?: string;
}

export const MdIconButton = React.forwardRef<HTMLButtonElement, MdIconButtonProps>(
  ({ icon, selected, toggle, label, className, disabled, ...props }, ref) => (
    <md-icon-button
      ref={ref}
      selected={selected}
      toggle={toggle}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={className}
      {...props}
    >
      <md-icon>{icon}</md-icon>
    </md-icon-button>
  ),
);
MdIconButton.displayName = "MdIconButton";

export interface MdFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "surface" | "secondary" | "tertiary";
  extended?: boolean;
  icon?: string;
  label?: string;
  lowered?: boolean;
}

export const MdFab = React.forwardRef<HTMLButtonElement, MdFabProps>(
  (
    {
      children,
      variant = "primary",
      extended,
      icon,
      label,
      lowered,
      disabled,
      className,
      ...props
    },
    ref,
  ) => (
    <md-fab
      ref={ref}
      variant={variant}
      extended={extended}
      lowered={lowered}
      label={label}
      disabled={disabled}
      className={className}
      {...props}
    >
      {icon ? <md-icon slot="icon">{icon}</md-icon> : null}
      {extended ? children : null}
    </md-fab>
  ),
);
MdFab.displayName = "MdFab";
