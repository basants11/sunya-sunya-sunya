'use client';

import React, { useRef, useState } from 'react';

interface NutritionSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  error?: string | null;
  placeholder?: string;
}

export default function NutritionSearchBar({
  onSearch,
  isLoading = false,
  error = null,
  placeholder = 'Search any fruit to check nutrition & daily quantity…',
}: NutritionSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Bar Container */}
        <div
          className={`
            relative flex items-center w-full
            bg-luxury-beige/80
            backdrop-blur-sm
            rounded-full
            shadow-lg
            transition-all duration-300
            ${isFocused ? 'shadow-xl ring-2 ring-luxury-gold/30' : 'hover:shadow-xl'}
            ${error ? 'ring-2 ring-luxury-burnt-orange/30' : ''}
          `}
        >
          {/* Search Icon */}
          <div className="absolute left-4 flex items-center justify-center">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-luxury-dark-green/30 border-t-luxury-dark-green rounded-full animate-spin" />
            ) : (
              <svg
                className="w-5 h-5 text-luxury-dark-green/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            className={`
              w-full px-12 py-4
              bg-transparent
              text-luxury-dark-green
              placeholder:text-luxury-dark-green/40
              text-base
              outline-none
              transition-all duration-300
              ${isLoading ? 'cursor-not-allowed opacity-70' : ''}
            `}
          />

          {/* Clear Button */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="
                absolute right-4
                flex items-center justify-center
                w-8 h-8
                rounded-full
                bg-luxury-gold/20
                text-luxury-dark-green/70
                hover:bg-luxury-gold/30
                hover:text-luxury-dark-green
                transition-all duration-300
                focus:outline-none
                focus:ring-2
                focus:ring-luxury-gold/50
              "
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="
              mt-3 px-4 py-2
              bg-luxury-burnt-orange/10
              border border-luxury-burnt-orange/20
              rounded-lg
              text-luxury-burnt-orange/80
              text-sm
              animate-fade-in-up
            "
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div
            className="
              mt-3 px-4 py-2
              bg-luxury-gold/10
              border border-luxury-gold/20
              rounded-lg
              text-luxury-dark-green/70
              text-sm
              animate-pulse-slow
            "
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin" />
              <span>Searching nutrition database…</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
