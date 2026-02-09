"use client"

import { useEffect, useState } from "react"
import type { Currency } from "@/lib/currency"
import { formatPrice } from "@/lib/currency"

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("NRS")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Always use NRS
    setCurrency("NRS")
    setLoading(false)
  }, [])

  return {
    currency,
    loading,
    formatPrice: (price: number) => formatPrice(price, currency)
  }
}
