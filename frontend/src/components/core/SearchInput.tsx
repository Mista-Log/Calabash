<<<<<<< HEAD
﻿"use client";

import * as React from "react";
=======
"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
      <div className="relative group w-full">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors duration-300 pointer-events-none"
          aria-hidden="true"
        />
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={handleChange}
          className={cn(
            "pl-11 h-10 bg-muted/5 border-border/40 hover:border-border/80 focus-visible:ring-2 focus-visible:ring-primary/20 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/60 text-base font-medium rounded-xl",
            className,
          )}
          aria-label="Search site content"
          {...props}
        />
      </div>
>>>>>>> origin/main
    );
  },
);

SearchInput.displayName = "SearchInput";
