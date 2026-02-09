import type { Metadata } from "next"
import { Crown, DollarSign, Award, Megaphone, Package, Headphones } from "lucide-react"
import { generateRetailerMetadata } from "@/lib/seo"
import { SunyaBoldText } from "@/components/sunya-bold-text"

// Export enhanced SEO metadata for retailer page
export const metadata: Metadata = generateRetailerMetadata()

export default function RetailerPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-orange-500" />
              <span className="font-bold text-xl"><SunyaBoldText>Sunya</SunyaBoldText> for Retailers</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/9779867333080"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Award className="w-4 h-4" />
              B2B Partnership Program
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Partner with Nepal&apos;s Finest
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Join our exclusive retailer network and offer your customers premium dehydrated fruits with exceptional margins and complete support.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Partner with <SunyaBoldText>Sunya</SunyaBoldText>?</h2>
            <p className="text-gray-600 font-light">Comprehensive support for your business success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Competitive Margins",
                description: "Attractive wholesale pricing with margins up to 40%. Volume-based discounts for larger orders.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Package,
                title: "Premium Packaging",
                description: "Luxury retail-ready packaging that attracts customers and commands premium pricing.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Megaphone,
                title: "Marketing Support",
                description: "Access to professional product photography, marketing materials, and co-branding opportunities.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Award,
                title: "Exclusive Territory",
                description: "Protected territories ensure you face no competition from other <SunyaBoldText>Sunya</SunyaBoldText> retailers in your area.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Headphones,
                title: "Dedicated Support",
                description: "Personal account manager and priority customer service for all your business needs.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Crown,
                title: "Brand Prestige",
                description: "Associate your business with Nepal's most premium dehydrated fruit brand.",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Partnership Requirements</h2>
              <p className="text-gray-400 mb-8 font-light">
                We seek passionate retailers who share our commitment to quality and customer satisfaction.
              </p>
              <ul className="space-y-4">
                {[
                  "Valid business registration and tax ID",
                  "Retail storefront or established online presence",
                  "Minimum initial order: NPR 50,000",
                  "Commitment to brand standards and quality",
                  "Excellent customer service track record",
                ].map((requirement, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-green-400" />
                    </div>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Ready to Get Started?</h3>
              <p className="text-gray-400 mb-8 font-light">
                Apply now and our partnership team will contact you within 24 hours to discuss opportunities.
              </p>
              <div className="space-y-4">
                <a
                  href="https://wa.me/9779867333080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-colors"
                >
                  Apply via WhatsApp
                </a>
                <a
                  href="mailto:pokhrelbasant00@gmail.com"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-semibold transition-colors"
                >
                  Apply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
