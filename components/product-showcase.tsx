"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { CheckoutModal } from "./checkout-modal";

const products = [
  {
    id: 1,
    name: "Dried Kiwi Slices",
    price: 699,
    weight: "250g",
    image: "/dried-kiwi-slices-premium.jpg",
    description: "Tangy and naturally sweet dehydrated kiwi",
    stock: 8,
  },
  {
    id: 2,
    name: "Dried Mango",
    price: 599,
    weight: "250g",
    image: "/dried-mango-chunks-premium.jpg",
    description: "Golden dehydrated mango with natural sweetness",
    stock: 15,
  },
  {
    id: 3,
    name: "Dried Strawberry",
    price: 849,
    weight: "250g",
    image: "/dried-strawberry-freeze-dried.jpg",
    description: "Delicate freeze-dried strawberries bursting with flavor",
    stock: 5,
  },
  {
    id: 4,
    name: "Dried Apple",
    price: 549,
    weight: "250g",
    image: "/dried-apple-rings-natural.jpg",
    description: "Crispy dehydrated apple rings, naturally sweet",
    stock: 12,
  },
  {
    id: 5,
    name: "Dried Banana",
    price: 499,
    weight: "250g",
    image: "/dried-banana-chips-natural.jpg",
    description: "Sweet and satisfying dehydrated banana slices",
    stock: 3,
  },
  {
    id: 6,
    name: "Mixed Fruits Pack",
    price: 799,
    weight: "500g",
    image: "/mixed-dehydrated-fruits-blend.jpg",
    description: "Premium blend of kiwi, mango, strawberry, and apple",
    stock: 20,
  },
];

export function ProductShowcase() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const addToCart = (productId: number, quantity: number = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
  };

  const getQuantity = (productId: number) => quantities[productId] || 1;

  return (
    <section id="products" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Collection Banner */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg border border-border">
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-muted">
            <img
              src="https://m.media-amazon.com/images/I/71orCmmrCvL._AC_UF1000,1000_QL80_.jpg"
              alt="Premium Dehydrated Fruits Collection"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
              <div className="text-white p-6 sm:p-8 md:p-12">
                <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-90">Premium Collection</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Hand-Selected Dehydrated Fruits</h3>
                <p className="text-sm sm:text-base opacity-90">Zero sugar, zero preservatives, 100% natural goodness</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-2">
        
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide leading-relaxed mb-4 animate-fade-in">
            {/* NEUROMARKING: Word-by-word color psychology */}
            <span className="text-luxury-charcoal">Pure </span>
            <span className="text-gentle-green font-semibold">Healthy </span>
            <span className="text-warm-peach">Dehydrated Fruits</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No added sugar | No preservatives | 100% Natural
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border border-border bg-card"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.stock < 5 && (
                  <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded text-xs font-medium">
                    Only {product.stock} left
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {product.description}
                </p>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-primary">
                    रु{product.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {product.weight}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(1, getQuantity(product.id) - 1),
                      }))
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {getQuantity(product.id)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: getQuantity(product.id) + 1,
                      }))
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      addToCart(product.id, getQuantity(product.id))
                    }
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedProduct({
                        ...product,
                        quantity: getQuantity(product.id),
                      });
                      setIsCheckoutOpen(true);
                    }}
                    className="flex-1 min-h-[48px] h-auto px-5 py-3 text-base font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 border-2 border-red-800/40 focus-visible:ring-[3px] focus-visible:ring-red-500/50 focus-visible:ring-offset-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
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
              </div>
            </Card>
          ))}
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        singleProduct={selectedProduct}
      />
    </section>
  );
}
