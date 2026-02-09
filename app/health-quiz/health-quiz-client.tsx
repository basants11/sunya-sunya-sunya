"use client"

import Link from "next/link"
import { useState } from "react"

interface QuizQuestion {
  id: number
  question: string
  options: { text: string; goal: string; points: Record<string, number> }[]
}

interface Recommendation {
  fruit: string
  icon: string
  reason: string
  benefits: string[]
  priceRange: string
}

export function HealthQuizClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [completed, setCompleted] = useState(false)

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is your primary wellness goal?",
      options: [
        {
          text: "Boost immunity",
          goal: "immunity",
          points: { immunity: 10, energy: 3 },
        },
        {
          text: "Increase energy",
          goal: "energy",
          points: { energy: 10, fitness: 5 },
        },
        { text: "Improve digestion", goal: "digestion", points: { digestion: 10 } },
        {
          text: "Skin health",
          goal: "skin",
          points: { skin: 10, antioxidants: 8 },
        },
      ],
    },
    {
      id: 2,
      question: "How often do you exercise?",
      options: [
        {
          text: "Rarely",
          goal: "beginner",
          points: { immunity: 5, wellness: 8 },
        },
        {
          text: "2-3 times weekly",
          goal: "moderate",
          points: { energy: 8, fitness: 6 },
        },
        {
          text: "Daily",
          goal: "athlete",
          points: { fitness: 10, energy: 10, potassium: 8 },
        },
      ],
    },
    {
      id: 3,
      question: "What's your lifestyle preference?",
      options: [
        {
          text: "Always on-the-go",
          goal: "portable",
          points: { energy: 8, convenience: 10 },
        },
        { text: "Balanced routine", goal: "balanced", points: { wellness: 10 } },
        {
          text: "Luxury self-care",
          goal: "premium",
          points: { antioxidants: 10, skincare: 10, premium: 10 },
        },
      ],
    },
    {
      id: 4,
      question: "Any specific dietary preferences?",
      options: [
        {
          text: "No restrictions",
          goal: "all",
          points: { variety: 10 },
        },
        {
          text: "Low sugar preference",
          goal: "lowsugar",
          points: { lowsugar: 10 },
        },
        {
          text: "Allergy concerns",
          goal: "safe",
          points: { hypoallergenic: 8 },
        },
      ],
    },
  ]

  const recommendations: Record<string, Recommendation> = {
    kiwi: {
      fruit: "Dried Kiwi",
      icon: "🥝",
      reason:
        "Perfect for immunity boosting with 8x vitamin C concentration. Ideal if you prioritize health and active lifestyle.",
      benefits: ["95% antioxidant power", "Immune system support", "Digestive enzymes", "Natural energy"],
      priceRange: "रु2199 / 250g",
    },
    mango: {
      fruit: "Dried Mango",
      icon: "🥭",
      reason:
        "Golden nutrition for daily wellness. Rich in beta-carotene, perfect for those seeking balanced, luxury wellness.",
      benefits: ["Eye health", "Energy boost", "Skin radiance", "Gut health"],
      priceRange: "रु2399 / 250g",
    },
    strawberry: {
      fruit: "Dried Strawberry",
      icon: "🍓",
      reason:
        "Antioxidant powerhouse for premium self-care. Highest antioxidant content, perfect for skin and cellular health.",
      benefits: ["Antioxidant champion", "Skin rejuvenation", "Heart health", "Inflammation support"],
      priceRange: "रु2499 / 250g",
    },
    dragonFruit: {
      fruit: "Dried Dragon Fruit",
      icon: "🐉",
      reason: "Exotic luxury choice. Best for fitness enthusiasts seeking unique nutrition and premium experience.",
      benefits: ["Fiber rich", "Muscle recovery", "Hydration support", "Unique taste"],
      priceRange: "रु2799 / 250g",
    },
  }

  const handleAnswer = (points: Record<string, number>) => {
    const newScores = { ...scores }
    Object.entries(points).forEach(([key, value]) => {
      newScores[key] = (newScores[key] || 0) + value
    })
    setScores(newScores)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCompleted(true)
    }
  }

  const getRecommendation = (): Recommendation | null => {
    if (!completed || Object.keys(scores).length === 0) return null

    const topScore = Object.entries(scores).sort(([, a], [, b]) => b - a)[0]

    if (topScore[0].includes("immunity") || topScore[0].includes("fitness")) {
      return recommendations.kiwi
    }
    if (topScore[0].includes("skin") || topScore[0].includes("antioxidants")) {
      return recommendations.strawberry
    }
    if (topScore[0].includes("premium") || topScore[0].includes("luxury")) {
      return recommendations.dragonFruit
    }
    return recommendations.mango
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Perfect Match</h1>
        <p className="text-lg text-muted-foreground">
          Answer a few questions to get personalized <span className="text-[#FF6900]">S</span>
          <span className="text-[#00C950]">U</span>
          <span className="text-[#9810FA]">N</span>
          <span className="text-[#BB4D00]">Y</span>
          <span className="text-[#FF6900]">A</span> recommendations based on your wellness goals
        </p>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-full bg-muted rounded-full h-2 ml-4 max-w-xs">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-8">{questions[currentQuestion].question}</h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.points)}
                className="w-full p-4 text-left rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 font-medium"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:p-12 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Personalized Recommendation</h2>
            <p className="text-muted-foreground">Based on your wellness goals and lifestyle</p>
          </div>

          {getRecommendation() && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg mb-8">
              <div className="text-6xl text-center mb-4">{getRecommendation()?.icon}</div>
              <h3 className="text-3xl font-bold text-center mb-2">{getRecommendation()?.fruit}</h3>
              <p className="text-center text-muted-foreground mb-8">{getRecommendation()?.reason}</p>

              <div className="mb-8">
                <h4 className="font-semibold mb-4">Key Benefits</h4>
                <ul className="space-y-2">
                  {getRecommendation()?.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-3">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-primary mb-6">{getRecommendation()?.priceRange}</p>
                <Link
                  href="/products"
                  className="inline-block cta-button text-primary-foreground px-8 py-3 rounded-lg font-semibold"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setCurrentQuestion(0)
              setScores({})
              setCompleted(false)
            }}
            className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  )
}
