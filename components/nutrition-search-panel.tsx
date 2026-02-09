/**
 * Nutrition Search Panel - Main Integration Component
 *
 * Complete nutrition search panel that integrates all components for a premium,
 * calm user experience. Features fruit search, nutrition analysis, safety validation,
 * product matching, and cart integration with smooth animations.
 *
 * Design Philosophy:
 * - Premium, calm visual tone
 * - Soft shadows, smooth animations
 * - No aggressive colors or sales copy
 * - Never force recommendations
 * - If unsure, show no suggestion
 */

'use client';

import { useNutritionCart } from '@/hooks/use-nutrition-cart';
import { FruitMatcher } from '@/lib/fruit-matcher';
import { NutritionAPI } from '@/lib/nutrition-api';
import { NutritionIntelligenceEngine } from '@/lib/nutrition-intelligence';
import { products } from '@/lib/products';
import { SafetyValidator } from '@/lib/safety-validator';
import { UserProfileManager } from '@/lib/user-profile';
import type { FruitMatchResult } from '@/types/fruit-matcher';
import type { NormalizedNutritionData } from '@/types/nutrition';
import type { UserProfile } from '@/types/user-profile';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatedCartIcon } from './animated-cart-icon';
import NutritionResultCard, { NutritionData } from './nutrition-result-card';
import NutritionSearchBar from './nutrition-search-bar';
import SafetyWarningBanner, { SafetyWarningData } from './safety-warning-banner';
import { UserProfileForm } from './user-profile-form';

/**
 * Main Nutrition Search Panel Component
 */
export default function NutritionSearchPanel() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<NormalizedNutritionData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matchedProduct, setMatchedProduct] = useState<FruitMatchResult | null>(null);
  const [safetyWarnings, setSafetyWarnings] = useState<SafetyWarningData | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Hooks
  const { addToCart, animateCartIcon, isItemInCart } = useNutritionCart();
  const fruitImageRef = useRef<HTMLDivElement>(null);

  // Initialize fruit matcher with products
  const fruitMatcher = useRef<FruitMatcher | null>(null);

  useEffect(() => {
    fruitMatcher.current = new FruitMatcher(products);
  }, []);

  // Load user profile on mount
  useEffect(() => {
    const profile = UserProfileManager.getProfile();
    setUserProfile(profile);
  }, []);

  /**
   * Handle search query
   */
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setError(null);
    setSafetyWarnings(null);

    // Clear results if query is empty
    if (!query.trim()) {
      setNutritionData(null);
      setMatchedProduct(null);
      return;
    }

    // Debounce search to avoid excessive API calls
    const debounceTimer = setTimeout(async () => {
      if (query.trim().length < 2) return;

      setIsLoading(true);
      try {
        // Step 1: Fetch nutrition data from API
        const api = new NutritionAPI();
        const result = await api.fetchNutrition(query);

        if (result.results.length === 0) {
          setError('No nutrition data found for this fruit');
          setNutritionData(null);
          setMatchedProduct(null);
          return;
        }

        const data = result.results[0];
        setNutritionData(data);

        // Step 2: Match to available products
        if (fruitMatcher.current) {
          const match = fruitMatcher.current.matchFruitToProduct(query, products);
          setMatchedProduct(match);

          // Step 3: Safety validation
          if (match.product) {
            const safetyResult = SafetyValidator.getSafetyReport(
              data,
              userProfile
            );

            if (safetyResult.warnings.length > 0 || safetyResult.shouldBlock) {
              setSafetyWarnings({
                title: safetyResult.shouldBlock ? 'Safety Notice' : 'Dietary Consideration',
                message: safetyResult.shouldBlock
                  ? `This item may not be suitable for your profile: ${safetyResult.blockReason || ''}`
                  : 'Please review the following information before adding to cart.',
                conditions: safetyResult.warnings,
                severity: safetyResult.shouldBlock ? 'high' : 'moderate',
                showConsultationNote: true
              });
            } else {
              setSafetyWarnings(null);
            }
          }
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Unable to fetch nutrition data. Please try again.');
        setNutritionData(null);
        setMatchedProduct(null);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [userProfile]);

  /**
   * Handle add to cart
   */
  const handleAddToCart = useCallback(async () => {
    if (!matchedProduct?.product || !nutritionData) return;

    setIsAddingToCart(true);

    try {
      // Animate fruit to cart
      if (fruitImageRef.current) {
        await addToCart(
          matchedProduct.product.id,
          nutritionData.calories,
          matchedProduct.product.name
        );
      }

      // Animate cart icon
      await animateCartIcon();
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setIsAddingToCart(false);
    }
  }, [matchedProduct, nutritionData, addToCart, animateCartIcon]);

  /**
   * Convert nutrition data to card format
   */
  const convertToCardData = useCallback(
    (data: NormalizedNutritionData): NutritionData => {
      // Calculate natural sugar level
      let naturalSugarLevel: 'low' | 'moderate' | 'high' = 'moderate';
      if (data.sugar <= 5) naturalSugarLevel = 'low';
      else if (data.sugar >= 15) naturalSugarLevel = 'high';

      // Calculate suggested daily quantity using intelligence engine
      const safeRange = NutritionIntelligenceEngine.calculateSafeRange(
        data,
        userProfile
      );

      // Get fruit icon based on name
      const getFruitIcon = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('kiwi')) return '🥝';
        if (lowerName.includes('apple')) return '🍎';
        if (lowerName.includes('banana')) return '🍌';
        if (lowerName.includes('mango')) return '🥭';
        if (lowerName.includes('strawberry')) return '🍓';
        if (lowerName.includes('blueberry')) return '🫐';
        if (lowerName.includes('pineapple')) return '🍍';
        if (lowerName.includes('papaya')) return '🍈';
        if (lowerName.includes('orange')) return '🍊';
        if (lowerName.includes('grape')) return '🍇';
        if (lowerName.includes('peach')) return '🍑';
        if (lowerName.includes('cherry')) return '🍒';
        if (lowerName.includes('lemon')) return '🍋';
        if (lowerName.includes('watermelon')) return '🍉';
        return '🍎'; // Default
      };

      return {
        name: data.name,
        icon: getFruitIcon(data.name),
        caloriesPer100g: data.calories,
        naturalSugarLevel,
        fiber: data.fiber || 0,
        potassium: data.potassium,
        magnesium: data.magnesium,
        vitaminC: data.vitaminC,
        suggestedDailyQuantity: safeRange.recommendedGrams,
        isUnsafe: safetyWarnings?.severity === 'high',
        warningReason: safetyWarnings?.message
      };
    },
    [userProfile, safetyWarnings]
  );

  /**
   * Check if item can be added to cart
   */
  const canAddToCart = useCallback(() => {
    if (!matchedProduct?.product) return false;
    if (safetyWarnings?.severity === 'high') return false;
    if (isAddingToCart) return false;
    return true;
  }, [matchedProduct, safetyWarnings, isAddingToCart]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-luxury-dark-green mb-2">
          Nutrition Explorer
        </h1>
        <p className="text-sm text-luxury-dark-green/70">
          Discover nutritional information for your favorite fruits
        </p>
      </div>

      {/* Cart Icon */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatedCartIcon />
      </div>

      {/* Profile Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="
            px-4 py-2
            text-sm
            text-luxury-dark-green/70
            hover:text-luxury-dark-green
            transition-colors duration-200
          "
        >
          {showProfile ? 'Hide Profile' : 'Show Profile'}
        </button>
      </div>

      {/* User Profile Form (Collapsible) */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <UserProfileForm />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="mb-8">
        <NutritionSearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          error={error}
          placeholder="Search any fruit to check nutrition & daily quantity…"
        />
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-luxury-dark-green/70">
                Searching nutrition database…
              </p>
            </div>
          </motion.div>
        )}

        {!isLoading && nutritionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Safety Warning Banner */}
            {safetyWarnings && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SafetyWarningBanner
                  data={safetyWarnings}
                  onDismiss={() => setSafetyWarnings(null)}
                />
              </motion.div>
            )}

            {/* Nutrition Result Card */}
            <div ref={fruitImageRef}>
              <NutritionResultCard
                data={convertToCardData(nutritionData)}
                onAddToCart={canAddToCart() ? handleAddToCart : undefined}
                isAddingToCart={isAddingToCart}
              />
            </div>

            {/* Matched Product Information */}
            {matchedProduct?.product && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="
                  px-6 py-4
                  bg-luxury-gold/10
                  border border-luxury-gold/20
                  rounded-xl
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-luxury-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-luxury-dark-green/70">
                      Available as{' '}
                      <span className="font-medium text-luxury-dark-green">
                        {matchedProduct.product.name}
                      </span>
                    </p>
                    <p className="text-xs text-luxury-dark-green/60 mt-1">
                      {matchedProduct.reason}
                    </p>
                  </div>
                  {matchedProduct.availabilityStatus === 'LIMITED' && (
                    <span className="px-3 py-1 text-xs font-medium text-luxury-dark-green bg-luxury-gold/20 rounded-full">
                      Limited
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Alternative Suggestions (if no exact match) */}
            {matchedProduct?.matchType === 'NONE' && fruitMatcher.current && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="
                  px-6 py-4
                  bg-luxury-beige/50
                  border border-luxury-dark-green/10
                  rounded-xl
                "
              >
                <p className="text-sm text-luxury-dark-green/70 mb-3">
                  No exact match found. Here are nutritionally similar alternatives:
                </p>
                <div className="space-y-2">
                  {fruitMatcher.current
                    .findSimilarFruits(searchQuery, products)
                    .slice(0, 3)
                    .map((result, index) => (
                      <div
                        key={index}
                        className="
                          flex items-center justify-between
                          px-4 py-3
                          bg-white
                          rounded-lg
                          hover:bg-luxury-off-white
                          transition-colors duration-200
                        "
                      >
                        <div>
                          <p className="text-sm font-medium text-luxury-dark-green">
                            {result.product?.name}
                          </p>
                          <p className="text-xs text-luxury-dark-green/60">
                            {result.reason}
                          </p>
                        </div>
                        <span className="text-xs text-luxury-gold font-medium">
                          {result.similarityScore}% match
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {!isLoading && !nutritionData && !error && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-sm text-luxury-dark-green/60">
              Enter a fruit name to explore its nutritional information
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && !nutritionData && !error && searchQuery.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🍎</div>
          <h3 className="text-xl font-medium text-luxury-dark-green mb-2">
            Start Exploring
          </h3>
          <p className="text-sm text-luxury-dark-green/70 max-w-md mx-auto">
            Search for any fruit to discover its nutritional information,
            safe daily quantities, and personalized recommendations based on your profile.
          </p>
        </motion.div>
      )}
    </div>
  );
}
