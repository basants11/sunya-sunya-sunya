"use client";

import { InlineSunya } from "@/components/sunya-colored-text";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/use-cart";
import { DailyPackage } from "@/lib/personalized-recommendation-engine";
import {
  Check,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

interface SunyaCareCartItemProps {
  dailyPackage: DailyPackage;
  onRemove?: () => void;
}

export function SunyaCareCartItem({
  dailyPackage,
  onRemove,
}: SunyaCareCartItemProps) {
  const { addItem, updateQuantity, removeItem, hasItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if package is already in cart
  const packageId = 9999; // Special ID for SUNYA Care package
  const isInCart = hasItem(packageId);

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

  const handleAddToCart = () => {
    // Add package as a single item with special ID
    addItem(packageId, quantity);
    setIsAdded(true);

    // Reset after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);

    if (isInCart) {
      updateQuantity(packageId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(packageId);
    onRemove?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group premium-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00C950] to-[#00A040] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm animate-premium-float">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                <InlineSunya /> Care Daily Package
              </h3>
              <p className="text-sm text-white/90">
                {dailyPackage.recommendations.length} products • Rs.{" "}
                {dailyPackage.totalPrice.toLocaleString()}/day
              </p>
            </div>
          </div>
          {isInCart && (
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Icons */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          {dailyPackage.recommendations.map((rec, index) => (
            <div
              key={rec.product.id}
              className="relative group/icon"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-2xl border-2 border-gray-200 shadow-sm transition-all duration-300 animate-premium-scale-in premium-hover-lift"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {getFruitEmoji(rec.product.name)}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="font-semibold mb-1">{rec.product.name}</div>
                <div className="text-gray-300">{rec.dailyQuantity}g daily</div>
              </div>
            </div>
          ))}
        </div>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            {
              label: "Calories",
              value: Math.round(dailyPackage.totalCalories),
              color: "text-orange-600",
            },
            {
              label: "Protein",
              value: `${Math.round(dailyPackage.totalProtein)}g`,
              color: "text-green-600",
            },
            {
              label: "Carbs",
              value: `${Math.round(dailyPackage.totalCarbs)}g`,
              color: "text-purple-600",
            },
            {
              label: "Fiber",
              value: `${Math.round(dailyPackage.totalFiber)}g`,
              color: "text-amber-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gray-50 rounded-lg p-2 text-center animate-premium-slide-up"
              style={{ animationDelay: `${item.label.length * 50}ms` }}
            >
              <div className={`text-lg font-bold ${item.color}`}>
                {item.value}
              </div>
              <div className="text-xs text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Coverage Badge */}
        <div className="flex items-center justify-center mb-4">
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium animate-premium-scale-in ${
              dailyPackage.meetsRequirements
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {dailyPackage.meetsRequirements ? (
              <>
                <Check className="w-4 h-4 inline mr-1" />
                Meets Daily Requirements
              </>
            ) : (
              `${dailyPackage.coveragePercentage}% of Daily Needs`
            )}
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Daily Price</div>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {(dailyPackage.totalPrice * quantity).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              Rs. {(dailyPackage.totalPrice * 30 * quantity).toLocaleString()} /
              month
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="px-4 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`${
                isAdded
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gradient-to-r from-[#00C950] to-[#00A040] hover:from-[#00A040] hover:to-[#008030]"
              } text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 premium-button`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart ? "Update" : "Add"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Sparkle Effect on Hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-2 right-2 w-4 h-4 text-[#FFD700] animate-premium-star" />
        </div>
      )}
    </div>
  );
}

interface CompactSunyaCareCartItemProps {
  dailyPackage: DailyPackage;
  onClick?: () => void;
}

export function CompactSunyaCareCartItem({
  dailyPackage,
  onClick,
}: CompactSunyaCareCartItemProps) {
  const { hasItem } = useCart();
  const packageId = 9999;
  const isInCart = hasItem(packageId);

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
      className="w-full bg-gradient-to-r from-[#00C950] to-[#00A040] text-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 group premium-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {dailyPackage.recommendations.slice(0, 4).map((rec) => (
              <div
                key={rec.product.id}
                className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl border border-white/30 group-hover:scale-110 transition-transform animate-premium-scale-in"
              >
                {getFruitEmoji(rec.product.name)}
              </div>
            ))}
            {dailyPackage.recommendations.length > 4 && (
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold border border-white/30">
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
          {isInCart ? (
            <div className="flex items-center gap-1 text-green-300">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">In Cart</span>
            </div>
          ) : (
            <div className="text-2xl font-bold animate-premium-pulse">
              {dailyPackage.coveragePercentage}%
            </div>
          )}
          <div className="text-xs text-white/80">Coverage</div>
        </div>
      </div>
    </button>
  );
}
