"use client";

import * as React from "react";
import { MaterialSymbol } from "./MaterialSymbol";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "assist" | "filter" | "input" | "suggestion";
  size?: "small" | "medium";
  label: string;
  value?: string;
  icon?: string;
  avatar?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  elevated?: boolean;
}

const toChipKey = (value?: string): string =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Chip = ({
  className,
  variant = "assist",
  size = "medium",
  label,
  value,
  icon,
  avatar,
  selected = false,
  onSelect,
  onRemove,
  disabled = false,
  elevated,
  onClick,
  style,
  ...props
}: ChipProps) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && !disabled) {
      onSelect?.();
    }
  };

  return React.createElement(
    "md-chip",
    {
      ...props,
      className,
      type: variant,
      label,
      value: value ?? toChipKey(label),
      selected,
      disabled,
      elevated: Boolean(elevated),
      removable: Boolean(onRemove),
      avatar: Boolean(avatar),
      onClick: handleClick,
      onRemove: onRemove
        ? (event: Event) => {
            event.preventDefault();
            onRemove();
          }
        : undefined,
      style: {
        ...style,
        // Apply M3 chip tokens
        "--md-chip-height": size === "small" ? "24px" : "32px",
        "--md-chip-radius": "var(--md-sys-shape-corner-small)",
        "--md-chip-padding": "0 var(--md-sys-spacing-3)",
      } as React.CSSProperties,
    },
    avatar
      ? React.isValidElement(avatar)
        ? React.cloneElement(avatar as React.ReactElement<{ slot?: string }>, {
            slot: "icon",
          })
        : React.createElement("span", { slot: "icon" }, avatar)
      : icon
        ? React.createElement(MaterialSymbol, { slot: "icon", icon, size: 18 })
        : null,
  );
};

Chip.displayName = "Chip";

export interface ChipSetProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "assist" | "filter" | "input" | "suggestion";
  multiple?: boolean;
  selectedValues?: string[];
  onSelectionChange?: (values: string[]) => void;
}

export const ChipSet = ({
  className,
  variant = "assist",
  multiple = false,
  selectedValues = [],
  onSelectionChange,
  children,
  ...props
}: ChipSetProps) => {
  const selectedSet = React.useMemo(
    () => new Set(selectedValues.map((entry) => toChipKey(entry))),
    [selectedValues],
  );

  const handleChipSelect = (chipValue: string) => {
    if (!onSelectionChange) return;

    if (multiple) {
      const normalized = toChipKey(chipValue);
      const next = selectedValues.filter(
        (entry) => toChipKey(entry) !== normalized,
      );
      if (!selectedSet.has(normalized)) {
        next.push(chipValue);
      }
      onSelectionChange(next);
      return;
    }

    const normalized = toChipKey(chipValue);
    onSelectionChange(selectedSet.has(normalized) ? [] : [chipValue]);
  };

  return React.createElement(
    "md-chip-set",
    {
      ...props,
      className,
    },
    React.Children.map(children, (child) => {
      if (!React.isValidElement<ChipProps>(child)) {
        return child;
      }

      const chipValue = child.props.value ?? child.props.label;
      const isSelected = selectedSet.has(toChipKey(chipValue));

      return React.cloneElement(child, {
        variant: child.props.variant || variant,
        value: chipValue,
        selected: isSelected,
        onSelect: () => {
          child.props.onSelect?.();
          handleChipSelect(chipValue);
        },
      } as ChipProps);
    }),
  );
};

ChipSet.displayName = "ChipSet";
