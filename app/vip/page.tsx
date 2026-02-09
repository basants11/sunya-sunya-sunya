import type { Metadata } from "next"
import { VIPClient } from "./vip-client"
import { generateVIPMetadata } from "@/lib/seo"

// Export enhanced SEO metadata for VIP page
export const metadata: Metadata = generateVIPMetadata()

export default function VIPPage() {
  return (
    <main className="min-h-screen">
      <VIPClient />
    </main>
  )
}
