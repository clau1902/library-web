"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Search, SlidersHorizontal, X, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { books, categories } from "@/data/books";
import { RatingStars } from "@/components/rating-stars";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { Book } from "@/types/book";
import { Heart } from "lucide-react";

// Search Result Card
function SearchResultCard({
  book,
  onAddToCart,
}: {
  book: Book;
  onAddToCart: (book: Book) => void;
}) {
  const { isInWishlist, toggleWishlist, isLoaded } = useWishlist();
  const inWishlist = isLoaded && isInWishlist(book.id);

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/80 transition-all duration-300 hover:border-gold/30 py-0">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <Link href={`/books/${book.id}`} className="flex-shrink-0 relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-28 h-40 object-cover rounded-lg book-shadow transition-transform duration-300 group-hover:scale-105"
            />
            {book.badge && (
              <Badge className="absolute top-2 left-2 bg-gold text-primary-foreground text-xs">
                {book.badge}
              </Badge>
            )}
          </Link>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">
                    {book.category}
                  </Badge>
                  <Link href={`/books/${book.id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-gold transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                <button
                  onClick={() => toggleWishlist(book)}
                  className={`p-2 rounded-full transition-colors ${
                    inWishlist
                      ? "bg-pink-500/10 text-pink-500"
                      : "hover:bg-secondary text-muted-foreground hover:text-pink-500"
                  }`}
                >
                  <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <RatingStars rating={book.rating} />
                <span className="text-xs text-muted-foreground">
                  ({book.reviews.toLocaleString()} reviews)
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {book.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gold">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
                {book.originalPrice && (
                  <Badge variant="destructive" className="text-xs">
                    {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {book.fileUrl && (
                  <Link href={`/books/${book.id}/read`}>
                    <Button size="sm" variant="outline" className="border-gold/30 hover:bg-gold/10">
                      Read
                    </Button>
                  </Link>
                )}
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const authorParam = searchParams.get("author") || "";
  const categoryParam = searchParams.get("category") || "";

  const { addToCart } = useCart();

  // Filter state
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [minRating, setMinRating] = useState(0);

  // Reset filters when search params change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [categoryParam]);

  // Search and filter logic
  const searchResults = useMemo(() => {
    let results = [...books];

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm) ||
          book.category.toLowerCase().includes(searchTerm)
      );
    }

    // Author filter
    if (authorParam) {
      results = results.filter((book) =>
        book.author.toLowerCase().includes(authorParam.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter((book) =>
        selectedCategories.includes(book.category)
      );
    }

    // Price filter
    results = results.filter(
      (book) => book.price >= priceRange[0] && book.price <= priceRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      results = results.filter((book) => book.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
        results.sort((a, b) => b.id - a.id);
        break;
      default:
        // Relevance - keep original order or boost exact matches
        if (query) {
          results.sort((a, b) => {
            const aExact =
              a.title.toLowerCase() === query.toLowerCase() ? 1 : 0;
            const bExact =
              b.title.toLowerCase() === query.toLowerCase() ? 1 : 0;
            return bExact - aExact;
          });
        }
    }

    return results;
  }, [query, authorParam, selectedCategories, priceRange, minRating, sortBy]);

  // Get search title
  const getSearchTitle = () => {
    if (authorParam) return `Books by "${authorParam}"`;
    if (categoryParam) return `${categoryParam} Books`;
    if (query) return `Search results for "${query}"`;
    return "All Books";
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50]);
    setMinRating(0);
    setSortBy("relevance");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 50 || minRating > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Search Header */}
      <section className="border-b border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span>Search</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)]">
                {getSearchTitle()}
              </h1>
              <p className="text-muted-foreground mt-1">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Search Info Badges */}
            <div className="flex flex-wrap gap-2">
              {query && (
                <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                  <Search size={14} />
                  {query}
                </Badge>
              )}
              {authorParam && (
                <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                  <User size={14} />
                  {authorParam}
                </Badge>
              )}
              {categoryParam && (
                <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                  <Tag size={14} />
                  {categoryParam}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="space-y-2">
                  {categories
                    .filter((c) => c !== "All Books")
                    .map((category) => {
                      const count = books.filter((b) => b.category === category).length;
                      return (
                        <div key={category} className="flex items-center gap-2">
                          <Checkbox
                            id={`cat-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label
                            htmlFor={`cat-${category}`}
                            className="text-sm flex-1 cursor-pointer"
                          >
                            {category}
                          </Label>
                          <span className="text-xs text-muted-foreground">({count})</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={50}
                  step={1}
                  className="py-4"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={minRating === rating}
                        onCheckedChange={() =>
                          setMinRating(minRating === rating ? 0 : rating)
                        }
                      />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="text-sm flex items-center gap-1 cursor-pointer"
                      >
                        <RatingStars rating={rating} size="sm" />
                        <span className="text-muted-foreground">& up</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <div className="flex-1">
            {/* Sort & Mobile Filter */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal size={18} />
                    Filters
                    {hasActiveFilters && (
                      <Badge className="bg-gold text-primary-foreground ml-1">
                        {selectedCategories.length + (minRating > 0 ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Mobile Categories */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Categories</h3>
                      <div className="space-y-2">
                        {categories
                          .filter((c) => c !== "All Books")
                          .map((category) => {
                            const count = books.filter((b) => b.category === category).length;
                            return (
                              <div key={category} className="flex items-center gap-2">
                                <Checkbox
                                  id={`mob-cat-${category}`}
                                  checked={selectedCategories.includes(category)}
                                  onCheckedChange={() => toggleCategory(category)}
                                />
                                <Label
                                  htmlFor={`mob-cat-${category}`}
                                  className="text-sm flex-1 cursor-pointer"
                                >
                                  {category}
                                </Label>
                                <span className="text-xs text-muted-foreground">({count})</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Mobile Price */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Price Range</h3>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={50}
                        step={1}
                        className="py-4"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Mobile Rating */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Minimum Rating</h3>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <Checkbox
                              id={`mob-rating-${rating}`}
                              checked={minRating === rating}
                              onCheckedChange={() =>
                                setMinRating(minRating === rating ? 0 : rating)
                              }
                            />
                            <Label
                              htmlFor={`mob-rating-${rating}`}
                              className="text-sm flex items-center gap-1 cursor-pointer"
                            >
                              <RatingStars rating={rating} size="sm" />
                              <span className="text-muted-foreground">& up</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                    <X size={14} />
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 50) && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setPriceRange([0, 50])}
                  >
                    ${priceRange[0]} - ${priceRange[1]}
                    <X size={14} />
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setMinRating(0)}
                  >
                    {minRating}+ stars
                    <X size={14} />
                  </Badge>
                )}
              </div>
            )}

            {/* Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((book, index) => (
                  <div
                    key={book.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <SearchResultCard book={book} onAddToCart={addToCart} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen size={64} className="mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No books found</h2>
                <p className="text-muted-foreground mb-6">
                  {query
                    ? `We couldn't find any books matching "${query}"`
                    : "Try adjusting your filters"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                  <Link href="/">
                    <Button className="bg-gold hover:bg-gold-dark text-primary-foreground">
                      Browse All Books
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

