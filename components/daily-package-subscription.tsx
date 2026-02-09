"use client";

import { InlineSunya } from "@/components/sunya-colored-text";
import { Button } from "@/components/ui/button";
import { DailyPackage } from "@/lib/personalized-recommendation-engine";
import {
  Calendar,
  Check,
  Download,
  Package,
  Share2,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface DailyPackageSubscriptionProps {
  dailyPackage: DailyPackage;
  onSubscribe?: () => void;
  onAddToCart?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export function DailyPackageSubscription({
  dailyPackage,
  onSubscribe,
  onAddToCart,
  onExport,
  onShare,
}: DailyPackageSubscriptionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubscribe = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1000);
    onSubscribe?.();
  };

  const handleAddToCart = () => {
    onAddToCart?.();
  };

  const getFruitEmoji = (productName: string): string => {
    const name = productName.toLowerCase();
    if (name.includes("kiwi")) return "🥝";
    if (name.includes("blueberry")) return "🫐";
    if (name.includes("pineapple")) return "🍍";
    if (name.includes("papaya")) return "🥭";
    if (name.includes("apple")) return "🍎";
    if (name.includes("banana")) return "🍌";
    if (name.includes("mango")) return "🥭";
    if (name.includes("strawberry")) return "🍓";
    return "🍇";
  };

  return (
    <div className="space-y-4">
      {/* Subscription Promise Card */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00C950] via-[#00A040] to-[#008030] p-6 text-white shadow-xl transition-all duration-500 premium-card ${
          isHovered ? "shadow-2xl scale-[1.02]" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] animate-pulse" />
        </div>

        {/* Sparkle Icons */}
        <div className="absolute top-4 right-4">
          <Sparkles
            className={`w-6 h-6 ${isPulsing ? "animate-premium-pulse" : ""}`}
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm animate-premium-float">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Custom Daily Package</h3>
              <p className="text-sm text-white/90">
                Personalized nutrition, delivered daily
              </p>
            </div>
          </div>

          {/* Product Icons Grid */}
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm mb-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {dailyPackage.recommendations.map((rec, index) => (
                <div
                  key={rec.product.id}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm border-2 border-white/30 group-hover:border-white/60 group-hover:scale-110 transition-all duration-300 animate-premium-float-in premium-hover-lift">
                    {getFruitEmoji(rec.product.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#FFD700] text-[#008030] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-premium-scale-in">
                    {rec.dailyQuantity}g
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-white/80 mt-3 italic animate-premium-fade-in">
              Perfectly measured for your daily wellness
            </p>
          </div>

          {/* Package Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              {
                value: dailyPackage.recommendations.length,
                label: "Products",
                color: "bg-blue-400/20",
              },
              {
                value: Math.round(dailyPackage.totalCalories),
                label: "Calories",
                color: "bg-orange-400/20",
              },
              {
                value: `${Math.round(dailyPackage.totalProtein)}g`,
                label: "Protein",
                color: "bg-green-400/20",
              },
              {
                value: `${Math.round(dailyPackage.totalFiber)}g`,
                label: "Fiber",
                color: "bg-purple-400/20",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`${item.color} rounded-lg p-3 backdrop-blur-sm animate-premium-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-xs text-white/80">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Coverage Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium animate-premium-scale-in ${
                dailyPackage.meetsRequirements
                  ? "bg-green-400 text-green-900"
                  : "bg-yellow-400 text-yellow-900"
              }`}
            >
              {dailyPackage.meetsRequirements ? (
                <>
                  <Check className="w-4 h-4 inline mr-1" />
                  Meets Requirements
                </>
              ) : (
                `${dailyPackage.coveragePercentage}% of Daily Needs`
              )}
            </div>
          </div>

          {/* Promise Text */}
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-4 animate-premium-fade-in">
            <p className="text-sm leading-relaxed">
              We craft your personalized daily <InlineSunya /> Care Package —
              measured, safe, and delivered once per day. Includes only safe
              products for your health conditions.
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="animate-premium-slide-up">
              <div className="text-sm text-white/80">Daily Package Price</div>
              <div className="text-3xl font-bold">
                Rs. {dailyPackage.totalPrice.toLocaleString()}
              </div>
              <div className="text-xs text-white/70">
                Rs. {(dailyPackage.totalPrice * 30).toLocaleString()} / month
              </div>
            </div>
            <div
              className="text-right animate-premium-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-sm text-white/80">Delivery</div>
              <div className="flex items-center gap-1 text-lg font-semibold">
                <Calendar className="w-4 h-4" />
                Daily
              </div>
            </div>
          </div>

          {/* Subscribe Button */}
          <Button
            onClick={handleSubscribe}
            className={`w-full bg-white text-[#00C950] hover:bg-gray-100 font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 premium-button ${
              isPulsing ? "animate-premium-pulse" : ""
            }`}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Subscribe to Your Custom Daily Package
          </Button>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="w-full mt-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 premium-button"
          >
            Add Package to Cart
          </Button>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">What's Included</h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-[#00C950] hover:text-[#00A040] font-medium"
          >
            {showDetails ? "Show Less" : "Show More"}
          </button>
        </div>
        <div className="space-y-3">
          {dailyPackage.recommendations.map((rec, index) => (
            <div
              key={rec.product.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                showDetails
                  ? "border-[#00C950]/20 bg-[#00C950]/5"
                  : "border-gray-200"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl animate-scale-in">
                  {getFruitEmoji(rec.product.name)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {rec.product.name}
                  </div>
                  <div className="text-xs text-gray-600">{rec.reason}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#00C950]">
                  {rec.dailyQuantity}g
                </div>
                <div className="text-xs text-gray-600">
                  {rec.servings} servings
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            icon: Package,
            title: "Personalized",
            desc: "Tailored to your needs",
          },
          { icon: Calendar, title: "Daily Delivery", desc: "Fresh every day" },
          { icon: Sparkles, title: "Premium Quality", desc: "Only the best" },
        ].map((benefit, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow duration-300"
          >
            <benefit.icon className="w-6 h-6 text-[#00C950] mx-auto mb-2" />
            <div className="font-semibold text-gray-900 text-sm">
              {benefit.title}
            </div>
            <div className="text-xs text-gray-600">{benefit.desc}</div>
          </div>
        ))}
      </div>

      {/* Export/Share Options */}
      <div className="flex gap-3">
        <Button
          onClick={onExport}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Plan
        </Button>
        <Button
          onClick={onShare}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Plan
        </Button>
      </div>
    </div>
  );
}

interface CompactDailyPackageProps {
  dailyPackage: DailyPackage;
  onClick?: () => void;
}

export function CompactDailyPackage({
  dailyPackage,
  onClick,
}: CompactDailyPackageProps) {
  const getFruitEmoji = (productName: string): string => {
    const name = productName.toLowerCase();
    if (name.includes("kiwi")) return "🥝";
    if (name.includes("blueberry")) return "🫐";
    if (name.includes("pineapple")) return "🍍";
    if (name.includes("papaya")) return "🥭";
    if (name.includes("apple")) return "🍎";
    if (name.includes("banana")) return "🍌";
    if (name.includes("mango")) return "🥭";
    if (name.includes("strawberry")) return "🍓";
    return "🍇";
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-[#00C950] to-[#00A040] text-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {dailyPackage.recommendations.slice(0, 4).map((rec) => (
              <div
                key={rec.product.id}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg border border-white/30 group-hover:scale-110 transition-transform"
              >
                {getFruitEmoji(rec.product.name)}
              </div>
            ))}
            {dailyPackage.recommendations.length > 4 && (
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold border border-white/30">
                +{dailyPackage.recommendations.length - 4}
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">Daily Package</p>
            <p className="text-sm text-white/90">
              {dailyPackage.recommendations.length} products • Rs.{" "}
              {dailyPackage.totalPrice.toLocaleString()}/day
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {dailyPackage.coveragePercentage}%
          </div>
          <div className="text-xs text-white/80">Coverage</div>
        </div>
      </div>
    </button>
  );
}
