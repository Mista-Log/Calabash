<<<<<<< HEAD
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
=======
import { Loading01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import * as Slot from "@radix-ui/react-slot";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-border/60 bg-background hover:bg-primary/5 hover:border-primary/20 hover:text-primary shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-primary/5 hover:text-primary shadow-none",
        subtle:
          "bg-primary/5 text-primary hover:bg-primary/10 shadow-none border border-primary/10",
        link: "text-primary underline-offset-4 hover:underline shadow-none p-0 h-auto",
      },
      size: {
        default: "h-10 px-6 py-2",
        xs: "h-8 gap-1 rounded-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-md gap-1.5 px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "size-10 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
type HugeIconType = React.ComponentProps<typeof HugeiconsIcon>["icon"];


export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  success?: boolean;
  icon?: React.ReactElement | HugeIconType;
  iconPlacement?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      success = false,
      icon,
      iconPlacement = "left",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Slot : "button";

    const renderIcon = (iconData: React.ReactElement | HugeIconType) => {
      if (React.isValidElement(iconData)) return iconData;

      return (
        <HugeiconsIcon
          icon={iconData}
          size={size === "xs" ? 14 : size === "sm" ? 16 : 18}
        />
      );
    };


    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <HugeiconsIcon
              icon={Loading01Icon}
              className="animate-spin"
              size={18}
            />
            {loadingText || children}
          </>
        ) : success ? (
          <>
            <HugeiconsIcon
              icon={Tick01Icon}
              className="text-green-500"
              size={18}
            />
            {children}
          </>
        ) : (
          <>
            {icon && iconPlacement === "left" && (
              <span className="shrink-0">{renderIcon(icon)}</span>
            )}
            {children}
            {icon && iconPlacement === "right" && (
              <span className="shrink-0">{renderIcon(icon)}</span>
            )}
          </>
        )}
      </Comp>
>>>>>>> origin/main
    );
  },
);
Button.displayName = "Button";

<<<<<<< HEAD
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
=======
export { Button, buttonVariants };
>>>>>>> origin/main
