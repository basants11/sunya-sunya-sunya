"use client";

import { InlineSunya } from "@/components/sunya-colored-text";
import Link from "next/link";
import { useState } from "react";

interface VIPBenefit {
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
}

// Professional SVG Icons
const Icons = {
  Gift: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  ),
  Truck: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
      <path d="M14 17h1" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
  Mail: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Cake: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v2" />
      <path d="M12 8v2" />
      <path d="M17 8v2" />
      <path d="M7 4h.01" />
      <path d="M12 4h.01" />
      <path d="M17 4h.01" />
    </svg>
  ),
  Crown: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  ),
  Star: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Sparkles: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M9 5H5" />
      <path d="M19 19v4" />
      <path d="M23 21h-4" />
    </svg>
  ),
  Package: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22v-9" />
    </svg>
  ),
  MessageCircle: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  Diamond: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12l4 6-10 13L2 9Z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  ),
  User: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Glass: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8" />
      <path d="M12 21v-4" />
      <path d="M12 17a5 5 0 0 0 5-5V3H7v9a5 5 0 0 0 5 5Z" />
      <path d="M7 3h10" />
    </svg>
  ),
  Infinity: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
    </svg>
  ),
  Ribbon: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Globe: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  Brain: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  Chart: () => (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Zap: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: () => (
    <svg
      className="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  ),
  Trophy: () => (
    <svg
      className="w-16 h-16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Heart: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
};

export function VIPClient() {
  const [selectedTier, setSelectedTier] = useState<
    "silver" | "gold" | "platinum"
  >("gold");

  const benefits: Record<string, VIPBenefit[]> = {
    silver: [
      {
        title: "15% Discount",
        icon: <Icons.Gift />,
        description: "On all orders",
        details: ["All products included", "Stackable with promotions"],
      },
      {
        title: "Free Shipping",
        icon: <Icons.Truck />,
        description: "On orders above ₹1,500",
        details: ["No minimum cart size", "Express shipping available"],
      },
      {
        title: "Monthly Newsletter",
        icon: <Icons.Mail />,
        description: "Exclusive recipes & tips",
        details: ["Health insights", "New product previews"],
      },
      {
        title: "Birthday Special",
        icon: <Icons.Cake />,
        description: "Extra 10% off + gift",
        details: ["Valid whole birthday month", "Surprise wellness gift"],
      },
    ],
    gold: [
      {
        title: "25% Discount",
        icon: <Icons.Crown />,
        description: "On all orders",
        details: ["Premium member rate", "All sales included"],
      },
      {
        title: "Priority Support",
        icon: <Icons.Star />,
        description: "24/7 WHATSAPP support",
        details: ["Dedicated support team", "Response within 1 hour"],
      },
      {
        title: "Exclusive Drops",
        icon: <Icons.Sparkles />,
        description: "Early access to new products",
        details: ["48 hours before public", "Limited quantities"],
      },
      {
        title: "Personalized Boxes",
        icon: <Icons.Package />,
        description: "Quarterly curated pack",
        details: ["Based on your preferences", "Surprise premium items"],
      },
      {
        title: "Wellness Consultation",
        icon: <Icons.MessageCircle />,
        description: "Monthly with nutritionist",
        details: ["Personalized recommendations", "Health goals tracking"],
      },
    ],
    platinum: [
      {
        title: "40% Discount",
        icon: <Icons.Diamond />,
        description: "On all orders",
        details: ["Maximum savings", "VIP exclusive pricing"],
      },
      {
        title: "Concierge Service",
        icon: <Icons.User />,
        description: "Personal shopping assistant",
        details: ["Dedicated account manager", "Custom bulk orders"],
      },
      {
        title: "VIP Events",
        icon: <Icons.Glass />,
        description: "Exclusive virtual tastings",
        details: ["Monthly live sessions", "Chef-led recipe workshops"],
      },
      {
        title: "Lifetime Access",
        icon: <Icons.Infinity />,
        description: "To all past & future products",
        details: ["Never-ending member benefits", "Legacy status"],
      },
      {
        title: "Gifting Concierge",
        icon: <Icons.Ribbon />,
        description: "Premium gifting service",
        details: ["Custom curated gifts", "Personal messaging"],
      },
      {
        title: "Sustainability Report",
        icon: <Icons.Globe />,
        description: "Your personal impact tracker",
        details: ["Monthly CO2 savings", "Tree planting credits"],
      },
    ],
  };

  const tiers = [
    {
      name: "Silver",
      key: "silver" as const,
      price: "Free",
      hook: "Good Start",
      minSpend: "No minimum",
      color: "bg-silver-gradient",
      badge: null,
    },
    {
      name: "Gold",
      key: "gold" as const,
      price: "रु499/year",
      hook: "Most Popular",
      minSpend: "रु1500 annual spend",
      color: "bg-gold-gradient",
      badge: "Most Popular",
    },
    {
      name: "Platinum",
      key: "platinum" as const,
      price: "रु1999/year",
      hook: "Elite Exclusive",
      minSpend: "रु5000 annual spend",
      color: "bg-platinum-gradient",
      badge: "Limited Spots",
    },
  ];

  return (
    <>
      {/* Hero Section with Enhanced Visuals */}
      <section className="relative py-24 px-4 md:px-8 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6900]/20 via-[#00C950]/20 to-[#9810FA]/20 animate-pulse" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 105, 0, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(0, 201, 80, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, rgba(152, 16, 250, 0.1) 0%, transparent 50%)`,
              animation: "pulse 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#FF6900]/20 to-transparent rounded-full blur-2xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#00C950]/20 to-transparent rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#9810FA]/20 to-transparent rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6900] via-[#00C950] to-[#9810FA] blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl shadow-2xl">
                <Icons.Trophy />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Join <InlineSunya /> Elite
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Exclusive VIP program designed for our most valued premium customers
          </p>

          {/* Highlighted Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF6900]/10 to-[#FF6900]/5 px-4 py-2 rounded-full border border-[#FF6900]/20">
              <Icons.Zap />
              <span className="font-semibold text-[#FF6900]">40% Off</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#00C950]/10 to-[#00C950]/5 px-4 py-2 rounded-full border border-[#00C950]/20">
              <Icons.User />
              <span className="font-semibold text-[#00C950]">
                Concierge Service
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#9810FA]/10 to-[#9810FA]/5 px-4 py-2 rounded-full border border-[#9810FA]/20">
              <Icons.Infinity />
              <span className="font-semibold text-[#9810FA]">
                Lifetime Benefits
              </span>
            </div>
          </div>

          <p className="text-lg font-semibold text-primary mb-4">
            Unlock premium perks and exclusive experiences
          </p>
        </div>
      </section>

      {/* Tier Selection with Enhanced Cards */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Choose Your Level
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the membership tier that best fits your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {tiers.map((tier, index) => (
              <button
                key={tier.key}
                onClick={() => setSelectedTier(tier.key)}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 cursor-pointer hover:transform hover:-translate-y-3 hover:shadow-2xl ${
                  selectedTier === tier.key
                    ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-2xl scale-105"
                    : "border-border bg-white dark:bg-slate-900 hover:border-primary/50 hover:shadow-xl"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Glow Effect for Selected Tier */}
                {selectedTier === tier.key && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl -z-10 animate-pulse" />
                )}

                {/* Tier Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedTier === tier.key
                        ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-600 dark:text-gray-400"
                    } transition-all duration-300`}
                  >
                    {tier.key === "silver" && <Icons.Gift />}
                    {tier.key === "gold" && <Icons.Crown />}
                    {tier.key === "platinum" && <Icons.Diamond />}
                  </div>
                </div>

                <div
                  className={`text-3xl font-bold mb-2 ${
                    selectedTier === tier.key
                      ? "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {tier.name}
                </div>
                <p className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  {tier.price}
                </p>
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  {tier.hook}
                </p>

                {tier.badge && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-urgency-red to-red-600 text-white text-xs px-3 py-1.5 rounded-full mb-3 font-semibold shadow-md">
                    <Icons.Zap />
                    {tier.badge}
                  </span>
                )}

                <p className="text-xs text-muted-foreground">{tier.minSpend}</p>

                {/* Hover Arrow */}
                <div
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    selectedTier === tier.key ? "opacity-100" : ""
                  }`}
                >
                  <Icons.ArrowRight />
                </div>
              </button>
            ))}
          </div>

          {/* Benefits Grid with Enhanced Cards */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              {tiers.find((t) => t.key === selectedTier)?.name} Benefits
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits[selectedTier].map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon Container */}
                  <div className="relative flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        selectedTier === "silver"
                          ? "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-600 dark:text-gray-400 group-hover:from-gray-200 group-hover:to-gray-300 dark:group-hover:from-gray-700 dark:group-hover:to-gray-600"
                          : selectedTier === "gold"
                            ? "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-600 dark:text-yellow-400 group-hover:from-yellow-200 group-hover:to-yellow-300 dark:group-hover:from-yellow-800/40 dark:group-hover:to-yellow-700/40"
                            : "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-600 dark:text-purple-400 group-hover:from-purple-200 group-hover:to-purple-300 dark:group-hover:from-purple-800/40 dark:group-hover:to-purple-700/40"
                      }`}
                    >
                      <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                    </div>
                    <div className="relative">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  {/* Details List */}
                  <ul className="relative space-y-2">
                    {benefit.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300"
                      >
                        <span
                          className={`mt-0.5 flex-shrink-0 ${
                            selectedTier === "silver"
                              ? "text-gray-400"
                              : selectedTier === "gold"
                                ? "text-yellow-500"
                                : "text-purple-500"
                          }`}
                        >
                          <Icons.Check />
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Social Proof */}
          <div className="text-center mb-12 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 py-8 rounded-2xl">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    10,000+ Premium Members
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Trust <InlineSunya /> Elite
                  </p>
                </div>
              </div>

              <div className="h-12 w-px bg-gray-300 dark:bg-gray-700 hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icons.Star key={i} />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    4.9/5 Rating
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on 2,500+ reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA */}
          <div className="text-center">
            <Link
              href="https://wa.me/977986733380"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-urgency-red to-red-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:transform hover:scale-105 shadow-2xl hover:shadow-red-500/25"
            >
              <span className="relative z-10">
                Join {tiers.find((t) => t.key === selectedTier)?.name} Today
              </span>
              <Icons.ArrowRight />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </Link>
            {selectedTier === "platinum" && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 px-4 py-2 rounded-full border border-purple-300 dark:border-purple-700">
                <Icons.Zap />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  Limited spots available - Act now!
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Personalization Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-accent/20 to-background relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#00C950]/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#9810FA]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00C950] to-[#9810FA] blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl shadow-2xl">
                  <Icons.Brain />
                </div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Personalized Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI learns your preferences and delivers tailored
              recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-border hover:border-[#00C950]/50 hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C950]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00C950]/20 to-[#00C950]/10 flex items-center justify-center text-[#00C950]">
                    <Icons.Brain />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Smart Recommendations
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "AI tracks your purchase history and preferences",
                    "Personalized product suggestions each week",
                    "Curated bundles based on your goals",
                    "Seasonal picks aligned with your taste profile",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <span className="mt-1 flex-shrink-0 text-[#00C950]">
                        <Icons.Check />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-border hover:border-[#9810FA]/50 hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9810FA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9810FA]/20 to-[#9810FA]/10 flex items-center justify-center text-[#9810FA]">
                    <Icons.Chart />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Wellness Dashboard
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Track your nutritional intake over time",
                    "Health goal progress monitoring",
                    "Personalized nutrition reports",
                    "Integration with fitness apps",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <span className="mt-1 flex-shrink-0 text-[#9810FA]">
                        <Icons.Check />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced How It Works */}
          <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-10 rounded-2xl border border-primary/20 shadow-xl">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              How It Works
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  text: "Answer our health quiz on signup",
                  icon: <Icons.User />,
                },
                {
                  step: 2,
                  text: "Make your first purchase",
                  icon: <Icons.Package />,
                },
                {
                  step: 3,
                  text: "AI learns your preferences",
                  icon: <Icons.Brain />,
                },
                {
                  step: 4,
                  text: "Enjoy personalized recommendations",
                  icon: <Icons.Star />,
                },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-primary flex items-center justify-center text-primary font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary mb-3">
                      {item.icon}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {item.text}
                    </p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6900] via-[#00C950] to-[#9810FA] blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl shadow-2xl">
                <Icons.Heart />
              </div>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Elevate Your Experience?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of satisfied members enjoying exclusive benefits
          </p>
          <Link
            href="https://wa.me/977986733380"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-xl font-bold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Start Your Journey</span>
            <Icons.ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
