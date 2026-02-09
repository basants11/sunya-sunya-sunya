import { Card } from "@/components/ui/card"
import { Leaf, Heart, Truck, Shield } from "lucide-react"

const benefits = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "No artificial additives, preservatives, or chemicals. Pure nature in every bite.",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Rich in antioxidants, vitamins, and minerals to support your wellness journey.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Fresh products delivered to your doorstep within 48 hours across Nepal.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Tested and certified by international quality standards. Taste the difference.",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-pretty">Why Choose Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to bringing you the finest quality dry fruits with unmatched care and service.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
