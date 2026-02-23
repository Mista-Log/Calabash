"use client";

import * as React from "react";
import { FilterIcon } from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Badge,
  M3Button,
} from "@/components/core";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";
import {
  DayPicker,
  DateRange,
  SelectRangeEventHandler,
} from "react-day-picker";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import "react-day-picker/dist/style.css";

export interface FilterSection {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "date-range";
}

export interface CheckboxSection extends FilterSection {
  type: "checkbox";
  options: { value: string; label: string }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export interface RadioSection extends FilterSection {
  type: "radio";
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export interface DateRangeSection extends FilterSection {
  type: "date-range";
  value: { from?: Date; to?: Date };
  onChange: (range: { from?: Date; to?: Date }) => void;
}

export type FilterSectionConfig =
  | CheckboxSection
  | RadioSection
  | DateRangeSection;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: FilterSectionConfig[];
  title?: string;
  description?: string;
}

export function FilterModal({
  isOpen,
  onClose,
  sections,
  title = "Filters",
  description,
}: FilterModalProps) {
  const { clearFilters } = useSearchStore();

  const activeFilterCount = React.useMemo(() => {
    return sections.reduce((count, section) => {
      if (section.type === "checkbox") {
        return count + section.selectedValues.length;
      }
      if (section.type === "date-range") {
        return count + (section.value.from || section.value.to ? 1 : 0);
      }
      return count;
    }, 0);
  }, [sections]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[min(96vw,42rem)] max-h-[calc(100dvh-2rem)] overflow-hidden border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
              <MaterialSymbol icon={FilterIcon} size={20} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {description}
                </DialogDescription>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="border-none bg-[color:var(--md-sys-color-primary-container)] font-semibold text-[color:var(--md-sys-color-on-primary-container)]"
              >
                {activeFilterCount} active
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100dvh-18rem)] space-y-6 overflow-y-auto px-1 py-1">
          {sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <h4 className="text-[14px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                {section.label}
              </h4>

              {section.type === "checkbox" && (
                <CheckboxGroup
                  options={section.options}
                  selectedValues={section.selectedValues}
                  onToggle={section.onToggle}
                />
              )}

              {section.type === "radio" && (
                <RadioGroup
                  options={section.options}
                  selectedValue={section.selectedValue}
                  onChange={section.onChange}
                />
              )}

              {section.type === "date-range" && (
                <DateRangePicker
                  value={section.value}
                  onChange={section.onChange}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="gap-3">
          {activeFilterCount > 0 && (
            <M3Button variant="outlined" onClick={clearFilters}>
              Clear All
            </M3Button>
          )}
          <M3Button onClick={onClose} className="flex-1">
            Apply Filters
          </M3Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CheckboxGroup({
  options,
  selectedValues,
  onToggle,
}: {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => onToggle(option.value)}
            className={cn(
              "rounded-xl border px-3 py-2 text-[13px] font-medium transition-colors",
              isSelected
                ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-low)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function RadioGroup({
  options,
  selectedValue,
  onChange,
}: {
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-[14px] font-medium transition-colors",
              isSelected
                ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-low)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function DateRangePicker({
  value,
  onChange,
}: {
  value: { from?: Date; to?: Date };
  onChange: (range: { from?: Date; to?: Date }) => void;
}) {
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>({
    from: value.from,
    to: value.to,
  });

  const handleRangeSelect: SelectRangeEventHandler = (range) => {
    setSelectedRange(range);
    onChange({ from: range?.from, to: range?.to });
  };

  const presetRanges = [
    {
      label: "This Month",
      range: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    {
      label: "This Year",
      range: () => ({
        from: startOfYear(new Date()),
        to: endOfYear(new Date()),
      }),
    },
    {
      label: "Clear",
      range: () => ({ from: undefined, to: undefined }),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {presetRanges.map((preset) => (
          <M3Button
            key={preset.label}
            variant="outlined"
            size="sm"
            onClick={() => {
              const range = preset.range();
              setSelectedRange(range);
              onChange(range);
            }}
          >
            {preset.label}
          </M3Button>
        ))}
      </div>

      {selectedRange?.from && (
        <p className="text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
          {format(selectedRange.from, "MMM d, yyyy")}
          {selectedRange.to && ` - ${format(selectedRange.to, "MMM d, yyyy")}`}
        </p>
      )}

      <div className="rdp-container rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-4">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleRangeSelect}
          numberOfMonths={1}
          className="rdp-custom"
        />
      </div>
    </div>
  );
}
