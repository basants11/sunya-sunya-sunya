"use client";

import React, { useState, useEffect } from 'react';

interface SeasonalSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const useCountdown = (endDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

const AnimatedCounter: React.FC<{ target: number }> = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = Math.ceil(target / 100);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev < target) {
          return Math.min(prev + increment, target);
        } else {
          clearInterval(interval);
          return target;
        }
      });
    }, 50);
    return () => clearInterval(interval);
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
};

const SeasonalSalePopup: React.FC<SeasonalSalePopupProps> = ({ isOpen, onClose }) => {
  const endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const { days, hours, mins, secs } = useCountdown(endDate);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="seasonal-sale-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full relative p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-2xl font-bold"
          aria-label="Close popup"
        >
          ×
        </button>

        <h2 id="seasonal-sale-title" className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Seasonal Sale Alert!
        </h2>

        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            Ends in: {days}d {hours}h {mins}m {secs}s
          </p>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Over <AnimatedCounter target={10000} /> customers have joined the revolution!
          </p>
        </div>

        <p className="text-center mb-4 text-gray-700 dark:text-gray-300">
          Discover the secret to healthier snacking and transform your cravings!
        </p>

        <p className="text-center mb-8 text-gray-700 dark:text-gray-300 text-lg">
          Get exclusive rewards, 50% off your first order, and free shipping! Transform your snacking habits with our premium dehydrated fruits and nuts.
        </p>
      </div>
    </div>
  );
};

export default SeasonalSalePopup;