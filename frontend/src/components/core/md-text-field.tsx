"use client";

import * as React from "react";
import { Input, type InputProps } from "./input";

export interface MdTextFieldProps extends InputProps {
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const MdTextField = React.forwardRef<HTMLInputElement, MdTextFieldProps>(
  ({ fullWidth = true, className, ...props }, ref) => (
    <Input
      ref={ref}
      className={`${fullWidth ? "w-full" : ""}${className ? ` ${className}` : ""}`}
      {...props}
    />
  ),
);
MdTextField.displayName = "MdTextField";

export const MdSearchField = React.forwardRef<
  HTMLInputElement,
  Omit<MdTextFieldProps, "type" | "leadingIcon" | "trailingIcon">
>(({ value, onChange, placeholder = "Search...", ...props }, ref) => {
  const hasValue = Boolean(value);

  return (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      leadingIcon="search"
      trailingIcon={hasValue ? "close" : undefined}
      onTrailingIconClick={() => {
        if (onChange) {
          onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        }
      }}
      {...props}
    />
  );
});
MdSearchField.displayName = "MdSearchField";
