'use client';


export interface NutritionData {
  name: string;
  icon?: string;
  caloriesPer100g: number;
  naturalSugarLevel: 'low' | 'moderate' | 'high';
  fiber: number;
  potassium?: number;
  magnesium?: number;
  vitaminC?: number;
  suggestedDailyQuantity: number;
  isUnsafe?: boolean;
  warningReason?: string;
}

interface NutritionResultCardProps {
  data: NutritionData;
  onAddToCart?: () => void;
  isAddingToCart?: boolean;
}

export default function NutritionResultCard({
  data,
  onAddToCart,
  isAddingToCart = false,
}: NutritionResultCardProps) {
  const getSugarLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-gentle-green';
      case 'moderate':
        return 'bg-luxury-gold';
      case 'high':
        return 'bg-luxury-burnt-orange';
      default:
        return 'bg-gentle-green';
    }
  };

  const getSugarLevelWidth = (level: string) => {
    switch (level) {
      case 'low':
        return '33%';
      case 'moderate':
        return '66%';
      case 'high':
        return '100%';
      default:
        return '33%';
    }
  };

  const getNutrientProgressWidth = (value: number, max: number) => {
    return `${Math.min((value / max) * 100, 100)}%`;
  };

  return (
    <div
      className="
        w-full
        bg-luxury-beige/50
        backdrop-blur-sm
        rounded-2xl
        shadow-xl
        p-6
        transition-all duration-300
        hover:shadow-2xl
        animate-fade-in-up
      "
    >
      {/* Header: Fruit Name and Icon */}
      <div className="flex items-center gap-4 mb-6">
        {data.icon && (
          <div
            className="
              w-16 h-16
              rounded-full
              bg-luxury-gold/20
              flex items-center justify-center
              flex-shrink-0
            "
          >
            <span className="text-3xl">{data.icon}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-luxury-dark-green mb-1">
            {data.name}
          </h3>
          <p className="text-sm text-luxury-dark-green/60">
            {data.caloriesPer100g} calories per 100g
          </p>
        </div>
      </div>

      {/* Natural Sugar Level */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-luxury-dark-green/80">
            Natural Sugar Level
          </span>
          <span
            className={`
              px-3 py-1
              rounded-full
              text-xs font-medium
              capitalize
              ${data.naturalSugarLevel === 'high' ? 'text-luxury-dark-green' : 'text-luxury-dark-green/80'}
            `}
          >
            {data.naturalSugarLevel}
          </span>
        </div>
        <div className="w-full h-2 bg-luxury-beige rounded-full overflow-hidden">
          <div
            className={`
              h-full
              ${getSugarLevelColor(data.naturalSugarLevel)}
              rounded-full
              transition-all duration-500
              ease-out
            `}
            style={{ width: getSugarLevelWidth(data.naturalSugarLevel) }}
          />
        </div>
      </div>

      {/* Key Nutrients */}
      <div className="space-y-4 mb-6">
        {/* Fiber */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-luxury-dark-green/70">Fiber</span>
            <span className="text-sm font-medium text-luxury-dark-green">
              {data.fiber}g
            </span>
          </div>
          <div className="w-full h-1.5 bg-luxury-beige rounded-full overflow-hidden">
            <div
              className="
                h-full
                bg-gentle-green
                rounded-full
                transition-all duration-500
                ease-out
              "
              style={{ width: getNutrientProgressWidth(data.fiber, 10) }}
            />
          </div>
        </div>

        {/* Potassium */}
        {data.potassium !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-luxury-dark-green/70">Potassium</span>
              <span className="text-sm font-medium text-luxury-dark-green">
                {data.potassium}mg
              </span>
            </div>
            <div className="w-full h-1.5 bg-luxury-beige rounded-full overflow-hidden">
              <div
                className="
                  h-full
                  bg-luxury-gold
                  rounded-full
                  transition-all duration-500
                  ease-out
                "
                style={{ width: getNutrientProgressWidth(data.potassium, 400) }}
              />
            </div>
          </div>
        )}

        {/* Magnesium */}
        {data.magnesium !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-luxury-dark-green/70">Magnesium</span>
              <span className="text-sm font-medium text-luxury-dark-green">
                {data.magnesium}mg
              </span>
            </div>
            <div className="w-full h-1.5 bg-luxury-beige rounded-full overflow-hidden">
              <div
                className="
                  h-full
                  bg-luxury-gold
                  rounded-full
                  transition-all duration-500
                  ease-out
                "
                style={{ width: getNutrientProgressWidth(data.magnesium, 100) }}
              />
            </div>
          </div>
        )}

        {/* Vitamin C */}
        {data.vitaminC !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-luxury-dark-green/70">Vitamin C</span>
              <span className="text-sm font-medium text-luxury-dark-green">
                {data.vitaminC}mg
              </span>
            </div>
            <div className="w-full h-1.5 bg-luxury-beige rounded-full overflow-hidden">
              <div
                className="
                  h-full
                  bg-gentle-green
                  rounded-full
                  transition-all duration-500
                  ease-out
                "
                style={{ width: getNutrientProgressWidth(data.vitaminC, 100) }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Daily Quantity */}
      <div
        className="
          mb-6
          px-4 py-3
          bg-luxury-gold/10
          border border-luxury-gold/20
          rounded-xl
        "
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-luxury-gold flex-shrink-0"
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
          <div>
            <p className="text-sm text-luxury-dark-green/70">
              Suggested Daily Quantity
            </p>
            <p className="text-lg font-semibold text-luxury-dark-green">
              {data.suggestedDailyQuantity}g
            </p>
          </div>
        </div>
      </div>

      {/* Warning Message (if unsafe) */}
      {data.isUnsafe && data.warningReason && (
        <div
          className="
            mb-6
            px-4 py-3
            bg-luxury-burnt-orange/10
            border border-luxury-burnt-orange/20
            rounded-xl
          "
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-luxury-burnt-orange/70 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-luxury-burnt-orange/90 mb-1">
                Please Note
              </p>
              <p className="text-sm text-luxury-burnt-orange/70">
                {data.warningReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      {onAddToCart && (
        <button
          onClick={onAddToCart}
          disabled={data.isUnsafe || isAddingToCart}
          className={`
            w-full
            px-6 py-3
            rounded-full
            font-medium
            transition-all duration-300
            flex items-center justify-center gap-2
            ${
              data.isUnsafe
                ? 'bg-luxury-beige/50 text-luxury-dark-green/40 cursor-not-allowed'
                : 'bg-luxury-dark-green text-white hover:bg-luxury-dark-green-light hover:shadow-lg'
            }
            ${isAddingToCart ? 'opacity-70 cursor-wait' : ''}
          `}
        >
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Adding…</span>
            </>
          ) : data.isUnsafe ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <span>Not Available</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
