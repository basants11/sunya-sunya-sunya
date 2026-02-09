"use client"

import { useState } from "react"

export function AnimatedCTA() {
  const [clicked, setClicked] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in-up">
      <button
        onClick={() => setClicked(!clicked)}
        className="bg-primary text-primary-foreground rounded-full p-4 shadow-2xl hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all duration-500 font-bold text-lg"
      >
        {clicked ? "✓" : "💬"}
      </button>
      {clicked && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-lg border border-border w-48 animate-fade-in-up">
          <p className="text-sm font-semibold mb-3">Quick order via WhatsApp?</p>
          <a
            href="https://wa.me/977986733380"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 text-white py-2 rounded font-semibold text-center hover:bg-green-600 transition-colors"
          >
            Care for Your Health
          </a>
        </div>
      )}
    </div>
  )
}
