"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/book";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  return (
    <div className="flex gap-4 py-4">
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
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={16} />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button
            size="icon-sm"
            variant="outline"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="h-7 w-7 text-destructive hover:text-destructive ml-auto"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
