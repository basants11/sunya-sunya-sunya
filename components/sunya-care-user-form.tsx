"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HealthCondition, UserProfile, validateProfile } from '@/lib/nutrition-calculator';
import { Info, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface SunyaCareUserFormProps {
  onSubmit: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
  isLoading?: boolean;
}

export function SunyaCareUserForm({ onSubmit, initialProfile, isLoading }: SunyaCareUserFormProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>(initialProfile || {});
  const [errors, setErrors] = useState<string[]>([]);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [customCondition, setCustomCondition] = useState('');
  const [showCustomConditionInput, setShowCustomConditionInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProfile(profile);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSubmit(profile as UserProfile);
  };

  const handleConditionToggle = (condition: HealthCondition | string) => {
    const currentConditions = profile.healthConditions || [];
    
    if (condition === 'none') {
      setProfile({ ...profile, healthConditions: ['none'] });
    } else {
      const newConditions = currentConditions.includes(condition)
        ? currentConditions.filter(c => c !== condition)
        : [...currentConditions.filter(c => c !== 'none'), condition];
      setProfile({ ...profile, healthConditions: newConditions as (HealthCondition | string)[] });
    }
  };

  const handleAddCustomCondition = () => {
    if (customCondition.trim()) {
      handleConditionToggle(customCondition.trim());
      setCustomCondition('');
      setShowCustomConditionInput(false);
    }
  };

  const handleHeightChange = (value: string) => {
    if (heightUnit === 'cm') {
      setProfile({ ...profile, height: parseInt(value) || 0 });
    } else {
      // Convert ft/in to cm (assuming format "5'10" or similar)
      const match = value.match(/(\d+)'(\d+)?/);
      if (match) {
        const feet = parseInt(match[1]);
        const inches = match[2] ? parseInt(match[2]) : 0;
        const cm = Math.round((feet * 12 + inches) * 2.54);
        setProfile({ ...profile, height: cm });
      }
    }
  };

  const handleWeightChange = (value: string) => {
    const weight = parseFloat(value) || 0;
    if (weightUnit === 'kg') {
      setProfile({ ...profile, weight });
    } else {
      // Convert lbs to kg
      setProfile({ ...profile, weight: Math.round(weight * 0.453592) });
    }
  };

  const handleDietaryPreferenceToggle = (preference: string) => {
    const currentPreferences = profile.dietaryPreferences || [];
    const newPreferences = currentPreferences.includes(preference)
      ? currentPreferences.filter(p => p !== preference)
      : [...currentPreferences, preference];
    setProfile({ ...profile, dietaryPreferences: newPreferences });
  };

  const getHeightDisplayValue = () => {
    if (heightUnit === 'cm') {
      return profile.height || '';
    } else {
      // Convert cm to ft/in
      const totalInches = Math.round((profile.height || 0) / 2.54);
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;
      return `${feet}'${inches}"`;
    }
  };

  const getWeightDisplayValue = () => {
    if (weightUnit === 'kg') {
      return profile.weight || '';
    } else {
      // Convert kg to lbs
      return Math.round((profile.weight || 0) * 2.20462);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <Input
              id="age"
              type="number"
              min="10"
              max="100"
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
              placeholder="25"
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender (Optional)
            </label>
            <select
              id="gender"
              value={profile.gender || ''}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' | undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00C950] focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height *
            </label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="text"
                value={getHeightDisplayValue()}
                onChange={(e) => handleHeightChange(e.target.value)}
                placeholder={heightUnit === 'cm' ? '170' : "5'10\""}
                className="flex-1"
                required
              />
              <button
                type="button"
                onClick={() => setHeightUnit(heightUnit === 'cm' ? 'ft' : 'cm')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              >
                {heightUnit === 'cm' ? 'cm' : 'ft/in'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight *
            </label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                value={getWeightDisplayValue()}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder={weightUnit === 'kg' ? '70' : '154'}
                className="flex-1"
                required
              />
              <button
                type="button"
                onClick={() => setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              >
                {weightUnit === 'kg' ? 'kg' : 'lbs'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Goal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Fitness Goal *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'muscle-gain', label: 'Muscle Gain', icon: '💪', desc: 'Build strength and mass' },
            { value: 'weight-loss', label: 'Weight Loss', icon: '🎯', desc: 'Burn fat and slim down' },
            { value: 'endurance', label: 'Endurance', icon: '🏃', desc: 'Improve stamina and energy' },
            { value: 'general-wellness', label: 'General Wellness', icon: '✨', desc: 'Maintain overall health' }
          ].map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => setProfile({ ...profile, fitnessGoal: goal.value as any })}
              className={`p-4 rounded-lg border-2 transition-all ${
                profile.fitnessGoal === goal.value
                  ? 'border-[#00C950] bg-[#00C950]/10 shadow-md'
                  : 'border-gray-200 hover:border-[#00C950]/50 hover:shadow-sm'
              }`}
            >
              <div className="text-2xl mb-2">{goal.icon}</div>
              <div className="font-medium text-gray-900">{goal.label}</div>
              <div className="text-xs text-gray-600 mt-1">{goal.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity Level *</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', icon: '🪑' },
            { value: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days/week', icon: '🚶' },
            { value: 'high', label: 'High', description: 'Exercise 6-7 days/week', icon: '💪' }
          ].map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setProfile({ ...profile, activityLevel: level.value as any })}
              className={`p-4 rounded-lg border-2 transition-all ${
                profile.activityLevel === level.value
                  ? 'border-[#00C950] bg-[#00C950]/10 shadow-md'
                  : 'border-gray-200 hover:border-[#00C950]/50 hover:shadow-sm'
              }`}
            >
              <div className="text-2xl mb-2">{level.icon}</div>
              <div className="font-medium text-gray-900 mb-1">{level.label}</div>
              <div className="text-sm text-gray-600">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Dietary Preferences (Optional)</h3>
        <p className="text-sm text-gray-600">Select any dietary preferences you follow</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: 'vegan', label: 'Vegan', icon: '🌱' },
            { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
            { value: 'keto', label: 'Keto', icon: '🥑' },
            { value: 'low-sugar', label: 'Low Sugar', icon: '🍬' },
            { value: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
            { value: 'paleo', label: 'Paleo', icon: '🥩' }
          ].map((pref) => (
            <button
              key={pref.value}
              type="button"
              onClick={() => handleDietaryPreferenceToggle(pref.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                (profile.dietaryPreferences || []).includes(pref.value)
                  ? 'border-[#00C950] bg-[#00C950]/10'
                  : 'border-gray-200 hover:border-[#00C950]/50'
              }`}
            >
              <div className="text-xl mb-1">{pref.icon}</div>
              <div className="font-medium text-gray-900 text-sm">{pref.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Health Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Health Conditions</h3>
        <p className="text-sm text-gray-600">Select any conditions you have (optional)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: 'none', label: 'None', icon: '✅' },
            { value: 'diabetes', label: 'Diabetes', icon: '🩺' },
            { value: 'hypertension', label: 'Hypertension', icon: '❤️' },
            { value: 'heart', label: 'Heart Condition', icon: '💓' },
            { value: 'kidney', label: 'Kidney Issues', icon: '🫀' },
            { value: 'allergies', label: 'Allergies', icon: '⚠️' }
          ].map((condition) => (
            <button
              key={condition.value}
              type="button"
              onClick={() => handleConditionToggle(condition.value as HealthCondition)}
              className={`p-3 rounded-lg border-2 transition-all ${
                (profile.healthConditions || []).includes(condition.value as HealthCondition)
                  ? 'border-[#00C950] bg-[#00C950]/10'
                  : 'border-gray-200 hover:border-[#00C950]/50'
              }`}
            >
              <div className="text-xl mb-1">{condition.icon}</div>
              <div className="font-medium text-gray-900 text-sm">{condition.label}</div>
            </button>
          ))}
        </div>

        {/* Custom Condition Input */}
        {showCustomConditionInput ? (
          <div className="flex gap-2 mt-3">
            <Input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              placeholder="Enter custom condition..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCondition()}
            />
            <Button
              type="button"
              onClick={handleAddCustomCondition}
              size="sm"
              className="bg-[#00C950] hover:bg-[#00A040]"
            >
              Add
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowCustomConditionInput(false);
                setCustomCondition('');
              }}
              size="sm"
              variant="outline"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCustomConditionInput(true)}
            className="mt-3 flex items-center gap-2 text-sm text-[#00C950] hover:text-[#00A040] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add custom condition
          </button>
        )}

        {/* Display custom conditions */}
        {(profile.healthConditions || []).filter(c => !['none', 'diabetes', 'hypertension', 'heart', 'kidney', 'allergies'].includes(c)).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile.healthConditions || [])
              .filter(c => !['none', 'diabetes', 'hypertension', 'heart', 'kidney', 'allergies'].includes(c))
              .map((condition) => (
                <div
                  key={condition}
                  className="flex items-center gap-1 px-3 py-1 bg-[#00C950]/10 text-[#00C950] rounded-full text-sm"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => handleConditionToggle(condition)}
                    className="hover:text-[#00A040]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Safety Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How we use your data</p>
            <p className="text-blue-700">
              Your information is used to calculate personalized nutrition recommendations and identify safe foods based on your health conditions. We use open datasets and rule-based analysis - no paid AI services.
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#00C950] to-[#00A040] hover:from-[#00A040] hover:to-[#008030] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
      >
        {isLoading ? 'Calculating...' : 'Get Personalized Recommendations'}
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        * This information is for educational purposes only and should not replace professional medical advice.
      </p>
    </form>
  );
}
