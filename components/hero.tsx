import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <p className="text-primary font-semibold text-sm uppercase tracking-wide">
              Premium Dehydrated Fruits
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Natural Goodness, <span className="text-primary">Preserved.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hand-selected, slow-dehydrated fruits from Nepal. No added sugar,
              no preservatives — just pure, natural flavor in every bite.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-md bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-md"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            <div className="flex gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Natural</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Additives</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">Export</p>
                <p className="text-sm text-muted-foreground">Quality</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-80 sm:h-96 lg:h-[500px]">
            {/* Shadow backdrop for depth effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 via-orange-500/10 to-transparent blur-3xl -z-10 scale-105" />
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-orange-500/30 via-primary/20 to-transparent blur-2xl -z-10 opacity-60" />
            
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-lkQjeS5tWlemPEp4dkudYH5274dNKj.jpg"
              alt="Premium dehydrated fruits collection in professional dehydrator"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
