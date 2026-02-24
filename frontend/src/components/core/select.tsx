<<<<<<< HEAD
"use client";

import * as React from "react";

type SelectOptionRecord = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  setPlaceholder: (placeholder?: string) => void;
  registerOption: (option: SelectOptionRecord) => void;
  unregisterOption: (value: string) => void;
  options: SelectOptionRecord[];
};

const SelectContext = React.createContext<SelectContextValue | undefined>(
  undefined,
);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
};

const extractText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("").trim();
  }
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return extractText(element.props.children);
  }
  return "";
};

const Select = ({
  value,
  onValueChange,
  children,
}: SelectProps) => {
  const [placeholder, setPlaceholder] = React.useState<string | undefined>(
    undefined,
  );
  const [optionsMap, setOptionsMap] = React.useState<
    Map<string, SelectOptionRecord>
  >(new Map());

  const registerOption = React.useCallback((option: SelectOptionRecord) => {
    setOptionsMap((prev) => {
      const next = new Map(prev);
      next.set(option.value, option);
      return next;
    });
  }, []);

  const unregisterOption = React.useCallback((optionValue: string) => {
    setOptionsMap((prev) => {
      if (!prev.has(optionValue)) return prev;
      const next = new Map(prev);
      next.delete(optionValue);
      return next;
    });
  }, []);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      value,
      onValueChange,
      placeholder,
      setPlaceholder,
      registerOption,
      unregisterOption,
      options: Array.from(optionsMap.values()),
    }),
    [
      value,
      onValueChange,
      placeholder,
      registerOption,
      unregisterOption,
      optionsMap,
    ],
  );

  return (
    <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
  );
};

const SelectGroup = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  return <>{children}</>;
};
SelectGroup.displayName = "SelectGroup";

const SelectValue = ({
  placeholder,
}: React.HTMLAttributes<HTMLSpanElement> & {
  placeholder?: string;
}) => {
  const { setPlaceholder } = useSelect();

  React.useEffect(() => {
    setPlaceholder(placeholder);
    return () => setPlaceholder(undefined);
  }, [placeholder, setPlaceholder]);

  return null;
};
SelectValue.displayName = "SelectValue";

const SelectTrigger = ({
  className,
  children,
  onChange,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const { value, onValueChange, options, placeholder } = useSelect();
  const hasValue = Boolean(value);

  return React.createElement(
    "md-select",
    {
      ...props,
      className,
      value: value ?? "",
      onChange: (event: Event) => {
        const target = event.currentTarget as HTMLElement & { value?: string };
        onValueChange?.(target.value ?? "");
        onChange?.(event as unknown as React.ChangeEvent<HTMLElement>);
      },
    },
    !hasValue
      ? React.createElement(
          "md-select-option",
          { selected: true },
          placeholder
            ? React.createElement("div", { slot: "headline" }, placeholder)
            : null,
        )
      : null,
    options.map((option) =>
      React.createElement(
        "md-select-option",
        {
          key: option.value,
          value: option.value,
          selected: option.value === value,
          disabled: option.disabled || undefined,
        },
        React.createElement("div", { slot: "headline" }, option.label),
      ),
    ),
    children,
  );
};
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = () => null;
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = () => null;
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  return <>{children}</>;
};
SelectContent.displayName = "SelectContent";

const SelectLabel = () => null;
SelectLabel.displayName = "SelectLabel";

const SelectItem = ({
  value,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: React.ReactNode;
}) => {
  const { registerOption, unregisterOption } = useSelect();
  const label = extractText(children);

  React.useEffect(() => {
    registerOption({
      value,
      label,
      disabled: (props as { disabled?: boolean }).disabled,
    });

    return () => unregisterOption(value);
  }, [value, label, props, registerOption, unregisterOption]);

  return null;
};
SelectItem.displayName = "SelectItem";

const SelectSeparator = () => React.createElement("md-divider");
SelectSeparator.displayName = "SelectSeparator";
=======
import { Tick01Icon, ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-11 w-full items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-base ring-offset-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <HugeiconsIcon icon={ArrowDown01Icon} className="h-5 w-5 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <HugeiconsIcon icon={ArrowUp01Icon} className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.SelectScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-lg data-state=open:animate-in data-state=closed:animate-out data-state=closed:fade-out-0 data-state=open:fade-in-0 data-state=closed:zoom-out-95 data-state=open:zoom-in-95 data-side=bottom:slide-in-from-top-2 data-side=left:-translate-x-1 data-side=right:translate-x-1 data-side=top:-translate-y-1",
        position === "popper" &&
          "data-side=bottom:translate-y-1 data-side=left:-translate-x-1 data-side=right:translate-x-1 data-side=top:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]", // Fixed property access
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-base outline-none focus:bg-primary/10 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors duration-200", // Refined styles
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
>>>>>>> origin/main

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
