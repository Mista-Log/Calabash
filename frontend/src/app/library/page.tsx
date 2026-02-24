"use client";

import * as React from "react";
import {
  Search01Icon,
  FilterIcon,
  Sorting05Icon,
  Grid02Icon,
  AlignLeftIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialCard } from "@/components/library/MaterialCard";
import {
  Button,
  Input,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/core";
import { CalabashApiService, Material } from "@/services/api";

const CATEGORIES = ["All", "PDFs", "Past Questions", "Videos", "Lab Manuals"];

export default function DiscoveryPage() {
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("All");

  React.useEffect(() => {
    CalabashApiService.getDashboardData().then((data) => {
      setMaterials(data.recentMaterials);
      setLoading(false);
    });
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Material Discovery
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore thousands of academic resources curated for your
              department.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <HugeiconsIcon icon={AlignLeftIcon} size={16} /> List
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-accent/10">
              <HugeiconsIcon icon={Grid02Icon} size={16} /> Grid
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
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
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
              <HugeiconsIcon icon={FilterIcon} size={18} /> Advanced
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 transition-all"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

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
    </MainLayout>
  );
}
