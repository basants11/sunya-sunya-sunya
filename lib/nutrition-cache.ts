/**
 * Nutrition Cache System
 *
 * This module provides a caching system for nutrition data with:
 * - In-memory cache with TTL (24 hours default)
 * - localStorage persistence for offline access
 * - Cache key generation based on search term
 * - Cache invalidation strategy
 */

import type {
  NormalizedNutritionData,
  NutritionCacheEntry,
  NutritionSearchResult
} from '@/types/nutrition';

/**
 * Default cache TTL: 24 hours in milliseconds
 */
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Cache storage key prefix for localStorage
 */
const CACHE_STORAGE_PREFIX = 'nutrition_cache_';

/**
 * In-memory cache storage
 */
interface InMemoryCache {
  [key: string]: NutritionCacheEntry;
}

/**
 * NutritionCache class for managing nutrition data caching
 */
export class NutritionCache {
  private inMemoryCache: InMemoryCache = {};
  private defaultTTL: number;
  private useLocalStorage: boolean;

  /**
   * Creates a new NutritionCache instance
   * @param defaultTTL - Default time-to-live in milliseconds (default: 24 hours)
   * @param useLocalStorage - Whether to use localStorage for persistence (default: true)
   */
  constructor(defaultTTL: number = DEFAULT_CACHE_TTL, useLocalStorage: boolean = true) {
    this.defaultTTL = defaultTTL;
    this.useLocalStorage = useLocalStorage && typeof window !== 'undefined' && 'localStorage' in window;

    // Load cache from localStorage on initialization
    if (this.useLocalStorage) {
      this.loadFromLocalStorage();
    }
  }

  /**
   * Generates a cache key from a search term
   * @param searchTerm - The search term to generate a key from
   * @returns A normalized cache key
   */
  private generateCacheKey(searchTerm: string): string {
    // Normalize the search term: lowercase, trim, remove extra spaces
    const normalized = searchTerm.toLowerCase().trim().replace(/\s+/g, '-');
    return `search_${normalized}`;
  }

  /**
   * Checks if a cache entry has expired
   * @param entry - The cache entry to check
   * @returns True if the entry has expired, false otherwise
   */
  private isExpired(entry: NutritionCacheEntry): boolean {
    const now = Date.now();
    return now > entry.cachedAt + entry.ttl;
  }

  /**
   * Loads cache entries from localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_STORAGE_PREFIX)) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const entry: NutritionCacheEntry = JSON.parse(value);
              // Only load non-expired entries
              if (!this.isExpired(entry)) {
                const cacheKey = key.replace(CACHE_STORAGE_PREFIX, '');
                this.inMemoryCache[cacheKey] = entry;
              } else {
                // Remove expired entry from localStorage
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            console.warn(`Failed to parse cache entry for key ${key}:`, error);
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Saves a cache entry to localStorage
   * @param key - The cache key
   * @param entry - The cache entry to save
   */
  private saveToLocalStorage(key: string, entry: NutritionCacheEntry): void {
    if (!this.useLocalStorage) return;

    try {
      const storageKey = `${CACHE_STORAGE_PREFIX}${key}`;
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to save cache entry to localStorage:', error);
    }
  }

  /**
   * Removes a cache entry from localStorage
   * @param key - The cache key to remove
   */
  private removeFromLocalStorage(key: string): void {
    if (!this.useLocalStorage) return;

    try {
      const storageKey = `${CACHE_STORAGE_PREFIX}${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to remove cache entry from localStorage:', error);
    }
  }

  /**
   * Retrieves cached nutrition data for a search term
   * @param searchTerm - The search term to look up
   * @returns The cached search result or null if not found or expired
   */
  get(searchTerm: string): NutritionSearchResult | null {
    const key = this.generateCacheKey(searchTerm);
    const entry = this.inMemoryCache[key];

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.delete(searchTerm);
      return null;
    }

    return {
      results: [entry.data],
      total: 1,
      source: entry.data.source,
      fromCache: true
    };
  }

  /**
   * Stores nutrition data in the cache
   * @param searchTerm - The search term to cache data for
   * @param data - The normalized nutrition data to cache
   * @param ttl - Optional custom TTL in milliseconds (uses default if not provided)
   */
  set(searchTerm: string, data: NormalizedNutritionData, ttl?: number): void {
    const key = this.generateCacheKey(searchTerm);
    const cacheTTL = ttl || this.defaultTTL;
    const entry: NutritionCacheEntry = {
      data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + cacheTTL,
      ttl: cacheTTL
    };

    this.inMemoryCache[key] = entry;
    this.saveToLocalStorage(key, entry);
  }

  /**
   * Deletes a cache entry
   * @param searchTerm - The search term to delete from cache
   */
  delete(searchTerm: string): void {
    const key = this.generateCacheKey(searchTerm);
    delete this.inMemoryCache[key];
    this.removeFromLocalStorage(key);
  }

  /**
   * Clears all cache entries
   */
  clear(): void {
    // Clear in-memory cache
    this.inMemoryCache = {};

    // Clear localStorage entries
    if (this.useLocalStorage) {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Failed to clear cache from localStorage:', error);
      }
    }
  }

  /**
   * Removes all expired cache entries
   * @returns The number of entries removed
   */
  invalidateExpired(): number {
    let removedCount = 0;
    const keys = Object.keys(this.inMemoryCache);

    keys.forEach(key => {
      const entry = this.inMemoryCache[key];
      if (entry && this.isExpired(entry)) {
        delete this.inMemoryCache[key];
        this.removeFromLocalStorage(key);
        removedCount++;
      }
    });

    return removedCount;
  }

  /**
   * Gets the size of the cache (number of entries)
   * @returns The number of cache entries
   */
  size(): number {
    return Object.keys(this.inMemoryCache).length;
  }

  /**
   * Gets all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Object.keys(this.inMemoryCache);
  }

  /**
   * Checks if a search term is cached
   * @param searchTerm - The search term to check
   * @returns True if the search term is cached and not expired
   */
  has(searchTerm: string): boolean {
    const key = this.generateCacheKey(searchTerm);
    const entry = this.inMemoryCache[key];

    if (!entry) {
      return false;
    }

    return !this.isExpired(entry);
  }

  /**
   * Gets cache statistics
   * @returns Object containing cache statistics
   */
  getStats(): {
    size: number;
    keys: string[];
    expiredCount: number;
    validCount: number;
  } {
    const keys = Object.keys(this.inMemoryCache);
    let expiredCount = 0;
    let validCount = 0;

    keys.forEach(key => {
      const entry = this.inMemoryCache[key];
      if (entry) {
        if (this.isExpired(entry)) {
          expiredCount++;
        } else {
          validCount++;
        }
      }
    });

    return {
      size: keys.length,
      keys,
      expiredCount,
      validCount
    };
  }
}

/**
 * Default cache instance with 24-hour TTL
 */
export const defaultNutritionCache = new NutritionCache();

/**
 * Helper function to get cached data using the default cache instance
 * @param searchTerm - The search term to look up
 * @returns The cached search result or null if not found or expired
 */
export function getCachedNutrition(searchTerm: string): NutritionSearchResult | null {
  return defaultNutritionCache.get(searchTerm);
}

/**
 * Helper function to cache nutrition data using the default cache instance
 * @param searchTerm - The search term to cache data for
 * @param data - The normalized nutrition data to cache
 * @param ttl - Optional custom TTL in milliseconds
 */
export function setCachedNutrition(
  searchTerm: string,
  data: NormalizedNutritionData,
  ttl?: number
): void {
  defaultNutritionCache.set(searchTerm, data, ttl);
}

/**
 * Helper function to clear all cached nutrition data using the default cache instance
 */
export function clearNutritionCache(): void {
  defaultNutritionCache.clear();
}

/**
 * Helper function to invalidate expired cache entries using the default cache instance
 * @returns The number of entries removed
 */
export function invalidateExpiredNutritionCache(): number {
  return defaultNutritionCache.invalidateExpired();
}
