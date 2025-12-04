"use client";

import Link from "next/link";
import { BookOpen, Heart, ShoppingCart, Truck, User, LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { SearchBar } from "@/components/search-bar";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { wishlist, isLoaded: wishlistLoaded } = useWishlist();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount, isLoaded: cartLoaded } = useCart();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 rounded-lg bg-gold/10">
              <BookOpen size={24} className="text-gold" />
            </div>
            <span className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient hidden sm:block">
              Biblion
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search size={20} />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart size={20} />
                {wishlistLoaded && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart size={22} />
                  {cartLoaded && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="font-[family-name:var(--font-playfair)] text-xl">
                    Your Cart
                  </SheetTitle>
                  <SheetDescription>
                    {cartCount === 0
                      ? "Your cart is empty"
                      : `${cartCount} item${cartCount > 1 ? "s" : ""} in your cart`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex-1 overflow-auto">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <ShoppingCart size={48} />
                      <p className="mt-4">No books in your cart yet</p>
                      <p className="text-sm">Start shopping to add items</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 py-4">
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-16 h-24 object-cover rounded book-shadow"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.author}</p>
                            <p className="text-gold font-semibold mt-1">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="icon-sm"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                size="icon-sm"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={16} />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="border-t border-border pt-4 mt-4 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-500 font-medium">
                        {cartTotal >= 35 ? "Free" : "$4.99"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-gold">
                        ${(cartTotal + (cartTotal >= 35 ? 0 : 4.99)).toFixed(2)}
                      </span>
                    </div>
                    <Link href="/checkout">
                      <Button className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold h-12">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                      <Truck size={16} />
                      Free shipping on orders over $35
                    </p>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Auth */}
            {!authLoading && (
              isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User size={16} className="mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        <Heart size={16} className="mr-2" />
                        My Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive cursor-pointer"
                    >
                      <LogIn size={16} className="mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User size={18} className="mr-2" />
                    Sign In
                  </Button>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <User size={20} />
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
