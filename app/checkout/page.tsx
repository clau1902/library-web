"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart, isLoaded } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= 35 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate order number
    const order = `BIB-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(order);
    
    // Clear cart
    clearCart();
    
    setIsProcessing(false);
    setStep("confirmation");
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />
        
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold/10">
                  <BookOpen size={24} className="text-gold" />
                </div>
                <span className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
                  Biblion
                </span>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-6">
              <BookOpen size={48} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added any books yet. Start browsing our collection!
            </p>
            <Link href="/">
              <Button className="bg-gold hover:bg-gold-dark text-primary-foreground">
                Browse Books
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation page
  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />
        
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold/10">
                  <BookOpen size={24} className="text-gold" />
                </div>
                <span className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
                  Biblion
                </span>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-lg mx-auto">
            <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto mb-6">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            
            <Card className="border-border/50 bg-card/80 mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number</span>
                    <span className="font-mono font-bold text-gold">{orderNumber}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{shippingInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Address</span>
                    <span className="text-right">
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Paid</span>
                    <span className="text-gold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground mb-6">
              A confirmation email has been sent to {shippingInfo.email}
            </p>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-gold hover:bg-gold-dark text-primary-foreground">
                  Continue Shopping
                </Button>
              </Link>
              {isAuthenticated && (
                <Link href="/profile">
                  <Button variant="outline" className="border-gold/30 hover:bg-gold/10">
                    View Orders
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <BookOpen size={24} className="text-gold" />
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
                Biblion
              </span>
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock size={14} />
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => step === "cart" ? router.back() : setStep(step === "payment" ? "shipping" : "cart")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft size={20} />
          {step === "cart" ? "Continue Shopping" : "Back"}
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {["cart", "shipping", "payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? "bg-gold text-primary-foreground"
                    : ["cart", "shipping", "payment"].indexOf(step) > i
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {["cart", "shipping", "payment"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              <span className={`hidden sm:inline text-sm ${step === s ? "font-medium" : "text-muted-foreground"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < 2 && <div className="w-8 sm:w-16 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Step */}
            {step === "cart" && (
              <Card className="border-border/50 bg-card/80">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Shopping Cart ({cart.length} items)</h2>
                  
                  <div className="divide-y divide-border">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 py-4">
                        <Link href={`/books/${item.id}`}>
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-20 h-28 object-cover rounded"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/books/${item.id}`}>
                            <h3 className="font-medium hover:text-gold transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                          <p className="text-gold font-semibold mt-1">${item.price.toFixed(2)}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded hover:bg-muted"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded hover:bg-muted"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-destructive hover:bg-destructive/10 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => setStep("shipping")}
                      className="w-full bg-gold hover:bg-gold-dark text-primary-foreground h-12"
                    >
                      Proceed to Shipping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Step */}
            {step === "shipping" && (
              <Card className="border-border/50 bg-card/80">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-gold" />
                    Shipping Information
                  </h2>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">First Name</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Last Name</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone</label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Address</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-sm font-medium mb-1 block">City</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">State</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">ZIP Code</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Country</label>
                        <select
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-dark text-primary-foreground h-12 mt-6"
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <Card className="border-border/50 bg-card/80">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-gold" />
                    Payment Information
                  </h2>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Name on Card</label>
                      <input
                        type="text"
                        required
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">CVV</label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-border/50 bg-secondary/50 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-500 text-sm mt-4">
                      <ShieldCheck size={18} />
                      Your payment information is secure and encrypted
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gold hover:bg-gold-dark text-primary-foreground h-12 mt-6"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Pay $${total.toFixed(2)}`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 bg-card/80 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                {/* Items Preview */}
                <div className="space-y-3 mb-4">
                  {cart.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{cart.length - 3} more item(s)
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-green-500" : ""}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-gold">${total.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <Badge className="mt-4 bg-green-500/10 text-green-500 border-0 w-full justify-center">
                    <Truck size={14} className="mr-1" />
                    Free shipping applied!
                  </Badge>
                )}

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Add ${(35 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

