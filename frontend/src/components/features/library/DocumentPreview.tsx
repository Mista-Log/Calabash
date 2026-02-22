import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  File01Icon,
  PlayCircleIcon,
  AlertCircleIcon,
} from "@/lib/icons/material-icons";
import { cn } from "@/lib/utils";
import { Material } from "@/services/api";

interface DocumentPreviewProps {
  material: Material;
  className?: string;
}

export function DocumentPreview({ material, className }: DocumentPreviewProps) {
  const [error, setError] = React.useState(false);

  // Helper to determine content type rendering
  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 p-6">
          <MaterialSymbol
            icon={AlertCircleIcon}
            size={48}
            className="text-destructive/50"
          />
          <p className="font-semibold">Unable to load preview</p>
        </div>
      );
    }

    switch (material.type) {
      case "pdf":
      case "past-question": // Assuming past questions are PDFs for now
        return (
          <iframe
            src={`${material.url}#toolbar=0`}
            className="w-full h-full rounded-lg bg-white"
            title={material.title}
            onError={() => setError(true)}
          />
        );
      case "video":
        return (
          <div className="relative w-full h-full bg-black rounded-lg flex items-center justify-center group cursor-pointer">
            {/* Placeholder for actual video player */}
            <video
              src={material.url}
              controls
              className="w-full h-full rounded-lg max-h-[60vh]"
              onError={() => setError(true)}
              poster="/video-placeholder.png" // You might want a generic placeholder logic
            >
              <div className="flex flex-col items-center gap-4">
                <MaterialSymbol
                  icon={PlayCircleIcon}
                  size={64}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
                <p className="text-white font-medium">Video Preview</p>
              </div>
            </video>
          </div>
        );
      case "image": // added for completeness
        return (
          <img
            src={material.url}
            alt={material.title}
            className="w-full h-full object-contain rounded-lg"
            onError={() => setError(true)}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 bg-muted/10 rounded-lg border-2 border-dashed border-muted">
            <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
              <MaterialSymbol icon={File01Icon} size={40} />
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">Preview not available</p>
              <p className="text-sm">Download the file to view its contents.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "w-full h-[60vh] min-h-[400px] bg-background/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50",
        className,
      )}
    >
      {renderContent()}
    </div>
  );
}

