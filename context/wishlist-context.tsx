"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Book } from "@/types/book";

export interface WishlistItem extends Book {
  addedAt: number;
  priceWhenAdded: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: number) => void;
  isInWishlist: (bookId: number) => boolean;
  toggleWishlist: (book: Book) => void;
  getPriceDrop: (bookId: number, currentPrice: number) => number | null;
  isLoaded: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage only on client after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("biblion-wishlist");
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse wishlist from localStorage");
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("biblion-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (book: Book) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === book.id)) {
        return prev;
      }
      return [...prev, { ...book, addedAt: Date.now(), priceWhenAdded: book.price }];
    });
  };

  const removeFromWishlist = (bookId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== bookId));
  };

  const isInWishlist = (bookId: number) => {
    return wishlist.some((item) => item.id === bookId);
  };

  const toggleWishlist = (book: Book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  // Check if the current price is lower than when added
  const getPriceDrop = (bookId: number, currentPrice: number): number | null => {
    const item = wishlist.find((item) => item.id === bookId);
    if (!item || !item.priceWhenAdded) return null;
    
    const priceDrop = item.priceWhenAdded - currentPrice;
    return priceDrop > 0 ? priceDrop : null;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        getPriceDrop,
        isLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
