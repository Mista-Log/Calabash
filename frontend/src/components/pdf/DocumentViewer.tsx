"use client";

import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  Download01Icon,
  DocumentCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/core";

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentViewerProps {
  url: string;
  title: string;
}

export function DocumentViewer({ url, title }: DocumentViewerProps) {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [scale, setScale] = React.useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-2xl bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={DocumentCodeIcon} size={24} />
          </div>
          <div>
            <CardTitle className="text-lg leading-none">{title}</CardTitle>
            <span className="text-xs text-muted-foreground mt-1 block">
              Page {pageNumber} of {numPages || "--"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          >
            <HugeiconsIcon icon={ZoomOutAreaIcon} size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          >
            <HugeiconsIcon icon={ZoomInAreaIcon} size={18} />
          </Button>
          <Separator orientation="vertical" className="h-8 mx-1" />
          <Button variant="ghost" size="icon">
            <HugeiconsIcon icon={Download01Icon} size={18} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center min-h-[600px] bg-accent/5 p-8 overflow-auto">
        <div className="shadow-lg border rounded-sm overflow-hidden bg-white">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center gap-4 p-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-medium">Opening Document...</p>
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
        <Button
          variant="outline"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((prev) => prev - 1)}
          className="gap-2"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Previous
        </Button>
        <div className="text-sm font-medium">
          {pageNumber} / {numPages || "--"}
        </div>
        <Button
          variant="outline"
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber((prev) => prev + 1)}
          className="gap-2"
        >
          Next <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
}
