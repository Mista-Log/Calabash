"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { M3Button, M3IconButton } from "./m3-button";
import type { M3ButtonProps, M3IconButtonProps } from "./m3-button";

type SelectionMode = "single" | "multi" | "required";
type GroupType = "standard" | "connected";

export interface ButtonGroupContextValue {
  selectedValues: Set<string | number>;
  selectionMode: SelectionMode;
  groupType: GroupType;
  size?: M3ButtonProps["size"];
  shape: "round" | "corner";
  onSelect: (value: string | number) => void;
}

export const ButtonGroupContext = React.createContext<
  ButtonGroupContextValue | undefined
>(undefined);

export function useButtonGroup() {
  const context = React.useContext(ButtonGroupContext);
  if (!context) {
    throw new Error("useButtonGroup must be used within a ButtonGroup");
  }
  return context;
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Type of button group
   * - standard: buttons with spacing between them
   * - connected: buttons adjacent with no gaps, shape morphing applied
   */
  type?: GroupType;

  /**
   * Selection mode for buttons
   * - single: only one button can be selected at a time
   * - multi: multiple buttons can be selected
   * - required: at least one button must be selected, cannot deselect all
   */
  selectionMode?: SelectionMode;

  /**
   * Currently selected button value(s)
   */
  value?: string | number | (string | number)[];

  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string | number | (string | number)[]) => void;

  /**
   * Size of buttons in the group
   */
  size?: M3ButtonProps["size"];

  /**
   * Shape morphing behavior
   * - round: buttons stay rounded-full
   * - corner: buttons morph to corner radius (default for connected groups)
   */
  shape?: "round" | "corner";

  /**
   * Child buttons to render in the group
   */
  children: React.ReactNode;
}

/**
 * Material 3 Button Group Component
 * Organizes buttons with support for standard and connected layouts
 * Applies shape morph when buttons are selected
 *
 * @example
 * <M3ButtonGroup selectionMode="single" value={selected} onValueChange={setSelected}>
 *   <GroupButton value="xs">XS</GroupButton>
 *   <GroupButton value="sm">Small</GroupButton>
 *   <GroupButton value="md">Medium</GroupButton>
 * </ButtonGroup>
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      type = "standard",
      selectionMode = "single",
      value,
      onValueChange,
      size = "md",
      shape = type === "connected" ? "corner" : "round",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Normalize value to Set for easier checking
    const selectedValues = React.useMemo(() => {
      const vals = Array.isArray(value)
        ? value
        : value !== undefined
          ? [value]
          : [];
      return new Set(vals);
    }, [value]);

    const handleSelect = React.useCallback(
      (selectedValue: string | number) => {
        let newValue: string | number | (string | number)[] | undefined =
          selectedValue;

        if (selectionMode === "single") {
          if (selectedValues.has(selectedValue)) {
            // Toggle off if selected
            newValue = undefined;
          } else {
            // Select this value
            newValue = selectedValue;
          }
        } else if (selectionMode === "multi") {
          const newSet = new Set(selectedValues);
          if (newSet.has(selectedValue)) {
            newSet.delete(selectedValue);
          } else {
            newSet.add(selectedValue);
          }
          newValue = Array.from(newSet);
        } else {
          // required mode - prevent deselecting if only one selected
          const newSet = new Set(selectedValues);
          if (newSet.has(selectedValue)) {
            // Don't allow deselecting if it's the only selection in required mode
            if (newSet.size > 1) {
              newSet.delete(selectedValue);
            }
          } else {
            newSet.add(selectedValue);
          }
          newValue = Array.from(newSet);
        }

        if (newValue !== undefined) {
          onValueChange?.(newValue);
        }
      },
      [selectedValues, selectionMode, onValueChange],
    );

    const contextValue: ButtonGroupContextValue = {
      selectedValues,
      selectionMode,
      groupType: type,
      size,
      shape,
      onSelect: handleSelect,
    };

    const groupClasses = cn(
      "inline-flex items-center",
      type === "connected" && "gap-0",
      type === "standard" && "gap-2",
      className,
    );

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <div ref={ref} className={groupClasses} role="group" {...props}>
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";

export interface GroupButtonProps extends Omit<
  M3ButtonProps,
  "selected" | "shape" | "size"
> {
  /**
   * Unique value for this button in the group
   */
  value: string | number;
}

export interface GroupIconButtonProps extends Omit<
  M3IconButtonProps,
  "selected" | "shape" | "size"
> {
  /**
   * Unique value for this button in the group
   */
  value: string | number;
}

/**
 * Button component optimized for use within ButtonGroup
 * Automatically handles selection state and shape morphing
 */
export const GroupButton = React.forwardRef<
  HTMLButtonElement,
  GroupButtonProps
>(({ value, onClick, ...props }, _ref) => {
  const context = useButtonGroup();
  const isSelected = context.selectedValues.has(value);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context.onSelect(value);
    onClick?.(e);
  };

  return (
    <M3Button
      selected={isSelected}
      size={context.size}
      shape={context.shape}
      onClick={handleClick}
      {...props}
    />
  );
});

GroupButton.displayName = "GroupButton";

/**
 * Icon button component optimized for use within ButtonGroup
 * Automatically handles selection state and shape morphing
 */
export const GroupIconButton = React.forwardRef<
  HTMLButtonElement,
  GroupIconButtonProps
>(({ value, onClick, ...props }, _ref) => {
  const context = useButtonGroup();
  const isSelected = context.selectedValues.has(value);
  const normalizedSize = context.size === "icon" ? "md" : context.size;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context.onSelect(value);
    onClick?.(e);
  };

  return (
    <M3IconButton
      selected={isSelected}
      size={normalizedSize}
      shape={context.shape}
      onClick={handleClick}
      {...props}
    />
  );
});

GroupIconButton.displayName = "GroupIconButton";

export { ButtonGroup as default };
