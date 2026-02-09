"use client";

import {
  GramOption,
  Product,
  calculatePriceByGrams,
  formatGramDisplay,
} from "@/lib/products";
import { useState } from "react";

interface GramSelectorProps {
  product: Product;
  onGramSelect: (grams: GramOption, price: number) => void;
  selectedGrams?: GramOption;
}

export function GramSelector({
  product,
  onGramSelect,
  selectedGrams,
}: GramSelectorProps) {
  const [localSelectedGrams, setLocalSelectedGrams] = useState<GramOption>(
    selectedGrams || 500,
  );

  const handleGramChange = (grams: GramOption) => {
    setLocalSelectedGrams(grams);
    const price = calculatePriceByGrams(product, grams);
    onGramSelect(grams, price);
  };

  const gramOptions: GramOption[] = [100, 200, 300, 400, 500, 1000];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-black">
        Select Quantity
      </label>
      <div className="grid grid-cols-3 gap-2">
        {gramOptions.map((grams) => {
          const price = calculatePriceByGrams(product, grams);
          const isSelected = localSelectedGrams === grams;

          return (
            <button
              key={grams}
              onClick={() => handleGramChange(grams)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
              }`}
            >
              <div className="text-lg font-bold">
                {formatGramDisplay(grams)}
              </div>
              <div className="text-sm">NPR {price}</div>
            </button>
          );
        })}
      </div>
      {product.gramPricing && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Price per gram:</span> NPR{" "}
            {calculatePriceByGrams(product, localSelectedGrams) /
              localSelectedGrams}
          </div>
        </div>
      )}
    </div>
  );
}

// Example usage component
export function GramPricingExample() {
  const [selectedGrams, setSelectedGrams] = useState<GramOption>(500);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  const handleGramSelect = (grams: GramOption, price: number) => {
    setSelectedGrams(grams);
    setCalculatedPrice(price);
  };

  // Example product
  const exampleProduct: Product = {
    id: 1,
    name: "Dried Kiwi",
    nrsPrice: 2499,
    description:
      "Hand-selected kiwis slices. Tart, vibrant, and naturally indulgent.",
    features: [
      "Small-batch production",
      "Export-grade quality",
      "Rich in Vitamin C",
    ],
    image: "/dried-kiwi-slices-premium.jpg",
    badge: "Limited Seasonal",
    pricePerGram: 5,
    gramPricing: [
      { grams: 100, price: 599, pricePerGram: 5.99 },
      { grams: 200, price: 1099, pricePerGram: 5.5 },
      { grams: 300, price: 1599, pricePerGram: 5.33 },
      { grams: 400, price: 2099, pricePerGram: 5.25 },
      { grams: 500, price: 2499, pricePerGram: 5.0 },
      { grams: 1000, price: 4499, pricePerGram: 4.5 },
    ],
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gram-Based Pricing Example</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2">{exampleProduct.name}</h3>
        <p className="text-gray-600 mb-4">{exampleProduct.description}</p>

        <GramSelector
          product={exampleProduct}
          onGramSelect={handleGramSelect}
          selectedGrams={selectedGrams}
        />

        <div className="mt-6 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-lg font-bold text-orange-700">
            Selected: {formatGramDisplay(selectedGrams)}
          </div>
          <div className="text-2xl font-bold text-orange-800">
            Total Price: NPR {calculatedPrice}
          </div>
        </div>
      </div>
    </div>
  );
}
