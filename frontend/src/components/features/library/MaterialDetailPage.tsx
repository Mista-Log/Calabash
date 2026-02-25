"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button, Card, CardContent, Chip, Badge } from "@/components/core";
import { MaterialViewerRouter } from "./MaterialViewer";
import { MaterialBookmarks } from "./MaterialBookmarks";
import { MaterialNavigation } from "./MaterialNavigation";
import { useMaterialProgress } from "@/hooks/useMaterialProgress";
import { useUserStore } from "@/store/useUserStore";
import type { Material } from "@/services/api";

interface MaterialDetailPageProps {
  material: Material;
  courseMaterials?: Material[];
  courseTitle?: string;
}

export function MaterialDetailPage({ 
  material, 
  courseMaterials = [],
  courseTitle 
}: MaterialDetailPageProps) {
  const params = useParams();
  const { user } = useUserStore();
  const [showBookmarks, setShowBookmarks] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const {
    isCompleted,
    viewCount,
    markComplete,
    markIncomplete,
    trackView,
  } = useMaterialProgress(material.id, user?.id);

  // Track view on mount
  React.useEffect(() => {
    trackView();
  }, []);

  const handleNavigate = (newMaterial: Material) => {
    // In real implementation, this would update the URL
    // For now, just trigger a re-render
    window.location.reload();
  };

  const getTypeIcon = (type: Material['type']) => {
    const icons: Record<Material['type'], string> = {
      'pdf': 'description',
      'video': 'video_file',
      'past-question': 'quiz',
      'zip': 'folder_zip',
      'image': 'image',
    };
    return icons[type] || 'description';
  };

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto max-w-[1400px] space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Chip
                variant="assist"
                size="small"
                label={material.type.toUpperCase()}
                icon={getTypeIcon(material.type)}
              />
              <Chip
                variant="assist"
                size="small"
                label={`Semester ${material.semester}`}
              />
              {isCompleted && (
                <Badge variant="secondary" className="bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                  <MaterialSymbol icon="check_circle" size={14} />
                  Completed
                </Badge>
              )}
            </div>
            <h1 className="text-[24px] md:text-[30px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              {material.title}
            </h1>
            {courseTitle && (
              <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                {courseTitle} • {material.courseCode}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
              <span>By {material.uploader}</span>
              <span>•</span>
              <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
              <span>•</span>
              <span>{viewCount} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <M3Button
              variant={isCompleted ? "filled" : "outlined"}
              onClick={isCompleted ? markIncomplete : markComplete}
              className="gap-2"
            >
              <MaterialSymbol icon={isCompleted ? "check_circle" : "radio_button_unchecked"} size={18} />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </M3Button>
            <M3Button
              variant="outlined"
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="gap-2"
            >
              <MaterialSymbol icon={showBookmarks ? "bookmark_remove" : "bookmark_add"} size={18} />
              Bookmarks
            </M3Button>
            <M3Button
              onClick={() => window.open(material.url, '_blank')}
              className="gap-2"
            >
              <MaterialSymbol icon="download" size={18} />
              Download
            </M3Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Viewer */}
          <div>
            <MaterialViewerRouter
              material={material}
              courseTitle={courseTitle}
              onComplete={markComplete}
              isCompleted={isCompleted}
            />

            {/* Material Navigation */}
            {courseMaterials.length > 1 && (
              <MaterialNavigation
                materials={courseMaterials}
                currentMaterialId={material.id}
                onNavigate={handleNavigate}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Bookmarks Panel */}
            {showBookmarks && (
              <Card>
                <CardContent className="p-4">
                  <MaterialBookmarks
                    materialId={material.id}
                    currentPage={currentPage}
                    onNavigateToPage={setCurrentPage}
                  />
                </CardContent>
              </Card>
            )}

            {/* Material Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  Material Details
                </h3>
                <div className="space-y-2 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Type:</span>
                    <span className="font-medium text-[color:var(--md-sys-color-on-surface)] capitalize">
                      {material.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Course:</span>
                    <span className="font-medium text-[color:var(--md-sys-color-on-surface)]">
                      {material.courseCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Semester:</span>
                    <span className="font-medium text-[color:var(--md-sys-color-on-surface)]">
                      {material.semester}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Uploaded:</span>
                    <span className="font-medium text-[color:var(--md-sys-color-on-surface)]">
                      {new Date(material.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  {material.size && (
                    <div className="flex justify-between">
                      <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Size:</span>
                      <span className="font-medium text-[color:var(--md-sys-color-on-surface)]">
                        {material.size}
                      </span>
                    </div>
                  )}
                  {material.duration && (
                    <div className="flex justify-between">
                      <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Duration:</span>
                      <span className="font-medium text-[color:var(--md-sys-color-on-surface)]">
                        {material.duration}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-[14px] font-semibold mb-3 text-[color:var(--md-sys-color-on-surface)]">
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  <div className="flex justify-between">
                    <span>Previous page</span>
                    <kbd className="px-2 py-0.5 rounded bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]">←</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Next page</span>
                    <kbd className="px-2 py-0.5 rounded bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]">→</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom in</span>
                    <kbd className="px-2 py-0.5 rounded bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]">Ctrl +</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom out</span>
                    <kbd className="px-2 py-0.5 rounded bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]">Ctrl -</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
