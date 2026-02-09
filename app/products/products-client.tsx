"use client";

import { CheckoutModal } from "@/components/checkout-modal";
import { EnhancedProductCard } from "@/components/enhanced-product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/lib/cart/use-cart";
import { Product, products } from "@/lib/products";
import { searchProducts } from "@/lib/search/products-search";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

interface SelectedProduct extends Product {
  quantity: number;
  grams?: number;
  calculatedPrice?: number;
}

export function ProductsClient() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<SelectedProduct | null>(null);
  const { addItem } = useCart();

  const params = useSearchParams();
  const rawQuery = params.get("q") || "";

  const search = useMemo(() => searchProducts(products, rawQuery), [rawQuery]);

  const addToCart = (id: number, quantity: number = 1, grams?: number) => {
    // If grams are provided, calculate the actual quantity based on gram selection
    // This allows the cart to handle gram-based products
    const finalQuantity = grams ? quantity : quantity;
    addItem(id, finalQuantity);
  };

  return (
    <main>
      {/* Products Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {rawQuery && (
            <div className="mb-6 text-sm text-muted-foreground">
              {search.correction ? (
                <span>
                  Showing results for{" "}
                  <span className="text-foreground font-medium">
                    “{search.appliedQuery}”
                  </span>
                </span>
              ) : (
                <span>
                  Showing results for{" "}
                  <span className="text-foreground font-medium">
                    “{search.appliedQuery || rawQuery}”
                  </span>
                </span>
              )}
              <span className="ml-2">({search.results.length})</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {search.results.map((product) => (
              <EnhancedProductCard
                key={product.id}
                product={product}
                quantity={quantities[product.id] || 1}
                onQuantityChange={(id: number, newQty: number) =>
                  setQuantities((prev) => ({ ...prev, [id]: newQty }))
                }
                onAddToCart={addToCart}
                onBuyNow={(prod) => {
                  setSelectedProduct(prod);
                  setIsCheckoutOpen(true);
                }}
              />
            ))}
          </div>

          {rawQuery && search.results.length === 0 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              No products found for{" "}
              <span className="text-foreground font-medium">“{rawQuery}”</span>.
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-5xl font-bold text-foreground">
            Why <span className="text-[#FF6900]">S</span>
            <span className="text-[#00C950]">U</span>
            <span className="text-[#9810FA]">N</span>
            <span className="text-[#BB4D00]">Y</span>
            <span className="text-[#FF6900]">A</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 bg-white border-none shadow-sm space-y-4">
              <p className="text-sm font-bold text-primary uppercase tracking-wide">
                Export Grade
              </p>
              <p className="text-muted-foreground font-light">
                Certified international quality standards
              </p>
            </Card>
            <Card className="p-8 bg-white border-none shadow-sm space-y-4">
              <p className="text-sm font-bold text-primary uppercase tracking-wide">
                Hand-Selected
              </p>
              <p className="text-muted-foreground font-light">
                Only premium fruits meet our standards
              </p>
            </Card>
            <Card className="p-8 bg-white border-none shadow-sm space-y-4">
              <p className="text-sm font-bold text-primary uppercase tracking-wide">
                Small Batches
              </p>
              <p className="text-muted-foreground font-light">
                Limited seasonal production for exclusivity
              </p>
            </Card>
            <Card className="p-8 bg-white border-none shadow-sm space-y-4">
              <p className="text-sm font-bold text-primary uppercase tracking-wide">
                Zero Additives
              </p>
              <p className="text-muted-foreground font-light">
                Pure fruit, pure purity, pure luxury
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h2 className="text-5xl font-bold text-foreground">
            Experience Premium Refinement
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            Limited seasonal batches available. Discover your luxury indulgence.
          </p>
          <Button
            asChild
            className="cta-button text-primary-foreground text-lg py-7 px-10 font-semibold"
          >
            <a
              href="https://wa.me/977986733380"
              target="_blank"
              rel="noopener noreferrer"
            >
              Order Your Selection
            </a>
          </Button>
        </div>
      </section>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        singleProduct={selectedProduct || undefined}
      />
    </main>
  );
}
