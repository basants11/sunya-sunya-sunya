import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Headphones,
  HelpCircle,
  RotateCcw,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import { SunyaBoldText } from "@/components/sunya-bold-text";

// Export enhanced SEO metadata for FAQ page
export const metadata: Metadata = {
  title: "FAQ - Sunya Premium Dehydrated Fruits",
  description: "Find answers to frequently asked questions about Sunya's premium dehydrated fruits, shipping, returns, and more.",
};

export default function FAQPage() {
  const faqSections = [
    {
      icon: Star,
      title: "Our Premium Products",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      questions: [
        {
          question: "What makes Sunya's dehydrated fruits truly premium?",
          answer:
            "At Sunya, we curate only the finest fruits from Nepal's most esteemed orchards, selecting each piece by hand for optimal ripeness and flavor. Our proprietary slow-dehydration process preserves maximum nutrition, vibrant color, and that irresistible crunch that defines luxury snacking. Every batch is limited, ensuring exclusivity and freshness that discerning palates deserve.",
        },
        {
          question: "Are your fruits organic and free from additives?",
          answer:
            "Absolutely. We maintain the purity of nature's bounty with zero additives, preservatives, or artificial enhancements. Our fruits are sourced from certified organic farms and undergo rigorous testing to guarantee they meet the highest standards of natural excellence. What you enjoy is pure, unadulterated fruit in its most refined form.",
        },
        {
          question: "What varieties of premium fruits do you offer?",
          answer:
            "Our collection features exquisite selections including dried kiwi, mango, strawberry, dragon fruit, papaya, pineapple, and an assortment of premium nuts. Each variety is chosen for its unique flavor profile and nutritional benefits, crafted to elevate your healthy lifestyle with unparalleled taste and quality.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Quality Assurance & Trust",
      color: "from-green-500 to-blue-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      questions: [
        {
          question: "How do you ensure consistent quality?",
          answer:
            "Quality is the cornerstone of our brand. Every batch undergoes rigorous laboratory testing for purity, nutritional content, and safety. We maintain ISO 22000 and HACCP certifications, ensuring international standards. Our hand-selection process, combined with state-of-the-art dehydration technology, guarantees that every package meets our uncompromising standards.",
        },
        {
          question: "What certifications does Sunya hold?",
          answer:
            "We proudly hold ISO 22000 for food safety management, HACCP certification for hazard analysis, and organic certification for our sourcing practices. Our export-grade certification ensures that our products meet the stringent requirements of international markets, reflecting our commitment to excellence.",
        },
        {
          question: "Are your products lab-tested?",
          answer:
            "Yes, every production batch undergoes comprehensive laboratory testing. We test for nutritional accuracy, absence of contaminants, moisture content, and microbial safety. These tests ensure that what you receive is not only delicious but also safe and nutritionally optimal.",
        },
      ],
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      questions: [
        {
          question: "How quickly will I receive my order?",
          answer:
            "We understand the anticipation of receiving premium products. Domestic orders within Nepal are delivered within 2-3 business days. International shipping typically takes 7-14 business days depending on the destination. Express shipping options are available for urgent requirements.",
        },
        {
          question: "Do you offer international shipping?",
          answer:
            "Absolutely. We ship our premium dehydrated fruits worldwide. International orders are carefully packaged to ensure they arrive in perfect condition. Shipping costs and delivery times vary by destination, and all applicable customs duties are the responsibility of the recipient.",
        },
        {
          question: "How are products packaged for shipping?",
          answer:
            "Each order is meticulously packaged in our signature luxury boxes, then secured in protective shipping materials. We use airtight, moisture-resistant packaging to preserve freshness during transit. For international orders, we include necessary documentation and ensure compliance with import regulations.",
        },
      ],
    },
    {
      icon: RotateCcw,
      title: "Returns & Satisfaction",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-800",
      questions: [
        {
          question: "What is your satisfaction guarantee?",
          answer:
            "Your satisfaction is our priority. If you're not completely delighted with your purchase, we offer a 100% satisfaction guarantee. Contact us within 7 days of receipt, and we'll make it right—whether that's a replacement, exchange, or refund. We stand behind the quality of every product we create.",
        },
        {
          question: "Can I return or exchange products?",
          answer:
            "Yes, we accept returns and exchanges for unopened products within 14 days of delivery. For quality concerns with opened products, please contact our customer service team immediately. We handle each case with the utmost care and attention to ensure your complete satisfaction.",
        },
        {
          question: "What if my order arrives damaged?",
          answer:
            "In the rare event that your order arrives damaged, please contact us within 48 hours with photos of the damage. We'll promptly send a replacement at no additional cost. Your premium experience is our commitment, and we take every measure to ensure perfect delivery.",
        },
      ],
    },
    {
      icon: Headphones,
      title: "Customer Support",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      questions: [
        {
          question: "How can I contact Sunya support?",
          answer:
            "Our dedicated support team is available via WhatsApp at +977-986-733-3080, email at pokhrelbasant00@gmail.com, or through our website's contact form. We strive to respond to all inquiries within 24 hours, ensuring you receive the attentive service that matches our premium products.",
        },
        {
          question: "Do you offer corporate gifting consultations?",
          answer:
            "Yes, we specialize in creating bespoke corporate gifting solutions. Our team works closely with businesses to design custom gift packages that reflect your brand's values and impress your recipients. Contact us for a personalized consultation and exclusive corporate pricing.",
        },
        {
          question: "Can I customize my order?",
          answer:
            "Absolutely. We offer customization options for bulk orders, corporate gifts, and special occasions. From personalized packaging to custom fruit selections, we work with you to create a truly unique experience. Minimum order quantities may apply for customizations.",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
              <HelpCircle className="w-4 h-4" />
              We&apos;re Here to Help
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Discover everything you need to know about <SunyaBoldText>Sunya&apos;s</SunyaBoldText> premium
              dehydrated fruits, from our meticulous quality standards to our
              dedicated customer service.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}
                >
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {section.questions.map((faq, faqIndex) => (
                  <Card
                    key={faqIndex}
                    className={`${section.bgColor} ${section.borderColor} border-2 p-6 hover:shadow-lg transition-all duration-300`}
                  >
                    <h3
                      className={`text-lg font-bold ${section.textColor} mb-3`}
                    >
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-light text-sm">
                      {faq.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-400 mb-10 font-light">
            Our dedicated support team is here to provide personalized
            assistance and ensure your complete satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-full"
            >
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full"
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
