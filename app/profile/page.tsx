"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  LogOut,
  Mail,
  Settings,
  ShoppingBag,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { wishlist } = useWishlist();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
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

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-gold text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Member since {formatDate(user.createdAt)}
                </span>
              </div>
            </div>

            <Button variant="outline" className="border-gold/30 hover:bg-gold/10">
              <Settings size={18} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-pink-500/10 text-pink-500">
                  <Heart size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{wishlist.length}</p>
                  <p className="text-sm text-muted-foreground">Books in Wishlist</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gold/10 text-gold">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Orders Placed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Books Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Wishlist Preview */}
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Heart size={20} className="text-pink-500" />
                  My Wishlist
                </h2>
                <Link href="/wishlist">
                  <Button variant="ghost" size="sm" className="text-gold">
                    View All
                  </Button>
                </Link>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No books in your wishlist yet</p>
                  <Link href="/">
                    <Button variant="link" className="text-gold mt-2">
                      Browse Books
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.slice(0, 3).map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{book.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {book.author}
                        </p>
                      </div>
                      <span className="text-gold font-semibold">
                        ${book.price.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Settings size={20} className="text-gold" />
                Account Settings
              </h2>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-muted-foreground" />
                    <span>Personal Information</span>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-muted-foreground" />
                    <span>Order History</span>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </button>

                <Separator />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 transition-colors text-left text-destructive"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Browse CTA */}
        <Card className="border-border/50 bg-gradient-to-br from-gold/10 to-transparent">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-2">
              Ready to discover your next read?
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore our curated collection of bestsellers and hidden gems.
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
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

