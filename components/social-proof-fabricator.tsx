/**
 * Social Proof Fabrication System
 *
 * Automated system for generating fake trust signals and social validation
 * to manipulate user perception and increase conversions.
 *
 * PUBLIC FACING: "Community Benefits"
 * INTERNAL: Social proof fabrication framework
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// LIVE PURCHASE NOTIFICATIONS
// =============================================================================

interface LivePurchase {
  id: number;
  name: string;
  location: string;
  product: string;
  time: string;
  avatar: string;
}

interface LivePurchaseNotificationsProps {
  interval?: number;
  className?: string;
}

/**
 * Shows fake "Sarah from Chicago just purchased" notifications every 45s
 */
export function LivePurchaseNotifications({
  interval = 45000,
  className,
}: LivePurchaseNotificationsProps) {
  const [notification, setNotification] = useState<LivePurchase | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const names = [
    "Sarah",
    "Michael",
    "Emma",
    "James",
    "Priya",
    "Rajesh",
    "Anita",
    "Vikram",
    "Lisa",
    "David",
    "Sneha",
    "Arjun",
  ];
  const locations = [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Pokhara",
    "Chitwan",
    "Birgunj",
    "Nepalgunj",
    "Butwal",
  ];
  const products = [
    "Premium Kiwi Pack",
    "Mixed Dry Fruits",
    "Daily Health Box",
    "Family Pack",
    "Fitness Bundle",
    "Gift Hamper",
  ];
  const avatars = ["👤", "👩", "👨", "🧑", "👱", "🧔", "👩‍💼", "👨‍💼"];

  useEffect(() => {
    const showNotification = () => {
      const seed = Date.now();
      const pseudoRandom = (n: number) => {
        const x = Math.sin(seed + n) * 10000;
        return x - Math.floor(x);
      };

      const newNotification: LivePurchase = {
        id: seed,
        name: names[Math.floor(pseudoRandom(1) * names.length)],
        location: locations[Math.floor(pseudoRandom(2) * locations.length)],
        product: products[Math.floor(pseudoRandom(3) * products.length)],
        time: "Just now",
        avatar: avatars[Math.floor(pseudoRandom(4) * avatars.length)],
      };

      requestAnimationFrame(() => {
        setNotification(newNotification);
        setIsVisible(true);
      });

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000);

    // Then show every interval
    const intervalTimer = setInterval(showNotification, interval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [interval]);

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{
            opacity: 0,
            x: prefersReducedMotion ? 0 : -100,
            scale: 0.9,
          }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "fixed bottom-4 left-4 z-50 max-w-sm",
            "bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border",
            "p-4",
            className,
          )}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xl">
              {notification.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                <span className="font-semibold">{notification.name}</span> from{" "}
                {notification.location}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Purchased {notification.product}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                {notification.time}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// TRUST WAVE RATINGS
// =============================================================================

interface TrustWaveProps {
  rating?: number;
  reviewCount?: string;
  className?: string;
}

/**
 * 5-star ratings that "fill up" sequentially with customer photos
 */
export function TrustWave({
  rating = 4.9,
  reviewCount = "1,200+",
  className,
}: TrustWaveProps) {
  const [filledStars, setFilledStars] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const fillStars = () => {
      for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
          requestAnimationFrame(() => setFilledStars(i));
        }, i * 200);
      }
    };

    fillStars();
  }, []);

  const customerPhotos = ["👩", "👨", "👩‍💼", "👨‍💼", "🧑"];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={
              i < filledStars
                ? { scale: 1, rotate: 0 }
                : { scale: 0, rotate: -180 }
            }
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: prefersReducedMotion ? 0 : i * 0.1,
            }}
          >
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Rating text */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{rating}</span>
        <span className="text-muted-foreground">/5</span>
        <span className="text-sm text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      </div>

      {/* Customer photos */}
      <div className="flex -space-x-2">
        {customerPhotos.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.5 + i * 0.1 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm border-2 border-white dark:border-slate-900"
          >
            {photo}
          </motion.div>
        ))}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-white dark:border-slate-900">
          +{reviewCount}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FAKE ENDORSEMENT CAROUSEL
// =============================================================================

interface Endorsement {
  name: string;
  logo: string;
}

interface FakeEndorsementCarouselProps {
  className?: string;
}

/**
 * Logos of fake publications (Forbes, NYT) with parallax effect
 */
export function FakeEndorsementCarousel({
  className,
}: FakeEndorsementCarouselProps) {
  const prefersReducedMotion = useReducedMotion();

  const endorsements: Endorsement[] = [
    { name: "Forbes", logo: "F" },
    { name: "NYT", logo: "N" },
    { name: "Times", logo: "T" },
    { name: "Health", logo: "H" },
    { name: "Wellness", logo: "W" },
    { name: "Lifestyle", logo: "L" },
  ];

  return (
    <div className={cn("overflow-hidden py-4", className)}>
      <p className="text-center text-sm text-muted-foreground mb-4">
        As Featured In
      </p>
      <motion.div
        animate={!prefersReducedMotion ? { x: ["0%", "-50%"] } : {}}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...endorsements, ...endorsements].map((item, i) => (
          <motion.div
            key={i}
            whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg"
          >
            <div className="w-8 h-8 rounded bg-foreground/10 flex items-center justify-center font-bold text-lg">
              {item.logo}
            </div>
            <span className="font-semibold text-muted-foreground">
              {item.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// =============================================================================
// FAKE PURCHASE COUNTER
// =============================================================================

interface FakePurchaseCounterProps {
  baseCount?: number;
  incrementInterval?: number;
  className?: string;
}

/**
 * Purchase counter that increments by 2-3 every 10 minutes
 * Even at 3 AM
 */
export function FakePurchaseCounter({
  baseCount = 1247892,
  incrementInterval = 600000, // 10 minutes
  className,
}: FakePurchaseCounterProps) {
  const [count, setCount] = useState(baseCount);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const increment = () => {
      // Increment by 2-3
      const incrementAmount = 2 + (Date.now() % 2);
      setCount((prev) => prev + incrementAmount);
    };

    const timer = setInterval(increment, incrementInterval);
    return () => clearInterval(timer);
  }, [incrementInterval]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <motion.div
      animate={
        !prefersReducedMotion
          ? {
              boxShadow: [
                "0 0 0 0 rgba(0, 201, 80, 0)",
                "0 0 20px 5px rgba(0, 201, 80, 0.2)",
                "0 0 0 0 rgba(0, 201, 80, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 3, repeat: Infinity }}
      className={cn(
        "inline-flex items-center gap-3 px-6 py-3 rounded-xl",
        "bg-gradient-to-r from-green-50 to-emerald-50",
        "border border-green-200",
        className,
      )}
    >
      <div className="relative">
        <motion.div
          animate={!prefersReducedMotion ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          🛒
        </motion.div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
      </div>
      <div>
        <p className="text-xs text-green-600 font-medium uppercase tracking-wider">
          Happy Customers
        </p>
        <p className="text-2xl font-bold text-green-800">
          {formatNumber(count)}
        </p>
      </div>
    </motion.div>
  );
}

// =============================================================================
// VIP BADGE
// =============================================================================

interface VIPBadgeProps {
  visitorNumber?: number;
  className?: string;
}

/**
 * "You're visitor #1,247,892" - always shows under 2 million
 */
export function VIPBadge({ visitorNumber, className }: VIPBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayNumber, setDisplayNumber] = useState(visitorNumber || 1247892);

  // Generate visitor number under 2 million if not provided
  useEffect(() => {
    if (!visitorNumber) {
      requestAnimationFrame(() => {
        setDisplayNumber(1000000 + Math.floor(Date.now() % 1000000));
      });
    }
  }, [visitorNumber]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-gradient-to-r from-purple-100 to-pink-100",
        "border border-purple-200",
        className,
      )}
    >
      <motion.span
        animate={!prefersReducedMotion ? { rotate: [0, 15, -15, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xl"
      >
        👑
      </motion.span>
      <span className="text-sm font-semibold text-purple-800">
        You&apos;re visitor #{displayNumber.toLocaleString()}
      </span>
    </motion.div>
  );
}

// =============================================================================
// TESTIMONIAL CAROUSEL WITH AI-GENERATED QUOTES
// =============================================================================

interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
  verified: boolean;
}

interface FakeTestimonialCarouselProps {
  className?: string;
}

/**
 * Fake customer photos with AI-generated quotes
 */
export function FakeTestimonialCarousel({
  className,
}: FakeTestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Kathmandu",
      quote:
        "The quality is unmatched. I've been buying premium dried fruits for years, and Sunya is simply the best!",
      rating: 5,
      avatar: "👩‍💼",
      verified: true,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Lalitpur",
      quote:
        "Export-grade quality at home. These aren't your average dried fruits. Worth every rupee!",
      rating: 5,
      avatar: "👨‍🔬",
      verified: true,
    },
    {
      id: 3,
      name: "Anita Gurung",
      location: "Pokhara",
      quote:
        "Perfect for my fitness journey. No crash, pure energy. The packaging is so luxurious too!",
      rating: 5,
      avatar: "💪",
      verified: true,
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Bhaktapur",
      quote:
        "Gifted these to my parents. They were amazed by the quality. Now they order regularly!",
      rating: 5,
      avatar: "🎁",
      verified: true,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-border shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">{current.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(current.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {current.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-foreground mb-3">
                &ldquo;{current.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {current.name}
                </span>
                <span>•</span>
                <span>{current.location}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i === currentIndex ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type LivePurchaseNotificationsProps,
  type TrustWaveProps,
  type FakeEndorsementCarouselProps,
  type FakePurchaseCounterProps,
  type VIPBadgeProps,
  type FakeTestimonialCarouselProps,
};
