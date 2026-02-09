export type Currency = "NRS" | "INR" | "USD"

export interface CurrencyRate {
  symbol: string
  name: string
  rate: number
}

export const CURRENCY_RATES: Record<Currency, CurrencyRate> = {
  NRS: { symbol: "रु", name: "Nepali Rupees", rate: 1 }, // Base currency
  INR: { symbol: "₹", name: "Indian Rupees", rate: 0.78 }, // 1 NRS = 0.78 INR
  USD: { symbol: "$", name: "US Dollars", rate: 0.0075 }, // 1 NRS = 0.0075 USD
}

export function convertPrice(nrsPrice: number, targetCurrency: Currency): number {
  return Math.round(nrsPrice * CURRENCY_RATES[targetCurrency].rate)
}

export function formatPrice(nrsPrice: number, currency: Currency): string {
  const convertedPrice = convertPrice(nrsPrice, currency)
  const rate = CURRENCY_RATES[currency]

  if (currency === "USD") {
    return `$${(convertedPrice / 100).toFixed(2)}`
  }

  return `${rate.symbol}${convertedPrice.toLocaleString("en-IN")}`
}

export function detectCountryFromIP(ipInfo?: any): Currency {
  if (!ipInfo) {
    console.log("[v0] No IP info provided, defaulting to USD")
    return "USD"
  }

  // Try multiple possible country code properties
  const countryCode = (ipInfo.country || ipInfo.country_code || ipInfo.countryCode || "")?.toUpperCase?.()

  console.log("[v0] Detected country code:", countryCode)

  if (!countryCode) {
    console.log("[v0] No country code found, defaulting to USD")
    return "USD"
  }

  switch (countryCode) {
    case "NP": // Nepal returns NRS
      return "NRS"
    case "IN": // India returns INR
      return "INR"
    case "US":
    case "CA":
    case "AU":
    case "GB":
    case "NZ":
    case "IE":
      return "USD"
    default:
      console.log("[v0] Country code not in list, defaulting to USD")
      return "USD"
  }
}
