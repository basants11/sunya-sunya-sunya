/**
 * Nutrition Search Demo Client Component
 * 
 * Client component showcasing the complete nutrition search system with
 * clickable fruit pills for quick access to popular dried fruits.
 */

'use client';

import NutritionSearchPanel from '@/components/nutrition-search-panel';
import { motion } from 'framer-motion';
import { useRef } from 'react';

/**
 * Fruit pill data for quick access
 */
const FRUIT_PILLS = [
  { name: 'Dried Kiwi', icon: '🥝', searchQuery: 'kiwi' },
  { name: 'Dried Blueberry', icon: '🫐', searchQuery: 'blueberry' },
  { name: 'Dried Pineapple', icon: '🍍', searchQuery: 'pineapple' },
  { name: 'Dried Papaya', icon: '🍈', searchQuery: 'papaya' },
  { name: 'Dried Apple', icon: '🍎', searchQuery: 'apple' },
  { name: 'Dried Banana', icon: '🍌', searchQuery: 'banana' },
  { name: 'Dried Mango', icon: '🥭', searchQuery: 'mango' },
  { name: 'Dried Strawberry', icon: '🍓', searchQuery: 'strawberry' },
];

/**
 * Nutrition Search Demo Component
 */
export default function NutritionSearchDemoClient() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle fruit pill click - focus search input and set value
   */
  const handleFruitPillClick = (searchQuery: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = searchQuery;
      searchInputRef.current.focus();
      
      // Trigger input event to activate search
      const event = new Event('input', { bubbles: true });
      searchInputRef.current.dispatchEvent(event);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-luxury-off-white to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-luxury-dark-green mb-4">
            Nutrition Intelligence
          </h1>
          <p className="text-lg text-luxury-dark-green/70 max-w-2xl mx-auto">
            Search any fruit worldwide to check nutrition facts and safe daily quantities
          </p>
        </motion.div>

        {/* Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-luxury-gold/10">
            <h2 className="text-xl font-medium text-luxury-dark-green mb-4">
              How to Use
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-luxury-dark-green mb-1">
                    Select a Fruit
                  </h3>
                  <p className="text-sm text-luxury-dark-green/60">
                    Click on any fruit pill below or type in the search bar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-luxury-dark-green mb-1">
                    View Nutrition
                  </h3>
                  <p className="text-sm text-luxury-dark-green/60">
                    See detailed nutritional information and safe daily quantities
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-luxury-dark-green mb-1">
                    Add to Cart
                  </h3>
                  <p className="text-sm text-luxury-dark-green/60">
                    Add matched products to your cart with one click
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fruit Pills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-medium text-luxury-dark-green mb-2">
              Popular Dried Fruits
            </h2>
            <p className="text-sm text-luxury-dark-green/60">
              Click on any fruit to instantly search its nutrition information
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {FRUIT_PILLS.map((fruit, index) => (
              <motion.button
                key={fruit.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                onClick={() => handleFruitPillClick(fruit.searchQuery)}
                className="
                  group
                  flex items-center gap-2
                  px-5 py-3
                  bg-luxury-beige/50
                  hover:bg-luxury-gold/20
                  rounded-full
                  border border-luxury-gold/10
                  hover:border-luxury-gold/30
                  transition-all duration-300
                  shadow-sm
                  hover:shadow-md
                "
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                  {fruit.icon}
                </span>
                <span className="text-sm font-medium text-luxury-dark-green group-hover:text-luxury-dark-green/90">
                  {fruit.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Nutrition Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-luxury-gold/10">
            <NutritionSearchPanel />
          </div>
        </motion.div>

        {/* Footer with Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="bg-luxury-beige/30 rounded-2xl p-6 border border-luxury-gold/10">
            <h3 className="text-lg font-medium text-luxury-dark-green mb-4">
              Helpful Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-luxury-dark-green/70">
                  Search for any fruit name in English - the system will find the closest match
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-luxury-dark-green/70">
                  Set up your profile for personalized safety recommendations and daily quantities
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-luxury-dark-green/70">
                  The system automatically matches your search to available dried fruit products
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-luxury-dark-green/70">
                  Safety warnings appear if a fruit may not be suitable for your dietary profile
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
