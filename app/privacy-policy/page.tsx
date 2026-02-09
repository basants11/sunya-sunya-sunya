import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Lock, Cookie, UserCheck, Phone, Database, Settings, AlertTriangle } from "lucide-react"
import { SunyaBoldText } from "@/components/sunya-bold-text"

export const metadata: Metadata = {
  title: "Privacy Policy - Premium Protection | Sunya's Commitment to Your Privacy",
  description:
    "Sunya's comprehensive privacy policy outlines our premium standards for protecting your personal information. Learn about our data collection, usage, security measures, and your rights as a valued customer.",
  keywords: "privacy policy sunya, data protection, customer privacy, premium security, GDPR compliance, privacy rights",
  openGraph: {
    title: "Sunya Privacy Policy - Premium Data Protection",
    description: "Discover how Sunya safeguards your privacy with uncompromising standards of excellence.",
    type: "website",
    url: "https://sunya.np/privacy-policy",
  },
  alternates: {
    canonical: "https://sunya.np/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  const privacySections = [
    {
      icon: Database,
      title: "Data Collection",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      content: [
        {
          heading: "Information We Collect",
          text: "At Sunya, we collect only the essential information necessary to provide you with our premium dehydrated fruits and exceptional service. This includes your name, contact details, shipping address, and payment information when you place an order. We may also collect information about your preferences and interactions with our concierge service to enhance your experience."
        },
        {
          heading: "Premium Standards",
          text: "We adhere to the highest standards of data collection, ensuring that every piece of information is handled with the same care and precision we apply to our hand-selected fruits. Our collection practices are transparent, purposeful, and always in service of delivering unparalleled quality to our discerning clientele."
        }
      ]
    },
    {
      icon: Settings,
      title: "Data Usage",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-800",
      content: [
        {
          heading: "Purposeful Utilization",
          text: "Your information is used exclusively to fulfill orders, provide personalized concierge service, and maintain the premium experience you expect from Sunya. We process data to ensure timely delivery of your luxury selections, communicate about order status, and offer tailored recommendations based on your refined tastes."
        },
        {
          heading: "No Compromises",
          text: "We never sell, rent, or share your personal information with third parties for marketing purposes. Your privacy is as sacred to us as the purity of our fruits—zero additives, zero compromises, zero exceptions."
        }
      ]
    },
    {
      icon: Shield,
      title: "Security Measures",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      content: [
        {
          heading: "Fortress-Level Protection",
          text: "Sunya employs enterprise-grade security measures to protect your data, including SSL encryption for all transmissions, secure payment processing through certified gateways, and regular security audits. Our systems are designed to safeguard your information with the same meticulous attention we give to our premium fruit selection process."
        },
        {
          heading: "Continuous Vigilance",
          text: "We maintain constant vigilance over our security infrastructure, implementing the latest protective technologies and conducting regular assessments. Your trust is our most valuable asset, and we treat your data with the reverence it deserves."
        }
      ]
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-800",
      content: [
        {
          heading: "Essential Cookies Only",
          text: "We use minimal, essential cookies to enhance your browsing experience and ensure smooth operation of our premium services. These cookies help us remember your preferences and maintain secure sessions, allowing us to provide the seamless, luxurious experience our clients expect."
        },
        {
          heading: "Transparency First",
          text: "All cookie usage is transparent and purposeful. We do not employ tracking cookies for advertising or third-party analytics. Your privacy remains paramount, with every technological choice made to protect rather than exploit your data."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      content: [
        {
          heading: "Complete Control",
          text: "You have the right to access, update, or delete your personal information at any time. As a valued Sunya customer, you may request data portability, restrict processing, or withdraw consent for specific uses. We honor these rights promptly and professionally."
        },
        {
          heading: "Direct Communication",
          text: "Exercise your rights through our dedicated concierge service. Our team is available 24/7 to assist with privacy requests, ensuring your experience remains as premium as our products. Your control over your data is absolute and respected."
        }
      ]
    },
    {
      icon: Phone,
      title: "Contact Information",
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-800",
      content: [
        {
          heading: "Concierge Service",
          text: "For all privacy-related inquiries, contact our dedicated concierge team at +977 9867 33380 via WhatsApp or email at privacy@sunya.np. Our privacy specialists are trained to handle your concerns with the same level of care and expertise we bring to our fruit curation."
        },
        {
          heading: "Swift Resolution",
          text: "We respond to privacy inquiries within 24 hours, ensuring your concerns are addressed promptly and thoroughly. Your trust and satisfaction are our highest priorities, reflected in every interaction and policy we uphold."
        }
      ]
    }
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full inline-block font-semibold shadow-lg">
              Your Privacy, Our Sacred Trust
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-pretty leading-tight">
              Privacy Policy
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto font-light">
              At <SunyaBoldText>Sunya</SunyaBoldText>, we protect your privacy with the same premium standards we apply to our hand-selected dehydrated fruits—uncompromising excellence, complete transparency, and unwavering trust.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      {privacySections.map((section, sectionIndex) => (
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
                Comprehensive protection and transparency in every aspect of your data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.content.map((item, itemIndex) => (
                <Card key={itemIndex} className={`p-8 bg-white border ${section.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="space-y-6">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-full flex items-center justify-center`}>
                      <Eye className={`w-6 h-6 ${section.textColor}`} />
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
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="bg-white text-blue-600 px-6 py-3 rounded-full inline-block font-bold text-lg shadow-lg">
            Questions About Your Privacy?
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-white text-pretty leading-tight">
            Experience <SunyaBoldText>Sunya&apos;s</SunyaBoldText> Premium Protection
          </h2>
          <p className="text-xl text-white/90 font-light">
            Join thousands who trust <SunyaBoldText>Sunya</SunyaBoldText> not just for our fruits, but for our unwavering commitment to your privacy and security.
          </p>
          <Button
            asChild
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-bold py-7 px-10 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <a href="https://wa.me/977986733380" target="_blank" rel="noopener noreferrer">
              Contact Privacy Concierge
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}