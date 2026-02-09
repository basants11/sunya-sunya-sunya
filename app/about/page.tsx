import OurTeam from "@/components/our-team";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateAboutMetadata } from "@/lib/seo";
import {
  Award,
  CheckCircle,
  Crown,
  Leaf,
  Shield,
  Star,
  Target,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { SunyaBoldText } from "@/components/sunya-bold-text";

// Export enhanced SEO metadata for about page
export const metadata: Metadata = generateAboutMetadata();

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section with Urgency Banner */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 mb-20">
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full inline-block font-semibold">
              Limited Batches Available - Order Now Before They are Gone!
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent text-pretty leading-tight">
              What Makes <SunyaBoldText>Sunya&apos;s</SunyaBoldText> Fruits Irresistibly Premium?
            </h1>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Taste the passion behind every dehydrated fruit—luxury that feels
              like a guilty pleasure, but it is pure health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-900">
                The Journey That Started It All
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                <p>
                  It began with a simple dream: to bring the world's most
                  exquisite fruits to discerning palates everywhere. As a
                  founder deeply passionate about health and luxury, I traveled
                  across Nepal's fertile valleys, hand-selecting only the
                  ripest, most vibrant fruits from trusted family farms.
                </p>
                <p>
                  Every fruit tells a story of sun-drenched orchards, meticulous
                  care, and the pursuit of perfection. We do not just dehydrate
                  fruits; we capture the essence of nature's finest offerings,
                  preserving their nutrition and flavor through our proprietary
                  slow-dehydration process.
                </p>
                <p>
                  <SunyaBoldText>Sunya</SunyaBoldText> is not merely a brand—it is a commitment to excellence,
                  a celebration of purity, and an invitation to experience
                  snacking at its most refined.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-purple-200 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Crown className="w-24 h-24 text-orange-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-gray-800">
                      Founded on Excellence
                    </p>
                    <p className="text-gray-600 mt-2">
                      Every bite, a testament to quality
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50+", label: "Family Farms", icon: Leaf },
              { number: "12", label: "Premium Varieties", icon: Star },
              { number: "100%", label: "Natural", icon: CheckCircle },
              { number: "25K+", label: "Happy Customers", icon: Users },
            ].map((stat, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg transition-shadow"
              >
                <stat.icon className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-light">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Guided by an unwavering commitment to excellence, we transform
              nature's bounty into extraordinary experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Purity First",
                description:
                  "Zero additives, zero compromises. Only the pure essence of premium fruits.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Shield,
                title: "Trust & Transparency",
                description:
                  "Lab-tested, certified, and completely transparent about our process.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Award,
                title: "Excellence Always",
                description:
                  "Export-grade quality standards that exceed expectations every time.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Leaf,
                title: "Sustainable Future",
                description:
                  "Eco-friendly practices that honor nature and nurture communities.",
                color: "from-purple-500 to-pink-500",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <OurTeam />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-white/90 mb-10 font-light">
            Join thousands of discerning customers who have discovered the art
            of premium dehydrated fruits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full"
            >
              Explore Our Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
