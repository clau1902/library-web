"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, BookOpen, User, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { books, categories } from "@/data/books";
import { Book } from "@/types/book";
import { RatingStars } from "./rating-stars";

interface SearchResult {
  type: "book" | "author" | "category";
  book?: Book;
  value: string;
  count?: number;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("biblion-recent-searches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored).slice(0, 5));
        } catch (e) {
          console.error("Failed to parse recent searches", e);
        }
      }
    }
  }, []);

  // Save search to recent
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("biblion-recent-searches", JSON.stringify(updated));
    }
  }, [recentSearches]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const searchTerm = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search books by title
    const matchedBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
    matchedBooks.slice(0, 4).forEach((book) => {
      searchResults.push({ type: "book", book, value: book.title });
    });

    // Search by author
    const authors = [...new Set(books.map((b) => b.author))];
    const matchedAuthors = authors.filter((author) =>
      author.toLowerCase().includes(searchTerm)
    );
    matchedAuthors.slice(0, 2).forEach((author) => {
      const bookCount = books.filter((b) => b.author === author).length;
      searchResults.push({ type: "author", value: author, count: bookCount });
    });

    // Search by category
    const matchedCategories = categories.filter(
      (cat) => cat !== "All Books" && cat.toLowerCase().includes(searchTerm)
    );
    matchedCategories.slice(0, 2).forEach((category) => {
      const bookCount = books.filter((b) => b.category === category).length;
      searchResults.push({ type: "category", value: category, count: bookCount });
    });

    setResults(searchResults);
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems = results.length + (query.trim() ? 1 : 0);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex === -1 || selectedIndex === results.length) {
            // Search all results
            if (query.trim()) {
              saveRecentSearch(query);
              router.push(`/search?q=${encodeURIComponent(query)}`);
              setIsOpen(false);
              setQuery("");
            }
          } else {
            const result = results[selectedIndex];
            handleResultClick(result);
          }
          break;
        case "Escape":
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex, query, router, saveRecentSearch]
  );

  // Handle result click
  const handleResultClick = useCallback(
    (result: SearchResult) => {
      saveRecentSearch(result.value);
      setIsOpen(false);
      setQuery("");

      if (result.type === "book" && result.book) {
        router.push(`/books/${result.book.id}`);
      } else if (result.type === "author") {
        router.push(`/search?author=${encodeURIComponent(result.value)}`);
      } else if (result.type === "category") {
        router.push(`/search?category=${encodeURIComponent(result.value)}`);
      }
    },
    [router, saveRecentSearch]
  );

  // Handle recent search click
  const handleRecentClick = useCallback(
    (search: string) => {
      setQuery("");
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(search)}`);
    },
    [router]
  );

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("biblion-recent-searches");
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen && (query.trim() || recentSearches.length > 0);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search books, authors, genres..."
          className="w-full h-10 pl-10 pr-10 rounded-lg border border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 text-sm transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Results */}
          {query.trim() && results.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-3 py-1.5 font-medium uppercase tracking-wide">
                Suggestions
              </p>
              <div className="space-y-1">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.value}`}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedIndex === index
                        ? "bg-gold/10 text-gold"
                        : "hover:bg-secondary/80"
                    }`}
                  >
                    {result.type === "book" && result.book && (
                      <>
                        <img
                          src={result.book.cover}
                          alt={result.book.title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{result.book.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.book.author}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <RatingStars rating={result.book.rating} size="sm" />
                            <span className="text-xs text-gold font-semibold">
                              ${result.book.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {result.type === "author" && (
                      <>
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <User size={18} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{result.value}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.count} book{result.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground" />
                      </>
                    )}
                    {result.type === "category" && (
                      <>
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <BookOpen size={18} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{result.value}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.count} book{result.count !== 1 ? "s" : ""} in category
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search All Results Option */}
          {query.trim() && (
            <div className="border-t border-border/50 p-2">
              <button
                onClick={() => {
                  saveRecentSearch(query);
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                  setQuery("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  selectedIndex === results.length
                    ? "bg-gold/10 text-gold"
                    : "hover:bg-secondary/80"
                }`}
              >
                <Search size={18} />
                <span>
                  Search all results for &quot;<strong>{query}</strong>&quot;
                </span>
                <ArrowRight size={16} className="ml-auto" />
              </button>
            </div>
          )}

          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-1.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide flex items-center gap-1.5">
                  <Clock size={12} />
                  Recent Searches
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleRecentClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-secondary/80 transition-colors"
                  >
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="flex-1">{search}</span>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Suggestions (when no query) */}
          {!query.trim() && (
            <div className="border-t border-border/50 p-2">
              <p className="text-xs text-muted-foreground px-3 py-1.5 font-medium uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp size={12} />
                Trending
              </p>
              <div className="flex flex-wrap gap-2 px-3 py-1">
                {["Fiction", "Matt Haig", "Thriller", "Romance"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setIsOpen(false);
                    }}
                    className="px-3 py-1.5 bg-secondary/80 hover:bg-gold/10 hover:text-gold rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.trim() && results.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p>No suggestions found for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">
                Press Enter to search all books
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

