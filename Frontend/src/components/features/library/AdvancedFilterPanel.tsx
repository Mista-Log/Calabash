"use client";

import { FilterIcon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@/components/core";
import { useSearchStore, MaterialType } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";

interface AdvancedFilterPanelProps {
  availableCourses: string[];
  onClose?: () => void;
}

const materialTypeOptions: { value: MaterialType; label: string }[] = [
  { value: "pdf", label: "PDF Documents" },
  { value: "video", label: "Videos" },
  { value: "past-question", label: "Past Questions" },
  { value: "zip", label: "ZIP Archives" },
];

export function AdvancedFilterPanel({
  availableCourses,
  onClose,
}: AdvancedFilterPanelProps) {
  const {
    filters,
    toggleCourse,
    toggleSemester,
    toggleMaterialType,
    clearFilters,
  } = useSearchStore();

  const activeFilterCount =
    filters.courses.length +
    filters.semesters.length +
    filters.materialTypes.length;

  return (
    <Card className="border-muted/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
            ⚙
          </div>
          <CardTitle className="text-lg font-bold">Advanced Filters</CardTitle>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-none font-bold text-xs"
            >
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center text-2xl leading-none text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Course Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold">Course</h4>
          <div className="flex flex-wrap gap-2">
            {availableCourses.map((course) => (
              <button
                key={course}
                onClick={() => toggleCourse(course)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2",
                  filters.courses.includes(course)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                )}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Semester Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold">Semester</h4>
          <div className="flex gap-2">
            {[1, 2].map((semester) => (
              <button
                key={semester}
                onClick={() => toggleSemester(semester)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2",
                  filters.semesters.includes(semester)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                )}
              >
                Semester {semester}
              </button>
            ))}
          </div>
        </div>

        {/* Material Type Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold">Material Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {materialTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleMaterialType(option.value)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                  filters.materialTypes.includes(option.value)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        {activeFilterCount > 0 && (
          <div className="flex gap-3 pt-4 border-t border-muted/10">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1 font-bold"
            >
              Clear All
            </Button>
            {onClose && (
              <Button onClick={onClose} className="flex-1 font-bold shadow-lg">
                Apply Filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
