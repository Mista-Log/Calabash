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

export { Tabs, TabsList, TabsTrigger, TabsContent };
