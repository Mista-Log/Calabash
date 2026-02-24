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
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
