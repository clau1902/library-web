"use client";

import Link from "next/link";
import { BookOpen, Heart, Trash2, TrendingDown, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { RatingStars } from "@/components/rating-stars";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { books } from "@/data/books";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, getPriceDrop } = useWishlist();
  const { addToCart } = useCart();

  // Get current price from books data (simulating real-time price updates)
  const getCurrentPrice = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    return book?.price || 0;
  };

  // Count items with price drops
  const priceDropCount = wishlist.filter((item) => {
    const currentPrice = getCurrentPrice(item.id);
    const drop = getPriceDrop(item.id, currentPrice);
    return drop !== null && drop > 0;
  }).length;

  // Sort wishlist by addedAt timestamp (newest first)
  const sortedWishlist = [...wishlist].sort((a, b) => b.addedAt - a.addedAt);

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-pink-500/10 mb-4">
              <Heart size={32} className="text-pink-500" fill="currentColor" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] animate-fade-in-up">
              My Wishlist
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-2">
              {sortedWishlist.length === 0
                ? "Your wishlist is empty. Start adding books you love!"
                : `You have ${sortedWishlist.length} book${sortedWishlist.length !== 1 ? "s" : ""} in your wishlist`}
            </p>
          </div>
        </div>
      </section>

      {/* Price Drop Alert Banner */}
      {priceDropCount > 0 && (
        <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-y border-green-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-3 text-green-500">
              <div className="flex items-center gap-2 animate-pulse">
                <Bell size={20} className="animate-bounce" />
                <TrendingDown size={20} />
              </div>
              <p className="font-medium">
                🎉 Great news! {priceDropCount} book{priceDropCount !== 1 ? "s" : ""} in your wishlist {priceDropCount !== 1 ? "have" : "has"} dropped in price!
              </p>
              <Sparkles size={18} className="text-gold" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {sortedWishlist.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">No books in your wishlist yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Browse our collection and click the heart icon on any book to add it to your wishlist.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-gold hover:bg-gold-dark text-primary-foreground">
                  Browse Books
                </Button>
              </Link>
              <Link href="/bestsellers">
                <Button variant="outline" className="border-gold/30 hover:bg-gold/10">
                  View Bestsellers
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="space-y-4">
            {sortedWishlist.map((book, index) => (
              <Card
                key={book.id}
                className={`overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 py-0 animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
              >
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Book Cover */}
                    <Link
                      href={`/books/${book.id}`}
                      className="flex-shrink-0 relative w-24 h-36 md:w-32 md:h-48 rounded overflow-hidden book-shadow"
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {book.badge && (
                        <Badge className="absolute top-2 left-2 bg-gold text-primary-foreground text-[10px] px-1.5 py-0">
                          {book.badge}
                        </Badge>
                      )}
                    </Link>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Badge
                              variant="outline"
                              className="text-muted-foreground border-border text-[10px] mb-2"
                            >
                              {book.category}
                            </Badge>
                            <Link href={`/books/${book.id}`}>
                              <h3 className="text-lg md:text-xl font-semibold hover:text-gold transition-colors line-clamp-1">
                                {book.title}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground">{book.author}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromWishlist(book.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <RatingStars rating={book.rating} />
                          <span className="text-xs text-muted-foreground">
                            ({book.reviews.toLocaleString()} reviews)
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 hidden md:block">
                          {book.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
                        <div>
                          {/* Price Drop Alert */}
                          {(() => {
                            const currentPrice = getCurrentPrice(book.id);
                            const priceDrop = getPriceDrop(book.id, currentPrice);
                            if (priceDrop && priceDrop > 0) {
                              return (
                                <div className="flex items-center gap-2 mb-2 animate-pulse">
                                  <Badge className="bg-green-500 text-white border-0 gap-1">
                                    <TrendingDown size={12} />
                                    Price dropped ${priceDrop.toFixed(2)}!
                                  </Badge>
                                </div>
                              );
                            }
                            return null;
                          })()}
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl md:text-2xl font-bold text-gold">
                              ${getCurrentPrice(book.id).toFixed(2)}
                            </span>
                            {book.priceWhenAdded && getCurrentPrice(book.id) < book.priceWhenAdded && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${book.priceWhenAdded.toFixed(2)}
                              </span>
                            )}
                            {book.originalPrice && getCurrentPrice(book.id) >= (book.priceWhenAdded || book.price) && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${book.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Added on {formatDate(book.addedAt)}
                            {book.priceWhenAdded && getCurrentPrice(book.id) < book.priceWhenAdded && (
                              <span className="text-green-500 ml-2">
                                • Was ${book.priceWhenAdded.toFixed(2)} when added
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            className="flex-1 sm:flex-none bg-gold hover:bg-gold-dark text-primary-foreground"
                            onClick={() => {
                              // Use current price from books data
                              const currentBook = books.find((b) => b.id === book.id);
                              if (currentBook) {
                                addToCart(currentBook);
                              } else {
                                addToCart(book);
                              }
                            }}
                          >
                            Add to Cart
                          </Button>
                          {book.fileUrl && (
                            <Link href={`/books/${book.id}/read`}>
                              <Button
                                variant="outline"
                                className="border-gold/30 hover:bg-gold/10"
                              >
                                <BookOpen size={16} />
                                <span className="hidden sm:inline ml-2">Read</span>
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {sortedWishlist.length > 0 && (
          <div className="mt-12 p-6 rounded-xl border border-border/50 bg-card/50">
            <h3 className="text-lg font-semibold mb-4">Wishlist Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-3xl font-bold text-gold">{sortedWishlist.length}</p>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold">
                  ${sortedWishlist.reduce((sum, book) => sum + getCurrentPrice(book.id), 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold">
                  $
                  {sortedWishlist
                    .reduce(
                      (sum, book) => {
                        const currentPrice = getCurrentPrice(book.id);
                        const currentBook = books.find((b) => b.id === book.id);
                        return sum + (currentBook?.originalPrice ? currentBook.originalPrice - currentPrice : 0);
                      },
                      0
                    )
                    .toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
              </div>
              {priceDropCount > 0 && (
                <div className="bg-green-500/10 rounded-lg p-3 -m-1">
                  <p className="text-3xl font-bold text-green-500">{priceDropCount}</p>
                  <p className="text-sm text-green-500/80">Price Drops!</p>
                </div>
              )}
              <div>
                <p className="text-3xl font-bold text-gold">
                  {(
                    sortedWishlist.reduce((sum, book) => sum + book.rating, 0) /
                    sortedWishlist.length
                  ).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

