import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { CheckCircle, Leaf, Award, Crown, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateWhyUsMetadata } from "@/lib/seo"
import { SunyaBoldText } from "@/components/sunya-bold-text"

// Export enhanced SEO metadata for why-us page
export const metadata: Metadata = generateWhyUsMetadata()

export default function WhyUsPage() {
  const features = [
    {
      icon: Crown,
      title: "Luxury Positioning",
      description:
        "Crafted exclusively for discerning palates who value rarity, purity, and prestige. Every bite reflects our commitment to excellence.",
    },
    {
      icon: Leaf,
      title: "Slow Dehydration Mastery",
      description:
        "Our proprietary process preserves maximum nutrition, natural flavor, and vibrant aesthetics. No shortcuts, only perfection.",
    },
    {
      icon: Award,
      title: "Export-Grade Certification",
      description:
        "Hand-selected premium fruits meeting international quality standards. Trusted by global markets for uncompromising excellence.",
    },
    {
      icon: Shield,
      title: "Verified Purity",
      description:
        "Lab-tested, certified, and transparent. Zero additives, zero preservatives. Pure fruit goodness in its most refined form.",
    },
  ]

  const certifications = [
    { name: "ISO 22000", description: "Food Safety Management" },
    { name: "HACCP", description: "Hazard Analysis Certified" },
    { name: "Organic", description: "Natural & Chemical-Free" },
    { name: "Export Quality", description: "International Standards" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Award className="w-4 h-4" />
              Export-Grade Certified
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Why <SunyaBoldText>Sunya</SunyaBoldText> Stands Apart
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Discover the uncompromising standards and meticulous craftsmanship that define every <SunyaBoldText>Sunya</SunyaBoldText> creation.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 group border-0 shadow-lg bg-white/80 backdrop-blur"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Certified Excellence</h2>
            <p className="text-gray-400 font-light">International standards, local craftsmanship</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/20 transition-colors"
              >
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{cert.name}</h3>
                <p className="text-gray-400 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our 5-Step Excellence Process</h2>
            <p className="text-gray-600 font-light">From orchard to your doorstep, perfection at every step</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "01", title: "Select", desc: "Hand-picked premium fruits" },
              { step: "02", title: "Inspect", desc: "Rigorous quality checks" },
              { step: "03", title: "Prepare", desc: "Gentle washing & slicing" },
              { step: "04", title: "Dehydrate", desc: "Slow, low-temp process" },
              { step: "05", title: "Package", desc: "Airtight luxury packaging" },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Experience the <SunyaBoldText>Sunya</SunyaBoldText> Difference</h2>
          <p className="text-xl text-white/90 mb-10 font-light">
            Join thousands who have elevated their snacking experience with Nepal&apos;s finest dehydrated fruits.
          </p>
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-6 text-lg font-semibold rounded-full shadow-xl"
          >
            Shop Premium Collection
          </Button>
        </div>
      </section>
    </main>
  )
}
