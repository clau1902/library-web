import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const sizeMap = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={starSize}
          className={star <= Math.round(rating) ? "text-gold fill-gold" : "text-muted-foreground"}
        />
      ))}
    </div>
  );
}
