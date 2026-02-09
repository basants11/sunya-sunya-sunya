"use client";

import { PersonalizedRecommendation } from '@/lib/personalized-recommendation-engine';
import { Bookmark, BookmarkCheck, ChefHat, Clock, Star } from 'lucide-react';
import { useState } from 'react';

interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  protein: number;
  fiber: number;
  ingredients: { product: string; quantity: string }[];
  instructions: string[];
  tips: string[];
  tags: string[];
}

interface SunyaCareRecipesProps {
  recommendations: PersonalizedRecommendation[];
}

export function SunyaCareRecipes({ recommendations }: SunyaCareRecipesProps) {
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const generateRecipes = (): Recipe[] => {
    const recipes: Recipe[] = [];
    const products = recommendations.map(r => r.product);

    // Recipe 1: Morning Energy Bowl
    if (products.some(p => p.name.toLowerCase().includes('mango') || p.name.toLowerCase().includes('banana'))) {
      recipes.push({
        id: 'morning-energy-bowl',
        name: 'Morning Energy Bowl',
        description: 'A refreshing and energizing breakfast bowl packed with vitamins and fiber',
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        difficulty: 'easy',
        calories: 320,
        protein: 8,
        fiber: 12,
        ingredients: [
          { product: 'Dried Mango', quantity: '50g' },
          { product: 'Dried Banana', quantity: '30g' },
          { product: 'Mixed Nuts', quantity: '40g' },
          { product: 'Greek Yogurt', quantity: '200g' },
          { product: 'Honey', quantity: '1 tbsp' }
        ],
        instructions: [
          'Chop dried mango and banana into bite-sized pieces',
          'Mix all dried fruits and nuts in a bowl',
          'Add Greek yogurt on top',
          'Drizzle with honey',
          'Serve immediately and enjoy!'
        ],
        tips: [
          'Add fresh berries for extra antioxidants',
          'Use almond yogurt for a dairy-free option',
          'Prepare the night before for a quick breakfast'
        ],
        tags: ['breakfast', 'easy', 'high-fiber', 'energy']
      });
    }

    // Recipe 2: Nutrient-Packed Trail Mix
    if (products.some(p => p.name.toLowerCase().includes('almond') || p.name.toLowerCase().includes('cashew'))) {
      recipes.push({
        id: 'nutrient-trail-mix',
        name: 'Nutrient-Packed Trail Mix',
        description: 'A perfect on-the-go snack loaded with healthy fats and protein',
        prepTime: 5,
        cookTime: 0,
        servings: 4,
        difficulty: 'easy',
        calories: 180,
        protein: 6,
        fiber: 4,
        ingredients: [
          { product: 'Almonds', quantity: '100g' },
          { product: 'Cashews', quantity: '80g' },
          { product: 'Dried Cranberries', quantity: '50g' },
          { product: 'Pumpkin Seeds', quantity: '30g' },
          { product: 'Dark Chocolate Chips', quantity: '20g' }
        ],
        instructions: [
          'Combine all nuts and seeds in a large bowl',
          'Add dried cranberries and chocolate chips',
          'Mix thoroughly',
          'Portion into small bags for easy snacking',
          'Store in an airtight container'
        ],
        tips: [
          'Customize with your favorite dried fruits',
          'Add a pinch of sea salt for flavor',
          'Perfect for hiking or office snacks'
        ],
        tags: ['snack', 'easy', 'portable', 'protein']
      });
    }

    // Recipe 3: Tropical Smoothie Bowl
    if (products.some(p => p.name.toLowerCase().includes('pineapple') || p.name.toLowerCase().includes('papaya'))) {
      recipes.push({
        id: 'tropical-smoothie-bowl',
        name: 'Tropical Smoothie Bowl',
        description: 'A refreshing tropical bowl that transports you to paradise',
        prepTime: 15,
        cookTime: 0,
        servings: 1,
        difficulty: 'easy',
        calories: 280,
        protein: 5,
        fiber: 8,
        ingredients: [
          { product: 'Dried Pineapple', quantity: '40g' },
          { product: 'Dried Papaya', quantity: '40g' },
          { product: 'Coconut Milk', quantity: '200ml' },
          { product: 'Chia Seeds', quantity: '1 tbsp' },
          { product: 'Fresh Banana', quantity: '1' }
        ],
        instructions: [
          'Soak dried pineapple and papaya in warm water for 10 minutes',
          'Drain and blend with coconut milk and fresh banana',
          'Add chia seeds and blend briefly',
          'Pour into a bowl',
          'Top with extra dried fruits and nuts'
        ],
        tips: [
          'Use frozen banana for a thicker consistency',
          'Add protein powder for extra nutrition',
          'Garnish with fresh mint leaves'
        ],
        tags: ['breakfast', 'smoothie', 'tropical', 'refreshing']
      });
    }

    // Recipe 4: Berry Antioxidant Mix
    if (products.some(p => p.name.toLowerCase().includes('blueberry') || p.name.toLowerCase().includes('strawberry'))) {
      recipes.push({
        id: 'berry-antioxidant-mix',
        name: 'Berry Antioxidant Mix',
        description: 'A powerful antioxidant boost to support your immune system',
        prepTime: 5,
        cookTime: 0,
        servings: 2,
        difficulty: 'easy',
        calories: 150,
        protein: 3,
        fiber: 6,
        ingredients: [
          { product: 'Dried Blueberries', quantity: '50g' },
          { product: 'Dried Strawberries', quantity: '50g' },
          { product: 'Goji Berries', quantity: '30g' },
          { product: 'Walnuts', quantity: '30g' },
          { product: 'Flax Seeds', quantity: '1 tbsp' }
        ],
        instructions: [
          'Combine all berries in a bowl',
          'Add walnuts and flax seeds',
          'Mix gently to avoid crushing berries',
          'Serve as a snack or add to oatmeal',
          'Store in a cool, dry place'
        ],
        tips: [
          'Great for adding to morning cereal',
          'High in vitamin C and antioxidants',
          'Perfect for post-workout recovery'
        ],
        tags: ['snack', 'antioxidant', 'immune-boost', 'easy']
      });
    }

    // Recipe 5: Kiwi Wellness Salad
    if (products.some(p => p.name.toLowerCase().includes('kiwi'))) {
      recipes.push({
        id: 'kiwi-wellness-salad',
        name: 'Kiwi Wellness Salad',
        description: 'A light and refreshing salad packed with vitamin C',
        prepTime: 15,
        cookTime: 0,
        servings: 2,
        difficulty: 'medium',
        calories: 200,
        protein: 4,
        fiber: 7,
        ingredients: [
          { product: 'Dried Kiwi', quantity: '60g' },
          { product: 'Mixed Greens', quantity: '100g' },
          { product: 'Feta Cheese', quantity: '50g' },
          { product: 'Walnuts', quantity: '30g' },
          { product: 'Olive Oil', quantity: '2 tbsp' },
          { product: 'Lemon Juice', quantity: '1 tbsp' }
        ],
        instructions: [
          'Rehydrate dried kiwi in warm water for 5 minutes',
          'Drain and slice into thin pieces',
          'Arrange mixed greens on a plate',
          'Top with kiwi, feta, and walnuts',
          'Drizzle with olive oil and lemon juice',
          'Season with salt and pepper to taste'
        ],
        tips: [
          'Add avocado for extra creaminess',
          'Use balsamic glaze for a sweeter taste',
          'Perfect as a light lunch or side dish'
        ],
        tags: ['salad', 'lunch', 'vitamin-c', 'refreshing']
      });
    }

    return recipes;
  };

  const recipes = generateRecipes();

  const toggleSaveRecipe = (recipeId: string) => {
    const newSaved = new Set(savedRecipes);
    if (newSaved.has(recipeId)) {
      newSaved.delete(recipeId);
    } else {
      newSaved.add(recipeId);
    }
    setSavedRecipes(newSaved);
    localStorage.setItem('sunya-care-saved-recipes', JSON.stringify([...newSaved]));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPrepTimeColor = (minutes: number) => {
    if (minutes <= 10) return 'text-green-600';
    if (minutes <= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recipe Suggestions</h3>
          <p className="text-sm text-gray-600">Delicious recipes using your recommended products</p>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-[#00C950]" />
          <span className="text-sm font-medium text-gray-700">{recipes.length} recipes</span>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Recipe Header */}
            <div className="bg-gradient-to-r from-[#00C950]/10 to-[#00A040]/10 p-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{recipe.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                </div>
                <button
                  onClick={() => toggleSaveRecipe(recipe.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {savedRecipes.has(recipe.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-[#00C950]" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="p-4 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <Clock className={`w-4 h-4 mx-auto mb-1 ${getPrepTimeColor(recipe.prepTime)}`} />
                  <div className="text-xs font-medium text-gray-900">{recipe.prepTime}m</div>
                  <div className="text-xs text-gray-500">Prep</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg mb-1">👥</div>
                  <div className="text-xs font-medium text-gray-900">{recipe.servings}</div>
                  <div className="text-xs text-gray-500">Servings</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg mb-1">🔥</div>
                  <div className="text-xs font-medium text-gray-900">{recipe.calories}</div>
                  <div className="text-xs text-gray-500">Calories</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg mb-1">💪</div>
                  <div className="text-xs font-medium text-gray-900">{recipe.protein}g</div>
                  <div className="text-xs text-gray-500">Protein</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#00C950]/10 text-[#00C950] px-2 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>

              {/* Ingredients Preview */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Key Ingredients</div>
                <div className="flex flex-wrap gap-1">
                  {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {ing.product}
                    </span>
                  ))}
                  {recipe.ingredients.length > 4 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      +{recipe.ingredients.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* View Recipe Button */}
              <button
                onClick={() => setSelectedRecipe(recipe)}
                className="w-full bg-gradient-to-r from-[#00C950] to-[#00A040] hover:from-[#00A040] hover:to-[#008030] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                View Full Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedRecipe(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-premium-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#00C950] to-[#00A040] text-white p-6">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h3>
              <p className="text-white/90">{selectedRecipe.description}</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Recipe Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-sm font-medium text-gray-900">{selectedRecipe.prepTime} min</div>
                  <div className="text-xs text-gray-500">Prep Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-sm font-medium text-gray-900">{selectedRecipe.servings}</div>
                  <div className="text-xs text-gray-500">Servings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm font-medium text-gray-900">{selectedRecipe.calories}</div>
                  <div className="text-xs text-gray-500">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="text-sm font-medium text-gray-900">{selectedRecipe.protein}g</div>
                  <div className="text-xs text-gray-500">Protein</div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🥗</span>
                  Ingredients
                </h4>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-[#00C950]" />
                      <span className="font-medium">{ing.quantity}</span>
                      <span>{ing.product}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  Instructions
                </h4>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00C950] text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {selectedRecipe.tips.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Pro Tips
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    {selectedRecipe.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nutrition Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Nutrition per Serving</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#00C950]">{selectedRecipe.calories}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#00C950]">{selectedRecipe.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#00C950]">{selectedRecipe.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
