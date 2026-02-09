"use client";

import { DailyRequirements } from "@/lib/nutrition-calculator";
import { PersonalizedRecommendation } from "@/lib/personalized-recommendation-engine";
import {
  Activity,
  Award,
  BarChart3,
  Calendar,
  LineChart,
  PieChart,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface AnalyticsData {
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

interface SunyaCareAnalyticsProps {
  requirements: DailyRequirements;
  recommendations: PersonalizedRecommendation[];
}

export function SunyaCareAnalytics({
  requirements,
  recommendations,
}: SunyaCareAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const filterDataByTimeRange = (data: AnalyticsData[]) => {
    const now = new Date();
    let filteredData: AnalyticsData[] = [];

    switch (timeRange) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = data.filter((d) => new Date(d.date) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = data.filter((d) => new Date(d.date) >= monthAgo);
        break;
      case "all":
        filteredData = data;
        break;
    }

    setAnalyticsData(filteredData);
  };

  const calculateAverage = (nutrient: keyof AnalyticsData) => {
    if (analyticsData.length === 0) return 0;
    const sum = analyticsData.reduce((acc, entry) => {
      const value = entry[nutrient];
      return acc + (typeof value === "number" ? value : 0);
    }, 0);
    return Math.round(sum / analyticsData.length);
  };

  const calculateGoalAchievement = (current: number, required: number) => {
    if (required === 0) return 0;
    return Math.min(100, Math.round((current / required) * 100));
  };

  const getTrend = (nutrient: keyof AnalyticsData) => {
    if (analyticsData.length < 2) return { direction: "stable", percentage: 0 };

    const recent = analyticsData.slice(-7);
    const previous = analyticsData.slice(-14, -7);

    if (previous.length === 0) return { direction: "stable", percentage: 0 };

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

    const percentage =
      previousAvg > 0
        ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100)
        : 0;

    if (percentage > 5) return { direction: "up", percentage };
    if (percentage < -5) return { direction: "down", percentage };
    return { direction: "stable", percentage };
  };

  const getBestDay = () => {
    if (analyticsData.length === 0) return null;

    let bestDay = analyticsData[0];
    let bestScore = 0;

    analyticsData.forEach((entry) => {
      let score = 0;
      const nutrients = [
        "calories",
        "protein",
        "carbs",
        "fiber",
        "fat",
        "vitaminC",
        "potassium",
        "magnesium",
      ] as const;

      nutrients.forEach((nutrient) => {
        const value = entry[nutrient];
        if (typeof value === "number") {
          const required = requirements[
            nutrient as keyof DailyRequirements
          ] as number;
          if (required > 0) {
            score += Math.min(100, (value / required) * 100);
          }
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestDay = entry;
      }
    });

    return { date: bestDay.date, score: Math.round(bestScore / 8) };
  };

  const getConsistencyScore = () => {
    if (analyticsData.length === 0) return 0;

    let totalScore = 0;
    analyticsData.forEach((entry) => {
      let score = 0;
      const nutrients = [
        "calories",
        "protein",
        "carbs",
        "fiber",
        "fat",
        "vitaminC",
        "potassium",
        "magnesium",
      ] as const;

      nutrients.forEach((nutrient) => {
        const value = entry[nutrient];
        if (typeof value === "number") {
          const required = requirements[
            nutrient as keyof DailyRequirements
          ] as number;
          if (required > 0) {
            score += Math.min(100, (value / required) * 100);
          }
        }
      });

      totalScore += score / 8;
    });

    return Math.round(totalScore / analyticsData.length);
  };

  const getNutrientDistribution = () => {
    const totalCalories = calculateAverage("calories");
    const proteinCalories = calculateAverage("protein") * 4;
    const carbsCalories = calculateAverage("carbs") * 4;
    const fatCalories = calculateAverage("fat") * 9;

    return [
      {
        label: "Protein",
        value: proteinCalories,
        color: "bg-green-500",
        percentage: Math.round((proteinCalories / totalCalories) * 100),
      },
      {
        label: "Carbs",
        value: carbsCalories,
        color: "bg-purple-500",
        percentage: Math.round((carbsCalories / totalCalories) * 100),
      },
      {
        label: "Fat",
        value: fatCalories,
        color: "bg-yellow-500",
        percentage: Math.round((fatCalories / totalCalories) * 100),
      },
    ];
  };

  const bestDay = getBestDay();
  const consistencyScore = getConsistencyScore();
  const distribution = getNutrientDistribution();

  const metrics = [
    {
      label: "Calories",
      current: calculateAverage("calories"),
      required: requirements.calories,
      unit: "kcal",
      icon: "🔥",
    },
    {
      label: "Protein",
      current: calculateAverage("protein"),
      required: requirements.protein,
      unit: "g",
      icon: "💪",
    },
    {
      label: "Carbs",
      current: calculateAverage("carbs"),
      required: requirements.carbs,
      unit: "g",
      icon: "🍞",
    },
    {
      label: "Fiber",
      current: calculateAverage("fiber"),
      required: requirements.fiber,
      unit: "g",
      icon: "🌾",
    },
    {
      label: "Fat",
      current: calculateAverage("fat"),
      required: requirements.fat,
      unit: "g",
      icon: "🥑",
    },
    {
      label: "Vitamin C",
      current: calculateAverage("vitaminC"),
      required: requirements.vitaminC,
      unit: "mg",
      icon: "🍊",
    },
    {
      label: "Potassium",
      current: calculateAverage("potassium"),
      required: requirements.potassium,
      unit: "mg",
      icon: "🍌",
    },
    {
      label: "Magnesium",
      current: calculateAverage("magnesium"),
      required: requirements.magnesium,
      unit: "mg",
      icon: "🥜",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Analytics Dashboard
          </h3>
          <p className="text-sm text-gray-600">
            Track your nutrition progress over time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00C950]" />
          <span className="text-sm font-medium text-gray-700">
            {analyticsData.length} days tracked
          </span>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
          { value: "all", label: "All Time" },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() =>
              setTimeRange(range.value as "week" | "month" | "all")
            }
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === range.value
                ? "bg-[#00C950] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Consistency Score */}
        <div className="bg-gradient-to-br from-[#00C950] to-[#00A040] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{consistencyScore}%</div>
              <div className="text-sm text-white/80">Consistency Score</div>
            </div>
          </div>
          <p className="text-sm text-white/90">
            {consistencyScore >= 80
              ? "Excellent! Keep up the great work!"
              : consistencyScore >= 60
                ? "Good progress! Stay consistent."
                : "Room for improvement. Keep tracking!"}
          </p>
        </div>

        {/* Best Day */}
        {bestDay && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-[#00C950]" />
              <div className="text-right">
                <div className="text-3xl font-bold text-[#00C950]">
                  {bestDay.score}%
                </div>
                <div className="text-sm text-gray-600">Best Day Score</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>{new Date(bestDay.date).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Total Tracked */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-[#00C950]" />
            <div className="text-right">
              <div className="text-3xl font-bold text-[#00C950]">
                {analyticsData.length}
              </div>
              <div className="text-sm text-gray-600">Days Tracked</div>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            {analyticsData.length >= 30
              ? "Full month tracked! Amazing dedication!"
              : analyticsData.length >= 7
                ? "One week tracked! Great start!"
                : "Keep tracking to see trends."}
          </p>
        </div>
      </div>

      {/* Nutrient Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#00C950]" />
          Calorie Distribution
        </h4>
        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-[#00C950]" />
          Nutrient Averages
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const achievement = calculateGoalAchievement(
              metric.current,
              metric.required,
            );
            const trend = getTrend(
              metric.label.toLowerCase() as keyof AnalyticsData,
            );

            return (
              <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{metric.icon}</span>
                    <span className="font-medium text-gray-900">
                      {metric.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {trend.direction === "up" && (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                    {trend.direction === "down" && (
                      <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                    )}
                    {trend.direction === "stable" && (
                      <div className="w-4 h-4 rounded-full bg-gray-400" />
                    )}
                    {trend.direction !== "stable" && (
                      <span
                        className={`text-xs font-medium ${trend.direction === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {Math.abs(trend.percentage)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metric.current}
                    </div>
                    <div className="text-xs text-gray-500">
                      / {metric.required} {metric.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        achievement >= 90
                          ? "text-green-600"
                          : achievement >= 70
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {achievement}%
                    </div>
                    <div className="text-xs text-gray-500">Goal</div>
                  </div>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      achievement >= 90
                        ? "bg-green-500"
                        : achievement >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${achievement}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Insights & Recommendations
        </h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              Your consistency score is <strong>{consistencyScore}%</strong>.
              {consistencyScore >= 80
                ? " You're doing great!"
                : consistencyScore >= 60
                  ? " Good progress, keep it up!"
                  : " Try to track more consistently."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              {calculateAverage("protein") >= requirements.protein
                ? "You're consistently meeting your protein goals. Excellent!"
                : "Consider adding more protein-rich foods to your diet."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              {calculateAverage("fiber") >= requirements.fiber
                ? "Your fiber intake is on track. Great for digestion!"
                : "Try to increase your fiber intake with more fruits and vegetables."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              {bestDay &&
                `Your best day was ${new Date(bestDay.date).toLocaleDateString()} with a score of ${bestDay.score}%. Try to replicate that success!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
