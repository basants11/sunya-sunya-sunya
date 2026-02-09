"use client"

import PricingComparisonTable from "@/components/PricingComparisonTable"
import { useCurrency } from "@/lib/hooks/use-currency"
import { SunyaBoldText } from "@/components/sunya-bold-text"

export default function SubscriptionPageClient() {
  const { currency } = useCurrency()

  const plans = [
    {
      name: "Starter",
      nrsPrice: 2199,
      duration: "monthly",
      description: "Perfect for personal use",
      features: [
        "1 premium fruit variety (250g)",
        "Monthly delivery",
        "10% subscriber discount",
        "Exclusive access to new batches",
        "Free WhatsApp support",
      ],
      cta: "Start Subscription",
    },
    {
      name: "Premium",
      nrsPrice: 5299,
      duration: "monthly",
      description: "For refined fruit enthusiasts",
      features: [
        "3 premium fruit varieties (250g each)",
        "Monthly delivery",
        "20% subscriber discount",
        "Early access to limited batches",
        "Priority WhatsApp support",
        "Curated seasonal selections",
      ],
      cta: "Start Subscription",
      highlighted: true,
    },
    {
      name: "Elite",
      nrsPrice: 9999,
      duration: "monthly",
      description: "The ultimate luxury experience",
      features: [
        "6 premium fruit varieties (250g each)",
        "Monthly delivery",
        "30% subscriber discount",
        "First access to ultra-rare batches",
        "Dedicated WhatsApp concierge",
        "Custom selections available",
        "Luxury gift wrapping included",
      ],
      cta: "Start Subscription",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "<SunyaBoldText>Sunya</SunyaBoldText> Premium Subscription Plans",
            description: "Monthly subscription service for premium dehydrated fruits with exclusive discounts",
            offers: plans.map((plan) => ({
              "@type": "Offer",
              name: plan.name,
              price: plan.nrsPrice.toString(),
              priceCurrency: "NPR",
              description: plan.description,
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-border">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Premium Fruit Delivered Monthly
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Subscribe to receive hand-selected dehydrated fruits at your doorstep every month
          </p>
          <p className="text-sm text-muted-foreground">Exclusive subscriber discounts up to 30% | Cancel anytime</p>
        </div>
      </section>

      {/* Plans */}
      <PricingComparisonTable />

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto border-t border-border pt-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Subscription FAQs</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I pause or cancel my subscription?",
                  a: "Yes, absolutely. You can pause for up to 3 months or cancel anytime with no penalties. Just message us on WhatsApp.",
                },
                {
                  q: "What if I don't like a particular fruit in my box?",
                  a: "We offer substitutions for any fruit. Let us know your preferences, and we'll customize future boxes.",
                },
                {
                  q: "How are subscriptions delivered?",
                  a: "Subscriptions are delivered via registered courier. Delivery is free within Kathmandu and standard rates apply elsewhere.",
                },
                {
                  q: "Do subscriptions have expiration dates?",
                  a: "No. Your subscription is active as long as you maintain it. You can skip months or adjust your plan anytime.",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Subscribe?</h3>
            <p className="text-muted-foreground mb-6">
              Message us on WhatsApp to set up your subscription or answer any questions
            </p>
            <a
              href="https://wa.me/977986733380?text=Hi%20SUNYA%2C%20I%20want%20to%20subscribe%20to%20premium%20dehydrated%20fruits"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block cta-button text-primary-foreground font-semibold px-8 py-3 rounded-lg"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
