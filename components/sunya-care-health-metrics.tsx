"use client";

import { DailyRequirements } from "@/lib/nutrition-calculator";
import {
  Activity,
  AlertTriangle,
  Brain,
  Droplets,
  Heart,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "excellent" | "good" | "fair" | "poor";
  trend: "up" | "down" | "stable";
  description: string;
  recommendation: string;
}

interface SunyaCareHealthMetricsProps {
  requirements: DailyRequirements;
}

export function SunyaCareHealthMetrics({
  requirements,
}: SunyaCareHealthMetricsProps) {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(
    null,
  );
  const calculateHealthMetrics = () => {
    const calculatedMetrics: HealthMetric[] = [];

    // Energy Level (based on calories)
    const energyScore = calculateEnergyScore(requirements.calories);
    calculatedMetrics.push({
      id: "energy",
      name: "Energy Level",
      value: energyScore,
      unit: "%",
      status: getStatus(energyScore),
      trend: "stable",
      description: "Based on your daily calorie intake",
      recommendation:
        energyScore >= 80
          ? "Your energy levels are optimal!"
          : "Consider increasing your calorie intake for better energy.",
    });

    // Protein Status
    const proteinScore = calculateProteinScore(requirements.protein);
    calculatedMetrics.push({
      id: "protein",
      name: "Protein Status",
      value: proteinScore,
      unit: "%",
      status: getStatus(proteinScore),
      trend: "stable",
      description: "Muscle building and repair indicator",
      recommendation:
        proteinScore >= 80
          ? "Excellent protein intake for muscle health!"
          : "Increase protein intake to support muscle growth.",
    });

    // Hydration Level (based on water intake from fruits)
    const hydrationScore = calculateHydrationScore(requirements);
    calculatedMetrics.push({
      id: "hydration",
      name: "Hydration Level",
      value: hydrationScore,
      unit: "%",
      status: getStatus(hydrationScore),
      trend: "stable",
      description: "Estimated hydration from food sources",
      recommendation:
        hydrationScore >= 70
          ? "Good hydration from fruits and vegetables!"
          : "Drink more water and eat water-rich foods.",
    });

    // Fiber Intake
    const fiberScore = calculateFiberScore(requirements.fiber);
    calculatedMetrics.push({
      id: "fiber",
      name: "Digestive Health",
      value: fiberScore,
      unit: "%",
      status: getStatus(fiberScore),
      trend: "stable",
      description: "Based on daily fiber intake",
      recommendation:
        fiberScore >= 80
          ? "Excellent fiber intake for digestive health!"
          : "Increase fiber intake for better digestion.",
    });

    // Vitamin C Status
    const vitaminCScore = calculateVitaminCScore(requirements.vitaminC);
    calculatedMetrics.push({
      id: "vitamin-c",
      name: "Immune Support",
      value: vitaminCScore,
      unit: "%",
      status: getStatus(vitaminCScore),
      trend: "stable",
      description: "Vitamin C intake for immune function",
      recommendation:
        vitaminCScore >= 80
          ? "Great vitamin C intake for immune support!"
          : "Add more vitamin C-rich foods to boost immunity.",
    });

    // Heart Health (based on potassium and magnesium)
    const heartHealthScore = calculateHeartHealthScore(
      requirements.potassium,
      requirements.magnesium,
    );
    calculatedMetrics.push({
      id: "heart",
      name: "Heart Health",
      value: heartHealthScore,
      unit: "%",
      status: getStatus(heartHealthScore),
      trend: "stable",
      description: "Based on potassium and magnesium intake",
      recommendation:
        heartHealthScore >= 80
          ? "Excellent heart health indicators!"
          : "Focus on potassium and magnesium-rich foods.",
    });

    // Brain Function (based on overall nutrition)
    const brainFunctionScore = calculateBrainFunctionScore(requirements);
    calculatedMetrics.push({
      id: "brain",
      name: "Brain Function",
      value: brainFunctionScore,
      unit: "%",
      status: getStatus(brainFunctionScore),
      trend: "stable",
      description: "Cognitive function support",
      recommendation:
        brainFunctionScore >= 80
          ? "Optimal nutrition for brain health!"
          : "Ensure balanced nutrition for cognitive function.",
    });

    // Overall Health Score
    const overallScore = Math.round(
      (energyScore +
        proteinScore +
        hydrationScore +
        fiberScore +
        vitaminCScore +
        heartHealthScore +
        brainFunctionScore) /
        7,
    );
    calculatedMetrics.push({
      id: "overall",
      name: "Overall Health Score",
      value: overallScore,
      unit: "%",
      status: getStatus(overallScore),
      trend: "stable",
      description: "Comprehensive health assessment",
      recommendation:
        overallScore >= 80
          ? "Excellent overall health! Keep it up!"
          : overallScore >= 60
            ? "Good health, with room for improvement."
            : "Focus on improving key health metrics.",
    });

    setMetrics(calculatedMetrics);
  };

  const calculateEnergyScore = (calories: number): number => {
    const optimal = 2000;
    return Math.min(100, Math.round((calories / optimal) * 100));
  };

  const calculateProteinScore = (protein: number): number => {
    const optimal = 50;
    return Math.min(100, Math.round((protein / optimal) * 100));
  };

  const calculateHydrationScore = (requirements: DailyRequirements): number => {
    // Estimate hydration from fruits (assuming 20% of daily water from food)
    const waterFromFood = Math.round(requirements.fiber * 2);
    const optimal = 500;
    return Math.min(100, Math.round((waterFromFood / optimal) * 100));
  };

  const calculateFiberScore = (fiber: number): number => {
    const optimal = 30;
    return Math.min(100, Math.round((fiber / optimal) * 100));
  };

  const calculateVitaminCScore = (vitaminC: number): number => {
    const optimal = 90;
    return Math.min(100, Math.round((vitaminC / optimal) * 100));
  };

  const calculateHeartHealthScore = (
    potassium: number,
    magnesium: number,
  ): number => {
    const potassiumScore = Math.min(100, Math.round((potassium / 3500) * 100));
    const magnesiumScore = Math.min(100, Math.round((magnesium / 400) * 100));
    return Math.round((potassiumScore + magnesiumScore) / 2);
  };

  const calculateBrainFunctionScore = (
    requirements: DailyRequirements,
  ): number => {
    const proteinScore = Math.min(
      100,
      Math.round((requirements.protein / 50) * 100),
    );
    const vitaminCScore = Math.min(
      100,
      Math.round((requirements.vitaminC / 90) * 100),
    );
    const magnesiumScore = Math.min(
      100,
      Math.round((requirements.magnesium / 400) * 100),
    );
    return Math.round((proteinScore + vitaminCScore + magnesiumScore) / 3);
  };

  const getStatus = (score: number): "excellent" | "good" | "fair" | "poor" => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "fair";
    return "poor";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-blue-500";
      case "fair":
        return "bg-yellow-500";
      case "poor":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-700";
      case "good":
        return "bg-blue-100 text-blue-700";
      case "fair":
        return "bg-yellow-100 text-yellow-700";
      case "poor":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMetricIcon = (id: string) => {
    switch (id) {
      case "energy":
        return Zap;
      case "protein":
        return Activity;
      case "hydration":
        return Droplets;
      case "fiber":
        return Shield;
      case "vitamin-c":
        return Shield;
      case "heart":
        return Heart;
      case "brain":
        return Brain;
      default:
        return Activity;
    }
  };

  const overallScore = metrics.find((m) => m.id === "overall");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Health Metrics</h3>
          <p className="text-sm text-gray-600">
            Monitor your overall health status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00C950]" />
          <span className="text-sm font-medium text-gray-700">
            {metrics.length} metrics
          </span>
        </div>
      </div>

      {/* Overall Health Score */}
      {overallScore && (
        <div className="bg-gradient-to-br from-[#00C950] to-[#00A040] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80 mb-1">
                Overall Health Score
              </div>
              <div className="text-5xl font-bold mb-2">
                {overallScore.value}%
              </div>
              <div className="text-sm text-white/90">
                {overallScore.status === "excellent" &&
                  "Excellent! You're in great health!"}
                {overallScore.status === "good" &&
                  "Good! Keep up the healthy habits!"}
                {overallScore.status === "fair" &&
                  "Fair. Room for improvement."}
                {overallScore.status === "poor" &&
                  "Needs attention. Focus on key areas."}
              </div>
            </div>
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-premium-pulse">
              <Activity className="w-12 h-12" />
            </div>
          </div>
        </div>
      )}

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics
          .filter((m) => m.id !== "overall")
          .map((metric) => {
            const Icon = getMetricIcon(metric.id);

            return (
              <div
                key={metric.id}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${getStatusBg(metric.status)}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(metric.status)}`}
                  >
                    {metric.status}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-1">
                    {metric.name}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}%
                  </div>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getStatusColor(metric.status)}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>

                <div className="text-xs text-gray-500 line-clamp-2">
                  {metric.description}
                </div>
              </div>
            );
          })}
      </div>

      {/* Health Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Health Insights
        </h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              Your overall health score is{" "}
              <strong>{overallScore?.value}%</strong>.
              {overallScore?.status === "excellent" &&
                " You're in excellent health!"}
              {overallScore?.status === "good" &&
                " Good health with room for improvement."}
              {overallScore?.status === "fair" &&
                " Fair health. Focus on key areas."}
              {overallScore?.status === "poor" &&
                " Needs attention. Consult a healthcare provider."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              {metrics.find((m) => m.id === "protein")?.value &&
              metrics.find((m) => m.id === "protein")!.value >= 80
                ? "Your protein intake is excellent for muscle health!"
                : "Consider increasing protein intake for better muscle function."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              {metrics.find((m) => m.id === "fiber")?.value &&
              metrics.find((m) => m.id === "fiber")!.value >= 80
                ? "Great fiber intake for digestive health!"
                : "Increase fiber intake for better digestion and gut health."}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              {metrics.find((m) => m.id === "vitamin-c")?.value &&
              metrics.find((m) => m.id === "vitamin-c")!.value >= 80
                ? "Excellent vitamin C intake for immune support!"
                : "Add more vitamin C-rich foods to boost your immune system."}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Detail Modal */}
      {selectedMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedMetric(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-premium-scale-in">
            <button
              onClick={() => setSelectedMetric(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-xl ${getStatusBg(selectedMetric.status)}`}
              >
                {React.createElement(getMetricIcon(selectedMetric.id), {
                  className: "w-8 h-8",
                })}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedMetric.name}
                </h3>
                <div
                  className={`text-sm font-medium ${getStatusBg(selectedMetric.status)}`}
                >
                  {selectedMetric.status}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#00C950] mb-2">
                  {selectedMetric.value}%
                </div>
                <div className="text-sm text-gray-600">
                  {selectedMetric.description}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Recommendation
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedMetric.recommendation}
                </p>
              </div>

              {selectedMetric.status === "poor" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium mb-1">Attention Needed</p>
                      <p>
                        This metric is below optimal levels. Consider consulting
                        with a healthcare provider for personalized advice.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedMetric.status === "fair" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Room for Improvement</p>
                      <p>
                        Focus on improving this metric through diet and
                        lifestyle changes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
