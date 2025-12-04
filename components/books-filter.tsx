"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/books";

interface BooksFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function BooksFilter({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: BooksFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className={
              selectedCategory === category
                ? "bg-gold hover:bg-gold-dark text-primary-foreground whitespace-nowrap"
                : "border-border/50 hover:border-gold/30 whitespace-nowrap"
            }
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Sort */}
      <div className="md:ml-auto">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-secondary/50 border-border/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
