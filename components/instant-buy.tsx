"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/lib/hooks/use-currency";
import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Dried Kiwi Slices",
    price: 699,
    weight: "250g",
    image: "/dried-kiwi-slices-premium.jpg",
    description: "Tangy and naturally sweet dehydrated kiwi",
    nutrition: "High in Vitamin C",
  },
  {
    id: 2,
    name: "Dried Mangoo",
    price: 599,
    weight: "250g",
    image: "/dried-mango-chunks-premium.jpg",
    description: "Golden dehydrated mango with natural sweetness",
    nutrition: "Rich in Fiber",
  },
  {
    id: 3,
    name: "Dried Strawberry",
    price: 849,
    weight: "250g",
    image: "/dried-strawberry-freeze-dried.jpg",
    description: "Delicate freeze-dried strawberries bursting with flavor",
    nutrition: "Antioxidant Rich",
  },
  {
    id: 6,
    name: "Mixed Fruits Pack",
    price: 799,
    weight: "500g",
    image: "/mixed-dehydrated-fruits-blend.jpg",
    description: "Premium blend of kiwi, mango, strawberry, and apple",
    nutrition: "Complete Nutrition",
  },
];

export function InstantBuy() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);
  const { formatPrice } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const handleBuyNow = () => {
    const whatsappUrl = "https://wa.me/9779867333080?text=Hello%20Basant";
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="cta"
        className="fixed bottom-6 right-6 z-40 rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-300 flex items-center gap-2 animate-bounce"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="hidden sm:inline font-semibold">Care Now</span>
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Instant Buy - Direct Order</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-muted p-1 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Product Selection */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Select Your Fruit
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedProduct.id === product.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.weight}
                      </div>
                      <div className="font-bold text-primary mt-1">
                        {formatPrice(product.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Product Details */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <img
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.description}
                </p>
                <p className="text-sm font-semibold text-secondary">
                  {selectedProduct.nutrition}
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center gap-4 bg-muted p-3 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-primary text-primary-foreground rounded px-3 py-1 font-semibold hover:bg-primary/90"
                  >
                    −
                  </button>
                  <span className="font-bold text-lg w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-primary text-primary-foreground rounded px-3 py-1 font-semibold hover:bg-primary/90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per unit</span>
                  <span className="font-semibold">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-semibold">{quantity}x</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(selectedProduct.price * quantity)}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <Button
                  onClick={handleBuyNow}
                  className="w-full min-h-[52px] h-auto px-6 py-4 text-lg font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 border-2 border-green-700/40 focus-visible:ring-[3px] focus-visible:ring-green-500/50 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                    color: "white",
                    boxShadow:
                      "0 12px 32px -10px rgba(22, 163, 74, 0.6), 0 4px 12px -4px rgba(0,0,0,0.15)",
                  }}
                >
                  <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                  Complete Order via WhatsApp
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  One-click checkout. Fast delivery. Premium quality guaranteed.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
