import type { Metadata } from "next"
import { EnhancedNutritionPanel } from "@/components/enhanced-nutrition-panel"
import { generateNutritionMetadata } from "@/lib/seo"

// Export enhanced SEO metadata for nutrition page
export const metadata: Metadata = generateNutritionMetadata()

export default function NutritionPage() {
  return (
    <main className="min-h-screen">
      <EnhancedNutritionPanel />
    </main>
  )
}
