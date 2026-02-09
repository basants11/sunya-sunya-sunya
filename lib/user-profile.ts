/**
 * User Profile Manager
 *
 * Privacy-focused profile management system.
 * All data is stored locally in localStorage and never sent to any server.
 * Used strictly to block unsafe recommendations - never for medical advice.
 */

import type {
  DietaryRestriction,
  ProfileUpdateOptions,
  UserProfile,
  ValidationResult
} from '@/types/user-profile';

/**
 * LocalStorage key for user profile
 */
const STORAGE_KEY = 'sunya-user-profile';

/**
 * Validation constants
 */
const VALIDATION = {
  AGE: {
    MIN: 13,
    MAX: 120
  },
  HEIGHT: {
    MIN: 50, // cm
    MAX: 250 // cm
  },
  WEIGHT: {
    MIN: 20, // kg
    MAX: 300 // kg
  }
} as const;

/**
 * UserProfileManager class
 *
 * Manages user profile data with localStorage persistence.
 * All operations are client-side only for maximum privacy.
 */
export class UserProfileManager {
  /**
   * Save user profile to localStorage
   * @param profile - The profile to save
   * @returns Promise that resolves when profile is saved
   */
  static async saveProfile(profile: UserProfile): Promise<void> {
    try {
      const profileWithTimestamp: UserProfile = {
        ...profile,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileWithTimestamp));
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw new Error('Unable to save profile. Please check your browser settings.');
    }
  }

  /**
   * Get user profile from localStorage
   * @returns The user profile or null if not found
   */
  static getProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }

      return JSON.parse(stored) as UserProfile;
    } catch (error) {
      console.error('Failed to retrieve user profile:', error);
      return null;
    }
  }

  /**
   * Clear user profile from localStorage
   * @returns Promise that resolves when profile is cleared
   */
  static async clearProfile(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear user profile:', error);
      throw new Error('Unable to clear profile. Please check your browser settings.');
    }
  }

  /**
   * Update user profile with partial data
   * @param updates - The fields to update
   * @returns Promise that resolves when profile is updated
   */
  static async updateProfile(updates: ProfileUpdateOptions): Promise<UserProfile> {
    const currentProfile = this.getProfile() || {};

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  /**
   * Validate age value
   * @param age - Age in years
   * @returns Validation result
   */
  static validateAge(age?: number): ValidationResult {
    if (age === undefined || age === null) {
      return { isValid: true }; // Age is optional
    }

    if (typeof age !== 'number' || isNaN(age)) {
      return { isValid: false, errors: ['Age must be a valid number'] };
    }

    if (age < VALIDATION.AGE.MIN || age > VALIDATION.AGE.MAX) {
      return {
        isValid: false,
        errors: [`Age must be between ${VALIDATION.AGE.MIN} and ${VALIDATION.AGE.MAX} years`]
      };
    }

    return { isValid: true };
  }

  /**
   * Validate height value
   * @param height - Height in centimeters
   * @returns Validation result
   */
  static validateHeight(height?: number): ValidationResult {
    if (height === undefined || height === null) {
      return { isValid: true }; // Height is optional
    }

    if (typeof height !== 'number' || isNaN(height)) {
      return { isValid: false, errors: ['Height must be a valid number'] };
    }

    if (height < VALIDATION.HEIGHT.MIN || height > VALIDATION.HEIGHT.MAX) {
      return {
        isValid: false,
        errors: [`Height must be between ${VALIDATION.HEIGHT.MIN} and ${VALIDATION.HEIGHT.MAX} cm`]
      };
    }

    return { isValid: true };
  }

  /**
   * Validate weight value
   * @param weight - Weight in kilograms
   * @returns Validation result
   */
  static validateWeight(weight?: number): ValidationResult {
    if (weight === undefined || weight === null) {
      return { isValid: true }; // Weight is optional
    }

    if (typeof weight !== 'number' || isNaN(weight)) {
      return { isValid: false, errors: ['Weight must be a valid number'] };
    }

    if (weight < VALIDATION.WEIGHT.MIN || weight > VALIDATION.WEIGHT.MAX) {
      return {
        isValid: false,
        errors: [`Weight must be between ${VALIDATION.WEIGHT.MIN} and ${VALIDATION.WEIGHT.MAX} kg`]
      };
    }

    return { isValid: true };
  }

  /**
   * Validate complete profile
   * @param profile - The profile to validate
   * @returns Validation result with all errors
   */
  static validateProfile(profile: UserProfile): ValidationResult {
    const errors: string[] = [];

    const ageValidation = this.validateAge(profile.age);
    if (!ageValidation.isValid && ageValidation.errors) {
      errors.push(...ageValidation.errors);
    }

    const heightValidation = this.validateHeight(profile.height);
    if (!heightValidation.isValid && heightValidation.errors) {
      errors.push(...heightValidation.errors);
    }

    const weightValidation = this.validateWeight(profile.weight);
    if (!weightValidation.isValid && weightValidation.errors) {
      errors.push(...weightValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : []
    };
  }

  /**
   * Check if user has a specific dietary restriction
   * @param restriction - The dietary restriction to check
   * @returns True if user has the restriction
   */
  static hasDietaryRestriction(restriction: DietaryRestriction): boolean {
    const profile = this.getProfile();
    if (!profile?.healthSensitivities) {
      return false;
    }

    return profile.healthSensitivities.some(
      sensitivity => sensitivity.restriction === restriction
    );
  }

  /**
   * Check if user has any custom sensitivity matching a keyword
   * @param keyword - The keyword to search for
   * @returns True if user has a matching custom sensitivity
   */
  static hasCustomSensitivity(keyword: string): boolean {
    const profile = this.getProfile();
    if (!profile?.customSensitivities) {
      return false;
    }

    const lowerKeyword = keyword.toLowerCase();
    return profile.customSensitivities.some(
      sensitivity => sensitivity.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Get all dietary restrictions for the user
   * @returns Array of dietary restrictions
   */
  static getDietaryRestrictions(): DietaryRestriction[] {
    const profile = this.getProfile();
    if (!profile?.healthSensitivities) {
      return [];
    }

    return profile.healthSensitivities.map(s => s.restriction);
  }

  /**
   * Check if profile is complete (has any data)
   * @returns True if profile has any data
   */
  static hasProfile(): boolean {
    const profile = this.getProfile();
    if (!profile) {
      return false;
    }

    return !!(
      profile.age ||
      profile.height ||
      profile.weight ||
      profile.activityLevel ||
      (profile.healthSensitivities && profile.healthSensitivities.length > 0) ||
      (profile.customSensitivities && profile.customSensitivities.length > 0)
    );
  }

  /**
   * Export profile data (for backup purposes)
   * @returns JSON string of profile data
   */
  static exportProfile(): string | null {
    const profile = this.getProfile();
    if (!profile) {
      return null;
    }

    return JSON.stringify(profile, null, 2);
  }

  /**
   * Import profile data (from backup)
   * @param jsonData - JSON string of profile data
   * @returns Promise that resolves when profile is imported
   */
  static async importProfile(jsonData: string): Promise<void> {
    try {
      const profile = JSON.parse(jsonData) as UserProfile;
      const validation = this.validateProfile(profile);

      if (!validation.isValid) {
        throw new Error(`Invalid profile data: ${validation.errors?.join(', ')}`);
      }

      await this.saveProfile(profile);
    } catch (error) {
      console.error('Failed to import user profile:', error);
      throw new Error('Unable to import profile. Please check the data format.');
    }
  }
}
