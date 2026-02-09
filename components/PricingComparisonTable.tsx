import { Button } from '@/components/ui/button'
import { Check, Star } from 'lucide-react'
import React from 'react'

type Plan = {
  id: 'basic' | 'premium' | 'vip'
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  ctaText: string
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹499',
    period: '/month',
    description: 'Perfect for individuals starting their healthy snacking journey',
    features: [
      '5 premium snacks per month',
      'Basic nutrition tracking',
      'Email support',
      'Monthly health tips',
      'Standard delivery',
    ],
    ctaText: 'Get Started',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹999',
    period: '/month',
    description: 'Most popular choice for health-conscious individuals',
    features: [
      '10 premium snacks per month',
      'Advanced nutrition analytics',
      'Priority support',
      'Weekly health insights',
      'Express delivery',
      'Personalized recommendations',
      'Recipe suggestions',
    ],
    popular: true,
    ctaText: 'Get Started',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '₹1,999',
    period: '/month',
    description: 'Ultimate experience with exclusive benefits',
    features: [
      '20 premium snacks per month',
      'Full nutrition dashboard',
      '24/7 dedicated support',
      'Daily health insights',
      'Same-day delivery',
      'Personalized meal plans',
      'Exclusive recipes',
      'Priority access to new products',
      'VIP-only discounts',
    ],
    ctaText: 'Get Started',
  },
]

const PricingComparisonTable: React.FC = () => {
  return (
    <section
      aria-labelledby="pricing-title"
      className="bg-gradient-to-b from-amber-50 to-orange-50 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="pricing-title"
            className="text-4xl font-bold text-slate-900 sm:text-5xl"
          >
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Select the perfect plan for your healthy snacking journey
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-amber-500 ring-4 ring-amber-200'
                  : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-amber-500 to-orange-500 py-2 text-center">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    <Star className="size-4 fill-white" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-600">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="size-3.5" aria-hidden="true" />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-8 w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                  size="lg"
                >
                  {plan.ctaText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingComparisonTable
