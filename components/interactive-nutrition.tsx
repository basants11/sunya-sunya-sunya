"use client"

import { useState } from "react"

export function InteractiveNutrition() {
  const [selectedFruit, setSelectedFruit] = useState("kiwi")

  const nutritionData = {
    kiwi: {
      name: "Dried Kiwi",
      description: "Immunity powerhouse with 8x more vitamin C than fresh kiwi",
      nutrients: {
        "Antioxidants": 95,
        "Vitamin C": 88,
        "Fiber": 85,
        "Potassium": 92,
      }
    },
    blueberry: {
      name: "Dried Blueberry",
      description: "Brain-enhancing superfruit with 5x more antioxidants than fresh blueberries",
      nutrients: {
        "Antioxidants": 95,
        "Vitamin C": 82,
        "Fiber": 78,
        "Potassium": 70,
      }
    },
    pineapple: {
      name: "Dried Pineapple",
      description: "Digestive aid rich in bromelain and vitamin C",
      nutrients: {
        "Vitamin C": 88,
        "Fiber": 80,
        "Bromelain (Enzyme)": 90,
        "Potassium": 75,
      }
    },
    papaya: {
      name: "Dried Papaya",
      description: "Immunity booster and digestive superstar with natural enzymes",
      nutrients: {
        "Vitamin C": 92,
        "Fiber": 85,
        "Antioxidants": 80,
        "Potassium": 78,
      }
    },
    apple: {
      name: "Dried Apple",
      description: "Heart-friendly and energy-rich snack for everyday vitality",
      nutrients: {
        "Fiber": 90,
        "Vitamin C": 70,
        "Potassium": 82,
        "Antioxidants": 75,
      }
    },
    banana: {
      name: "Dried Banana",
      description: "Natural energy booster loaded with potassium and magnesium",
      nutrients: {
        "Potassium": 95,
        "Vitamin B6": 88,
        "Fiber": 80,
        "Antioxidants": 70,
      }
    },
    mango: {
      name: "Dried Mango",
      description: "Golden nutrition with beta-carotene for eye health",
      nutrients: {
        "Antioxidants": 90,
        "Vitamin C": 72,
        "Fiber": 82,
        "Potassium": 88,
      }
    },
    strawberry: {
      name: "Dried Strawberry",
      description: "Antioxidant champion for cellular rejuvenation",
      nutrients: {
        "Antioxidants": 98,
        "Vitamin C": 85,
        "Fiber": 80,
        "Potassium": 75,
      }
    },
  }

  const colorMap: Record<string, string> = {
    "Antioxidants": "bg-red-500",
    "Vitamin C": "bg-yellow-500",
    "Fiber": "bg-green-500",
    "Potassium": "bg-blue-500",
    "Bromelain (Enzyme)": "bg-purple-500",
    "Vitamin B6": "bg-orange-500",
  }

  const current = nutritionData[selectedFruit as keyof typeof nutritionData]

  return (
    <section className="py-20 px-4 md:px-8 bg-accent/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">Nutritional Intelligence</h2>
        <p className="text-center text-muted-foreground mb-12">
          Explore the power of each fruit. Select to see detailed nutrition profiles.
        </p>

        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {Object.entries(nutritionData).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedFruit(key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedFruit === key
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-background border border-border hover:border-primary/50"
              }`}
            >
              {value.name}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-2">{current.name}</h3>
          <p className="text-muted-foreground mb-8">{current.description}</p>

          <div className="space-y-6">
            {Object.entries(current.nutrients).map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold">{label}</label>
                  <span className="text-primary font-bold">{value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`${colorMap[label] || "bg-gray-500"} h-full transition-all duration-700`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
