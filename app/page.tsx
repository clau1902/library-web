"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { BooksFilter } from "@/components/books-filter";
import { BooksGrid } from "@/components/books-grid";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { books } from "@/data/books";
import { useCart } from "@/context/cart-context";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [sortBy, setSortBy] = useState("featured");
  const { addToCart } = useCart();

  // Filter and sort books
  const filteredBooks = books
    .filter((book) => {
      const matchesCategory =
        selectedCategory === "All Books" || book.category === selectedCategory;
      return matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSelectedCategory("All Books");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Filters */}
        <BooksFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Books Grid */}
        <BooksGrid
          books={filteredBooks}
          selectedCategory={selectedCategory}
          onAddToCart={addToCart}
          onClearFilters={clearFilters}
        />

        {/* Features Section */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
