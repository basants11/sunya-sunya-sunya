"use client";
import { useEffect, useRef, useState } from "react";

export function UrgencyBanner() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;
      const targetTop = targetRef.current.getBoundingClientRect().top;
      if (targetTop <= 0) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="bg-gradient-to-r from-red-600 to-orange-600 text-white pb-3 px-4 sticky top-16 z-40 animate-pulse"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-bounce">⏰</span>
          <span className="font-semibold">
            Limited Time: 20% OFF Seasonal Packs
          </span>
        </div>
      </div>
      {/* Invisible target for scroll detection */}
      <div
        ref={targetRef}
        className="absolute -bottom-[800px] left-0 w-0 h-0 pointer-events-none"
      />
    </div>
  );
}
