"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import component with no SSR - forces client-only rendering
const EnhancedCartSection = dynamic(() => import("./enhanced-cart-section").then(mod => {
  return { default: mod.EnhancedCartSection };
}), {
  ssr: false,
  loading: () => <CartSectionFallback />,
});

function CartSectionFallback() {
  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * EnhancedCartWrapper - Forces client-side only rendering using dynamic import
 * This prevents useCart() hook from being called during SSR
 */
export function EnhancedCartWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <CartSectionFallback />;
  }

  return <EnhancedCartSection />;
}
