"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight01Icon,
  Clock01Icon,
  Search01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  Chip,
  ChipSet,
  Input,
  M3Button,
} from "@/components/core";
import { cn } from "@/lib/utils";
import { Material } from "@/services/api";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useMockDataStore } from "@/store/useMockDataStore";
import { useCourseStore } from "@/store/useCourseStore";

type CatalogKind = "course" | "lab";
type CatalogLevel = "beginner" | "intermediate" | "advanced";

interface CatalogMaterial extends Material {
  kind: CatalogKind;
  badge: "certificate-track" | "none";
  level: CatalogLevel;
  language: "english";
  durationMinutes: number;
  description?: string;
  courseCode: string;
}

const PAGE_SIZE = 8;

function isLegacySyntheticMaterial(material: Material): boolean {
  return material.id.startsWith("catalog-");
}

function parseDurationMinutes(duration?: string): number | null {
  if (!duration) return null;
  const match = duration.match(/\d+/);
  if (!match) return null;
  const value = Number.parseInt(match[0], 10);
  return Number.isFinite(value) ? value : null;
}

function inferKind(material: Material): CatalogKind {
  return material.type === "zip" ? "lab" : "course";
}

function inferLevel(material: Material): CatalogLevel {
  if (material.type === "past-question") return "advanced";
  if (material.type === "video") return "intermediate";
  return "beginner";
}

function materialDescription(material: Material, courseTitle?: string): string {
  if (material.type === "past-question") {
    return `Assessment preparation material for ${courseTitle ?? material.courseCode}.`;
  }

  const resourceLabel =
    material.type === "video"
      ? "lecture recording"
      : material.type === "zip"
        ? "practical activity package"
        : "course reading resource";

  return `Academic ${resourceLabel} for ${courseTitle ?? material.courseCode}, published by ${material.uploader}.`;
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (remainder === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours} hour${hours > 1 ? "s" : ""} ${remainder} minute${remainder > 1 ? "s" : ""}`;
  }
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}

export default function StudentCatalogPage() {
  const { materials: storeMaterials, setMaterials } = useLibraryStore();
  const fallbackMaterials = useMockDataStore((state) => state.materials);
  const courses = useCourseStore((state) => state.courses);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const [badgeFilter, setBadgeFilter] = React.useState<
    "all" | "certificate-track" | "none"
  >("all");
  const [formatFilter, setFormatFilter] = React.useState<"all" | CatalogKind>(
    "all",
  );
  const [levelFilter, setLevelFilter] = React.useState<"all" | CatalogLevel>(
    "all",
  );
  const [durationFilter, setDurationFilter] = React.useState<
    "all" | "short" | "medium" | "long"
  >("all");

  React.useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedQuery(query.trim().toLowerCase()),
      220,
    );
    return () => clearTimeout(timer);
  }, [query]);

  React.useEffect(() => {
    const existingMaterials = useLibraryStore.getState().materials;
    const sanitizedExisting = existingMaterials.filter(
      (material) => !isLegacySyntheticMaterial(material),
    );

    if (sanitizedExisting.length !== existingMaterials.length) {
      setMaterials(sanitizedExisting, { source: "manual" });
    }

    if (sanitizedExisting.length === 0 && fallbackMaterials.length > 0) {
      setMaterials(
        fallbackMaterials.filter((material) => !isLegacySyntheticMaterial(material)),
        { source: "manual" },
      );
    }

    setLoading(false);
  }, [fallbackMaterials, setMaterials]);

  const materials = React.useMemo<CatalogMaterial[]>(
    () => {
      const courseIdSet = new Set(courses.map((course) => course.id));
      const courseCodeSet = new Set(courses.map((course) => course.code));
      const courseMap = new Map(courses.map((course) => [course.code, course.title]));
      const scopedMaterials =
        courseIdSet.size > 0 || courseCodeSet.size > 0
          ? storeMaterials.filter(
              (material) =>
                (material.courseId && courseIdSet.has(material.courseId)) ||
                courseCodeSet.has(material.courseCode),
            )
          : storeMaterials;

      return scopedMaterials
        .filter(
          (material) =>
            !isLegacySyntheticMaterial(material) &&
            material.visibility !== "private",
        )
        .map((material) => ({
          ...material,
          kind: inferKind(material),
          badge: inferKind(material) === "course" ? "certificate-track" : "none",
          level: inferLevel(material),
          description:
            (material as Partial<CatalogMaterial>).description ??
            materialDescription(material, courseMap.get(material.courseCode)),
          courseCode: material.courseCode,
          durationMinutes:
            parseDurationMinutes(material.duration) ??
            (material.type === "video" ? 45 : material.type === "zip" ? 35 : 30),
          language: "english",
        }));
    },
    [courses, storeMaterials],
  );

  const filteredMaterials = React.useMemo(() => {
    return materials.filter((material) => {
      const matchesQuery =
        debouncedQuery.length === 0 ||
        material.title.toLowerCase().includes(debouncedQuery) ||
        material.description?.toLowerCase().includes(debouncedQuery);

      const matchesBadge =
        badgeFilter === "all" || material.badge === badgeFilter;
      const matchesFormat =
        formatFilter === "all" || material.kind === formatFilter;
      const matchesLevel =
        levelFilter === "all" || material.level === levelFilter;
      const matchesDuration =
        durationFilter === "all" ||
        (durationFilter === "short" && material.durationMinutes <= 30) ||
        (durationFilter === "medium" &&
          material.durationMinutes > 30 &&
          material.durationMinutes <= 60) ||
        (durationFilter === "long" && material.durationMinutes > 60);

      return (
        matchesQuery &&
        matchesBadge &&
        matchesFormat &&
        matchesLevel &&
        matchesDuration
      );
    });
  }, [
    materials,
    debouncedQuery,
    badgeFilter,
    formatFilter,
    levelFilter,
    durationFilter,
  ]);

  React.useEffect(() => {
    setPage(1);
  }, [
    debouncedQuery,
    badgeFilter,
    formatFilter,
    levelFilter,
    durationFilter,
  ]);

  const total = filteredMaterials.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, total);
  const currentItems = filteredMaterials.slice(startIndex, endIndex);

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto w-full max-w-[1360px] space-y-6 sm:space-y-8">
        {/* Hero + Search */}
        <section className="mx-auto max-w-[1120px] rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5 sm:p-7">
          <div className="mx-auto max-w-[800px] space-y-4 text-center">
            <h1 className="m3-headline-large text-[color:var(--md-sys-color-on-surface)]">
              Explore the Academic Resource Library
            </h1>
            <p className="m3-body-large text-[color:var(--md-sys-color-on-surface-variant)]">
              Access curated course materials, guided learning modules, and
              instructional resources aligned with your academic programme.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-[680px]">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources"
              leadingIcon="search"
              trailingIcon={query ? "close" : undefined}
              trailingIconAriaLabel="Clear search"
              onTrailingIconClick={() => setQuery("")}
              className={cn("h-14 w-full m3-body-medium")}
              style={
                {
                  "--md-filled-text-field-container-color":
                    "var(--md-sys-color-surface-container-high)",
                  "--md-filled-text-field-focus-container-color":
                    "var(--md-sys-color-surface-container)",
                  "--md-filled-text-field-hover-container-color":
                    "var(--md-sys-color-surface-container)",
                  "--md-outlined-text-field-container-height": "56px",
                  "--md-filled-text-field-container-height": "56px",
                } as React.CSSProperties
              }
            />
          </div>
        </section>

        {/* Filter Rail */}
        <section className="mx-auto max-w-[1120px]">
          <div className="library-filter-rail flex items-center gap-3 overflow-x-auto pb-2">
            <ChipSet
              variant="filter"
              selectedValues={[badgeFilter]}
              className="library-filter-group shrink-0"
              onSelectionChange={(values) =>
                setBadgeFilter(
                  (values[0] as "all" | "certificate-track" | "none") ?? "all",
                )
              }
            >
              <Chip label="All badges" value="all" />
              <Chip label="Certificate track" value="certificate-track" />
              <Chip label="No badge" value="none" />
            </ChipSet>

            <ChipSet
              variant="filter"
              selectedValues={formatFilter === "all" ? [] : [formatFilter]}
              className="library-filter-group shrink-0"
              onSelectionChange={(values) =>
                setFormatFilter((values[0] as "all" | CatalogKind) ?? "all")
              }
            >
              <Chip label="All formats" value="all" />
              <Chip label="Course" value="course" />
              <Chip label="Lab" value="lab" />
            </ChipSet>

            <ChipSet
              variant="filter"
              selectedValues={levelFilter === "all" ? [] : [levelFilter]}
              className="library-filter-group shrink-0"
              onSelectionChange={(values) =>
                setLevelFilter((values[0] as "all" | CatalogLevel) ?? "all")
              }
            >
              <Chip label="All levels" value="all" />
              <Chip label="Introductory" value="beginner" />
              <Chip label="Intermediate" value="intermediate" />
              <Chip label="Advanced" value="advanced" />
            </ChipSet>

            <ChipSet
              variant="filter"
              selectedValues={durationFilter === "all" ? [] : [durationFilter]}
              className="library-filter-group shrink-0"
              onSelectionChange={(values) =>
                setDurationFilter(
                  (values[0] as "all" | "short" | "medium" | "long") ?? "all",
                )
              }
            >
              <Chip label="All durations" value="all" />
              <Chip label="Under 30 mins" value="short" />
              <Chip label="30-60 mins" value="medium" />
              <Chip label="Over 60 mins" value="long" />
            </ChipSet>
          </div>
        </section>

        {/* Results Count */}
        <div className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
          {total.toLocaleString()} resources
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_unused, idx) => (
              <Card
                key={`skeleton-${idx}`}
                variant="outlined"
                className="h-[280px] animate-pulse"
              />
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <Card
            variant="outlined"
            className="flex min-h-[400px] items-center justify-center text-center p-12"
          >
            <div className="max-w-[400px] space-y-4">
              <MaterialSymbol
                icon={Search01Icon}
                size={40}
                className="mx-auto text-[color:var(--md-sys-color-on-surface-variant)]"
              />
              <p className="m3-body-large text-[color:var(--md-sys-color-on-surface-variant)]">
                No materials match your current filters.
              </p>
              <M3Button
                variant="outlined"
                onClick={() => {
                  setQuery("");
                  setBadgeFilter("all");
                  setFormatFilter("all");
                  setLevelFilter("all");
                  setDurationFilter("all");
                }}
              >
                Reset filters
              </M3Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentItems.map((material) => (
                <Link
                  key={material.id}
                  href={`/library/${material.id}`}
                  aria-label={`Open ${material.title}`}
                  className="group block"
                >
                  <Card
                    variant="outlined"
                    className="flex h-full flex-col overflow-hidden transition-colors m3-motion-short"
                  >
                    <CardContent className="flex flex-1 flex-col p-5">
                      {/* Badges */}
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Chip
                          variant="assist"
                          size="small"
                          label={material.kind === "course" ? "Course" : "Lab"}
                          icon={
                            material.kind === "course"
                              ? "deployed_code"
                              : "change_history"
                          }
                        />
                        {material.badge === "certificate-track" && (
                          <Chip
                            variant="assist"
                            size="small"
                            label="Certificate track"
                            icon="globe_book"
                          />
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="m3-title-large text-[color:var(--md-sys-color-on-surface)]">
                        {material.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-3 m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                        {material.description ||
                          "Engage with course-aligned resources to reinforce lecture content and support continuous academic progress."}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center gap-1.5 m3-label-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                          <MaterialSymbol icon={Clock01Icon} size={16} />
                          {formatDuration(material.durationMinutes)}
                        </div>
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                          aria-hidden="true"
                        >
                          <MaterialSymbol icon={ArrowRight01Icon} size={18} />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between border-t border-[color:var(--md-sys-color-outline-variant)] pt-6">
              <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
                Showing {startIndex + 1} - {endIndex} of{" "}
                {total.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage <= 1}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    safePage <= 1
                      ? "text-[color:var(--md-sys-color-outline)]"
                      : "text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                  )}
                  aria-label="Previous page"
                >
                  <MaterialSymbol icon="chevron_left" size={20} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(pageCount, prev + 1))
                  }
                  disabled={safePage >= pageCount}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    safePage >= pageCount
                      ? "text-[color:var(--md-sys-color-outline)]"
                      : "text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                  )}
                  aria-label="Next page"
                >
                  <MaterialSymbol icon="chevron_right" size={20} />
                </button>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

