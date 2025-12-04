import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-burgundy/5" />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight animate-fade-in-up">
            Discover Your Next
            <span className="text-gold-gradient block">Literary Adventure</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up stagger-2">
            Explore our curated collection of bestsellers, hidden gems, and timeless classics.
            From gripping thrillers to heartwarming romances, find the perfect book for every mood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
            <Link href="/bestsellers">
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold px-8">
                Browse Bestsellers
              </Button>
            </Link>
            <Link href="/collections">
              <Button size="lg" variant="outline" className="border-gold/30 hover:bg-gold/5 hover:border-gold/50 hover:text-gold transition-colors">
                View Collections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
