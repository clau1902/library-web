"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "./book-card";
import { Book } from "@/types/book";

interface BooksGridProps {
  books: Book[];
  selectedCategory: string;
  onAddToCart: (book: Book) => void;
  onClearFilters: () => void;
}

export function BooksGrid({
  books,
  selectedCategory,
  onAddToCart,
  onClearFilters,
}: BooksGridProps) {
  return (
    <>
      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {books.length} book{books.length !== 1 ? "s" : ""}
        {selectedCategory !== "All Books" && ` in ${selectedCategory}`}
      </p>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <div
              key={book.id}
              className={`animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
            >
              <BookCard book={book} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No books found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" className="mt-4" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
}
