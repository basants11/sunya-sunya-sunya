import type { Metadata } from "next"
import { HealthQuizClient } from "./health-quiz-client"

export const metadata: Metadata = {
  title: "Sunya Health Quiz - Personalized Fruit Recommendations",
  description:
    "Take our AI-powered health quiz to discover your personalized Sunya fruit recommendations based on your wellness goals.",
  openGraph: {
    title: "Sunya Health Quiz",
    description: "Discover your perfect fruit match with our personalized health quiz",
  },
}

export default function HealthQuizPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <HealthQuizClient />
    </main>
  )
}
