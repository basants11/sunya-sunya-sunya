import { generateSubscriptionMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import SubscriptionPageClient from "./subscription-client";

// Export enhanced SEO metadata for subscription page
export const metadata: Metadata = generateSubscriptionMetadata();

export default function SubscriptionPage() {
  return <SubscriptionPageClient />;
}
