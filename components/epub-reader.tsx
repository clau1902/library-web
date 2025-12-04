"use client";

import { useState, useRef } from "react";
import { ReactReader } from "react-reader";
import { AlertTriangle, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fallback EPUB (local sample)
const SAMPLE_EPUB_URL = "/books/alice.epub";

interface EpubReaderProps {
  url: string;
  title: string;
}

export function EpubReader({ url, title }: EpubReaderProps) {
  const [location, setLocation] = useState<string | number>(0);
  const renditionRef = useRef<any>(null);
  const [fontSize, setFontSize] = useState(100);
  const [error, setError] = useState<boolean>(false);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentUrl = useFallback ? SAMPLE_EPUB_URL : url;

  const changeFontSize = (newSize: number) => {
    setFontSize(newSize);
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${newSize}%`);
    }
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const handleRetry = () => {
    setError(false);
    setUseFallback(false);
    setIsLoading(true);
    setLocation(0);
  };

  const handleUseSample = () => {
    setError(false);
    setUseFallback(true);
    setIsLoading(true);
    setLocation(0);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sample EPUB Notice */}
      {useFallback && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            📖 Showing sample book — Original file could not be loaded
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
          {useFallback ? "Alice in Wonderland (Sample)" : title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Font Size:</span>
          <button
            onClick={() => changeFontSize(Math.max(50, fontSize - 10))}
            className="px-2 py-1 text-sm bg-secondary rounded hover:bg-secondary/80"
          >
            A-
          </button>
          <span className="text-xs w-12 text-center">{fontSize}%</span>
          <button
            onClick={() => changeFontSize(Math.min(200, fontSize + 10))}
            className="px-2 py-1 text-sm bg-secondary rounded hover:bg-secondary/80"
          >
            A+
          </button>
        </div>
      </div>

      {/* Reader */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background text-center p-8">
            <div className="p-4 rounded-full bg-destructive/10 mb-4">
              <AlertTriangle size={48} className="text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Book</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              The EPUB file could not be loaded. This may be due to an invalid file or network issue.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRetry}>
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </Button>
              {!useFallback && (
                <Button
                  className="bg-gold hover:bg-gold-dark text-primary-foreground"
                  onClick={handleUseSample}
                >
                  <BookOpen size={16} className="mr-2" />
                  Load Sample Book
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading book...</p>
              </div>
            )}
            <ReactReader
              url={currentUrl}
              location={location}
              locationChanged={(epubcfi: string) => setLocation(epubcfi)}
              loadingView={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mb-4"></div>
                  <p className="text-sm text-muted-foreground">Loading book...</p>
                </div>
              }
              getRendition={(rendition: any) => {
                renditionRef.current = rendition;
                setIsLoading(false);
                rendition.themes.fontSize(`${fontSize}%`);
                rendition.themes.register("custom", {
                  body: {
                    background: "var(--background) !important",
                    color: "var(--foreground) !important",
                  },
                  "body *": {
                    color: "var(--foreground) !important",
                  },
                });
                rendition.themes.select("custom");
                
                // Handle error events
                rendition.on("displayError", handleError);
              }}
              epubOptions={{
                flow: "paginated",
                manager: "default",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

