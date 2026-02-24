"use client";

<<<<<<< HEAD
import * as React from "react";
=======
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
import {
  Search01Icon,
  FilterIcon,
  Sorting05Icon,
  Grid02Icon,
  AlignLeftIcon,
<<<<<<< HEAD
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialCard } from "@/components/library/MaterialCard";
import {
  Button,
  Input,
=======
  Calendar03Icon,
  Upload02Icon,
  UserIcon,
  PlayIcon,
  DocumentCodeIcon,
} from "@hugeicons/core-free-icons";
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialCard } from "@/components/features/library/MaterialCard";
import dynamic from "next/dynamic";

const PdfPreview = dynamic(
  () => import("@/components/features/library/PdfPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center gap-4 p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium">Loading Previewer...</p>
      </div>
    ),
  },
);

import {
  DayPicker,
  SelectRangeEventHandler,
  DateRange,
} from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  format,
  isAfter,
  isBefore,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

import {
  Button,
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
<<<<<<< HEAD
} from "@/components/core";
import { CalabashApiService, Material } from "@/services/api";

const CATEGORIES = ["All", "PDFs", "Past Questions", "Videos", "Lab Manuals"];
=======
  SearchInput,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Field,
  FieldLabel,
  Input,
} from "@/components/core";
import TiptapEditor from "@/components/core/tiptap-editor";
import { Material } from "@/services/api";
import { MOCK_MATERIALS } from "@/data/mock-data";
import { EmptyState } from "@/components/core/empty-state";
import { cn } from "@/lib/utils";

const MATERIAL_TYPES = ["All", "pdf", "past-question", "video", "zip"];

const MaterialPreviewContent: React.FC<{ material: Material }> = ({
  material,
}) => {
  if (!material) return null;

  switch (material.type) {
    case "video":
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black flex items-center justify-center">
          <video
            controls
            className="absolute inset-0 w-full h-full object-contain"
          >
            <source src={material.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    case "pdf":
      return <PdfPreview url={material.url} />;
    case "zip":
    case "past-question":
    default:
      return (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted/20 flex items-center justify-center border border-border/50">
          <HugeiconsIcon
            icon={DocumentCodeIcon}
            size={48}
            className="text-muted-foreground/50"
          />
          <p className="absolute text-muted-foreground/70">
            Preview Not Available
          </p>
        </div>
      );
  }
};
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e

export default function DiscoveryPage() {
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("All");
<<<<<<< HEAD

  React.useEffect(() => {
    CalabashApiService.getDashboardData().then((data) => {
      setMaterials(data.recentMaterials);
      setLoading(false);
    });
  }, []);

=======
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedMaterial, setSelectedMaterial] =
    React.useState<Material | null>(null);

  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState("All");
  const [filterUploader, setFilterUploader] = React.useState("");
  const [selectedDateRange, setSelectedDateRange] = React.useState<
    DateRange | undefined
  >(undefined);
  const [sortBy, setSortBy] = React.useState<
    "newest" | "oldest" | "course_code"
  >("newest");

  const ITEMS_PER_PAGE = 10;
  const [displayLimit, setDisplayLimit] = React.useState(ITEMS_PER_PAGE);

  const [newComment, setNewComment] = React.useState("");
  const [comments, setComments] = React.useState<
    { id: string; user: string; content: string; date: string }[]
  >([
    {
      id: "1",
      user: "Alice Smith",
      content: "<p>Great resource! Very helpful for my studies.</p>",
      date: "2023-01-15",
    },
    {
      id: "2",
      user: "Bob Johnson",
      content: "<p>The video explanation for this concept is really clear.</p>",
      date: "2023-01-16",
    },
  ]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          user: "Current User",
          content: newComment,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewComment("");
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials(MOCK_MATERIALS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMaterials = React.useMemo(() => {
    let filtered = materials.filter((m) => {
      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "PDFs" && m.type === "pdf") ||
        (activeCategory === "Past Questions" && m.type === "past-question") ||
        (activeCategory === "Videos" && m.type === "video") ||
        (activeCategory === "Lab Manuals" && m.type === "zip");

      const matchesSearch =
        m.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        m.courseCode
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        m.uploader.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesType = filterType === "All" || m.type === filterType;
      const matchesUploader =
        filterUploader === "" ||
        filterUploader
          .split(",")
          .some((uploader) =>
            m.uploader.toLowerCase().includes(uploader.trim().toLowerCase()),
          ); // Support multiple uploaders
      const matchesDateRange = () => {
        if (
          !selectedDateRange ||
          (!selectedDateRange.from && !selectedDateRange.to)
        )
          return true;
        const uploadDate = new Date(m.uploadDate);
        const from = selectedDateRange.from
          ? new Date(selectedDateRange.from.setHours(0, 0, 0, 0))
          : undefined;
        const to = selectedDateRange.to
          ? new Date(selectedDateRange.to.setHours(23, 59, 59, 999))
          : undefined;

        if (from && isBefore(uploadDate, from)) return false;
        if (to && isAfter(uploadDate, to)) return false;
        return true;
      };

      return (
        matchesCategory &&
        matchesSearch &&
        matchesType &&
        matchesUploader &&
        matchesDateRange()
      );
    });

    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        );
      }
      if (sortBy === "course_code") {
        return a.courseCode.localeCompare(b.courseCode);
      }
      return 0;
    });

    return filtered;
  }, [
    materials,
    activeCategory,
    debouncedSearchQuery,
    filterType,
    filterUploader,
    selectedDateRange,
    sortBy,
  ]);

  const handleDateRangeSelect: SelectRangeEventHandler = (range) => {
    setSelectedDateRange(range);
  };

  const clearAdvancedFilters = () => {
    setFilterType("All");
    setFilterUploader("");
    setSelectedDateRange(undefined);
    setIsAdvancedFilterOpen(false);
  };

  const footerDateText = selectedDateRange?.from
    ? selectedDateRange.to
      ? `${format(selectedDateRange.from, "PPP")} - ${format(selectedDateRange.to, "PPP")}`
      : format(selectedDateRange.from, "PPP")
    : "Select date range";

>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
<<<<<<< HEAD
            <h1 className="text-3xl font-bold tracking-tight">
=======
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
              Material Discovery
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore thousands of academic resources curated for your
              department.
            </p>
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <Button variant="outline" size="sm" className="gap-2">
              <HugeiconsIcon icon={AlignLeftIcon} size={16} /> List
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-accent/10">
=======
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => setViewMode("list")}
            >
              <HugeiconsIcon icon={AlignLeftIcon} size={16} /> List
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => setViewMode("grid")}
            >
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
              <HugeiconsIcon icon={Grid02Icon} size={16} /> Grid
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
<<<<<<< HEAD
        <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute left-3 top-2.5 text-muted-foreground"
            />
            <Input
              placeholder="Search by title, course code, or instructor..."
              className="pl-10 h-10 border-none shadow-none focus-visible:ring-1"
=======
        <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-md lg:flex-row lg:items-center shadow-sm">
          <div className="relative flex-1">
            <SearchInput
              placeholder="Search by title, course code, or instructor..."
              className="border-none bg-transparent shadow-none focus:bg-transparent w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search materials"
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                <Button variant="outline" className="gap-2 h-10">
                  <HugeiconsIcon icon={Sorting05Icon} size={18} /> Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem>Newest First</DropdownMenuItem>
                <DropdownMenuItem>Oldest First</DropdownMenuItem>
                <DropdownMenuItem>By Course Code</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="gap-2 h-10 lg:w-fit">
=======
                <Button variant="outline" className="gap-2 h-10 rounded-xl">
                  <HugeiconsIcon icon={Sorting05Icon} size={18} /> Sort By:{" "}
                  {sortBy
                    .replace("_", " ")
                    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("course_code")}>
                  By Course Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="gap-2 h-10 rounded-xl lg:w-fit"
              onClick={() => setIsAdvancedFilterOpen(true)} // Open advanced filter dialog
            >
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
              <HugeiconsIcon icon={FilterIcon} size={18} /> Advanced
            </Button>
          </div>
        </div>

        {/* Category Filter */}
<<<<<<< HEAD
        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 transition-all"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
=======
        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar pt-2">
          {MATERIAL_TYPES.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 transition-all duration-300 text-sm font-bold rounded-full",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50",
              )}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "zip"
                ? "Lab Manuals"
                : cat === "pdf"
                  ? "PDFs"
                  : cat === "past-question"
                    ? "Past Questions"
                    : cat === "video"
                      ? "Videos"
                      : "All"}
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
            </Badge>
          ))}
        </div>

<<<<<<< HEAD
        {/* Results Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[200px] rounded-xl bg-accent/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {materials.map((m) => (
              <MaterialCard
                key={m.id}
                material={m}
                onView={(mat) => console.warn("Viewing:", mat.title)}
              />
            ))}
            {/* Mocking more items for visual density */}
            {[1, 2, 3].map((i) => (
              <MaterialCard
                key={`mock-${i}`}
                material={{
                  ...materials[0],
                  id: `mocked-${i}`,
                  title: `${materials[0].title} v${i + 1}`,
                }}
                onView={(mat) => console.warn("Viewing:", mat.title)}
              />
            ))}
          </div>
        )}

        {!loading && materials.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <HugeiconsIcon
                icon={Search01Icon}
                size={40}
                className="text-primary/40"
              />
            </div>
            <h3 className="text-lg font-semibold">No materials found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
=======
        {/* Results Grid/List */}
        {loading ? (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1",
            )}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-muted/30 animate-pulse rounded-2xl", // Updated loading skeleton style
                  viewMode === "grid" ? "h-[220px]" : "h-28", // Adjusted height for better visual
                )}
              />
            ))}
          </div>
        ) : filteredMaterials.length > 0 ? (
          <>
            <div
              className={cn(
                "grid gap-6 animate-in fade-in-50",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" // Enhanced responsive grid
                  : "grid-cols-1 divide-y divide-border/50", // Added divider for list view
              )}
            >
              {filteredMaterials.slice(0, displayLimit).map((m) => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  variant={viewMode}
                  onView={(mat) => setSelectedMaterial(mat)}
                />
              ))}
            </div>
            {displayLimit < filteredMaterials.length && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() =>
                    setDisplayLimit((prev) => prev + ITEMS_PER_PAGE)
                  }
                  className="rounded-xl h-11 font-bold px-8"
                >
                  Load More ({filteredMaterials.length - displayLimit}{" "}
                  remaining)
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Search01Icon}
            title="No materials found"
            description={`We couldn't find any resources matching "${searchQuery}" in ${activeCategory}.`}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </Button>
            }
          />
        )}
      </div>

      {/* Preview Modal */}
      <Dialog
        open={!!selectedMaterial}
        onOpenChange={(open) => !open && setSelectedMaterial(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
            <DialogDescription>
              {selectedMaterial?.courseCode} • {selectedMaterial?.uploadDate}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedMaterial && (
              <MaterialPreviewContent material={selectedMaterial} /> // Use new component
            )}
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary uppercase">
                {selectedMaterial?.uploader.charAt(0)}
              </span>
              Uploaded by{" "}
              <span className="font-bold text-foreground">
                {selectedMaterial?.uploader}
              </span>
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-lg font-bold text-foreground">Comments</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 bg-muted/20 rounded-lg border border-border/30"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground text-sm">
                        {comment.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.date}
                      </span>
                    </div>
                    <div
                      className="prose prose-sm dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              )}
            </div>

            <div className="mt-4">
              <TiptapEditor
                content={newComment}
                onUpdate={setNewComment}
                placeholder="Add a comment..."
              />
              <Button onClick={handleAddComment} className="mt-2 w-full">
                Post Comment
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedMaterial(null)}>
              Close
            </Button>
            <Button>Download Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filter Dialog */}
      <Dialog
        open={isAdvancedFilterOpen}
        onOpenChange={setIsAdvancedFilterOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Refine your search with more specific criteria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <HugeiconsIcon icon={Upload02Icon} size={18} /> Material Type
              </FieldLabel>
              <div className="flex flex-wrap gap-2">
                {MATERIAL_TYPES.map((type) => (
                  <Badge
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterType(type)}
                  >
                    {type === "zip"
                      ? "Lab Manual"
                      : type === "pdf"
                        ? "PDF"
                        : type === "past-question"
                          ? "Past Question"
                          : type === "video"
                            ? "Video"
                            : "All"}
                  </Badge>
                ))}
              </div>
            </Field>
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} size={18} /> Uploader
              </FieldLabel>
              <Input
                placeholder="Filter by uploader name"
                value={filterUploader}
                onChange={(e) => setFilterUploader(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar03Icon} size={18} /> Date Range
              </FieldLabel>
              <div className="grid gap-2">
                <DayPicker
                  mode="range"
                  selected={selectedDateRange}
                  onSelect={handleDateRangeSelect}
                  className="rounded-xl bg-muted/10 p-4 border border-border/50"
                  classNames={{
                    months:
                      "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
                    caption: "flex justify-center py-2 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_icon: "h-4 w-4",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    day_range_end: "day-range-end",
                    day_selected:
                      "rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent/20 text-accent-foreground",
                    day_outside:
                      "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                    day_range_start: "day-range-start",
                  }}
                  styles={{
                    month: { width: "100%", borderCollapse: "collapse" },
                    day: { borderRadius: "0.5rem" }, // Rounded days
                  }}
                />
                <div className="text-sm text-muted-foreground text-center">
                  {footerDateText}
                </div>
              </div>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => clearAdvancedFilters()}>
              Clear Filters
            </Button>
            <Button onClick={() => setIsAdvancedFilterOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
    </MainLayout>
  );
}
