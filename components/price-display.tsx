"use client"

import { useCurrency } from "@/lib/hooks/use-currency"
import { formatPrice } from "@/lib/currency"

interface PriceDisplayProps {
  nrsPrice: number
  className?: string
}

export function PriceDisplay({ nrsPrice, className = "" }: PriceDisplayProps) {
  const { currency, loading } = useCurrency()

  if (loading) {
    return <span className={className}>रु{nrsPrice.toLocaleString()}</span>
  }

  return <span className={className}>{formatPrice(nrsPrice, currency)}</span>
}
