"use client";

import * as React from "react";
import { MaterialSymbol } from "./MaterialSymbol";

type MaterialButtonColor = "filled" | "tonal" | "outlined" | "text" | "elevated";
type MaterialButtonSize =
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large";
type MaterialIconButtonColor = "standard" | "filled" | "tonal" | "outlined";
type MaterialFabSize = "small" | "medium" | "large";

const buttonColorMap: Record<
  NonNullable<ButtonProps["variant"]>,
  MaterialButtonColor
> = {
  filled: "filled",
  "filled-tonal": "tonal",
  outlined: "outlined",
  outline: "outlined",
  text: "text",
  ghost: "text",
  secondary: "tonal",
  default: "filled",
  destructive: "filled",
};

const buttonSizeMap: Record<NonNullable<ButtonProps["size"]>, MaterialButtonSize> = {
  small: "extra-small",
  medium: "small",
  large: "medium",
  icon: "small",
};

const iconButtonSizeMap: Record<
  NonNullable<IconButtonProps["size"]>,
  MaterialButtonSize
> = {
  small: "extra-small",
  medium: "small",
  large: "medium",
};

const withSlot = (node: React.ReactNode, slot: string): React.ReactNode => {
  if (!node) return null;
  if (React.isValidElement(node)) {
    return React.cloneElement(node as React.ReactElement<{ slot?: string }>, {
      slot,
    });
  }
  return <span slot={slot}>{node}</span>;
};

const renderSymbol = (icon?: string, fill = false) => {
  if (!icon) return null;
  return <MaterialSymbol icon={icon} size={18} fill={fill} />;
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "filled"
    | "filled-tonal"
    | "outlined"
    | "outline"
    | "text"
    | "ghost"
    | "secondary"
    | "default"
    | "destructive";
  size?: "small" | "medium" | "large" | "icon";
  icon?: string;
  iconPlacement?: "left" | "right";
  trailingIcon?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "filled",
      size = "medium",
      icon,
      iconPlacement = "left",
      trailingIcon,
      loading = false,
      fullWidth = false,
      children,
      disabled,
      style,
      ...props
    },
    _ref,
  ) => {
    const leadingIcon = loading
      ? <MaterialSymbol icon="progress_activity" size={18} className="animate-spin" />
      : iconPlacement === "left"
        ? renderSymbol(icon)
        : null;

    const endIcon =
      !loading && trailingIcon
        ? renderSymbol(trailingIcon)
        : !loading && iconPlacement === "right"
          ? renderSymbol(icon)
          : null;

    const tokenStyle =
      variant === "destructive"
        ? ({
            "--md-button-filled-container-color": "var(--md-sys-color-error)",
            "--md-button-filled-label-text-color": "var(--md-sys-color-on-error)",
          } as React.CSSProperties)
        : undefined;

    return React.createElement(
      "md-button",
      {
        ...props,
        color: buttonColorMap[variant],
        size: buttonSizeMap[size],
        shape: "round",
        disabled: disabled || loading || undefined,
        "trailing-icon": Boolean(endIcon) || undefined,
        style: {
          ...(fullWidth ? { width: "100%" } : {}),
          ...(tokenStyle ?? {}),
          ...(style ?? {}),
        },
      },
      withSlot(endIcon ?? leadingIcon, "icon"),
      children,
    );
  },
);
Button.displayName = "Button";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "standard" | "filled" | "tonal" | "outlined";
  size?: "small" | "medium" | "large";
  icon: string;
  filled?: boolean;
  label?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "standard", size = "medium", icon, filled, label, ...props }, _ref) =>
    React.createElement(
      "md-icon-button",
      {
        ...props,
        color: variant as MaterialIconButtonColor,
        size: iconButtonSizeMap[size],
        "aria-label": label,
        title: label,
      },
      renderSymbol(icon, Boolean(filled)),
    ),
);
IconButton.displayName = "IconButton";

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "regular" | "extended" | "small" | "large";
  icon?: string;
  label?: string;
}

const fabSizeFromVariant = (
  variant: NonNullable<FABProps["variant"]>,
): MaterialFabSize => {
  if (variant === "large") return "large";
  if (variant === "regular") return "medium";
  return "small";
};

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ variant = "regular", icon, label, children, ...props }, _ref) =>
    React.createElement(
      "md-fab",
      {
        ...props,
        size: fabSizeFromVariant(variant),
        extended: variant === "extended" || undefined,
        label: label ?? (typeof children === "string" ? children : undefined),
      },
      withSlot(renderSymbol(icon), "icon"),
      variant === "extended" && label == null && typeof children !== "string"
        ? children
        : null,
    ),
);
FAB.displayName = "FAB";
