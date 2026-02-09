import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Shield, FileText, AlertTriangle, Scale, Gavel } from "lucide-react"
import { SunyaBoldText } from "@/components/sunya-bold-text"

export const metadata: Metadata = {
  title: "Terms & Conditions - Premium Service Standards | Sunya's Commitment to Excellence",
  description:
    "Sunya's comprehensive terms and conditions outline our premium service standards. Discover the exclusive terms governing our relationship with discerning clients who seek unparalleled quality in dehydrated fruits.",
  keywords: "terms and conditions sunya, premium service standards, exclusive terms, quality assurance, client agreement",
  openGraph: {
    title: "Sunya Terms & Conditions - Premium Service Standards",
    description: "Explore the elegant terms that define our commitment to excellence and mutual respect.",
    type: "website",
    url: "https://sunya.np/terms-and-conditions",
  },
  alternates: {
    canonical: "https://sunya.np/terms-and-conditions",
  },
}

export default function TermsAndConditionsPage() {
  const termsSections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800",
      content: [
        {
          heading: "Elegant Agreement",
          text: "By accessing Sunya's exclusive platform and indulging in our premium dehydrated fruits, you enter into a covenant of mutual respect and appreciation for unparalleled quality. These terms represent our shared commitment to excellence, transparency, and the pursuit of extraordinary experiences."
        },
        {
          heading: "Premium Standards Acknowledged",
          text: "Your acceptance signifies recognition of Sunya's bespoke service standards, where every interaction is crafted with the same meticulous care as our hand-selected fruits. We invite you to join our community of discerning connoisseurs who value authenticity, quality, and refined taste."
        }
      ]
    },
    {
      icon: Users,
      title: "Use of Service",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      textColor: "text-teal-800",
      content: [
        {
          heading: "Exclusive Access",
          text: "Sunya's services are reserved for those who appreciate the artistry of premium dehydration. Our platform provides access to exquisite selections, personalized concierge guidance, and an elevated shopping experience designed for the most discerning palates."
        },
        {
          heading: "Respectful Engagement",
          text: "We expect our valued clients to engage with our services in a manner that upholds the dignity and exclusivity of our offerings. Any misuse diminishes the experience for all, and we reserve the right to curate our community accordingly."
        }
      ]
    },
    {
      icon: Shield,
      title: "User Accounts",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      textColor: "text-cyan-800",
      content: [
        {
          heading: "Personalized Profiles",
          text: "Your Sunya account is a gateway to a world of premium possibilities. We collect essential information to tailor our services to your refined preferences, ensuring every recommendation and interaction reflects your unique tastes."
        },
        {
          heading: "Security & Exclusivity",
          text: "Account security is paramount in maintaining the trust of our elite clientele. We employ fortress-level protections and expect our clients to safeguard their credentials with the same vigilance we apply to our fruit selection process."
        }
      ]
    },
    {
      icon: FileText,
      title: "Intellectual Property",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      content: [
        {
          heading: "Protected Excellence",
          text: "Sunya's brand, proprietary dehydration techniques, and curated content represent years of dedication to perfection. These intellectual treasures are safeguarded to preserve the exclusivity and value we offer our discerning clients."
        },
        {
          heading: "Respect for Creation",
          text: "We invite you to appreciate and share our offerings, but request that you honor the intellectual property that makes Sunya's premium experience possible. Your respect for our creations enhances the collective enjoyment of our community."
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: "Liability Limitations",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-800",
      content: [
        {
          heading: "Reasonable Boundaries",
          text: "While Sunya strives for perfection in every aspect of our service, we acknowledge the complexities of premium commerce. Our liability is limited to reflect the shared understanding that absolute guarantees are as rare as our most exquisite fruits."
        },
        {
          heading: "Mutual Understanding",
          text: "These limitations are crafted with transparency and fairness, ensuring that our relationship remains one of trust and mutual benefit. We invite open dialogue should any concerns arise regarding our premium standards."
        }
      ]
    },
    {
      icon: Scale,
      title: "Indemnification",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      content: [
        {
          heading: "Shared Responsibility",
          text: "In the spirit of mutual respect, clients agree to indemnify Sunya against claims arising from their use of our services. This provision ensures that our focus remains on delivering unparalleled quality rather than external disputes."
        },
        {
          heading: "Harmonious Resolution",
          text: "We approach indemnification as an opportunity for dialogue and understanding, preferring amicable resolutions that preserve the elegance of our client relationships."
        }
      ]
    },
    {
      icon: Gavel,
      title: "Governing Law",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-800",
      content: [
        {
          heading: "Jurisdictional Harmony",
          text: "These terms are governed by the laws of Nepal, reflecting our roots in a land of natural abundance and cultural richness. This jurisdiction ensures consistency with our commitment to authenticity and quality."
        },
        {
          heading: "Arbitration Preference",
          text: "In the rare event of disputes, we favor arbitration as a dignified method of resolution, preserving privacy and focusing on equitable outcomes that honor our shared values of excellence and respect."
        }
      ]
    }
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full inline-block font-semibold shadow-lg">
              Terms of Mutual Respect & Excellence
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-pretty leading-tight">
              Terms & Conditions
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto font-light">
              <SunyaBoldText>Sunya&apos;s</SunyaBoldText> terms embody our unwavering commitment to premium service standards, fostering a relationship built on trust, exclusivity, and the shared pursuit of extraordinary quality in every dehydrated fruit experience.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      {termsSections.map((section, sectionIndex) => (
        <section key={sectionIndex} className={`py-24 ${section.bgColor}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className={`w-20 h-20 ${section.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 border-2 ${section.borderColor}`}>
                <section.icon className={`w-10 h-10 ${section.textColor}`} />
              </div>
              <h2 className={`text-5xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent mb-4`}>
                {section.title}
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Defining the foundations of our premium partnership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.content.map((item, itemIndex) => (
                <Card key={itemIndex} className={`p-8 bg-white border ${section.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="space-y-6">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-full flex items-center justify-center`}>
                      <CheckCircle className={`w-6 h-6 ${section.textColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {item.heading}
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-light">
                      {item.text}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="bg-white text-emerald-600 px-6 py-3 rounded-full inline-block font-bold text-lg shadow-lg">
            Questions About Our Terms?
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-white text-pretty leading-tight">
            Experience <SunyaBoldText>Sunya&apos;s</SunyaBoldText> Premium Standards
          </h2>
          <p className="text-xl text-white/90 font-light">
            Join our community of discerning clients who appreciate the elegance of clear, respectful agreements that enhance rather than complicate the pursuit of quality.
          </p>
          <Button
            asChild
            className="bg-white text-emerald-600 hover:bg-gray-100 text-lg font-bold py-7 px-10 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <a href="https://wa.me/977986733380" target="_blank" rel="noopener noreferrer">
              Contact Our Concierge
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}