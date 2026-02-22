"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={handleChange}
        leadingIcon="search"
        className={cn("h-11 w-full", className)}
        aria-label="Search site content"
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";
