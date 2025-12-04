"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./rating-stars";
import { Book } from "@/types/book";
import { useWishlist } from "@/context/wishlist-context";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

export function BookCard({ book, onAddToCart }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(book.id);

  return (
    <Card
      className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-card py-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Book Cover */}
        <Link href={`/books/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-secondary">
          <img
            src={book.cover}
            alt={book.title}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Badge */}
          {book.badge && (
            <Badge className="absolute top-3 left-3 bg-gold text-primary-foreground font-medium">
              {book.badge}
            </Badge>
          )}
          {/* Quick Actions */}
          <div
            className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <Button
              size="sm"
              className="flex-1 bg-gold hover:bg-gold-dark text-primary-foreground font-medium"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(book);
              }}
            >
              Add to Cart
            </Button>
            <Button
              size="icon-sm"
              variant="secondary"
              className={`backdrop-blur-sm ${
                isWishlisted 
                  ? "bg-pink-500 hover:bg-pink-600 text-white" 
                  : "bg-white/10 hover:bg-white/20"
              }`}
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(book);
              }}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </Button>
          </div>
          {/* Discount Badge */}
          {book.originalPrice && (
            <div className="absolute top-3 right-3 bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round((1 - book.price / book.originalPrice) * 100)}%
            </div>
          )}
        </Link>

        {/* Book Info */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {book.category}
          </p>
          <Link href={`/books/${book.id}`}>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-gold transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{book.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStars rating={book.rating} />
            <span className="text-xs text-muted-foreground">
              ({book.reviews.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-bold text-gold">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
