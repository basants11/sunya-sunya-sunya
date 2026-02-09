"use client";

import EnhancedCalendarPicker from "@/components/EnhancedCalendarPicker";
import GiftBoxCard from "@/components/GiftBoxCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FormData {
  selectedBox: string | null;
  selectedDates: Date[];
  note: string;
}

const giftBoxes = [
  {
    id: "starter",
    name: "Starter Box",
    title: "Starter Box",
    price: 499,
    description: "Perfect for trying out our dehydrated fruits",
    items: ["Apple Slices", "Mango Pieces", "Banana Chips"],
    themeColor: "vibrant-orange",
    illustration: null,
  },
  {
    id: "premium",
    name: "Premium Box",
    title: "Premium Box",
    price: 999,
    description: "Our most popular choice for fruit lovers",
    items: ["Apple Slices", "Mango Pieces", "Pineapple Rings", "Berry Mix"],
    themeColor: "soft-lavender",
    illustration: null,
  },
  {
    id: "ultimate",
    name: "Ultimate Box",
    title: "Ultimate Box",
    price: 1499,
    description: "The complete experience with premium selection",
    items: [
      "Apple Slices",
      "Mango Pieces",
      "Pineapple Rings",
      "Berry Mix",
      "Tropical Mix",
      "Nut Mix",
    ],
    themeColor: "deep-burgundy",
    illustration: null,
  },
];

export default function CravingsCareCycleWrapper() {
  const [formData, setFormData] = useState<FormData>({
    selectedBox: null,
    selectedDates: [],
    note: "",
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleBoxSelect = (boxId: string) => {
    setFormData((prev) => ({ ...prev, selectedBox: boxId }));
  };

  const handleDateSelect = (dates: Date[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedDates: dates,
    }));
  };

  const handleNoteChange = (note: string) => {
    setFormData((prev) => ({ ...prev, note }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Handle subscription creation
    console.log("Creating subscription:", formData);
    alert(
      "Subscription created successfully! Check your email for confirmation.",
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Craving Care Cycle
          </h1>
          <p className="text-gray-600 mt-2">
            Subscribe to regular deliveries of healthy, delicious dehydrated
            fruits
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {["Choose Your Box", "Select Delivery Dates", "Add Note"].map(
              (step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep > index + 1
                        ? "bg-green-500 text-white"
                        : currentStep === index + 1
                          ? "bg-[#FF6900] text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > index + 1 ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      currentStep >= index + 1
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                  {index < 2 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Choose Your Gift Box
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {giftBoxes.map((box) => (
                <GiftBoxCard
                  key={box.id}
                  {...box}
                  isSelected={formData.selectedBox === box.id}
                  onSelect={() => handleBoxSelect(box.id)}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Select Delivery Dates
            </h2>
            <EnhancedCalendarPicker
              selectedDates={formData.selectedDates}
              onDatesSelect={handleDateSelect}
            />
            <p className="text-sm text-gray-600 mt-4">
              Selected: {formData.selectedDates.length} dates
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Add a Note (Optional)
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <Input
                placeholder="Any special requests or notes for your delivery..."
                value={formData.note}
                onChange={(e) => handleNoteChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Summary */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Box:{" "}
                  {giftBoxes.find((b) => b.id === formData.selectedBox)?.name ||
                    "Not selected"}
                </p>
                <p className="text-gray-600">
                  Deliveries: {formData.selectedDates.length} dates
                </p>
                {formData.note && (
                  <p className="text-gray-600">Note: {formData.note}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button onClick={nextStep} disabled={!formData.selectedBox}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-[#FF6900] hover:bg-[#FF6900]/90"
              disabled={formData.selectedDates.length === 0}
            >
              Complete Subscription
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
