"use client"

export function SustainabilityTracker() {
  const stats = [
    { metric: "CO₂ Saved", value: "2,456 kg", icon: "🌍" },
    { metric: "Eco Packaging", value: "100%", icon: "♻️" },
    { metric: "Plastic Free", value: "Since 2023", icon: "🌱" },
    { metric: "Trees Planted", value: "1,200+", icon: "🌳" },
  ]

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Sustainability Impact</h2>
        <p className="text-center text-muted-foreground mb-16">
          Premium products with a conscience. Every purchase contributes to a healthier planet.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-lg border border-border text-center">
              <div className="text-5xl mb-4">{stat.icon}</div>
              <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground font-semibold">{stat.metric}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
          <ul className="space-y-3 text-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>100% compostable and biodegradable packaging</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>Water-efficient dehydration process with 40% less water usage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>Carbon-neutral shipping with renewable energy</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <span>Support for organic farming communities</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
