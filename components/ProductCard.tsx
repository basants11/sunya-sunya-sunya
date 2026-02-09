"use client";

import { AnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";
import { PriceDisplay } from "@/components/price-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  nrsPrice: number;
  description: string;
  features: string[];
  image: string;
  badge: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onAddToCart: (id: number, quantity: number) => void;
  onBuyNow: (product: Product & { quantity: number }) => void;
}

export function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  return (
    <Card className="group h-full overflow-hidden rounded-xl border border-border/40 bg-card/95 p-0 gap-0 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_8px_20px_-16px_rgba(17,24,39,0.35)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_28px_-22px_rgba(17,24,39,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/40 ring-1 ring-inset ring-border/20">
        <img
          src={product.image || "/placeholder.svg"}
          alt={`${product.name} - Premium Dehydrated Fruit, Healthy Snack from Nepal`}
          className="h-full w-full object-cover object-center transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02]"
        />
        <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur">
          {product.badge}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5 gap-3">
        <div>
          <h3
            className="text-lg sm:text-xl font-semibold leading-tight tracking-tight text-foreground"
            data-product-id={product.id}
          >
            {product.name}
          </h3>
          <p className="text-primary font-semibold text-xl mt-1">
            <PriceDisplay nrsPrice={product.nrsPrice} />
          </p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {product.features.slice(0, 2).map((feature, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-primary/8 text-foreground/80 px-2.5 py-1 rounded-full font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-center gap-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() =>
              onQuantityChange(product.id, Math.max(1, quantity - 1))
            }
          >
            <Minus size={14} />
          </Button>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              onQuantityChange(product.id, parseInt(e.target.value) || 1)
            }
            className="w-12 h-8 text-center text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onQuantityChange(product.id, quantity + 1)}
          >
            <Plus size={14} />
          </Button>
        </div>
        <div className="flex gap-3 pt-2">
          <AnimatedAddToCartButton
            onClick={() => onAddToCart(product.id, quantity)}
            showPlusOne={true}
            variant="cart"
            size="touch"
            className="flex-1"
          >
            Add to Cart
          </AnimatedAddToCartButton>
          <Button
            onClick={() => onBuyNow({ ...product, quantity })}
            className="flex-1 min-h-[48px] h-auto px-5 py-3 text-base font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 border-2 border-red-800/40 focus-visible:ring-[3px] focus-visible:ring-red-500/50 focus-visible:ring-offset-2"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              color: "white",
              boxShadow:
                "0 10px 28px -10px rgba(220, 38, 38, 0.6), 0 4px 12px -4px rgba(0,0,0,0.15)",
            }}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Buy Now
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-green-600 flex items-center">✓ In Stock</span>
          <span className="text-blue-600 flex items-center">
            🚚 Free Shipping
          </span>
        </div>
      </div>
    </Card>
  );
}
