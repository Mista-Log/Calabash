import * as React from "react";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
=======
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          isInvalid
            ? "border-destructive focus-visible:ring-destructive/40"
            : "border-border hover:border-muted-foreground/40 focus-visible:border-primary",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
Input.displayName = "Input";

export { Input };
