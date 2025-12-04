"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Fallback sample PDF URL (local sample PDF)
const SAMPLE_PDF_URL = "/books/sample.pdf";

interface PdfReaderProps {
  url: string;
  title: string;
}

export function PdfReader({ url, title }: PdfReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<boolean>(false);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const currentUrl = useFallback ? SAMPLE_PDF_URL : url;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(false);
  }

  function onDocumentLoadError() {
    setError(true);
  }

  function handleUseSample() {
    setUseFallback(true);
    setError(false);
    setPageNumber(1);
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1.0);

  return (
    <div className="h-full flex flex-col bg-secondary/30">
      {/* Sample PDF Notice */}
      {useFallback && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            📄 Showing sample PDF — Original file could not be loaded
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
          {useFallback ? "Sample Document" : title}
        </span>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm min-w-[80px] text-center">
            {pageNumber} / {numPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={zoomOut}>
            <ZoomOut size={16} />
          </Button>
          <span className="text-xs w-14 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="icon-sm" onClick={zoomIn}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={resetZoom}>
            <Maximize2 size={16} />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto flex justify-center p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="p-4 rounded-full bg-destructive/10 mb-4">
              <AlertTriangle size={48} className="text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load PDF</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              The PDF file could not be loaded. This may be due to an invalid file or network issue.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setError(false);
                  setUseFallback(false);
                }}
              >
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </Button>
              {!useFallback && (
                <Button
                  className="bg-gold hover:bg-gold-dark text-primary-foreground"
                  onClick={handleUseSample}
                >
                  Load Sample PDF
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Document
            file={currentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full text-destructive">
                Failed to load PDF.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        )}
      </div>

      {/* Page Jump */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-card border-t border-border">
        <span className="text-sm text-muted-foreground">Go to page:</span>
        <input
          type="number"
          min={1}
          max={numPages}
          value={pageNumber}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= numPages) {
              setPageNumber(page);
            }
          }}
          className="w-16 px-2 py-1 text-sm text-center bg-secondary border border-border rounded focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>
    </div>
  );
}
