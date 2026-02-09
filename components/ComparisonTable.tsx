import React from 'react'
import {
  BadgeDollarSign,
  Cookie,
  HeartPulse,
  Leaf,
  Package,
  Recycle,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ComparisonAspect = {
  key:
    | 'nutritional-value'
    | 'health-benefits'
    | 'ingredients'
    | 'taste'
    | 'price'
    | 'environmental-impact'
  title: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  healthy: string[]
  junk: string[]
}

const ASPECTS: ComparisonAspect[] = [
  {
    key: 'nutritional-value',
    title: 'Nutritional value',
    Icon: Sparkles,
    healthy: ['Vitamins, minerals, and fiber', 'Steadier energy support'],
    junk: ['Empty calories + added sugar/fats', 'Quick spikes, low nutrients'],
  },
  {
    key: 'health-benefits',
    title: 'Health benefits',
    Icon: HeartPulse,
    healthy: ['Supports immunity and digestion', 'Sustained energy (fewer crashes)'],
    junk: ['Risk builds over time (weight, heart, sugar)', 'Can leave you sluggish'],
  },
  {
    key: 'ingredients',
    title: 'Ingredients',
    Icon: Package,
    healthy: ['Whole foods (fruits, nuts, veggies)', 'Minimal processing, fewer additives'],
    junk: ['Ultra-processed + preservatives', 'Hidden sugars/syrups are common'],
  },
  {
    key: 'taste',
    title: 'Taste',
    Icon: Cookie,
    healthy: ['Naturally sweet/savory flavors', 'Satisfying without guilt'],
    junk: ['Intense salt/sweet can trigger cravings', 'Short-lived satisfaction'],
  },
  {
    key: 'price',
    title: 'Price',
    Icon: BadgeDollarSign,
    healthy: ['Better value per nutrient', 'Invests in long-term wellbeing'],
    junk: ['Cheaper now, long-term costs later', 'Health expenses add up'],
  },
  {
    key: 'environmental-impact',
    title: 'Environmental impact',
    Icon: Recycle,
    healthy: ['Often lower waste and simpler sourcing', 'Supports more sustainable practices'],
    junk: ['More packaging and waste', 'Higher footprint from industrial supply chains'],
  },
]

function AspectList({
  kind,
}: {
  kind: 'healthy' | 'junk'
}) {
  const isHealthy = kind === 'healthy'

  return (
    <ul className="space-y-3">
      {ASPECTS.map(({ key, title, Icon, healthy, junk }) => {
        const bullets = isHealthy ? healthy : junk

        return (
          <li
            key={key}
            className={
              isHealthy
                ? 'rounded-lg border border-emerald-200/70 bg-emerald-50/50 p-4'
                : 'rounded-lg border border-amber-200/70 bg-amber-50/50 p-4'
            }
          >
            <div className="flex items-start gap-3">
              <div
                className={
                  isHealthy
                    ? 'mt-0.5 flex size-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-800'
                    : 'mt-0.5 flex size-9 items-center justify-center rounded-md bg-amber-100 text-amber-900'
                }
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-700">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span
                        className={
                          isHealthy
                            ? 'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800'
                            : 'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-900'
                        }
                        aria-hidden="true"
                      >
                        {isHealthy ? (
                          <span className="text-[12px] leading-none">✓</span>
                        ) : (
                          <span className="text-[12px] leading-none">!</span>
                        )}
                      </span>
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const ComparisonTable: React.FC = () => {
  return (
    <section
      aria-labelledby="comparison-title"
      className="bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="comparison-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Choose Healthy Snacks Over Junk Food?
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Quick comparison—same cravings, very different outcomes.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="relative overflow-hidden border-emerald-200/70 bg-white">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400/70 via-emerald-300/60 to-emerald-200/40"
              aria-hidden="true"
            />
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                      <Leaf className="size-5" aria-hidden="true" />
                    </span>
                    <span>Healthy snack</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Nutrient-dense, calmer energy, and fewer regrets.
                  </CardDescription>
                </div>
                <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 sm:block">
                  Recommended
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AspectList kind="healthy" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-amber-200/70 bg-white">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400/60 via-amber-300/50 to-amber-200/40"
              aria-hidden="true"
            />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
                  <TriangleAlert className="size-5" aria-hidden="true" />
                </span>
                <span>Junk food</span>
              </CardTitle>
              <CardDescription className="mt-1">
                Convenient now—long-term costs can quietly add up.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AspectList kind="junk" />
              <p className="mt-4 text-xs text-slate-600">
                <span className="font-medium text-slate-800">Loss aversion note:</span> risks often build
                gradually—your future energy, mood, and health are the real price.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ComparisonTable
