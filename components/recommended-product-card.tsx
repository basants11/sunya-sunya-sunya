"use client";

import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart/use-cart';
import { PersonalizedRecommendation } from '@/lib/personalized-recommendation-engine';
import { AlertTriangle, Check, Info, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface RecommendedProductCardProps {
  recommendation: PersonalizedRecommendation;
  onAddToCart?: (productId: number, quantity: number) => void;
  showSafetyInfo?: boolean;
}

export function RecommendedProductCard({ 
  recommendation, 
  onAddToCart,
  showSafetyInfo = true 
}: RecommendedProductCardProps) {
  const { addItem, hasItem } = useCart();
  const [quantity, setQuantity] = useState(recommendation.servings);
  const [isAdded, setIsAdded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAddToCart = () => {
    const totalQuantity = Math.round(quantity * 30); // Convert servings to grams
    addItem(recommendation.product.id, totalQuantity);
    onAddToCart?.(recommendation.product.id, totalQuantity);
    setIsAdded(true);
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const getSafetyBadge = () => {
    switch (recommendation.safetyResult.safetyLevel) {
      case 'safe':
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
            <Check className="w-3 h-3" />
            Safe for your condition
          </div>
        );
      case 'caution':
        return (
          <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            Use with caution
          </div>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = () => {
    const colors = {
      high: 'bg-[#00C950] text-white',
      medium: 'bg-[#FFB800] text-white',
      low: 'bg-gray-400 text-white'
    };
    
    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors[recommendation.priority]}`}>
        {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recommendation.product.image}
          alt={recommendation.product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {getPriorityBadge()}
        </div>
        <div className="absolute top-3 right-3">
          {getSafetyBadge()}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Product Name & Badge */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-lg">
              {recommendation.product.name}
            </h3>
            {recommendation.product.badge && (
              <span className="text-xs bg-[#FF6900]/10 text-[#FF6900] px-2 py-1 rounded-full font-medium whitespace-nowrap">
                {recommendation.product.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {recommendation.product.description}
          </p>
        </div>

        {/* Recommendation Reason */}
        <div className="bg-gradient-to-r from-[#00C950]/5 to-[#00A040]/5 p-3 rounded-lg border border-[#00C950]/10">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[#00C950] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{recommendation.reason}</p>
              <p className="text-xs text-gray-600 mt-1">
                Recommended: {recommendation.dailyQuantity}g daily ({recommendation.servings} servings)
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap gap-2">
          {recommendation.benefits.slice(0, 3).map((benefit, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {benefit}
            </span>
          ))}
        </div>

        {/* Nutrition Contribution */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-500">Calories</div>
            <div className="text-sm font-bold text-gray-900">
              {recommendation.nutritionContribution.calories}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-500">Protein</div>
            <div className="text-sm font-bold text-[#00C950]">
              {recommendation.nutritionContribution.protein}g
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-500">Fiber</div>
            <div className="text-sm font-bold text-[#BB4D00]">
              {recommendation.nutritionContribution.fiber}g
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-500">Vit C</div>
            <div className="text-sm font-bold text-[#FF6B6B]">
              {recommendation.nutritionContribution.vitaminC}mg
            </div>
          </div>
        </div>

        {/* Safety Info */}
        {showSafetyInfo && recommendation.safetyResult.microCopy && (
          <div className="text-xs text-gray-600 italic">
            {recommendation.safetyResult.microCopy}
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <div className="text-lg font-bold text-gray-900">
              Rs. {recommendation.product.nrsPrice.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              Rs. {Math.round((recommendation.product.nrsPrice / 1000) * recommendation.dailyQuantity)} / day
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="px-3 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
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
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-[#00C950] to-[#00A040] hover:from-[#00A040] hover:to-[#008030]'
              } text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecommendedProductsGridProps {
  recommendations: PersonalizedRecommendation[];
  onAddToCart?: (productId: number, quantity: number) => void;
  maxItems?: number;
}

export function RecommendedProductsGrid({ 
  recommendations, 
  onAddToCart,
  maxItems = 6
}: RecommendedProductsGridProps) {
  const displayRecommendations = recommendations.slice(0, maxItems);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Recommended for You
        </h3>
        <span className="text-sm text-gray-600">
          {displayRecommendations.length} products
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRecommendations.map((recommendation, index) => (
          <div
            key={recommendation.product.id}
            className="animate-slide-in"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <RecommendedProductCard
              recommendation={recommendation}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
