"use client";

import Image from "next/image";
import Link from "next/link";

import { PriceDisplay } from "@/components/price-display";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  nrsPrice: number;
  description: string;
  features: string[];
  image: string;
  badge: string;
}

interface ProductIconProps {
  product: Product;
}

export function ProductIcon({ product }: ProductIconProps) {
  return (
    <Link
      href="/products"
      aria-label={`View ${product.name} details`}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/55 bg-card/90 shadow-[0_1px_1px_rgba(0,0,0,0.04)] transition-[transform,border-color,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-border/80 group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_10px_26px_-22px_rgba(17,24,39,0.35)] motion-reduce:transition-none motion-reduce:transform-none">
        <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden bg-muted/25 ring-1 ring-inset ring-border/30">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={`${product.name} - Premium Dehydrated Fruit, Healthy Snack from Nepal`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-background/0 to-background/0" />

          {product.badge ? (
            <div className="absolute left-3 top-3 rounded-full border border-border/50 bg-background/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-foreground shadow-sm backdrop-blur-sm">
              {product.badge}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <header className="space-y-1">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight leading-snug text-foreground">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              <span className="sr-only">Price: </span>
              <span className="font-semibold text-foreground">
                <PriceDisplay nrsPrice={product.nrsPrice} />
              </span>
            </p>
          </header>

          <div className="mt-auto pt-1 hidden">
            <span
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "w-full justify-center rounded-lg h-10 px-4 select-none",
                "transition-transform duration-200 group-hover:translate-y-[-1px] active:translate-y-0",
                "motion-reduce:transition-none motion-reduce:transform-none",
              )}
            >
              Explore product
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
