"use client";

import { DailyRequirements } from '@/lib/nutrition-calculator';
import { useEffect, useRef, useState } from 'react';

interface NutritionRingsProps {
  requirements: DailyRequirements;
  currentIntake?: Partial<DailyRequirements>;
  size?: number;
  strokeWidth?: number;
}

interface RingData {
  label: string;
  value: number;
  required: number;
  color: string;
  percentage: number;
  status: 'deficient' | 'adequate' | 'excess';
}

export function NutritionRings({ 
  requirements, 
  currentIntake = {},
  size = 120,
  strokeWidth = 8
}: NutritionRingsProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const rings = getRingData();
      const newAnimatedValues: Record<string, number> = {};
      
      rings.forEach(ring => {
        newAnimatedValues[ring.label] = 0;
        
        // Animate to target value
        let current = 0;
        const increment = ring.percentage / 30;
        const interval = setInterval(() => {
          current += increment;
          if (current >= ring.percentage) {
            current = ring.percentage;
            clearInterval(interval);
          }
          setAnimatedValues(prev => ({
            ...prev,
            [ring.label]: current
          }));
        }, 16);
      });
    }
  }, [isVisible, requirements, currentIntake]);

  const getRingData = (): RingData[] => {
    const rings: RingData[] = [
      {
        label: 'Calories',
        value: currentIntake.calories || 0,
        required: requirements.calories,
        color: 'var(--brand-orange)',
        percentage: Math.min(100, Math.round(((currentIntake.calories || 0) / requirements.calories) * 100)),
        status: getStatus((currentIntake.calories || 0), requirements.calories)
      },
      {
        label: 'Protein',
        value: currentIntake.protein || 0,
        required: requirements.protein,
        color: 'var(--brand-green)',
        percentage: Math.min(100, Math.round(((currentIntake.protein || 0) / requirements.protein) * 100)),
        status: getStatus((currentIntake.protein || 0), requirements.protein)
      },
      {
        label: 'Carbs',
        value: currentIntake.carbs || 0,
        required: requirements.carbs,
        color: 'var(--brand-purple)',
        percentage: Math.min(100, Math.round(((currentIntake.carbs || 0) / requirements.carbs) * 100)),
        status: getStatus((currentIntake.carbs || 0), requirements.carbs)
      },
      {
        label: 'Fiber',
        value: currentIntake.fiber || 0,
        required: requirements.fiber,
        color: 'var(--brand-brown)',
        percentage: Math.min(100, Math.round(((currentIntake.fiber || 0) / requirements.fiber) * 100)),
        status: getStatus((currentIntake.fiber || 0), requirements.fiber)
      },
      {
        label: 'Fat',
        value: currentIntake.fat || 0,
        required: requirements.fat,
        color: 'var(--brand-yellow)',
        percentage: Math.min(100, Math.round(((currentIntake.fat || 0) / requirements.fat) * 100)),
        status: getStatus((currentIntake.fat || 0), requirements.fat)
      },
      {
        label: 'Vitamin C',
        value: currentIntake.vitaminC || 0,
        required: requirements.vitaminC,
        color: 'var(--brand-coral)',
        percentage: Math.min(100, Math.round(((currentIntake.vitaminC || 0) / requirements.vitaminC) * 100)),
        status: getStatus((currentIntake.vitaminC || 0), requirements.vitaminC)
      },
      {
        label: 'Potassium',
        value: currentIntake.potassium || 0,
        required: requirements.potassium,
        color: 'var(--brand-teal)',
        percentage: Math.min(100, Math.round(((currentIntake.potassium || 0) / requirements.potassium) * 100)),
        status: getStatus((currentIntake.potassium || 0), requirements.potassium)
      },
      {
        label: 'Magnesium',
        value: currentIntake.magnesium || 0,
        required: requirements.magnesium,
        color: 'var(--brand-mint)',
        percentage: Math.min(100, Math.round(((currentIntake.magnesium || 0) / requirements.magnesium) * 100)),
        status: getStatus((currentIntake.magnesium || 0), requirements.magnesium)
      }
    ];

    return rings;
  };

  const getStatus = (current: number, required: number): 'deficient' | 'adequate' | 'excess' => {
    const percentage = (current / required) * 100;
    if (percentage < 80) return 'deficient';
    if (percentage > 120) return 'excess';
    return 'adequate';
  };

  const rings = getRingData();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getStatusColor = (status: 'deficient' | 'adequate' | 'excess') => {
    switch (status) {
      case 'deficient': return 'text-red-500';
      case 'adequate': return 'text-green-500';
      case 'excess': return 'text-yellow-500';
    }
  };

  const getStatusBg = (status: 'deficient' | 'adequate' | 'excess') => {
    switch (status) {
      case 'deficient': return 'bg-red-100';
      case 'adequate': return 'bg-green-100';
      case 'excess': return 'bg-yellow-100';
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Daily Nutrition Goals</h3>
        <p className="text-sm text-muted-foreground">Track your progress towards optimal nutrition</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {rings.map((ring) => {
          const animatedPercentage = animatedValues[ring.label] || 0;
          const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

          return (
            <div
              key={ring.label}
              className="flex flex-col items-center p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative" style={{ width: size, height: size }}>
                <svg
                  width={size}
                  height={size}
                  className="transform -rotate-90"
                >
                  {/* Background circle */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth={strokeWidth}
                  />
                  {/* Progress circle */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {Math.round(animatedPercentage)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-sm font-semibold text-foreground">{ring.label}</div>
                <div className="text-xs text-muted-foreground">
                  {ring.value} / {ring.required}
                </div>
                <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBg(ring.status)} ${getStatusColor(ring.status)}`}>
                  {ring.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 rounded-xl border" style={{background: 'linear-gradient(to right, var(--brand-green)/10, var(--brand-green)/5)', borderColor: 'var(--brand-green)/20'}}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground">Daily Progress</h4>
            <p className="text-sm text-muted-foreground">
              {rings.filter(r => r.status === 'adequate').length} of {rings.length} nutrients on target
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{color: 'var(--brand-green)'}}>
              {Math.round(rings.reduce((sum, r) => sum + r.percentage, 0) / rings.length)}%
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MacroBarsProps {
  requirements: DailyRequirements;
  currentIntake?: Partial<DailyRequirements>;
}

export function MacroBars({ requirements, currentIntake = {} }: MacroBarsProps) {
  const macros = [
    { label: 'Protein', current: currentIntake.protein || 0, required: requirements.protein, color: 'var(--brand-green)' },
    { label: 'Carbs', current: currentIntake.carbs || 0, required: requirements.carbs, color: 'var(--brand-purple)' },
    { label: 'Fat', current: currentIntake.fat || 0, required: requirements.fat, color: 'var(--brand-yellow)' },
    { label: 'Fiber', current: currentIntake.fiber || 0, required: requirements.fiber, color: 'var(--brand-brown)' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Macronutrient Breakdown</h3>
      {macros.map((macro) => {
        const percentage = Math.min(100, (macro.current / macro.required) * 100);
        const status = percentage < 80 ? 'deficient' : percentage > 120 ? 'excess' : 'adequate';
        
        return (
          <div key={macro.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{macro.label}</span>
              <span className="text-sm text-muted-foreground">
                {macro.current}g / {macro.required}g
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: macro.color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
