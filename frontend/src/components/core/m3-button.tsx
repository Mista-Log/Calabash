"use client";

import * as React from "react";
import { MdIcon } from "./md-icon";
import { cn } from "@/lib/utils";

type M3ButtonVariant =
  | "filled"
  | "tonal"
  | "outlined"
  | "text"
  | "elevated"
  | "ghost"
  | "secondary";
type M3IconButtonVariant = "filled" | "tonal" | "outlined" | "text";
type M3ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";
type M3IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type M3ButtonShape = "round" | "corner";
type M3ButtonLayout = "inline" | "mobile-full" | "always-full";

/**
 * Map M3ButtonVariant to Material Web button color attribute
 * The Material Web md-button component uses a 'color' property for variants
 */
const getButtonColor = (variant: M3ButtonVariant) => {
  switch (variant) {
    case "filled":
    case "secondary":
      return "filled";
    case "tonal":
      return "tonal";
    case "outlined":
      return "outlined";
    case "text":
    case "ghost":
      return "text";
    case "elevated":
      return "elevated";
    default:
      return "filled";
  }
};

const getButtonSize = (size: M3ButtonSize) => {
  switch (size) {
    case "xs":
      return "extra-small";
    case "sm":
      return "small";
    case "md":
      return "medium";
    case "lg":
      return "large";
    case "xl":
      return "extra-large";
    case "icon":
      return "small";
    default:
      return "medium";
  }
};

const getButtonShape = (shape: M3ButtonShape) => {
  return shape === "corner" ? "square" : "round";
};

/**
 * Helper function to convert icon data to MdIcon element
 * Supports string icon names, React elements, or custom icons
 */
const toIconNode = (iconData: React.ReactNode): React.ReactNode | null => {
  if (!iconData) return null;
  if (React.isValidElement(iconData)) return iconData;
  if (typeof iconData === "string") {
    return <MdIcon>{iconData}</MdIcon>;
  }
  return iconData;
};

export interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: M3ButtonVariant;
  size?: M3ButtonSize;
  shape?: M3ButtonShape;
  layout?: M3ButtonLayout;
  isLoading?: boolean;
  loading?: boolean;
  loadingText?: string;
  success?: boolean;
  icon?: React.ReactNode;
  iconPlacement?: "left" | "right";
  trailingIcon?: string | React.ReactNode;
  selected?: boolean;
  fullWidth?: boolean;
}

export interface M3IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: M3IconButtonVariant;
  size?: M3IconButtonSize;
  icon: React.ReactNode;
  isLoading?: boolean;
  loading?: boolean;
  success?: boolean;
  selected?: boolean;
  shape?: M3ButtonShape;
}

const M3Button = ({
  variant = "filled",
  size = "md",
  className,
  layout = "inline",
  isLoading = false,
  loading = false,
  loadingText,
  success = false,
  icon,
  iconPlacement = "left",
  trailingIcon,
  selected: _selected,
  shape = "corner",
  children,
  disabled,
  fullWidth,
  style,
  ...props
}: M3ButtonProps) => {
  const isLoadingState = isLoading || loading;
  const isDisabled = disabled || isLoadingState;
  const buttonColor = getButtonColor(variant);
  const buttonSize = getButtonSize(size);
  const buttonShape = getButtonShape(shape);
  const resolvedLayout = fullWidth ? "always-full" : layout;
  const labelText =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : undefined;
  const resolvedAriaLabel = props["aria-label"] ?? labelText;
  const resolvedTitle = props.title ?? labelText;

  // Prepare icon nodes - convert string icon names to MdIcon elements
  const leadingIcon =
    iconPlacement === "left" && icon && !trailingIcon && !isLoadingState ? (
      toIconNode(icon)
    ) : isLoadingState ? (
      <MdIcon>progress_activity</MdIcon>
    ) : null;

  const rightIcon =
    iconPlacement === "right" && icon && !isLoadingState ? (
      toIconNode(icon)
    ) : trailingIcon && !isLoadingState ? (
      toIconNode(trailingIcon)
    ) : isLoadingState && success ? (
      <MdIcon>check_circle</MdIcon>
    ) : null;

  const childNodes = React.Children.toArray(children);
  const hasElementChild = childNodes.some((node) => React.isValidElement(node));
  const hasTextChild = childNodes.some(
    (node) => typeof node === "string" || typeof node === "number",
  );
  const needsInlineGap = !leadingIcon && !rightIcon && hasElementChild && hasTextChild;

  const buttonProps = {
    ...props,
    className: cn("m3-button", className),
    ["data-layout"]: resolvedLayout,
    color: buttonColor,
    size: buttonSize,
    shape: buttonShape,
    disabled: isDisabled || undefined,
    ["aria-label"]: resolvedAriaLabel,
    title: resolvedTitle,
    ["trailing-icon"]: Boolean(rightIcon) || undefined,
    style: {
      ...style,
      ...(fullWidth || resolvedLayout === "always-full" ? { width: "100%" } : {}),
      ...(size === "icon"
        ? {
            minWidth: "40px",
            width: "40px",
            minHeight: "40px",
            paddingInline: "0",
          }
        : {
            minHeight:
              size === "xs"
                ? "32px"
                : size === "sm"
                  ? "36px"
                  : size === "lg"
                    ? "48px"
                    : size === "xl"
                      ? "56px"
                      : "40px",
            paddingInline:
              size === "xs"
                ? "12px"
                : size === "sm"
                  ? "14px"
                  : size === "lg"
                    ? "20px"
                    : size === "xl"
                      ? "24px"
                      : "16px",
          }),
    },
  };

  // Render the Material Web md-button with color attribute for variants
  return React.createElement(
    "md-button",
    buttonProps,
    leadingIcon && <span slot="icon">{leadingIcon}</span>,
    isLoadingState
      ? loadingText || "Loading..."
      : needsInlineGap
        ? <span className="inline-flex items-center gap-2">{children}</span>
        : children,
    rightIcon && <span slot="icon">{rightIcon}</span>,
  );
};

M3Button.displayName = "M3Button";

const M3IconButton = ({
  variant: _variant = "filled",
  size = "md",
  icon,
  className,
  isLoading = false,
  loading = false,
  success = false,
  selected: _selected,
  shape = "round",
  disabled,
  style,
  ...props
}: M3IconButtonProps) => {
  const isLoadingState = isLoading || loading;
  const isDisabled = disabled || isLoadingState;
  const iconButtonSize = getButtonSize(size as M3ButtonSize);
  const iconButtonShape = getButtonShape(shape);

  // Build the icon element
  let iconElement: React.ReactNode = null;
  if (isLoadingState) {
    iconElement = <MdIcon>progress_activity</MdIcon>;
  } else if (success) {
    iconElement = <MdIcon>check_circle</MdIcon>;
  } else {
    iconElement = toIconNode(icon);
  }

  const iconButtonProps = {
    ...props,
    className: cn("m3-button", className),
    size: iconButtonSize,
    shape: iconButtonShape,
    disabled: isDisabled || undefined,
    style: style,
  };

  return React.createElement("md-icon-button", iconButtonProps, iconElement);
};

M3IconButton.displayName = "M3IconButton";

export { M3Button, M3IconButton };
