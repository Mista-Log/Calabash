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
