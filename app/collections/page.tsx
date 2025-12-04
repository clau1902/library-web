"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Heart,
  Flame,
  Clock,
  Award,
  Users,
  Lightbulb,
  Moon,
  Snowflake,
  Sun,
  Leaf,
  Flower2,
  ChevronRight,
  Film,
  Tv,
  Play,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { books } from "@/data/books";
import { RatingStars } from "@/components/rating-stars";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { Book } from "@/types/book";

// Collection definitions
const collections = [
  {
    id: "staff-picks",
    name: "Staff Picks",
    description: "Handpicked favorites from our expert booksellers",
    icon: <Sparkles size={24} />,
    color: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
    bookIds: [1, 4, 7],
  },
  {
    id: "romance-essentials",
    name: "Romance Essentials",
    description: "Swoon-worthy love stories that will capture your heart",
    icon: <Heart size={24} />,
    color: "from-pink-500/20 to-rose-500/20",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-500",
    bookIds: [6],
  },
  {
    id: "trending-now",
    name: "Trending Now",
    description: "The most talked-about books of the moment",
    icon: <Flame size={24} />,
    color: "from-red-500/20 to-orange-500/20",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-500",
    bookIds: [1, 2, 3],
  },
  {
    id: "quick-reads",
    name: "Quick Reads",
    description: "Perfect for busy readers - finish in a weekend",
    icon: <Clock size={24} />,
    color: "from-cyan-500/20 to-blue-500/20",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-500",
    bookIds: [4, 6],
  },
  {
    id: "award-winners",
    name: "Award Winners",
    description: "Critically acclaimed masterpieces",
    icon: <Award size={24} />,
    color: "from-gold/20 to-amber-500/20",
    iconBg: "bg-gold/20",
    iconColor: "text-gold",
    bookIds: [5, 7, 8],
  },
  {
    id: "book-club",
    name: "Book Club Favorites",
    description: "Great conversation starters for your next meeting",
    icon: <Users size={24} />,
    color: "from-purple-500/20 to-violet-500/20",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-500",
    bookIds: [1, 5, 7],
  },
  {
    id: "mind-expanding",
    name: "Mind-Expanding",
    description: "Books that will change the way you think",
    icon: <Lightbulb size={24} />,
    color: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-500",
    bookIds: [2, 7],
  },
  {
    id: "late-night",
    name: "Late Night Reads",
    description: "Page-turners you won't be able to put down",
    icon: <Moon size={24} />,
    color: "from-indigo-500/20 to-purple-500/20",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-500",
    bookIds: [3, 4, 8],
  },
];

// Seasonal reading lists
const seasonalLists = [
  {
    id: "winter",
    name: "Winter Warmers",
    subtitle: "Cozy reads for cold nights",
    description: "Curl up with these heartwarming stories perfect for snowy days and warm blankets.",
    icon: <Snowflake size={28} />,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    bgPattern: "❄️",
    bookIds: [1, 5, 6],
    months: [12, 1, 2],
  },
  {
    id: "spring",
    name: "Spring Awakening",
    subtitle: "Fresh starts & new beginnings",
    description: "Celebrate renewal with uplifting stories of growth, change, and fresh perspectives.",
    icon: <Flower2 size={28} />,
    gradient: "from-pink-400 via-rose-400 to-fuchsia-500",
    bgPattern: "🌸",
    bookIds: [2, 4, 6],
    months: [3, 4, 5],
  },
  {
    id: "summer",
    name: "Summer Escapes",
    subtitle: "Beach reads & adventures",
    description: "Light, breezy reads perfect for lazy days at the beach or by the pool.",
    icon: <Sun size={28} />,
    gradient: "from-amber-400 via-orange-400 to-yellow-500",
    bgPattern: "☀️",
    bookIds: [3, 4, 8],
    months: [6, 7, 8],
  },
  {
    id: "fall",
    name: "Autumn Treasures",
    subtitle: "Mysteries & magical tales",
    description: "Atmospheric reads that capture the magic of falling leaves and crisp evenings.",
    icon: <Leaf size={28} />,
    gradient: "from-orange-500 via-amber-600 to-red-600",
    bgPattern: "🍂",
    bookIds: [3, 5, 7],
    months: [9, 10, 11],
  },
];

// Get current season
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  return seasonalLists.find((season) => season.months.includes(month)) || seasonalLists[0];
};

// Movie to Book adaptations
const movieToBook = [
  {
    id: 1,
    movieTitle: "The Midnight Library",
    movieYear: "Coming Soon",
    streamingOn: "Netflix",
    posterGradient: "from-indigo-900 via-purple-800 to-indigo-900",
    type: "movie",
    tagline: "Every choice creates a new world",
    bookId: 1,
  },
  {
    id: 2,
    movieTitle: "Atomic Habits",
    movieYear: "Documentary 2024",
    streamingOn: "Prime Video",
    posterGradient: "from-orange-600 via-red-600 to-orange-700",
    type: "documentary",
    tagline: "Small changes, remarkable results",
    bookId: 2,
  },
  {
    id: 3,
    movieTitle: "The Silent Patient",
    movieYear: "Coming 2025",
    streamingOn: "HBO Max",
    posterGradient: "from-slate-900 via-zinc-800 to-slate-900",
    type: "movie",
    tagline: "She stopped speaking. He needs to know why.",
    bookId: 3,
  },
  {
    id: 4,
    movieTitle: "Project Hail Mary",
    movieYear: "Coming 2026",
    streamingOn: "Theaters",
    posterGradient: "from-blue-900 via-cyan-800 to-blue-900",
    type: "movie",
    tagline: "Starring Ryan Gosling",
    bookId: 4,
  },
  {
    id: 5,
    movieTitle: "Educated",
    movieYear: "In Development",
    streamingOn: "Universal",
    posterGradient: "from-emerald-800 via-teal-700 to-emerald-800",
    type: "movie",
    tagline: "A true story of survival and self-discovery",
    bookId: 5,
  },
];

// Get books for a collection
const getCollectionBooks = (bookIds: number[]): Book[] => {
  return bookIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => book !== undefined);
};

// Collection Card Component
function CollectionCard({
  collection,
  onClick,
}: {
  collection: (typeof collections)[0];
  onClick: () => void;
}) {
  const collectionBooks = getCollectionBooks(collection.bookIds);

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:scale-[1.02] py-0"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Cover Images */}
        <div className={`relative h-48 bg-gradient-to-br ${collection.color} p-4`}>
          <div className="flex justify-center items-end h-full gap-2">
            {collectionBooks.slice(0, 3).map((book, i) => (
              <div
                key={book.id}
                className="relative transition-transform duration-300 group-hover:-translate-y-2"
                style={{
                  zIndex: 3 - i,
                  transform: `rotate(${(i - 1) * 5}deg)`,
                }}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded shadow-lg"
                />
              </div>
            ))}
          </div>
          
          {/* Icon Badge */}
          <div className={`absolute top-4 left-4 p-2 rounded-lg ${collection.iconBg} ${collection.iconColor}`}>
            {collection.icon}
          </div>
          
          {/* Book Count */}
          <Badge className="absolute top-4 right-4 bg-black/50 text-white border-0">
            {collection.bookIds.length} books
          </Badge>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg group-hover:text-gold transition-colors">
            {collection.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {collection.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Book Card for Collection Detail
function CollectionBookCard({
  book,
  onAddToCart,
}: {
  book: Book;
  onAddToCart: (book: Book) => void;
}) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/80 transition-all duration-300 hover:border-gold/30 py-0">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <Link href={`/books/${book.id}`} className="flex-shrink-0">
            <img
              src={book.cover}
              alt={book.title}
              className="w-24 h-36 object-cover rounded book-shadow transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <Badge variant="outline" className="text-xs mb-2">
                {book.category}
              </Badge>
              <Link href={`/books/${book.id}`}>
                <h4 className="font-semibold group-hover:text-gold transition-colors line-clamp-1">
                  {book.title}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground">{book.author}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <RatingStars rating={book.rating} />
                <span className="text-xs text-muted-foreground">
                  ({book.reviews.toLocaleString()})
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 hidden sm:block">
                {book.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gold">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
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

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Check both regular collections and seasonal lists
  const activeCollection = selectedCollection
    ? collections.find((c) => c.id === selectedCollection)
    : null;
  
  const activeSeasonalList = selectedCollection
    ? seasonalLists.find((s) => s.id === selectedCollection)
    : null;

  const collectionBooks = activeCollection
    ? getCollectionBooks(activeCollection.bookIds)
    : activeSeasonalList
    ? getCollectionBooks(activeSeasonalList.bookIds)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center space-y-4">
            <Badge className="bg-purple-500/20 text-purple-400 border-0">
              <BookOpen size={14} className="mr-1" />
              Curated for You
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] animate-fade-in-up">
              {activeCollection ? activeCollection.name : activeSeasonalList ? activeSeasonalList.name : "Book Collections"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-2">
              {activeCollection
                ? activeCollection.description
                : activeSeasonalList
                ? activeSeasonalList.description
                : "Explore our thoughtfully curated collections, handpicked by our team of passionate readers."}
            </p>
            {(activeCollection || activeSeasonalList) && (
              <Button
                variant="outline"
                className="border-gold/30 hover:bg-gold/10 mt-4"
                onClick={() => setSelectedCollection(null)}
              >
                ← Back to All Collections
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!activeCollection && !activeSeasonalList ? (
          /* Collections Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={`animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
                >
                  <CollectionCard
                    collection={collection}
                    onClick={() => setSelectedCollection(collection.id)}
                  />
                </div>
              ))}
            </div>

            {/* Featured Collection */}
            <section className="mt-16">
              <Card className="border-border/50 bg-gradient-to-r from-gold/10 to-transparent overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <Badge className="bg-gold/20 text-gold border-0 mb-4">
                        Featured Collection
                      </Badge>
                      <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-4">
                        Staff Picks of the Month
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Discover the books our team can&apos;t stop talking about. From gripping thrillers to 
                        heartwarming stories, these are the reads that have captivated us this month.
                      </p>
                      <Button
                        className="bg-gold hover:bg-gold-dark text-primary-foreground"
                        onClick={() => setSelectedCollection("staff-picks")}
                      >
                        Explore Staff Picks
                      </Button>
                    </div>
                    <div className="flex justify-center">
                      <div className="flex gap-4">
                        {getCollectionBooks([1, 4, 7]).map((book, i) => (
                          <Link key={book.id} href={`/books/${book.id}`}>
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-28 h-40 object-cover rounded-lg shadow-xl hover:scale-105 transition-transform"
                              style={{
                                transform: `rotate(${(i - 1) * 5}deg)`,
                              }}
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Seasonal Reading Lists */}
            <section className="mt-16">
              <div className="text-center mb-10">
                <Badge className="bg-gradient-to-r from-pink-500/20 to-amber-500/20 text-foreground border-0 mb-4">
                  {getCurrentSeason().icon}
                  <span className="ml-2">Seasonal Picks</span>
                </Badge>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                  Seasonal Reading Lists
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Perfect reads for every time of year. Find books that match the mood of the season.
                </p>
              </div>

              {/* Current Season Highlight */}
              {(() => {
                const currentSeason = getCurrentSeason();
                const seasonBooks = getCollectionBooks(currentSeason.bookIds);
                return (
                  <Card className={`mb-8 overflow-hidden border-0 bg-gradient-to-r ${currentSeason.gradient} text-white`}>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Season Info */}
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                              {currentSeason.icon}
                            </div>
                            <Badge className="bg-white/20 text-white border-0">
                              Current Season
                            </Badge>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                            {currentSeason.name}
                          </h3>
                          <p className="text-lg text-white/80 mb-2">{currentSeason.subtitle}</p>
                          <p className="text-white/70 mb-6">{currentSeason.description}</p>
                          <div className="flex gap-3">
                            <Button 
                              className="bg-white text-gray-900 hover:bg-white/90"
                              onClick={() => setSelectedCollection(currentSeason.id)}
                            >
                              Explore {seasonBooks.length} Books
                            </Button>
                          </div>
                        </div>
                        
                        {/* Season Books Preview */}
                        <div className="relative p-8 flex items-center justify-center bg-black/10">
                          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10">
                            {currentSeason.bgPattern}
                          </div>
                          <div className="flex gap-4 relative z-10">
                            {seasonBooks.slice(0, 3).map((book, i) => (
                              <Link key={book.id} href={`/books/${book.id}`}>
                                <div 
                                  className="transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                                  style={{ transform: `rotate(${(i - 1) * 8}deg)` }}
                                >
                                  <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-24 h-36 md:w-28 md:h-40 object-cover rounded-lg shadow-2xl"
                                  />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* All Seasons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {seasonalLists.map((season) => {
                  const seasonBooks = getCollectionBooks(season.bookIds);
                  const isCurrent = getCurrentSeason().id === season.id;
                  
                  return (
                    <button
                      key={season.id}
                      onClick={() => setSelectedCollection(season.id)}
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] text-left ${
                        isCurrent 
                          ? 'border-gold ring-2 ring-gold/20' 
                          : 'border-border/50 hover:border-gold/30'
                      }`}
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${season.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      
                      {/* Content */}
                      <div className="relative p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${season.gradient} text-white`}>
                            {season.icon}
                          </div>
                          {isCurrent && (
                            <Badge className="bg-gold text-primary-foreground text-xs">
                              Now
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-lg mb-1 group-hover:text-gold transition-colors">
                          {season.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {season.subtitle}
                        </p>
                        
                        {/* Mini Book Preview */}
                        <div className="flex -space-x-3">
                          {seasonBooks.slice(0, 3).map((book) => (
                            <img
                              key={book.id}
                              src={book.cover}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded border-2 border-background"
                            />
                          ))}
                          <div className="w-10 h-14 rounded border-2 border-background bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            +{season.bookIds.length}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* If You Liked the Movie, Read the Book */}
            <section className="mt-16">
              <div className="text-center mb-10">
                <Badge className="bg-gradient-to-r from-red-500/20 to-purple-500/20 text-foreground border-0 mb-4">
                  <Film size={14} className="mr-2" />
                  Screen to Page
                </Badge>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                  If You Liked the Movie, Read the Book
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Discover the original stories behind your favorite films and upcoming adaptations.
                </p>
              </div>

              {/* Movie Cards Horizontal Scroll */}
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {movieToBook.map((movie) => {
                    const book = books.find((b) => b.id === movie.bookId);
                    if (!book) return null;
                    
                    return (
                      <div
                        key={movie.id}
                        className="flex-shrink-0 w-[320px] md:w-[380px] snap-start"
                      >
                        <Card className="overflow-hidden border-border/50 bg-card/80 h-full group">
                          <CardContent className="p-0">
                            {/* Movie Poster Style Header */}
                            <div className={`relative h-48 bg-gradient-to-br ${movie.posterGradient} p-6 flex flex-col justify-between`}>
                              {/* Film grain overlay */}
                              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
                              
                              <div className="relative flex items-start justify-between">
                                <div>
                                  <Badge className="bg-black/30 text-white border-0 backdrop-blur-sm mb-2">
                                    {movie.type === "documentary" ? (
                                      <><Tv size={12} className="mr-1" /> Documentary</>
                                    ) : (
                                      <><Film size={12} className="mr-1" /> Movie</>
                                    )}
                                  </Badge>
                                  <p className="text-white/60 text-sm">{movie.streamingOn}</p>
                                </div>
                                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                                  {movie.movieYear}
                                </Badge>
                              </div>
                              
                              <div className="relative">
                                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] leading-tight">
                                  {movie.movieTitle}
                                </h3>
                                <p className="text-white/70 text-sm italic mt-1">
                                  &ldquo;{movie.tagline}&rdquo;
                                </p>
                              </div>

                              {/* Play button overlay */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <Play size={28} className="text-white ml-1" fill="white" />
                                </div>
                              </div>
                            </div>

                            {/* Book Info */}
                            <div className="p-5">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <ArrowRight size={14} />
                                <span>Based on the book</span>
                              </div>
                              
                              <div className="flex gap-4">
                                <Link href={`/books/${book.id}`} className="flex-shrink-0">
                                  <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-20 h-28 object-cover rounded-lg shadow-lg transition-transform group-hover:scale-105"
                                  />
                                </Link>
                                <div className="flex-1 min-w-0">
                                  <Link href={`/books/${book.id}`}>
                                    <h4 className="font-semibold hover:text-gold transition-colors line-clamp-1">
                                      {book.title}
                                    </h4>
                                  </Link>
                                  <p className="text-sm text-muted-foreground">{book.author}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <RatingStars rating={book.rating} size="sm" />
                                  </div>
                                  <div className="flex items-center gap-2 mt-3">
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
                              </div>

                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-gold hover:bg-gold-dark text-primary-foreground"
                                  onClick={() => addToCart(book)}
                                >
                                  Add to Cart
                                </Button>
                                <Link href={`/books/${book.id}`}>
                                  <Button size="sm" variant="outline" className="border-gold/30 hover:bg-gold/10">
                                    View Book
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
                
                {/* Scroll Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                  {movieToBook.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-border"
                    />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Read the book before watching the movie — it&apos;s always better! 🎬📚
                </p>
              </div>
            </section>

            {/* Why Collections */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-center mb-8">
                Why Shop by Collection?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Sparkles size={24} />,
                    title: "Expert Curation",
                    description:
                      "Each collection is carefully assembled by our team of passionate readers and booksellers.",
                  },
                  {
                    icon: <Clock size={24} />,
                    title: "Save Time",
                    description:
                      "No more endless scrolling. Find your perfect read faster with themed collections.",
                  },
                  {
                    icon: <Heart size={24} />,
                    title: "Discover New Favorites",
                    description:
                      "Explore books you might have missed and find your next obsession.",
                  },
                ].map((feature, index) => (
                  <Card
                    key={feature.title}
                    className={`border-border/50 bg-card/50 animate-fade-in-up stagger-${index + 1}`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 rounded-full bg-gold/10 text-gold mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Collection Detail */
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {collectionBooks.length} book{collectionBooks.length !== 1 ? "s" : ""} in this collection
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {collectionBooks.map((book, index) => (
                <div
                  key={book.id}
                  className={`animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
                >
                  <CollectionBookCard book={book} onAddToCart={addToCart} />
                </div>
              ))}
            </div>

            {/* Other Collections */}
            <section className="mt-16">
              <h2 className="text-xl font-semibold mb-6">
                {activeSeasonalList ? "Other Seasonal Lists" : "Explore More Collections"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeSeasonalList ? (
                  // Show other seasonal lists
                  seasonalLists
                    .filter((s) => s.id !== selectedCollection)
                    .map((season) => (
                      <button
                        key={season.id}
                        onClick={() => setSelectedCollection(season.id)}
                        className={`p-4 rounded-xl border border-border/50 bg-gradient-to-br ${season.gradient} bg-opacity-20 text-left hover:border-gold/30 transition-all relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                        <div className={`relative p-2 rounded-lg bg-gradient-to-br ${season.gradient} text-white w-fit mb-2`}>
                          {season.icon}
                        </div>
                        <h4 className="relative font-medium text-sm">{season.name}</h4>
                        <p className="relative text-xs text-muted-foreground">
                          {season.bookIds.length} books
                        </p>
                      </button>
                    ))
                ) : (
                  // Show other regular collections
                  collections
                    .filter((c) => c.id !== selectedCollection)
                    .slice(0, 4)
                    .map((collection) => (
                      <button
                        key={collection.id}
                        onClick={() => setSelectedCollection(collection.id)}
                        className={`p-4 rounded-xl border border-border/50 bg-gradient-to-br ${collection.color} text-left hover:border-gold/30 transition-all`}
                      >
                        <div className={`p-2 rounded-lg ${collection.iconBg} ${collection.iconColor} w-fit mb-2`}>
                          {collection.icon}
                        </div>
                        <h4 className="font-medium text-sm">{collection.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {collection.bookIds.length} books
                        </p>
                      </button>
                    ))
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

