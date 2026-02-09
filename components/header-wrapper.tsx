"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Header with no SSR - forces client-only rendering
const Header = dynamic(() => import("./header").then(mod => {
  return { default: mod.Header };
}), {
  ssr: false,
  loading: () => <HeaderSkeleton />,
});

function HeaderSkeleton() {
  return (
    <header className="h-16 bg-background border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
      </div>
    </header>
  );
}

/**
 * HeaderWrapper - Forces client-side only rendering using dynamic import
 * This prevents useCart() hook from being called during SSR
 */
export function HeaderWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <HeaderSkeleton />;
  }

  return <Header />;
}
