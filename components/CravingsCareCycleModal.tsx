"use client";

import { useState } from "react";
import EnhancedCalendarPicker from "./EnhancedCalendarPicker";

interface DeliveryInfo {
  fullName: string;
  address: string;
  phone: string;
  whatsapp?: string;
}

interface CravingsCareCycleModalProps {
  selectedBoxType: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CravingsCareCycleModal({
  selectedBoxType,
  isOpen,
  onClose,
}: CravingsCareCycleModalProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: "",
    address: "",
    phone: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (selectedDates.length === 0)
      newErrors.dates = "Please select at least one date";
    if (!deliveryInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!deliveryInfo.address.trim()) newErrors.address = "Address is required";
    if (!deliveryInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/cravings-care-cycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftBoxChoice: selectedBoxType,
          selectedDays: selectedDates.map(
            (date) => date.toISOString().split("T")[0],
          ), // YYYY-MM-DD
          deliveryInfo,
        }),
      });

      if (response.ok) {
        onClose();
        // Reset form
        setSelectedDates([]);
        setDeliveryInfo({ fullName: "", address: "", phone: "", whatsapp: "" });
        setErrors({});
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-muted-rose">
            Cravings & Care Cycle™ - {selectedBoxType}
          </h2>

          {/* Calendar Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Select Menstruation Days (Up to 3)
            </h3>
            <EnhancedCalendarPicker
              selectedDates={selectedDates}
              onDatesSelect={setSelectedDates}
              maxSelections={3}
            />
            {errors.dates && (
              <p className="text-red-500 text-sm mt-1">{errors.dates}</p>
            )}
          </div>

          {/* Delivery Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={deliveryInfo.fullName}
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-muted-rose focus:border-transparent"
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address/Location
                </label>
                <input
                  type="text"
                  value={deliveryInfo.address}
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-muted-rose focus:border-transparent"
                  placeholder="Enter address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={deliveryInfo.phone}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-muted-rose focus:border-transparent"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={deliveryInfo.whatsapp}
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      whatsapp: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-muted-rose focus:border-transparent"
                  placeholder="Enter WhatsApp number"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-muted-rose to-pink-500 text-white rounded-md hover:from-pink-500 hover:to-muted-rose transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Confirm & Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
