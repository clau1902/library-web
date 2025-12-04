export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  cover: string;
  category: string;
  badge?: string;
  description: string;
  fileUrl?: string;
  fileType?: "epub" | "pdf";
}

export interface CartItem extends Book {
  quantity: number;
}
