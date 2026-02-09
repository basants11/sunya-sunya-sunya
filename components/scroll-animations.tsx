/**
 * Scroll Animation Components
 *
 * Components that animate on scroll to create engaging, dynamic experiences
 * that guide users through the page and highlight important content.
 */

"use client";

import { cn } from "@/lib/utils";
import {
  Variants,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef } from "react";

// =============================================================================
// SCROLL REVEAL ANIMATIONS
// =============================================================================

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

const directionVariants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={directionVariants[direction]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered Children Reveal
 * Reveals children one by one with staggered delay
 */
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

// =============================================================================
// PARALLAX EFFECTS
// =============================================================================

/**
 * Parallax Container
 * Creates depth with different scroll speeds
 */
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative moves slower, positive moves faster
}

export function Parallax({ children, className, speed = 0.5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
}

/**
 * Parallax Background
 * For hero sections with depth
 */
interface ParallaxBackgroundProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  parallaxSpeed?: number;
  className?: string;
  overlayOpacity?: number;
}

export function ParallaxBackground({
  children,
  backgroundImage,
  backgroundColor,
  parallaxSpeed = 0.5,
  className,
  overlayOpacity = 0.3,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${parallaxSpeed * 30}%`],
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 -top-[20%] -bottom-[20%]"
        style={{ y }}
      >
        {backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor }} />
        )}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// =============================================================================
// SCROLL PROGRESS INDICATORS
// =============================================================================

/**
 * Reading Progress Bar
 * Shows scroll progress at the top of the page
 */
interface ReadingProgressProps {
  className?: string;
  color?: string;
}

export function ReadingProgress({
  className,
  color = "bg-primary",
}: ReadingProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 origin-left z-50",
        color,
        className,
      )}
      style={{ scaleX }}
    />
  );
}

/**
 * Circular Scroll Progress
 * For section-based navigation
 */
interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularScrollProgress({
  size = 60,
  strokeWidth = 4,
  className,
}: CircularProgressProps) {
  const { scrollYProgress } = useScroll();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-primary"
          style={{
            pathLength: scrollYProgress,
            strokeDasharray: circumference,
          }}
        />
      </svg>
    </div>
  );
}

// =============================================================================
// SCROLL-TRIGGERED ANIMATIONS
// =============================================================================

/**
 * Scale on Scroll
 * Element scales up as it enters viewport
 */
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
  startScale?: number;
  endScale?: number;
}

export function ScaleOnScroll({
  children,
  className,
  startScale = 0.8,
  endScale = 1,
}: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [startScale, endScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Text Reveal on Scroll
 * Reveals text character by character or word by word
 */
interface TextRevealProps {
  text: string;
  className?: string;
  by?: "character" | "word";
  once?: boolean;
}

export function TextReveal({
  text,
  className,
  by = "word",
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const items = by === "character" ? text.split("") : text.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: by === "character" ? 0.03 : 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {item}
          {by === "word" && i < items.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.div>
  );
}

// =============================================================================
// HORIZONTAL SCROLL SECTIONS
// =============================================================================

/**
 * Horizontal Scroll Container
 * Converts vertical scroll to horizontal movement
 */
interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({
  children,
  className,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div ref={containerRef} className={cn("relative h-[200vh]", className)}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div style={{ x }} className="flex gap-8 px-8">
          {children}
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// FADE IN SECTIONS
// =============================================================================

/**
 * Fade In When Visible
 * Simple fade in animation when element enters viewport
 */
interface FadeInProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  duration = 0.6,
  delay = 0,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// BLUR REVEAL
// =============================================================================

/**
 * Blur Reveal
 * Reveals content by removing blur effect
 */
interface BlurRevealProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  once?: boolean;
}

export function BlurReveal({
  children,
  className,
  duration = 0.8,
  once = true,
}: BlurRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={
        isInView
          ? { filter: "blur(0px)", opacity: 1 }
          : { filter: "blur(10px)", opacity: 0 }
      }
      transition={{ duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// ROTATE ON SCROLL
// =============================================================================

/**
 * Rotate on Scroll
 * Rotates element based on scroll position
 */
interface RotateOnScrollProps {
  children: ReactNode;
  className?: string;
  startRotation?: number;
  endRotation?: number;
}

export function RotateOnScroll({
  children,
  className,
  startRotation = -15,
  endRotation = 15,
}: RotateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [startRotation, endRotation],
  );

  return (
    <motion.div ref={ref} style={{ rotate }} className={className}>
      {children}
    </motion.div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type ScrollRevealProps,
  type StaggerRevealProps,
  type ParallaxProps,
  type ParallaxBackgroundProps,
  type ReadingProgressProps,
  type CircularProgressProps,
  type ScaleOnScrollProps,
  type TextRevealProps,
  type HorizontalScrollProps,
  type FadeInProps,
  type BlurRevealProps,
  type RotateOnScrollProps,
};
