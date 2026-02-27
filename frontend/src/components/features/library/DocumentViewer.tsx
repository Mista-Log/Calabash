"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Download01Icon,
  DocumentCodeIcon,
} from "@/lib/icons/material-icons";
import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  M3Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/core";
import {
  resolveUrlDownloadAction,
  runMaterialAction,
} from "@/lib/material-actions";

// Set up worker for react-pdf using CDN
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface DocumentViewerProps {
  url: string;
  title: string;
}

export function DocumentViewer({ url, title }: DocumentViewerProps) {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [scale, setScale] = React.useState(1.0);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const downloadAction = React.useMemo(
    () => resolveUrlDownloadAction(url),
    [url],
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [fitToWidth, setFitToWidth] = React.useState(false);

  // Measure container width for fit-to-width
  React.useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate scale based on fit-to-width setting
  const calculatedScale = React.useMemo(() => {
    if (fitToWidth && containerWidth > 0) {
      // Account for padding and margins
      const availableWidth = containerWidth - 64;
      const pdfStandardWidth = 600;
      return Math.min(availableWidth / pdfStandardWidth, 2);
    }
    return scale;
  }, [fitToWidth, containerWidth, scale]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    setError(error.message || "Failed to load document");
    setIsLoading(false);
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'ArrowRight' && pageNumber < (numPages || 0)) {
        setPageNumber(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && pageNumber > 1) {
        setPageNumber(prev => prev - 1);
      } else if (e.key === '+' && e.ctrlKey) {
        setScale(s => Math.min(2, s + 0.1));
      } else if (e.key === '-' && e.ctrlKey) {
        setScale(s => Math.max(0.5, s - 0.1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    }
  };

  // Loading fallback
  function LoadingFallback() {
    return (
      <div className="flex flex-col items-center gap-6 p-20">
        <div className="h-16 w-16 rounded-2xl bg-[color:var(--md-sys-color-primary-container)] flex items-center justify-center animate-pulse">
          <MaterialSymbol 
            icon={DocumentCodeIcon} 
            size={32} 
            className="text-[color:var(--md-sys-color-on-primary-container)]" 
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            Loading document...
          </p>
          <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
            This may take a moment depending on file size
          </p>
        </div>
      </div>
    );
  }

  // Error fallback
  function ErrorFallback() {
    return (
      <Card className="w-full max-w-md mx-auto p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-14 w-14 rounded-full bg-[color:var(--md-sys-color-error-container)] flex items-center justify-center">
            <MaterialSymbol 
              icon="error" 
              size={28} 
              className="text-[color:var(--md-sys-color-on-error-container)]" 
            />
          </div>
        </div>
        <h3 className="text-[18px] font-semibold mb-2 text-[color:var(--md-sys-color-on-surface)]">
          Failed to load document
        </h3>
        <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)] mb-6">
          {error || "An unknown error occurred"}
        </p>
        <div className="flex gap-2 justify-center">
          <M3Button
            variant="outlined"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setPageNumber(1);
            }}
          >
            Retry
          </M3Button>
          <M3Button
            onClick={() => window.open(url, '_blank')}
          >
            Open in New Tab
          </M3Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-none bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] shrink-0">
            <MaterialSymbol icon={DocumentCodeIcon} size={24} />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-[16px] md:text-[18px] leading-none truncate">
              {title}
            </CardTitle>
            <span className="text-[12px] md:text-[13px] text-muted-foreground mt-1 block">
              Page {pageNumber} of {numPages || "--"}
            </span>
          </div>
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <M3Button
            size="sm"
            onClick={() => setFitToWidth(!fitToWidth)}
            variant={fitToWidth ? "filled" : "outlined"}
            title="Fit to width"
          >
            <MaterialSymbol icon={fitToWidth ? "check" : "fit_width"} size={18} />
          </M3Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <M3Button
            size="sm"
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            disabled={fitToWidth}
            title="Zoom In (Ctrl +)"
          >
            <MaterialSymbol icon={ArrowUp01Icon} size={18} />
          </M3Button>
          <M3Button
            size="sm"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            disabled={fitToWidth}
            title="Zoom Out (Ctrl -)"
          >
            <MaterialSymbol icon={ArrowDown01Icon} size={18} />
          </M3Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <M3Button
            size="sm"
            onClick={() => {
              runMaterialAction(downloadAction);
            }}
            disabled={downloadAction.kind === "none"}
            title={
              downloadAction.kind === "none"
                ? downloadAction.reason
                : "Download file"
            }
          >
            <MaterialSymbol icon={Download01Icon} size={18} />
          </M3Button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-1">
          <M3Button
            size="sm"
            onClick={() => {
              runMaterialAction(downloadAction);
            }}
            disabled={downloadAction.kind === "none"}
            title="Download"
          >
            <MaterialSymbol icon={Download01Icon} size={18} />
          </M3Button>
        </div>
      </CardHeader>

      <CardContent 
        ref={containerRef}
        className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[600px] bg-[color:var(--md-sys-color-surface-container-low)] p-4 md:p-8 overflow-auto"
      >
        {error ? (
          <ErrorFallback />
        ) : isLoading ? (
          <LoadingFallback />
        ) : (
          <div className="border rounded-sm overflow-hidden bg-white shadow-lg">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<LoadingFallback />}
            >
              <Page
                pageNumber={pageNumber}
                scale={calculatedScale}
                renderAnnotationLayer={false}
                renderTextLayer={true}
                className="!max-w-full"
              />
            </Document>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 border-t bg-muted/30 px-4 py-3 md:px-6">
        {/* Mobile Page Navigation */}
        <div className="flex md:hidden items-center gap-2 w-full justify-between">
          <M3Button
            variant="outlined"
            disabled={pageNumber <= 1}
            onClick={() => goToPage(pageNumber - 1)}
            className="flex-1"
            size="sm"
          >
            <MaterialSymbol icon={ArrowLeft01Icon} size={18} />
          </M3Button>
          <span className="text-[13px] font-medium px-3">
            {pageNumber} / {numPages || "--"}
          </span>
          <M3Button
            variant="outlined"
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => goToPage(pageNumber + 1)}
            className="flex-1"
            size="sm"
          >
            <MaterialSymbol icon={ArrowRight01Icon} size={18} />
          </M3Button>
        </div>

        {/* Desktop Page Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <M3Button
            variant="outlined"
            disabled={pageNumber <= 1}
            onClick={() => goToPage(pageNumber - 1)}
            className="gap-2"
            size="sm"
          >
            <MaterialSymbol icon={ArrowLeft01Icon} size={18} /> Previous
          </M3Button>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-16 text-center text-[14px] font-medium border rounded-md px-2 py-1 bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)]"
            />
            <span className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              / {numPages || "--"}
            </span>
          </div>
          <M3Button
            variant="outlined"
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => goToPage(pageNumber + 1)}
            className="gap-2"
            size="sm"
          >
            Next <MaterialSymbol icon={ArrowRight01Icon} size={18} />
          </M3Button>
        </div>

        {/* Zoom indicator */}
        <div className="hidden md:flex items-center gap-2 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
          <span>Zoom:</span>
          <span className="font-medium">{Math.round(calculatedScale * 100)}%</span>
          {fitToWidth && (
            <span className="text-[11px] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] px-2 py-0.5 rounded-full">
              Fit to Width
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
