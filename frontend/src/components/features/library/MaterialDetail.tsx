"use client";

import * as React from "react";
import {
  ArrowLeft01Icon,
  Download01Icon,
  Share01Icon,
  BookmarkIcon,
  CourseIcon,
  UserIcon,
  Calendar03Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Material } from "@/services/api";
import dynamic from "next/dynamic";

const DocumentViewer = dynamic(
  () =>
    import("@/components/features/library/DocumentViewer").then(
      (mod) => mod.DocumentViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center gap-4 p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium">Loading Document Viewer...</p>
      </div>
    ),
  },
);

import { Button, Badge, Card, CardContent, Separator } from "@/components/core";

interface MaterialDetailProps {
  material: Material;
}

export function MaterialDetail({ material }: MaterialDetailProps) {
  const isVideo = material.type === "video";
  const isPdf = material.type === "pdf" || material.type === "past-question";

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Link href="/library">
          <Button
            variant="ghost"
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            Back to Library
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10">
            <HugeiconsIcon icon={BookmarkIcon} size={18} />
            Save to Notes
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10">
            <HugeiconsIcon icon={Share01Icon} size={18} />
            Share
          </Button>
          <Button className="gap-2 rounded-xl h-10 shadow-lg shadow-primary/20">
            <HugeiconsIcon icon={Download01Icon} size={18} />
            Download {material.size && `(${material.size})`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content Area (Resource Viewer) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-border/40 bg-card shadow-sm">
            {isVideo ? (
              <div className="aspect-video bg-black flex items-center justify-center group relative">
                {/* Mock Video Player */}
                <video
                  src={material.url}
                  controls
                  className="w-full h-full object-contain"
                  poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                />
              </div>
            ) : isPdf ? (
              <div className="bg-accent/5 p-4 md:p-8">
                <DocumentViewer url={material.url} title={material.title} />
              </div>
            ) : (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={40}
                    className="text-primary"
                  />
                </div>
                <h3 className="text-xl font-bold">Preview not available</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  This file type ({material.type}) cannot be previewed directly.
                  Please download it to view the content.
                </p>
                <Button className="mt-8 gap-2">
                  <HugeiconsIcon icon={Download01Icon} size={18} />
                  Download Resource
                </Button>
              </div>
            )}
          </div>

          {/* Info Card for mobile/smaller screens */}
          <Card className="xl:hidden">
            <CardContent className="p-6 space-y-6">
              <MaterialInfo material={material} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info (Desktop) */}
        <div className="hidden xl:block space-y-6">
          <Card className="sticky top-8 border-border/40">
            <CardContent className="p-6 space-y-8">
              <MaterialInfo material={material} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MaterialInfo({ material }: { material: Material }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Badge
          variant="secondary"
          className="bg-primary/5 text-primary border-none font-bold uppercase tracking-widest text-xs"
        >
          {material.courseCode}
        </Badge>
        <h1 className="text-2xl font-bold leading-tight">{material.title}</h1>
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <HugeiconsIcon icon={UserIcon} size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Uploader
            </p>
            <p className="text-sm font-bold">{material.uploader}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <HugeiconsIcon icon={Calendar03Icon} size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Upload Date
            </p>
            <p className="text-sm font-bold">
              {new Date(material.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <HugeiconsIcon icon={CourseIcon} size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Semester
            </p>
            <p className="text-sm font-bold">{material.semester}</p>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground px-1">
          Description
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This resource was curated to help students in {material.courseCode}{" "}
          better understand the core concepts. Make sure to review the
          accompanying notes and participate in the course Q&A if you have
          questions.
        </p>
      </div>
    </div>
  );
}
