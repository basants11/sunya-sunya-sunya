import {
  generateProductsMetadata,
  generateProductsPageSchemas,
} from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsClient } from "./products-client";

// Export enhanced SEO metadata for products page
export const metadata: Metadata = generateProductsMetadata();

export default function ProductsPage() {
  // Generate structured data schemas
  const schemas = generateProductsPageSchemas().map((schema) =>
    JSON.parse(schema),
  );

  return (
    <>
      {/* Structured Data - Backend SEO Injection */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}

      <Suspense fallback={<ProductsPageFallback />}>
        <ProductsClient />
      </Suspense>
    </>
  );
}

function ProductsPageFallback() {
  return (
    <main>
      {/* Hero Section (skeleton) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-pulse">
            <div className="h-14 sm:h-16 w-3/4 mx-auto rounded-md bg-muted/40" />
            <div className="h-7 w-2/3 mx-auto rounded-md bg-muted/30" />
          </div>
        </div>
      </section>

      {/* Products Grid (skeleton) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-muted/40" />
                <div className="p-5 space-y-3">
                  <div className="h-6 w-3/4 rounded bg-muted/40" />
                  <div className="h-4 w-full rounded bg-muted/30" />
                  <div className="h-4 w-2/3 rounded bg-muted/30" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-8 w-16 rounded-full bg-muted/40" />
                    <div className="h-8 w-16 rounded-full bg-muted/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
