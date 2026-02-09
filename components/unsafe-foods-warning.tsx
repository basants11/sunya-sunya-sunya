"use client";

import { FoodSafetyResult } from '@/lib/food-safety-engine';
import { AlertTriangle, Info, XCircle } from 'lucide-react';

interface UnsafeFoodsWarningProps {
  unsafeFoods: FoodSafetyResult[];
  onDismiss?: () => void;
}

export function UnsafeFoodsWarning({ unsafeFoods, onDismiss }: UnsafeFoodsWarningProps) {
  if (unsafeFoods.length === 0) {
    return null;
  }

  const getSeverityColor = (level: FoodSafetyResult['safetyLevel']) => {
    switch (level) {
      case 'avoid':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'caution':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getSeverityIcon = (level: FoodSafetyResult['safetyLevel']) => {
    switch (level) {
      case 'avoid':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (level: FoodSafetyResult['safetyLevel']) => {
    switch (level) {
      case 'avoid':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Avoid
          </span>
        );
      case 'caution':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Use with Caution
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Warning Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">
              Foods to Avoid or Use with Caution
            </h3>
            <p className="text-sm text-gray-600">
              Based on your health profile, we've identified {unsafeFoods.length} product(s) that may not be suitable for you.
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <XCircle className="w-5 h-5 text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Unsafe Foods List */}
      <div className="space-y-3">
        {unsafeFoods.map((food) => (
          <div
            key={food.foodId}
            className={`border-2 rounded-xl p-4 transition-all duration-300 ${getSeverityColor(food.safetyLevel)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(food.safetyLevel)}
              </div>
              <div className="flex-1 space-y-2">
                {/* Food Name & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-900">
                    {food.foodName}
                  </h4>
                  {getSeverityBadge(food.safetyLevel)}
                </div>

                {/* Reasons */}
                {food.reasons.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Reasons:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {food.reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Micro Copy */}
                {food.microCopy && (
                  <div className="text-sm italic text-gray-700 bg-white/50 rounded-lg p-2">
                    {food.microCopy}
                  </div>
                )}

                {/* Alternatives */}
                {food.alternatives && food.alternatives.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Safe Alternatives:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {food.alternatives.map((alternative, index) => (
                        <li key={index}>{alternative}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">Safety Notice</h4>
            <p className="text-sm text-blue-800">
              These recommendations are based on general nutritional guidelines and should not replace professional medical advice. 
              Always consult with your healthcare provider before making significant changes to your diet, especially if you have 
              existing health conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CompactUnsafeFoodsProps {
  unsafeFoods: FoodSafetyResult[];
  onClick?: () => void;
}

export function CompactUnsafeFoods({ unsafeFoods, onClick }: CompactUnsafeFoodsProps) {
  if (unsafeFoods.length === 0) {
    return null;
  }

  const avoidCount = unsafeFoods.filter(f => f.safetyLevel === 'avoid').length;
  const cautionCount = unsafeFoods.filter(f => f.safetyLevel === 'caution').length;

  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
              {unsafeFoods.length} Food{unsafeFoods.length > 1 ? 's' : ''} to Avoid
            </p>
            <p className="text-sm text-gray-600">
              {avoidCount > 0 && `${avoidCount} to avoid`}
              {avoidCount > 0 && cautionCount > 0 && ' • '}
              {cautionCount > 0 && `${cautionCount} to use with caution`}
            </p>
          </div>
        </div>
        <div className="text-red-600 group-hover:translate-x-1 transition-transform">
          →
        </div>
      </div>
    </button>
  );
}
