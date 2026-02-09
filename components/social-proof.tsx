"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { SunyaBoldText } from "@/components/sunya-bold-text";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  image?: string;
  likes: number;
  verified: boolean;
}

export function SocialProof() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      text: "The quality is unmatched. I&apos;ve been buying premium dried fruits for years, and <SunyaBoldText>Sunya</SunyaBoldText> is simply the best. The kiwi has transformed my morning routine!",
      image: "👩‍💼",
      likes: 234,
      verified: true,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      rating: 5,
      text: "Export-grade quality at home. These aren't your average dried fruits. The nutrition profile and taste are exceptional. Worth every rupee!",
      image: "👨‍🔬",
      likes: 189,
      verified: true,
    },
    {
      id: 3,
      name: "Aaisha Malik",
      rating: 5,
      text: "Perfect for my fitness journey. I use the mixed pack daily. No crash, pure energy. The packaging is so luxurious too!",
      image: "💪",
      likes: 267,
      verified: true,
    },
    {
      id: 4,
      name: "Vikram Singh",
      rating: 5,
      text: "Gifted these to my parents. They were amazed by the quality and taste. Now they order regularly!",
      image: "🎁",
      likes: 145,
      verified: true,
    },
  ]);

  const sortedReviews = [...reviews].sort((a, b) => b.likes - a.likes);

  const toggleLike = (id: number) => {
    setReviews(
      reviews.map((r) =>
        r.id === id
          ? { ...r, likes: r.likes + (Math.random() > 0.5 ? 1 : -1) }
          : r,
      ),
    );
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by Customers
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied customers worldwide
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl">
                ⭐
              </span>
            ))}
            <span className="ml-3 font-semibold text-lg">
              4.9/5 (1,200+ reviews)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-4xl">{review.image}</div>
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    {review.verified && (
                      <p className="text-xs text-green-600 font-semibold">
                        ✓ Verified Buyer
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    ⭐
                  </span>
                ))}
              </div>

              <p className="text-foreground mb-4 leading-relaxed">
                {review.text}
              </p>

              <button
                onClick={() => toggleLike(review.id)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {review.likes} found this helpful
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
