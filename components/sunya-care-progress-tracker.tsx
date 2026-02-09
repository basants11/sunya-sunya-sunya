"use client";

import { DailyRequirements } from "@/lib/nutrition-calculator";
import {
  Award,
  Calendar,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface NutritionEntry {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  fat: number;
  vitaminC: number;
  potassium: number;
  magnesium: number;
}

interface ProgressTrackerProps {
  requirements: DailyRequirements;
}

export function SunyaCareProgressTracker({
  requirements,
}: ProgressTrackerProps) {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem("sunya-care-progress");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    // Load streak
    const savedStreak = localStorage.getItem("sunya-care-streak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    // Load achievements
    const savedAchievements = localStorage.getItem("sunya-care-achievements");
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  const calculateProgress = (current: number, required: number) => {
    return Math.min(100, Math.round((current / required) * 100));
  };

  const getWeeklyAverage = (nutrient: keyof NutritionEntry) => {
    if (entries.length === 0) return 0;
    const recentEntries = entries.slice(-7);
    const sum = recentEntries.reduce((acc, entry) => {
      const value = entry[nutrient];
      return acc + (typeof value === "number" ? value : 0);
    }, 0);
    return Math.round(sum / recentEntries.length);
  };

  const getTrend = (nutrient: keyof NutritionEntry) => {
    if (entries.length < 2) return "stable";
    const recent = entries.slice(-7);
    const previous = entries.slice(-14, -7);

    if (previous.length === 0) return "stable";

    const recentAvg =
      recent.reduce((acc, entry) => {
        const value = entry[nutrient];
        return acc + (typeof value === "number" ? value : 0);
      }, 0) / recent.length;
    const previousAvg =
      previous.reduce((acc, entry) => {
        const value = entry[nutrient];
        return acc + (typeof value === "number" ? value : 0);
      }, 0) / previous.length;

    if (recentAvg > previousAvg * 1.1) return "up";
    if (recentAvg < previousAvg * 0.9) return "down";
    return "stable";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const checkAchievements = () => {
    const newAchievements: string[] = [];

    // First week streak
    if (streak >= 7 && !achievements.includes("first-week")) {
      newAchievements.push("first-week");
    }

    // Perfect day
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      const allMet = Object.entries(requirements).every(([key, value]) => {
        if (key === "vitaminB6" || key === "antioxidants") return true;
        const entryKey = key as keyof NutritionEntry;
        const entryValue = lastEntry[entryKey];
        return typeof entryValue === "number" && entryValue >= value * 0.9;
      });

      if (allMet && !achievements.includes("perfect-day")) {
        newAchievements.push("perfect-day");
      }
    }

    // Protein champion
    const proteinAvg = getWeeklyAverage("protein");
    if (
      proteinAvg >= requirements.protein &&
      !achievements.includes("protein-champion")
    ) {
      newAchievements.push("protein-champion");
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);
      localStorage.setItem(
        "sunya-care-achievements",
        JSON.stringify(updatedAchievements),
      );
    }
  };

  useEffect(() => {
    checkAchievements();
  }, [entries, streak]);

  const metrics = [
    {
      label: "Calories",
      current: getWeeklyAverage("calories"),
      required: requirements.calories,
      unit: "kcal",
      color: "bg-orange-500",
    },
    {
      label: "Protein",
      current: getWeeklyAverage("protein"),
      required: requirements.protein,
      unit: "g",
      color: "bg-green-500",
    },
    {
      label: "Carbs",
      current: getWeeklyAverage("carbs"),
      required: requirements.carbs,
      unit: "g",
      color: "bg-purple-500",
    },
    {
      label: "Fiber",
      current: getWeeklyAverage("fiber"),
      required: requirements.fiber,
      unit: "g",
      color: "bg-amber-600",
    },
    {
      label: "Fat",
      current: getWeeklyAverage("fat"),
      required: requirements.fat,
      unit: "g",
      color: "bg-yellow-500",
    },
    {
      label: "Vitamin C",
      current: getWeeklyAverage("vitaminC"),
      required: requirements.vitaminC,
      unit: "mg",
      color: "bg-red-500",
    },
    {
      label: "Potassium",
      current: getWeeklyAverage("potassium"),
      required: requirements.potassium,
      unit: "mg",
      color: "bg-teal-500",
    },
    {
      label: "Magnesium",
      current: getWeeklyAverage("magnesium"),
      required: requirements.magnesium,
      unit: "mg",
      color: "bg-cyan-500",
    },
  ];

  const achievementList = [
    {
      id: "first-week",
      icon: Award,
      title: "First Week",
      desc: "7-day streak achieved",
      color: "bg-yellow-500",
    },
    {
      id: "perfect-day",
      icon: Target,
      title: "Perfect Day",
      desc: "Met all nutrition goals",
      color: "bg-green-500",
    },
    {
      id: "protein-champion",
      icon: Zap,
      title: "Protein Champion",
      desc: "Consistently hit protein goals",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Progress Tracker</h3>
          <p className="text-sm text-gray-600">Track your nutrition journey</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#00C950]" />
          <span className="text-sm font-medium text-gray-700">
            {entries.length} days tracked
          </span>
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-gradient-to-r from-[#00C950] to-[#00A040] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/80 mb-1">Current Streak</div>
            <div className="text-4xl font-bold">{streak} days</div>
            <div className="text-sm text-white/70 mt-1">Keep it going!</div>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-premium-pulse">
            <Zap className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Weekly Averages */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Weekly Averages</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const progress = calculateProgress(metric.current, metric.required);
            const trend = getTrend(
              metric.label.toLowerCase() as keyof NutritionEntry,
            );

            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {metric.label}
                    </span>
                    {getTrendIcon(trend)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {metric.current} / {metric.required} {metric.unit}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${metric.color}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {progress}% of goal
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Achievements</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievementList.map((achievement) => {
            const isUnlocked = achievements.includes(achievement.id);
            const Icon = achievement.icon;

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isUnlocked
                    ? "border-[#00C950] bg-[#00C950]/5"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    isUnlocked ? achievement.color : "bg-gray-300"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${isUnlocked ? "text-white" : "text-gray-500"}`}
                  />
                </div>
                <div
                  className={`font-semibold text-sm ${isUnlocked ? "text-gray-900" : "text-gray-500"}`}
                >
                  {achievement.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {achievement.desc}
                </div>
                {isUnlocked && (
                  <div className="mt-2 text-xs text-[#00C950] font-medium">
                    ✓ Unlocked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">Weekly Insights</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              You've tracked your nutrition for{" "}
              <strong>{entries.length} days</strong>.
              {entries.length >= 7
                ? " Great consistency!"
                : " Keep tracking to see trends."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              Your protein intake is{" "}
              {getWeeklyAverage("protein") >= requirements.protein
                ? "on track"
                : "below target"}
              .
              {getWeeklyAverage("protein") < requirements.protein &&
                " Try adding more nuts to your diet."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              {streak > 0
                ? `You're on a ${streak}-day streak! Keep it up to earn more achievements.`
                : "Start tracking daily to build your streak!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
