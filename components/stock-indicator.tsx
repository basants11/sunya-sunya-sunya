"use client"

interface StockIndicatorProps {
  stock: number
  maxStock: number
}

export function StockIndicator({ stock, maxStock }: StockIndicatorProps) {
  const percentage = (stock / maxStock) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-muted-foreground">Limited Stock Available</span>
        <span className="text-xs font-bold text-orange-600">{stock} left</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            percentage > 30 ? "bg-green-500" : percentage > 10 ? "bg-yellow-500" : "bg-red-500 animate-pulse"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
