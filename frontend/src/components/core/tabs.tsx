<<<<<<< HEAD
"use client";

import * as React from "react";

export interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  defaultValue?: string;
}

const TabsContext = React.createContext<
  | {
      value?: string;
      onValueChange: (value: string) => void;
    }
  | undefined
>(undefined);

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs");
  }
  return context;
};

const Tabs = ({
  value,
  onValueChange,
  defaultValue,
  children,
  className,
}: TabsProps & { className?: string }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const controlledValue = value ?? internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      onValueChange?.(newValue);
      setInternalValue(newValue);
    },
    [onValueChange],
  );

  return (
    <TabsContext.Provider
      value={{ value: controlledValue, onValueChange: handleValueChange }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({
  className,
  children,
  onChange,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const { onValueChange } = useTabs();

  const handleChange = (event: Event) => {
    const target = event.currentTarget as HTMLElement & {
      activeTabIndex?: number;
    };

    const tabIndex = target.activeTabIndex ?? 0;
    const tabs = Array.from(target.querySelectorAll("md-tab"));
    const selectedTab = tabs[tabIndex] as HTMLElement | undefined;
    const nextValue = selectedTab?.dataset?.tabValue;

    if (nextValue) {
      onValueChange(nextValue);
    }

    onChange?.(event as unknown as React.ChangeEvent<HTMLElement>);
  };

  return React.createElement(
    "md-tabs",
    {
      ...props,
      className,
      onChange: handleChange,
    },
    children,
  );
};
TabsList.displayName = "TabsList";

const TabsTrigger = ({
  className,
  value,
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  value: string;
}) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;

  return React.createElement(
    "md-tab",
    {
      ...props,
      className,
      type: "primary",
      active: isSelected || undefined,
      "data-tab-value": value,
      onClick: (event: Event) => {
        onValueChange(value);
        onClick?.(event as unknown as React.MouseEvent<HTMLElement>);
      },
    },
    children,
  );
};
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
  }
>(({ value, ...props }, ref) => {
  const { value: selectedValue } = useTabs();

  if (selectedValue !== value) return null;

  return <div ref={ref} role="tabpanel" {...props} />;
});
TabsContent.displayName = "TabsContent";
=======
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
>>>>>>> origin/main

export { Tabs, TabsList, TabsTrigger, TabsContent };
