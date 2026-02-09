/**
 * User Profile Form Component
 *
 * Premium, calm design for optional user profile data collection.
 * All fields are optional - users can skip everything.
 * Data is stored locally and used strictly to block unsafe recommendations.
 */

"use client";

import { UserProfileManager } from "@/lib/user-profile";
import type { HealthSensitivity, UserProfile } from "@/types/user-profile";
import { ActivityLevel, DietaryRestriction } from "@/types/user-profile";
import { useEffect, useState } from "react";

/**
 * Activity level options for dropdown
 */
const ACTIVITY_LEVEL_OPTIONS: { value: ActivityLevel; label: string }[] = [
  {
    value: ActivityLevel.SEDENTARY,
    label: "Sedentary (little or no exercise)",
  },
  { value: ActivityLevel.LIGHT, label: "Lightly Active (1-3 days/week)" },
  { value: ActivityLevel.MODERATE, label: "Moderately Active (3-5 days/week)" },
  { value: ActivityLevel.ACTIVE, label: "Very Active (6-7 days/week)" },
  {
    value: ActivityLevel.VERY_ACTIVE,
    label: "Extra Active (very hard exercise)",
  },
];

/**
 * Dietary restriction options for multi-select
 */
const DIETARY_RESTRICTION_OPTIONS: {
  value: DietaryRestriction;
  label: string;
}[] = [
  { value: DietaryRestriction.DIABETES, label: "Diabetes" },
  { value: DietaryRestriction.HYPERTENSION, label: "High Blood Pressure" },
  { value: DietaryRestriction.KIDNEY_DISEASE, label: "Kidney Disease" },
  { value: DietaryRestriction.ACID_REFLUX, label: "Acid Reflux" },
  {
    value: DietaryRestriction.POTASSIUM_SENSITIVE,
    label: "Potassium Sensitive",
  },
  { value: DietaryRestriction.SODIUM_SENSITIVE, label: "Sodium Sensitive" },
  { value: DietaryRestriction.SUGAR_SENSITIVE, label: "Sugar Sensitive" },
  { value: DietaryRestriction.GLUTEN_INTOLERANCE, label: "Gluten Intolerance" },
  {
    value: DietaryRestriction.LACTOSE_INTOLERANCE,
    label: "Lactose Intolerance",
  },
  { value: DietaryRestriction.NUT_ALLERGY, label: "Nut Allergy" },
  { value: DietaryRestriction.FRUIT_ALLERGY, label: "Fruit Allergy" },
  { value: DietaryRestriction.LOW_FIBER, label: "Low Fiber Diet" },
  { value: DietaryRestriction.HIGH_FIBER, label: "High Fiber Diet" },
  { value: DietaryRestriction.LOW_PROTEIN, label: "Low Protein Diet" },
  { value: DietaryRestriction.HIGH_PROTEIN, label: "High Protein Diet" },
];

/**
 * User Profile Form Component
 */
export function UserProfileForm() {
  const [profile, setProfile] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [customSensitivityInput, setCustomSensitivityInput] = useState("");

  // Load existing profile on mount
  useEffect(() => {
    const loadProfile = () => {
      const existingProfile = UserProfileManager.getProfile();
      if (existingProfile) {
        setProfile(existingProfile);
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  /**
   * Handle form field changes
   */
  const handleFieldChange = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K],
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaveMessage(null);
  };

  /**
   * Handle dietary restriction toggle
   */
  const handleDietaryRestrictionToggle = (restriction: DietaryRestriction) => {
    const currentSensitivities = profile.healthSensitivities || [];
    const exists = currentSensitivities.some(
      (s) => s.restriction === restriction,
    );

    let updatedSensitivities: HealthSensitivity[];
    if (exists) {
      updatedSensitivities = currentSensitivities.filter(
        (s) => s.restriction !== restriction,
      );
    } else {
      updatedSensitivities = [...currentSensitivities, { restriction }];
    }

    handleFieldChange("healthSensitivities", updatedSensitivities);
  };

  /**
   * Handle adding custom sensitivity
   */
  const handleAddCustomSensitivity = () => {
    const trimmed = customSensitivityInput.trim();
    if (!trimmed) return;

    const currentCustom = profile.customSensitivities || [];
    if (!currentCustom.includes(trimmed)) {
      handleFieldChange("customSensitivities", [...currentCustom, trimmed]);
    }
    setCustomSensitivityInput("");
  };

  /**
   * Handle removing custom sensitivity
   */
  const handleRemoveCustomSensitivity = (sensitivity: string) => {
    const currentCustom = profile.customSensitivities || [];
    handleFieldChange(
      "customSensitivities",
      currentCustom.filter((s) => s !== sensitivity),
    );
  };

  /**
   * Handle form submission
   */
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const validation = UserProfileManager.validateProfile(profile);

      if (!validation.isValid) {
        setSaveMessage({
          type: "error",
          text: validation.errors?.join(", ") || "Please check your input",
        });
        setIsSaving(false);
        return;
      }

      await UserProfileManager.saveProfile(profile);
      setSaveMessage({
        type: "success",
        text: "Profile saved successfully",
      });
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle clearing profile
   */
  const handleClear = async () => {
    if (
      !confirm(
        "Are you sure you want to clear your profile? This cannot be undone.",
      )
    ) {
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await UserProfileManager.clearProfile();
      setProfile({});
      setSaveMessage({
        type: "success",
        text: "Profile cleared successfully",
      });
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Failed to clear profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-luxury-dark-green">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-luxury-beige rounded-2xl shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-luxury-dark-green mb-2">
          Your Profile
        </h2>
        <p className="text-sm text-luxury-dark-green/70">
          Optional information to help us provide safer recommendations. All
          data is stored locally on your device.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Age */}
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-luxury-dark-green mb-2"
          >
            Age <span className="text-luxury-dark-green/50">(optional)</span>
          </label>
          <input
            id="age"
            type="number"
            min="13"
            max="120"
            value={profile.age || ""}
            onChange={(e) =>
              handleFieldChange(
                "age",
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
            className="w-full px-4 py-3 bg-white border border-luxury-dark-green/20 rounded-lg text-luxury-dark-green placeholder-luxury-dark-green/30 focus:outline-none focus:ring-2 focus:ring-luxury-dark-green/30 focus:border-transparent transition-all duration-200"
            placeholder="Enter your age"
          />
        </div>

        {/* Height */}
        <div>
          <label
            htmlFor="height"
            className="block text-sm font-medium text-luxury-dark-green mb-2"
          >
            Height (cm){" "}
            <span className="text-luxury-dark-green/50">(optional)</span>
          </label>
          <input
            id="height"
            type="number"
            min="50"
            max="250"
            value={profile.height || ""}
            onChange={(e) =>
              handleFieldChange(
                "height",
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
            className="w-full px-4 py-3 bg-white border border-luxury-dark-green/20 rounded-lg text-luxury-dark-green placeholder-luxury-dark-green/30 focus:outline-none focus:ring-2 focus:ring-luxury-dark-green/30 focus:border-transparent transition-all duration-200"
            placeholder="Enter your height in centimeters"
          />
        </div>

        {/* Weight */}
        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-luxury-dark-green mb-2"
          >
            Weight (kg){" "}
            <span className="text-luxury-dark-green/50">(optional)</span>
          </label>
          <input
            id="weight"
            type="number"
            min="20"
            max="300"
            value={profile.weight || ""}
            onChange={(e) =>
              handleFieldChange(
                "weight",
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
            className="w-full px-4 py-3 bg-white border border-luxury-dark-green/20 rounded-lg text-luxury-dark-green placeholder-luxury-dark-green/30 focus:outline-none focus:ring-2 focus:ring-luxury-dark-green/30 focus:border-transparent transition-all duration-200"
            placeholder="Enter your weight in kilograms"
          />
        </div>

        {/* Activity Level */}
        <div>
          <label
            htmlFor="activityLevel"
            className="block text-sm font-medium text-luxury-dark-green mb-2"
          >
            Activity Level{" "}
            <span className="text-luxury-dark-green/50">(optional)</span>
          </label>
          <select
            id="activityLevel"
            value={profile.activityLevel || ""}
            onChange={(e) =>
              handleFieldChange(
                "activityLevel",
                (e.target.value as ActivityLevel) || undefined,
              )
            }
            className="w-full px-4 py-3 bg-white border border-luxury-dark-green/20 rounded-lg text-luxury-dark-green focus:outline-none focus:ring-2 focus:ring-luxury-dark-green/30 focus:border-transparent transition-all duration-200 cursor-pointer"
          >
            <option value="">Select your activity level</option>
            {ACTIVITY_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Health Sensitivities */}
        <div>
          <label className="block text-sm font-medium text-luxury-dark-green mb-3">
            Health Sensitivities{" "}
            <span className="text-luxury-dark-green/50">(optional)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DIETARY_RESTRICTION_OPTIONS.map((option) => {
              const isSelected = profile.healthSensitivities?.some(
                (s) => s.restriction === option.value,
              );
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleDietaryRestrictionToggle(option.value)}
                  className={`px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 text-left ${
                    isSelected
                      ? "bg-luxury-dark-green text-white border-luxury-dark-green"
                      : "bg-white text-luxury-dark-green border-luxury-dark-green/20 hover:border-luxury-dark-green/40"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Sensitivities */}
        <div>
          <label
            htmlFor="customSensitivity"
            className="block text-sm font-medium text-luxury-dark-green mb-2"
          >
            Custom Sensitivities{" "}
            <span className="text-luxury-dark-green/50">(optional)</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              id="customSensitivity"
              type="text"
              value={customSensitivityInput}
              onChange={(e) => setCustomSensitivityInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleAddCustomSensitivity()
              }
              className="flex-1 px-4 py-3 bg-white border border-luxury-dark-green/20 rounded-lg text-luxury-dark-green placeholder-luxury-dark-green/30 focus:outline-none focus:ring-2 focus:ring-luxury-dark-green/30 focus:border-transparent transition-all duration-200"
              placeholder="Add custom sensitivity"
            />
            <button
              type="button"
              onClick={handleAddCustomSensitivity}
              className="px-6 py-3 bg-luxury-dark-green text-white rounded-lg hover:bg-luxury-dark-green-light transition-all duration-200 font-medium"
            >
              Add
            </button>
          </div>
          {profile.customSensitivities &&
            profile.customSensitivities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.customSensitivities.map((sensitivity) => (
                  <span
                    key={sensitivity}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-luxury-dark-green/10 text-luxury-dark-green rounded-full text-sm"
                  >
                    {sensitivity}
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomSensitivity(sensitivity)}
                      className="hover:text-luxury-burnt-orange transition-colors duration-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`p-4 rounded-lg ${
              saveMessage.type === "success"
                ? "bg-gentle-green/20 text-luxury-dark-green"
                : "bg-muted-rose/20 text-luxury-dark-green"
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-luxury-dark-green text-white rounded-lg hover:bg-luxury-dark-green-light transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={isSaving}
            className="px-6 py-3 bg-white text-luxury-dark-green border border-luxury-dark-green/20 rounded-lg hover:bg-luxury-off-white transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="pt-4 border-t border-luxury-dark-green/10">
          <p className="text-xs text-luxury-dark-green/60 text-center">
            Your profile data is stored locally on your device and is never
            shared with any server. This information is used solely to provide
            safer food recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
