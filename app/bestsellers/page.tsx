"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { books, categories } from "@/data/books";
import { RatingStars } from "@/components/rating-stars";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Book } from "@/types/book";
import { useCart } from "@/context/cart-context";

// Genre icons/colors for visual distinction
const genreStyles: Record<string, { color: string; bgColor: string }> = {
  Fiction: { color: "text-blue-400", bgColor: "bg-blue-400/10" },
  "Non-Fiction": { color: "text-green-400", bgColor: "bg-green-400/10" },
  Mystery: { color: "text-purple-400", bgColor: "bg-purple-400/10" },
  "Sci-Fi": { color: "text-cyan-400", bgColor: "bg-cyan-400/10" },
  Romance: { color: "text-pink-400", bgColor: "bg-pink-400/10" },
  Biography: { color: "text-amber-400", bgColor: "bg-amber-400/10" },
  "Self-Help": { color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
  History: { color: "text-orange-400", bgColor: "bg-orange-400/10" },
};

// Get bestsellers (books with badge "Bestseller" or high ratings/reviews)
const getBestsellers = (genre?: string) => {
  let filteredBooks = books;

  // Filter by genre if specified
  if (genre && genre !== "All Genres") {
    filteredBooks = filteredBooks.filter((book) => book.category === genre);
  }

  // Sort by a combination of rating and reviews (bestseller score)
  return filteredBooks
    .map((book) => ({
      ...book,
      bestsellersScore: book.rating * Math.log10(book.reviews + 1),
    }))
    .sort((a, b) => b.bestsellersScore - a.bestsellersScore);
};

// Bestseller Book Card Component
function BestsellerCard({
  book,
  rank,
  onAddToCart,
}: {
  book: Book;
  rank: number;
  onAddToCart: (book: Book) => void;
}) {
  const genreStyle = genreStyles[book.category] || {
    color: "text-gold",
    bgColor: "bg-gold/10",
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-card py-0">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Rank Badge */}
          <div className="flex-shrink-0 flex flex-col items-center justify-start">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                rank <= 3
                  ? "bg-gold text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {rank}
            </div>
            {rank <= 3 && (
              <TrendingUp size={16} className="text-gold mt-1" />
            )}
          </div>

          {/* Book Cover */}
          <Link
            href={`/books/${book.id}`}
            className="flex-shrink-0 relative w-20 h-28 rounded overflow-hidden book-shadow"
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {book.badge && (
              <Badge className="absolute top-1 left-1 bg-gold text-primary-foreground text-[10px] px-1.5 py-0">
                {book.badge}
              </Badge>
            )}
          </Link>

          {/* Book Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <Badge
                variant="outline"
                className={`${genreStyle.color} ${genreStyle.bgColor} border-0 text-[10px] mb-1`}
              >
                {book.category}
              </Badge>
              <Link href={`/books/${book.id}`}>
                <h3 className="font-semibold line-clamp-1 group-hover:text-gold transition-colors">
                  {book.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{book.author}</p>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={book.rating} />
                <span className="text-xs text-muted-foreground">
                  ({book.reviews.toLocaleString()})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gold">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="bg-gold hover:bg-gold-dark text-primary-foreground"
                onClick={() => onAddToCart(book)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Genre Card Component for the hero section
function GenreCard({
  genre,
  count,
  isSelected,
  onClick,
}: {
  genre: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const style = genreStyles[genre] || {
    color: "text-gold",
    bgColor: "bg-gold/10",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
        isSelected
          ? "border-gold bg-gold/10"
          : "border-border/50 bg-card/50 hover:border-gold/30"
      }`}
    >
      <div className={`p-3 rounded-full ${style.bgColor} ${style.color} mb-2`}>
        <BookOpen size={24} />
      </div>
      <span className="font-medium text-sm">{genre}</span>
      <span className="text-xs text-muted-foreground">{count} books</span>
    </button>
  );
}

export default function BestsellersPage() {
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [sortBy, setSortBy] = useState("popularity");
  const { addToCart } = useCart();

  // Get genre counts
  const genreCounts = categories.slice(1).reduce((acc, genre) => {
    acc[genre] = books.filter((b) => b.category === genre).length;
    return acc;
  }, {} as Record<string, number>);

  // Get bestsellers based on selected genre
  let bestsellers = getBestsellers(
    selectedGenre === "All Genres" ? undefined : selectedGenre
  );

  // Apply additional sorting
  if (sortBy === "price-low") {
    bestsellers = [...bestsellers].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    bestsellers = [...bestsellers].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    bestsellers = [...bestsellers].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "newest") {
    // Mock: reverse order for "newest"
    bestsellers = [...bestsellers].reverse();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5" />
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center space-y-4 mb-10">
            <Badge className="bg-gold/20 text-gold border-0">
              <TrendingUp size={14} className="mr-1" />
              Trending Now
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] animate-fade-in-up">
              Bestsellers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-2">
              Discover the most popular books loved by readers worldwide. Browse
              by genre to find your next favorite read.
            </p>
          </div>

          {/* Genre Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 animate-fade-in-up stagger-3">
            <button
              onClick={() => setSelectedGenre("All Genres")}
              className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
                selectedGenre === "All Genres"
                  ? "border-gold bg-gold/10"
                  : "border-border/50 bg-card/50 hover:border-gold/30"
              }`}
            >
              <div className="p-3 rounded-full bg-gold/10 text-gold mb-2">
                <Filter size={24} />
              </div>
              <span className="font-medium text-sm">All Genres</span>
              <span className="text-xs text-muted-foreground">
                {books.length} books
              </span>
            </button>
            {categories.slice(1).map((genre) => (
              <GenreCard
                key={genre}
                genre={genre}
                count={genreCounts[genre] || 0}
                isSelected={selectedGenre === genre}
                onClick={() => setSelectedGenre(genre)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-playfair)]">
              {selectedGenre === "All Genres"
                ? "Top Bestsellers"
                : `${selectedGenre} Bestsellers`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {bestsellers.length} book{bestsellers.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bestsellers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bestsellers.map((book, index) => (
            <div
              key={book.id}
              className={`animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
            >
              <BestsellerCard
                book={book}
                rank={index + 1}
                onAddToCart={addToCart}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {bestsellers.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No books found</h3>
            <p className="text-muted-foreground mt-2">
              Try selecting a different genre
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSelectedGenre("All Genres")}
            >
              View All Genres
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Books", value: books.length.toString() },
            { label: "Genres", value: (categories.length - 1).toString() },
            {
              label: "Avg. Rating",
              value: (
                books.reduce((a, b) => a + b.rating, 0) / books.length
              ).toFixed(1),
            },
            {
              label: "Happy Readers",
              value: `${Math.round(
                books.reduce((a, b) => a + b.reviews, 0) / 1000
              )}K+`,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center p-6 rounded-xl border border-border/50 bg-card/50 animate-fade-in-up stagger-${
                index + 1
              }`}
            >
              <p className="text-3xl font-bold text-gold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

