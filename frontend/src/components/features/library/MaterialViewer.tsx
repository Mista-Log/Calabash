"use client";

import * as React from "react";
import { DocumentViewer } from "./DocumentViewer";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button, Card, CardContent } from "@/components/core";
import type { Material } from "@/services/api";

interface MaterialViewerRouterProps {
  material: Material;
  courseTitle?: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function MaterialViewerRouter({ 
  material, 
  courseTitle,
  onComplete,
  isCompleted = false 
}: MaterialViewerRouterProps) {
  const [showDownloadPrompt, setShowDownloadPrompt] = React.useState(false);

  // Video Viewer Component
  function VideoViewer() {
    const videoUrl = material.youtubeUrl || material.url;
    const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');

    if (isYouTube && videoUrl) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="aspect-video rounded-2xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={material.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4 p-4 bg-[color:var(--md-sys-color-surface-container-low)] rounded-xl">
            <h3 className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              {material.title}
            </h3>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              {material.courseCode} • Uploaded by {material.uploader}
            </p>
          </div>
        </div>
      );
    }

    // For non-YouTube videos, show download prompt
    return (
      <Card className="w-full max-w-md mx-auto p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-[color:var(--md-sys-color-primary-container)] flex items-center justify-center">
            <MaterialSymbol icon="video_file" size={32} className="text-[color:var(--md-sys-color-on-primary-container)]" />
          </div>
        </div>
        <h3 className="text-[18px] font-semibold mb-2 text-[color:var(--md-sys-color-on-surface)]">
          Video File
        </h3>
        <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)] mb-6">
          This video needs to be downloaded to view.
        </p>
        <M3Button onClick={() => window.open(material.url, '_blank')}>
          <MaterialSymbol icon="download" size={18} />
          Download Video
        </M3Button>
      </Card>
    );
  }

  // Image Viewer Component
  function ImageViewer() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [scale, setScale] = React.useState(1);

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            {material.title}
          </h3>
          <div className="flex gap-2">
            <M3Button size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.25))}>
              <MaterialSymbol icon="remove" size={18} />
            </M3Button>
            <span className="flex items-center text-[14px] font-medium">
              {Math.round(scale * 100)}%
            </span>
            <M3Button size="sm" onClick={() => setScale(s => Math.min(2, s + 0.25))}>
              <MaterialSymbol icon="add" size={18} />
            </M3Button>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0 bg-[color:var(--md-sys-color-surface-container-low)] overflow-auto">
            {error ? (
              <div className="p-8 text-center">
                <MaterialSymbol icon="error" size={48} className="mx-auto mb-2 text-[color:var(--md-sys-color-error)]" />
                <p className="text-[color:var(--md-sys-color-on-surface-variant)]">Failed to load image</p>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <img
                  src={material.url}
                  alt={material.title}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setError("Failed to load image");
                    setIsLoading(false);
                  }}
                  style={{ 
                    transform: `scale(${scale})`,
                    maxWidth: '100%',
                    transition: 'transform 0.2s ease'
                  }}
                  className={isLoading ? 'opacity-50' : 'opacity-100'}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Download Prompt Component
  function DownloadPrompt() {
    return (
      <Card className="w-full max-w-md mx-auto p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-[color:var(--md-sys-color-secondary-container)] flex items-center justify-center">
            <MaterialSymbol icon="download" size={32} className="text-[color:var(--md-sys-color-on-secondary-container)]" />
          </div>
        </div>
        <h3 className="text-[18px] font-semibold mb-2 text-[color:var(--md-sys-color-on-surface)]">
          Download Required
        </h3>
        <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)] mb-6">
          This {material.type} file needs to be downloaded to view.
        </p>
        <div className="flex gap-2 justify-center">
          <M3Button variant="outlined" onClick={() => window.open(material.url, '_blank')}>
            Open in New Tab
          </M3Button>
          <M3Button onClick={() => window.open(material.url, '_blank')}>
            <MaterialSymbol icon="download" size={18} />
            Download
          </M3Button>
        </div>
      </Card>
    );
  }

  // Render based on material type
  switch (material.type) {
    case 'pdf':
      return <DocumentViewer url={material.url} title={material.title} />;
    
    case 'video':
      return <VideoViewer />;
    
    case 'image':
      return <ImageViewer />;
    
    case 'past-question':
      // Past questions are typically PDFs
      return <DocumentViewer url={material.url} title={material.title} />;
    
    case 'zip':
    default:
      return <DownloadPrompt />;
  }
}
