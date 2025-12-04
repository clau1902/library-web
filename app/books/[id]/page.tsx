"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  BookOpenCheck,
  Heart,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/data/books";
import { RatingStars } from "@/components/rating-stars";
import { Footer } from "@/components/footer";
import { useWishlist } from "@/context/wishlist-context";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { isInWishlist, toggleWishlist, isLoaded } = useWishlist();

  const bookId = Number(params.id);
  const book = books.find((b) => b.id === bookId);

  // Get related books (same category, excluding current book)
  const relatedBooks = books
    .filter((b) => b.category === book?.category && b.id !== bookId)
    .slice(0, 4);

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

  const discountPercentage = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <BookOpen size={24} className="text-gold" />
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
                Biblion
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart size={20} />
                  {isLoaded && isInWishlist(book.id) && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-pink-500" />
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart size={22} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-gold transition-colors">
            {book.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{book.title}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
          Back to Books
        </Button>

        {/* Book Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Book Cover */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] max-w-md mx-auto lg:mx-0 rounded-lg overflow-hidden book-shadow animate-fade-in-up">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover"
              />
              {book.badge && (
                <Badge className="absolute top-4 left-4 bg-gold text-primary-foreground font-medium text-sm px-3 py-1">
                  {book.badge}
                </Badge>
              )}
              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-destructive text-white text-sm font-bold px-3 py-1 rounded">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            {/* Category */}
            <Badge variant="outline" className="border-gold/30 text-gold">
              {book.category}
            </Badge>

            {/* Title & Author */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-muted-foreground">by {book.author}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <RatingStars rating={book.rating} />
              <span className="text-lg font-medium">{book.rating}</span>
              <span className="text-muted-foreground">
                ({book.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-gold">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                  <Badge className="bg-destructive/20 text-destructive border-0">
                    Save ${(book.originalPrice - book.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About this book</h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                This captivating story will take you on an unforgettable journey 
                through its beautifully crafted pages. With vivid storytelling and 
                compelling characters, the author creates a world that readers won&apos;t 
                want to leave. Perfect for those who enjoy thought-provoking narratives 
                that stay with you long after the final page. A must-read for book 
                lovers everywhere.
              </p>
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-gold hover:bg-gold-dark text-primary-foreground font-semibold h-14 text-lg"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(book)}
                  className={`h-14 px-6 rounded-md border inline-flex items-center justify-center transition-colors ${
                    isLoaded && isInWishlist(book.id)
                      ? "bg-pink-500/10 border-pink-500 text-pink-500 hover:bg-pink-500/20"
                      : "border-border hover:border-pink-500/50 hover:text-pink-500"
                  }`}
                >
                  <Heart size={20} fill={isLoaded && isInWishlist(book.id) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Read Now Button */}
              {book.fileUrl && (
                <Link href={`/books/${book.id}/read`} className="block">
                  <Button
                    size="lg"
                    className="w-full h-12 bg-transparent border border-gold/50 text-gold hover:bg-gold/10 hover:text-gold font-semibold"
                  >
                    <BookOpenCheck size={20} />
                    Read Now — Free Preview
                  </Button>
                </Link>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-gold/10 text-gold">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-muted-foreground text-xs">On orders $35+</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-gold/10 text-gold">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-muted-foreground text-xs">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-gold/10 text-gold">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-muted-foreground text-xs">30 day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Details Table */}
        <Card className="mb-16 border-border/50 bg-card/50 animate-fade-in-up stagger-3">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold font-[family-name:var(--font-playfair)] mb-6">
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Format", value: "Paperback" },
                { label: "Pages", value: "352" },
                { label: "Publisher", value: "Viking Press" },
                { label: "Publication Date", value: "August 13, 2020" },
                { label: "Language", value: "English" },
                { label: "ISBN-13", value: "978-0525559474" },
                { label: "Dimensions", value: '5.5 x 0.9 x 8.2 inches' },
                { label: "Weight", value: "10.4 ounces" },
              ].map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Reviews Summary */}
        <Card className="mb-16 border-border/50 bg-card/50 animate-fade-in-up stagger-4">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold font-[family-name:var(--font-playfair)] mb-6">
              Customer Reviews
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Overall Rating */}
              <div className="text-center md:text-left md:pr-8 md:border-r border-border/50">
                <div className="text-5xl font-bold text-gold mb-2">
                  {book.rating}
                </div>
                <RatingStars rating={book.rating} />
                <p className="text-muted-foreground mt-2">
                  {book.reviews.toLocaleString()} reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const percentage =
                    stars === 5
                      ? 68
                      : stars === 4
                      ? 22
                      : stars === 3
                      ? 7
                      : stars === 2
                      ? 2
                      : 1;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm w-16">{stars} stars</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sample Reviews */}
            <Separator className="my-6" />
            <div className="space-y-6">
              {[
                {
                  name: "Sarah M.",
                  rating: 5,
                  date: "November 15, 2024",
                  comment:
                    "Absolutely loved this book! The writing is beautiful and the story kept me hooked from start to finish. Highly recommend!",
                },
                {
                  name: "James T.",
                  rating: 4,
                  date: "October 28, 2024",
                  comment:
                    "A thought-provoking read with memorable characters. Lost half a star for the slow middle section, but the ending made up for it.",
                },
              ].map((review, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-semibold text-gold">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={review.rating} />
                          <span className="text-xs text-muted-foreground">
                            Verified Purchase
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground pl-13">{review.comment}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-6">
              See All Reviews
            </Button>
          </CardContent>
        </Card>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="animate-fade-in-up stagger-5">
            <h3 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <Link
                  key={relatedBook.id}
                  href={`/books/${relatedBook.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-border/50 bg-card/80 transition-all duration-300 hover:border-gold/30 py-0">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={relatedBook.cover}
                        alt={relatedBook.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium line-clamp-1 group-hover:text-gold transition-colors">
                        {relatedBook.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {relatedBook.author}
                      </p>
                      <p className="text-gold font-bold mt-2">
                        ${relatedBook.price.toFixed(2)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Books from Same Category */}
        {relatedBooks.length === 0 && (
          <section className="animate-fade-in-up stagger-5">
            <h3 className="text-2xl font-semibold font-[family-name:var(--font-playfair)] mb-6">
              More Books to Explore
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {books.slice(0, 4).filter(b => b.id !== bookId).map((otherBook) => (
                <Link
                  key={otherBook.id}
                  href={`/books/${otherBook.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-border/50 bg-card/80 transition-all duration-300 hover:border-gold/30 py-0">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={otherBook.cover}
                        alt={otherBook.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium line-clamp-1 group-hover:text-gold transition-colors">
                        {otherBook.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {otherBook.author}
                      </p>
                      <p className="text-gold font-bold mt-2">
                        ${otherBook.price.toFixed(2)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
