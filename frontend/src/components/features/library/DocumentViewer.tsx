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
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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
import { resolveUrlDownloadAction, runMaterialAction } from "@/lib/material-actions";

// Set up worker for react-pdf
// Set up worker for react-pdf only on client side
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

interface DocumentViewerProps {
  url: string;
  title: string;
}

export function DocumentViewer({ url, title }: DocumentViewerProps) {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [scale, setScale] = React.useState(1.0);
  const downloadAction = React.useMemo(() => resolveUrlDownloadAction(url), [url]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-none bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
            <MaterialSymbol icon={DocumentCodeIcon} size={24} />
          </div>
          <div>
            <CardTitle className="text-[18px] leading-none">{title}</CardTitle>
            <span className="text-[13px] text-muted-foreground mt-1 block">
              Page {pageNumber} of {numPages || "--"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <M3Button size="sm"
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            title="Zoom In"
          >
            <MaterialSymbol icon={ArrowUp01Icon} size={18} />
          </M3Button>
          <M3Button size="sm"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            title="Zoom Out"
          >
            <MaterialSymbol icon={ArrowDown01Icon} size={18} />
          </M3Button>
          <Separator orientation="vertical" className="h-8 mx-1" />
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
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center min-h-[600px] bg-[color:var(--md-sys-color-surface-container-low)] p-8 overflow-auto">
        <div className="border rounded-sm overflow-hidden bg-white">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center gap-4 p-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-[14px] font-medium">Opening Document...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={true}
            />
          </Document>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
        <M3Button
          variant="outlined"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((prev) => prev - 1)}
          className="gap-2"
        >
          <MaterialSymbol icon={ArrowLeft01Icon} size={18} /> Previous
        </M3Button>
        <div className="text-[14px] font-medium">
          {pageNumber} / {numPages || "--"}
        </div>
        <M3Button
          variant="outlined"
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber((prev) => prev + 1)}
          className="gap-2"
        >
          Next <MaterialSymbol icon={ArrowRight01Icon} size={18} />
        </M3Button>
      </CardFooter>
    </Card>
  );
}
