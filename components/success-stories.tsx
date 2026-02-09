"use client"

import { SunyaBoldText } from "@/components/sunya-bold-text";

export function SuccessStories() {
  const stories = [
    {
      title: "From Athlete to Better Recovery",
      icon: "🏃",
      story:
        "Akhil used <SunyaBoldText>Sunya&apos;s</SunyaBoldText> potassium-rich dried banana to support his marathon training. In 4 weeks, he reduced recovery time by 30% and improved his energy levels significantly.",
    },
    {
      title: "Skin Transformation Journey",
      icon: "✨",
      story:
        "Shruti added <SunyaBoldText>Sunya&apos;s</SunyaBoldText> strawberry (antioxidant powerhouse) to her daily routine. In 8 weeks, she noticed clearer, more radiant skin with less inflammation.",
    },
    {
      title: "Immunity Boost During Winter",
      icon: "🛡️",
      story:
        "Rajesh&apos;s family started consuming <SunyaBoldText>Sunya</SunyaBoldText> kiwi daily. They didn&apos;t catch a single cold during the harsh winter season - a first in 5 years!",
    },
    {
      title: "Corporate Wellness Program",
      icon: "🏢",
      story:
        "A tech startup ordered 500 packs for their employee wellness program. 92% of employees reported improved focus and energy levels within 6 weeks.",
    },
  ]

  return (
    <section className="py-20 px-4 md:px-8 bg-accent/20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Success Stories</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Real transformations from real customers who chose premium health
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 p-8 rounded-lg border-l-4 border-primary hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{story.icon}</div>
              <h3 className="text-xl font-bold mb-3">{story.title}</h3>
              <p className="text-foreground leading-relaxed">{story.story}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
