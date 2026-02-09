/**
 * Authority & Trust Engineering
 *
 * Credibility theater components designed to establish false authority
 * and manipulate user trust perception.
 *
 * PUBLIC FACING: "Trust & Security Center"
 * INTERNAL: Authority manipulation framework
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// SECURITY THEATER BADGE
// =============================================================================

interface SecurityTheaterProps {
  className?: string;
}

/**
 * Security theater: Animated lock icon with "256-bit encrypted" pulsing
 */
export function SecurityTheater({ className }: SecurityTheaterProps) {
  const prefersReducedMotion = useReducedMotion();

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
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-green-50 border border-green-200",
        className,
      )}
    >
      <motion.div
        animate={!prefersReducedMotion ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative"
      >
        <span className="text-xl">🔒</span>
        <motion.span
          animate={!prefersReducedMotion ? { opacity: [0, 1, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 text-xl"
        >
          🔓
        </motion.span>
      </motion.div>
      <span className="text-sm font-semibold text-green-700">
        256-bit Encrypted
      </span>
    </motion.div>
  );
}

// =============================================================================
// MEDIA MARQUEE
// =============================================================================

interface MediaMarqueeProps {
  className?: string;
}

/**
 * Media marquee: Fake "As Featured In" logos scrolling slowly
 */
export function MediaMarquee({ className }: MediaMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();

  const publications = [
    { name: "Forbes", color: "#1a1a1a" },
    { name: "NYT", color: "#1a1a1a" },
    { name: "Times", color: "#c00" },
    { name: "Health", color: "#00a86b" },
    { name: "Wellness", color: "#8b5cf6" },
    { name: "Lifestyle", color: "#f59e0b" },
    { name: "Business", color: "#2563eb" },
    { name: "Tech", color: "#06b6d4" },
  ];

  return (
    <div className={cn("overflow-hidden py-4", className)}>
      <p className="text-center text-sm text-muted-foreground mb-4 uppercase tracking-wider">
        As Featured In
      </p>
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          animate={!prefersReducedMotion ? { x: ["0%", "-50%"] } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...publications, ...publications].map((pub, i) => (
            <motion.div
              key={i}
              whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
              className="flex items-center gap-2 px-6 py-3 bg-muted/50 rounded-lg"
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: pub.color }}
              >
                {pub.name.charAt(0)}
              </div>
              <span className="font-semibold text-muted-foreground">
                {pub.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPERT AVATARS
// =============================================================================

interface Expert {
  name: string;
  title: string;
  avatar: string;
  verified: boolean;
}

interface ExpertAvatarsProps {
  experts?: Expert[];
  className?: string;
}

/**
 * Expert avatars: Stock photo "doctors/scientists" with verification badges
 */
export function ExpertAvatars({
  experts = [
    { name: "Dr. Sharma", title: "Nutritionist", avatar: "👨‍⚕️", verified: true },
    { name: "Dr. Patel", title: "Health Expert", avatar: "👩‍⚕️", verified: true },
    { name: "Dr. Kumar", title: "Dietician", avatar: "🧑‍⚕️", verified: true },
  ],
  className,
}: ExpertAvatarsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-semibold text-muted-foreground">
        Recommended by Experts
      </p>
      <div className="flex gap-4">
        {experts.map((expert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : i * 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl">
                {expert.avatar}
              </div>
              {expert.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{expert.name}</p>
              <p className="text-xs text-muted-foreground">{expert.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// CERTIFICATION PARADE
// =============================================================================

interface Certification {
  name: string;
  icon: string;
}

interface CertificationParadeProps {
  certifications?: Certification[];
  className?: string;
}

/**
 * Certification parade: SSL badges that animate sequentially
 */
export function CertificationParade({
  certifications = [
    { name: "SSL Secure", icon: "🔒" },
    { name: "ISO Certified", icon: "✓" },
    { name: "FDA Approved", icon: "🏥" },
    { name: "GMP Quality", icon: "⭐" },
  ],
  className,
}: CertificationParadeProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= certifications.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [certifications.length]);

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {certifications.map((cert, i) => (
        <AnimatePresence key={i}>
          {i < visibleCount && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: prefersReducedMotion ? 0 : i * 0.1,
              }}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
            >
              <span className="text-lg">{cert.icon}</span>
              <span className="text-xs font-medium">{cert.name}</span>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
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

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  className?: string;
}

/**
 * Testimonial carousel: Fake customer photos with AI-generated quotes
 */
export function TestimonialCarousel({
  testimonials = [
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
  ],
  className,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[currentIndex];

  return (
    <div className={cn("relative", className)}>
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
            <div className="text-5xl">{current.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(current.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {current.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-foreground mb-3 text-lg">
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

      {/* Dots */}
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
  type SecurityTheaterProps,
  type MediaMarqueeProps,
  type ExpertAvatarsProps,
  type CertificationParadeProps,
  type TestimonialCarouselProps,
  type Expert,
  type Certification,
  type Testimonial,
};
