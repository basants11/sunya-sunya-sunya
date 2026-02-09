"use client";

import { InlineSunya } from "@/components/sunya-colored-text";
import { useCart } from "@/lib/cart/use-cart";
import {
  calculateNutrition,
  getDailyValuePercentages,
  identifyDeficiencies,
  searchFood,
  type FoodItem,
} from "@/lib/nutrition-data";
import {
  getRecommendations,
  getSearchHistory,
  storeSearchHistory,
  type Recommendation,
} from "@/lib/recommendation-engine";
import { useEffect, useRef, useState } from "react";

export function EnhancedNutritionPanel() {
  const { addItem, hasItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [grams, setGrams] = useState(100);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [searchHistory, setSearchHistory] = useState(getSearchHistory());
  const [showExitBanner, setShowExitBanner] = useState(false);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [cumulativeBenefits, setCumulativeBenefits] = useState(0);
  const recommendationRef = useRef<HTMLDivElement>(null);

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const results = searchFood(searchQuery);
    if (results.length > 0) {
      const food = results[0];
      setSelectedFood(food);

      // Store search history
      storeSearchHistory({
        query: searchQuery,
        timestamp: Date.now(),
        grams,
        foodId: food.id,
      });

      // Update search history state
      setSearchHistory(getSearchHistory());

      // Get recommendations
      const recs = getRecommendations(food, grams, searchHistory);
      setRecommendations(recs);
      setShowRecommendations(true);

      // Scroll to recommendations
      setTimeout(() => {
        recommendationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  // Handle add to cart
  const handleAddToCart = (productId: number, quantity: number) => {
    addItem(productId, quantity);
    setAddedToCart(productId);

    // Update cumulative benefits
    setCumulativeBenefits((prev) => prev + 1);

    // Reset added state after animation
    setTimeout(() => setAddedToCart(null), 2000);
  };

  // Handle exit intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && showRecommendations && !addedToCart) {
        setShowExitBanner(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [showRecommendations, addedToCart]);

  // Color map for nutrients
  const colorMap: Record<string, string> = {
    Calories: "bg-luxury-gold",
    Protein: "bg-luxury-burnt-orange",
    Carbs: "bg-luxury-dark-green",
    Fiber: "bg-gentle-green",
    Fat: "bg-muted-rose",
    "Vitamin C": "bg-vibrant-orange",
    Potassium: "bg-soft-lavender",
    Magnesium: "bg-deep-burgundy",
    "Vitamin B6": "bg-warm-amber",
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-luxury-off-white to-soft-ivory">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-luxury-dark-green">
            Nutritional Intelligence
          </h2>
          <p className="text-lg text-luxury-charcoal/80 max-w-2xl mx-auto">
            Discover the power of precision nutrition. Search any food to see
            its nutritional profile and get personalized <InlineSunya /> product
            recommendations.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="food-search"
                className="block text-sm font-semibold mb-2 text-luxury-dark-green"
              >
                Search Food
              </label>
              <input
                id="food-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g., banana, kiwi, mango..."
                className="w-full px-4 py-3 border-2 border-luxury-beige rounded-lg focus:border-luxury-gold focus:outline-none transition-colors text-lg"
                aria-label="Search for food"
              />
            </div>
            <div className="w-full md:w-32">
              <label
                htmlFor="grams-input"
                className="block text-sm font-semibold mb-2 text-luxury-dark-green"
              >
                Grams
              </label>
              <input
                id="grams-input"
                type="number"
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
                min="1"
                max="1000"
                className="w-full px-4 py-3 border-2 border-luxury-beige rounded-lg focus:border-luxury-gold focus:outline-none transition-colors text-lg"
                aria-label="Quantity in grams"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-8 py-3 bg-luxury-dark-green text-white font-semibold rounded-lg hover:bg-luxury-dark-green-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Search for nutrition information"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Search Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Banana", "Kiwi", "Mango", "Blueberry", "Pineapple"].map(
              (food) => (
                <button
                  key={food}
                  onClick={() => {
                    setSearchQuery(food);
                    handleSearch();
                  }}
                  className="px-3 py-1 text-sm bg-luxury-beige/50 hover:bg-luxury-gold/20 rounded-full transition-colors"
                >
                  {food}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Nutrition Results */}
        {selectedFood && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-luxury-dark-green mb-2">
                  {selectedFood.name}
                </h3>
                <p className="text-muted-foreground">
                  {selectedFood.description}
                </p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-2 bg-luxury-gold/10 rounded-full">
                <span className="text-sm font-semibold text-luxury-gold">
                  {grams}g serving
                </span>
              </div>
            </div>

            {/* Nutrition Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {(() => {
                const nutrition = calculateNutrition(selectedFood, grams);
                const dv = getDailyValuePercentages(nutrition);
                const deficiencies = identifyDeficiencies(nutrition);

                return (
                  <>
                    {/* Macro Nutrients */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-luxury-dark-green">
                        Macronutrients
                      </h4>
                      {[
                        {
                          label: "Calories",
                          value: nutrition.calories,
                          unit: "kcal",
                          dv: dv.calories,
                        },
                        {
                          label: "Protein",
                          value: nutrition.protein,
                          unit: "g",
                          dv: dv.protein,
                        },
                        {
                          label: "Carbs",
                          value: nutrition.carbs,
                          unit: "g",
                          dv: dv.carbs,
                        },
                        {
                          label: "Fiber",
                          value: nutrition.fiber,
                          unit: "g",
                          dv: dv.fiber,
                        },
                        {
                          label: "Fat",
                          value: nutrition.fat,
                          unit: "g",
                          dv: dv.fat,
                        },
                      ].map((nutrient) => (
                        <div key={nutrient.label}>
                          <div className="flex justify-between mb-2">
                            <label className="font-semibold text-luxury-charcoal">
                              {nutrient.label}
                            </label>
                            <span className="text-luxury-dark-green font-bold">
                              {nutrient.value}
                              {nutrient.unit}
                            </span>
                          </div>
                          <div className="w-full bg-luxury-beige/50 rounded-full h-3 overflow-hidden">
                            <div
                              className={`${colorMap[nutrient.label] || "bg-gray-500"} h-full transition-all duration-700`}
                              style={{
                                width: `${Math.min(nutrient.dv, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {nutrient.dv}% Daily Value
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Micro Nutrients */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-luxury-dark-green">
                        Micronutrients
                      </h4>
                      {[
                        {
                          label: "Vitamin C",
                          value: nutrition.vitaminC,
                          unit: "mg",
                          dv: dv.vitaminC,
                        },
                        {
                          label: "Potassium",
                          value: nutrition.potassium,
                          unit: "mg",
                          dv: dv.potassium,
                        },
                        {
                          label: "Magnesium",
                          value: nutrition.magnesium,
                          unit: "mg",
                          dv: dv.magnesium,
                        },
                        {
                          label: "Vitamin B6",
                          value: nutrition.vitaminB6,
                          unit: "mg",
                          dv: dv.vitaminB6,
                        },
                      ].map((nutrient) => (
                        <div key={nutrient.label}>
                          <div className="flex justify-between mb-2">
                            <label className="font-semibold text-luxury-charcoal">
                              {nutrient.label}
                            </label>
                            <span className="text-luxury-dark-green font-bold">
                              {nutrient.value}
                              {nutrient.unit}
                            </span>
                          </div>
                          <div className="w-full bg-luxury-beige/50 rounded-full h-3 overflow-hidden">
                            <div
                              className={`${colorMap[nutrient.label] || "bg-gray-500"} h-full transition-all duration-700`}
                              style={{
                                width: `${Math.min(nutrient.dv, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {nutrient.dv}% Daily Value
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Deficiencies Alert */}
            {(() => {
              const nutrition = calculateNutrition(selectedFood, grams);
              const deficiencies = identifyDeficiencies(nutrition);

              if (deficiencies.length > 0) {
                return (
                  <div className="bg-luxury-gold/10 border-l-4 border-luxury-gold p-4 rounded-r-lg mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-semibold text-luxury-dark-green">
                          Boost your {deficiencies[0]} today!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          This serving is low in {deficiencies.join(", ")}.
                          Check our recommendations below.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Benefits */}
            <div className="flex flex-wrap gap-2">
              {selectedFood.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1 bg-luxury-dark-green/10 text-luxury-dark-green rounded-full text-sm font-medium"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {showRecommendations && recommendations.length > 0 && (
          <div
            ref={recommendationRef}
            className="sticky top-4 z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-luxury-gold/30"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-luxury-dark-green mb-2">
                  Personalized Recommendations
                </h3>
                <p className="text-muted-foreground">
                  Fuel your body with precision
                </p>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-luxury-gold font-semibold">
                  Perfect for your daily wellness
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => {
                const product = rec.product;
                const isInCart = hasItem(product.id);
                const isAdded = addedToCart === product.id;

                return (
                  <div
                    key={product.id}
                    className={`relative bg-gradient-to-br from-luxury-off-white to-soft-ivory rounded-xl p-6 transition-all duration-300 ${
                      isAdded
                        ? "ring-2 ring-luxury-gold scale-105"
                        : "hover:shadow-xl hover:scale-105"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Match Score Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-luxury-gold text-white text-xs font-bold rounded-full">
                      {rec.matchScore}% Match
                    </div>

                    {/* Product Image */}
                    <div className="relative mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {isAdded && (
                        <div className="absolute inset-0 bg-luxury-gold/20 flex items-center justify-center rounded-lg">
                          <span className="text-2xl">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <h4 className="text-xl font-bold text-luxury-dark-green mb-2">
                      {product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.reason}
                    </p>

                    {/* Comparison */}
                    <div className="bg-white/50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-luxury-charcoal/80">
                        {rec.comparison}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {rec.benefits.slice(0, 3).map((benefit) => (
                        <span
                          key={benefit}
                          className="px-2 py-0.5 bg-luxury-dark-green/10 text-luxury-dark-green rounded text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Suggested: {rec.suggestedQuantity}g
                        </p>
                        <p className="text-lg font-bold text-luxury-gold">
                          NPR {rec.pricePerServing}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product.id, 1)}
                        disabled={isInCart}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          isInCart || isAdded
                            ? "bg-luxury-dark-green text-white cursor-default"
                            : "bg-luxury-gold text-white hover:bg-luxury-gold/90 hover:shadow-lg transform hover:scale-105"
                        }`}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        {isAdded
                          ? "Added!"
                          : isInCart
                            ? "In Cart"
                            : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro-copy Nudge */}
            <div className="mt-6 text-center">
              <p className="text-sm text-luxury-charcoal/80">
                Don't miss your daily boost! 🛒
              </p>
            </div>
          </div>
        )}

        {/* Exit Banner */}
        {showExitBanner && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-luxury-dark-green text-white p-4 rounded-xl shadow-2xl z-50 animate-bounce">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Your wellness pack is waiting!</p>
                <p className="text-sm text-luxury-gold/80">
                  Add to cart before you go
                </p>
              </div>
              <button
                onClick={() => setShowExitBanner(false)}
                className="text-luxury-gold hover:text-white transition-colors"
                aria-label="Close banner"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Cumulative Benefits */}
        {cumulativeBenefits > 0 && (
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
            <h4 className="font-semibold text-luxury-dark-green mb-4">
              Your 7-Day Wellness Journey
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-luxury-beige/50 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-luxury-gold h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(cumulativeBenefits * 14.3, 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-luxury-dark-green">
                {cumulativeBenefits}/7 days
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep going! Daily nutrition builds lasting wellness.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
