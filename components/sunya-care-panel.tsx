"use client";

import { InlineSunya } from "@/components/sunya-colored-text";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/use-cart";
import { UserProfile } from "@/lib/nutrition-calculator";
import {
  RecommendationSummary,
  generatePersonalizedRecommendations,
} from "@/lib/personalized-recommendation-engine";
import { ArrowRight, Heart, Package, RefreshCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CompactDailyPackage,
  DailyPackageSubscription,
} from "./daily-package-subscription";
import { MacroBars, NutritionRings } from "./nutrition-rings";
import { RecommendedProductsGrid } from "./recommended-product-card";
import { SunyaCareAnalytics } from "./sunya-care-analytics";
import { SunyaCareExportShare } from "./sunya-care-export-share";
import { SunyaCareHealthMetrics } from "./sunya-care-health-metrics";
import { SunyaCareProgressTracker } from "./sunya-care-progress-tracker";
import { SunyaCareRecipes } from "./sunya-care-recipes";
import { SunyaCareShoppingList } from "./sunya-care-shopping-list";
import { SunyaCareUserForm } from "./sunya-care-user-form";
import { CompactUnsafeFoods, UnsafeFoodsWarning } from "./unsafe-foods-warning";

interface SunyaCarePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialProfile?: Partial<UserProfile>;
}

export function SunyaCarePanel({
  isOpen: controlledIsOpen,
  onClose,
  initialProfile,
}: SunyaCarePanelProps) {
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const [showForm, setShowForm] = useState(!initialProfile);
  const [profile, setProfile] = useState<Partial<UserProfile>>(
    initialProfile || {},
  );
  const [recommendations, setRecommendations] =
    useState<RecommendationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsafeFoods, setShowUnsafeFoods] = useState(false);
  const [showFullPackage, setShowFullPackage] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "products"
    | "package"
    | "progress"
    | "recipes"
    | "shopping"
    | "analytics"
    | "health"
  >("overview");
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  // Handle scroll for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const scrollPercentage =
          (scrollTop / (scrollHeight - clientHeight)) * 100;
        setShowStickyCTA(scrollPercentage > 20);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : isInternalOpen;

  useEffect(() => {
    if (initialProfile && Object.keys(initialProfile).length > 0) {
      setProfile(initialProfile);
      setShowForm(false);
      generateRecommendations(initialProfile as UserProfile);
    }
  }, [initialProfile]);

  const generateRecommendations = async (userProfile: UserProfile) => {
    setIsLoading(true);
    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      const result = generatePersonalizedRecommendations(userProfile);
      setRecommendations(result);
      setShowForm(false);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = (userProfile: UserProfile) => {
    setProfile(userProfile);
    generateRecommendations(userProfile);
  };

  const handleRecalculate = () => {
    if (
      profile.age &&
      profile.height &&
      profile.weight &&
      profile.fitnessGoal &&
      profile.activityLevel
    ) {
      generateRecommendations(profile as UserProfile);
    }
  };

  const handleAddToCart = (productId: number, quantity: number) => {
    addItem(productId, quantity);
  };

  const handleSubscribe = () => {
    if (recommendations) {
      // Add all package items to cart
      recommendations.dailyPackage.recommendations.forEach((rec) => {
        addItem(rec.product.id, rec.dailyQuantity);
      });
      // Navigate to checkout
      window.location.href = "/checkout";
    }
  };

  const handleAddPackageToCart = () => {
    if (recommendations) {
      recommendations.dailyPackage.recommendations.forEach((rec) => {
        addItem(rec.product.id, rec.dailyQuantity);
      });
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose || (() => setIsInternalOpen(false))}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-hidden flex flex-col animate-slide-in-right md:w-[80vw] lg:w-[60vw] xl:w-[50vw]">
        {/* Sticky Header */}
        <div className="premium-sticky-header">
          <div className="bg-gradient-to-r from-[#00C950] to-[#00A040] text-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm animate-premium-pulse">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    <InlineSunya /> Care
                  </h2>
                  <p className="text-sm text-white/90">
                    Personalized Nutrition
                  </p>
                </div>
              </div>
              <button
                onClick={onClose || (() => setIsInternalOpen(false))}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            {!showForm && recommendations && (
              <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "products", label: "Products" },
                  { id: "package", label: "Daily Package" },
                  { id: "progress", label: "Progress" },
                  { id: "recipes", label: "Recipes" },
                  { id: "shopping", label: "Shopping" },
                  { id: "analytics", label: "Analytics" },
                  { id: "health", label: "Health" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as
                          | "overview"
                          | "products"
                          | "package"
                          | "progress"
                          | "recipes"
                          | "shopping"
                          | "analytics"
                          | "health",
                      )
                    }
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-white text-[#00C950] shadow-md"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {showForm ? (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tell Us About Yourself
                </h3>
                <p className="text-gray-600">
                  We&apos;ll create personalized nutrition recommendations just
                  for you
                </p>
              </div>
              <SunyaCareUserForm
                onSubmit={handleProfileSubmit}
                initialProfile={profile}
                isLoading={isLoading}
              />
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-16 h-16 border-4 border-[#00C950] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">Analyzing your profile...</p>
            </div>
          ) : recommendations ? (
            <div className="space-y-6 animate-fade-in">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <>
                  {/* User Summary */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Your Profile
                      </h3>
                      <Button
                        onClick={() => setShowForm(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Age</div>
                        <div className="font-semibold text-gray-900">
                          {profile.age} years
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Goal</div>
                        <div className="font-semibold text-gray-900 capitalize">
                          {profile.fitnessGoal?.replace("-", " ")}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Activity</div>
                        <div className="font-semibold text-gray-900 capitalize">
                          {profile.activityLevel}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Conditions</div>
                        <div className="font-semibold text-gray-900">
                          {profile.healthConditions?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Requirements */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Daily Requirements
                    </h3>
                    <NutritionRings
                      requirements={recommendations.dailyRequirements}
                    />
                  </div>

                  {/* Macro Bars */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <MacroBars
                      requirements={recommendations.dailyRequirements}
                    />
                  </div>

                  {/* Safety Advice */}
                  {recommendations.safetyAdvice && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Safety Advice
                      </h4>
                      <p className="text-sm text-blue-800">
                        {recommendations.safetyAdvice}
                      </p>
                    </div>
                  )}

                  {/* Unsafe Foods Compact */}
                  {recommendations.unsafeFoods.length > 0 && (
                    <CompactUnsafeFoods
                      unsafeFoods={recommendations.unsafeFoods}
                      onClick={() => setShowUnsafeFoods(true)}
                    />
                  )}

                  {/* Compact Daily Package */}
                  <div className="md:hidden">
                    <CompactDailyPackage
                      dailyPackage={recommendations.dailyPackage}
                      onClick={() => setShowFullPackage(true)}
                    />
                  </div>
                </>
              )}

              {/* Products Tab */}
              {activeTab === "products" && (
                <>
                  <RecommendedProductsGrid
                    recommendations={recommendations.recommendations}
                    onAddToCart={handleAddToCart}
                  />
                </>
              )}

              {/* Package Tab */}
              {activeTab === "package" && (
                <>
                  <DailyPackageSubscription
                    dailyPackage={recommendations.dailyPackage}
                    onSubscribe={handleSubscribe}
                    onAddToCart={handleAddPackageToCart}
                  />
                </>
              )}

              {/* Progress Tab */}
              {activeTab === "progress" && (
                <SunyaCareProgressTracker
                  requirements={recommendations.dailyRequirements}
                />
              )}

              {/* Recipes Tab */}
              {activeTab === "recipes" && (
                <SunyaCareRecipes
                  recommendations={recommendations.recommendations}
                />
              )}

              {/* Shopping Tab */}
              {activeTab === "shopping" && (
                <SunyaCareShoppingList
                  recommendations={recommendations.recommendations}
                  onAddToCart={handleAddToCart}
                />
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <SunyaCareAnalytics
                  requirements={recommendations.dailyRequirements}
                  recommendations={recommendations.recommendations}
                />
              )}

              {/* Health Tab */}
              {activeTab === "health" && (
                <SunyaCareHealthMetrics
                  requirements={recommendations.dailyRequirements}
                />
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!showForm && recommendations && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                {recommendations.recommendations.length} safe products found
              </div>
              <Button
                onClick={handleRecalculate}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Recalculate
              </Button>
            </div>

            {/* Export/Share */}
            <SunyaCareExportShare summary={recommendations} />
          </div>
        )}

        {/* Sticky Subscription CTA */}
        {!showForm && recommendations && showStickyCTA && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#00C950] to-[#00A040] text-white p-4 shadow-2xl animate-premium-slide-up z-40">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex -space-x-2">
                  {recommendations.dailyPackage.recommendations
                    .slice(0, 4)
                    .map((rec) => (
                      <div
                        key={rec.product.id}
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl border border-white/30 animate-premium-float"
                        style={{ animationDelay: `${rec.product.id * 100}ms` }}
                      >
                        {getFruitEmoji(rec.product.name)}
                      </div>
                    ))}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">
                    Subscribe to Your Daily <InlineSunya /> Care Package
                  </p>
                  <p className="text-sm text-white/90">
                    {recommendations.dailyPackage.recommendations.length}{" "}
                    products • Rs.{" "}
                    {recommendations.dailyPackage.totalPrice.toLocaleString()}
                    /day
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSubscribe}
                className="bg-white text-[#00C950] hover:bg-gray-100 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Subscribe Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Unsafe Foods Modal */}
      {showUnsafeFoods && recommendations && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUnsafeFoods(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in">
            <button
              onClick={() => setShowUnsafeFoods(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <UnsafeFoodsWarning
              unsafeFoods={recommendations.unsafeFoods}
              onDismiss={() => setShowUnsafeFoods(false)}
            />
          </div>
        </div>
      )}

      {/* Full Package Modal */}
      {showFullPackage && recommendations && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFullPackage(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
            <button
              onClick={() => setShowFullPackage(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <DailyPackageSubscription
              dailyPackage={recommendations.dailyPackage}
              onSubscribe={handleSubscribe}
              onAddToCart={handleAddPackageToCart}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface SunyaCareButtonProps {
  onClick: () => void;
  count?: number;
}

export function SunyaCareButton({ onClick, count }: SunyaCareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00C950] to-[#00A040] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <Heart className="w-5 h-5" />
      <span>
        <InlineSunya /> Care
      </span>
      {count !== undefined && count > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-[#00C950] text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
          {count}
        </span>
      )}
    </button>
  );
}
