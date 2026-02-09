"use client"

import { useState } from "react"
import Link from "next/link"

export function Gamification() {
  const [spinCount, setSpinCount] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [reward, setReward] = useState<string | null>(null)

  const rewards = [
    { text: "15% OFF", discount: 15 },
    { text: "Free Shipping", discount: 0 },
    { text: "20% OFF", discount: 20 },
    { text: "Free Gift", discount: 0 },
    { text: "10% OFF", discount: 10 },
    { text: "Try Kiwi Free", discount: 0 },
  ]

  const spin = () => {
    if (spinning || spinCount >= 1) return

    setSpinning(true)
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)]
    setReward(randomReward.text)
    setSpinCount(spinCount + 1)

    setTimeout(() => setSpinning(false), 1000)
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Lucky Spin - Get Instant Reward</h2>
        <p className="text-muted-foreground mb-12">
          Spin the wheel for exclusive discounts. Limited to one spin per customer.
        </p>

        <div className="bg-white dark:bg-slate-900 p-12 rounded-xl shadow-xl">
          <div className="mb-8">
            <div
              className={`w-48 h-48 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl cursor-pointer ${
                spinning ? "animate-spin" : ""
              } transition-transform`}
              onClick={spin}
              style={{
                animationDuration: "1s",
              }}
            >
              {reward ? reward : "SPIN"}
            </div>
          </div>

          <button
            onClick={spin}
            disabled={spinning || spinCount >= 1}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {spinCount >= 1 ? "Already Spun" : "Spin Now"}
          </button>

          {reward && spinCount >= 1 && (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="font-bold text-lg text-green-700 dark:text-green-400">You won: {reward}!</p>
              <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                Use this code at checkout or share on WhatsApp
              </p>
              <Link
                href="https://wa.me/977986733380"
                className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90"
              >
                Claim via WhatsApp
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
