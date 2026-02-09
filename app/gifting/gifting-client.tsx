"use client"

import VisualCard from "@/components/VisualCard"
import WarmBackground from "@/components/WarmBackground"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCurrency } from "@/lib/hooks/use-currency"
import Image from "next/image"
import { SunyaBoldText } from "@/components/sunya-bold-text"

export default function GiftingPageClient() {
  const { currency } = useCurrency()

  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/mixed-dehydrated-fruits-blend.jpg"
            alt="Decorated gift box with premium dehydrated fruits"
            fill
            className="object-cover"
            priority
            style={{ filter: 'sepia(20%) brightness(0.9) saturate(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soft-ivory/20 via-transparent to-warm-beige/20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h1 className="text-6xl sm:text-7xl font-bold text-foreground text-pretty leading-tight">
              Luxury Gifting for Elite Occasions
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light mt-6">
              Premium dehydrated fruits for those who appreciate refined taste and exclusivity. Discover thoughtful anonymous gift Nepal options for meaningful care.
            </p>
          </div>
        </div>
      </section>

      {/* Why Gift Sunya */}
      <section className="py-24 bg-soft-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-foreground text-center mb-16">Why <SunyaBoldText>Sunya</SunyaBoldText> for Gifting?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VisualCard
              imageSrc="/dried-kiwi-slices-premium.jpg"
              imageAlt="Elegant kiwi slices"
              imagePlacement="top"
              title="Prestige & Elegance"
              className="p-10 text-center space-y-5 bg-white border border-border/30 hover:shadow-lg transition"
            >
              <p className="text-muted-foreground leading-relaxed font-light">
                Hand-selected luxury fruits convey refined taste and sincere appreciation.
              </p>
            </VisualCard>
            <VisualCard
              imageSrc="/dried-strawberry-freeze-dried.jpg"
              imageAlt="Premium strawberries"
              imagePlacement="top"
              title="Memorable Experience"
              className="p-10 text-center space-y-5 bg-white border border-border/30 hover:shadow-lg transition"
            >
              <p className="text-muted-foreground leading-relaxed font-light">
                Unique flavors and premium packaging create lasting impressions.
              </p>
            </VisualCard>
            <VisualCard
              imageSrc="/mixed-nuts-assortment-premium.jpg"
              imageAlt="Assorted nuts"
              imagePlacement="top"
              title="Corporate Excellence"
              className="p-10 text-center space-y-5 bg-white border border-border/30 hover:shadow-lg transition"
            >
              <p className="text-muted-foreground leading-relaxed font-light">
                Perfect for executive gifts, client appreciation, and premium partnerships.
              </p>
            </VisualCard>
          </div>
        </div>
      </section>

      {/* Bulk & Corporate */}
      <WarmBackground className="py-24 relative">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/premium-dry-fruits-nuts-almonds-cashews-healthy-sn.jpg"
            alt="Corporate gifting scene"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12">Corporate & Bulk Solutions</h2>
          <Card className="p-12 bg-white/95 backdrop-blur-sm space-y-8 border border-border/30">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Exclusive Pricing</h3>
              <p className="text-muted-foreground font-light">
                Premium volume discounts for corporate partnerships and bulk luxury gifting.
              </p>
            </div>
            <div className="border-t border-border/30 pt-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Bespoke Branding</h3>
              <p className="text-muted-foreground font-light">
                Personalize gift packaging with your company insignia or custom messaging.
              </p>
            </div>
            <div className="border-t border-border/30 pt-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Flexible Quantities</h3>
              <p className="text-muted-foreground font-light">
                From 10 premium boxes to 1000+. We provide dedicated account management.
              </p>
            </div>
            <div className="border-t border-border/30 pt-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Priority Handling</h3>
              <p className="text-muted-foreground font-light">
                Expedited processing and packaging for time-sensitive corporate events.
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-muted-rose text-luxury-charcoal hover:bg-muted-rose/90 py-4 font-bold text-lg mt-8"
            >
              <a href="https://wa.me/9779867333080" target="_blank" rel="noopener noreferrer">
                Request Corporate Quote
              </a>
            </Button>
          </Card>
        </div>
      </WarmBackground>

    </main>
  )
}
