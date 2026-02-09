import { generateGiftingMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import GiftingPageClient from "./gifting-client";

// Export enhanced SEO metadata for gifting page
export const metadata: Metadata = generateGiftingMetadata();

export default function GiftingPage() {
  return <GiftingPageClient />;
}
