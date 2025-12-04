"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, BookOpen, Home, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { books } from "@/data/books";

// Dynamic imports to avoid SSR issues
const EpubReader = dynamic(
  () => import("@/components/epub-reader").then((mod) => mod.EpubReader),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    ),
  }
);

const PdfReader = dynamic(
  () => import("@/components/pdf-reader").then((mod) => mod.PdfReader),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    ),
  }
);

export default function ReadBookPage() {
  const params = useParams();
  const router = useRouter();

  const bookId = Number(params.id);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen size={48} className="mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">Book Not Found</h1>
          <p className="text-muted-foreground">
            The book you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (!book.fileUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen size={48} className="mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">No Preview Available</h1>
          <p className="text-muted-foreground">
            This book doesn&apos;t have a readable file attached.
          </p>
          <Button onClick={() => router.push(`/books/${book.id}`)}>
            Back to Book Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            title="Go back"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="hidden sm:block">
            <h1 className="font-semibold line-clamp-1">{book.title}</h1>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" title="Home">
              <Home size={20} />
            </Button>
          </Link>
          <Link href={`/books/${book.id}`}>
            <Button variant="ghost" size="icon" title="Book details">
              <Info size={20} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Reader Content */}
      <div className="flex-1 overflow-hidden">
        {book.fileType === "epub" ? (
          <EpubReader url={book.fileUrl} title={book.title} />
        ) : book.fileType === "pdf" ? (
          <PdfReader url={book.fileUrl} title={book.title} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <BookOpen size={48} className="mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">Unsupported Format</h2>
              <p className="text-muted-foreground">
                This file format is not supported.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

