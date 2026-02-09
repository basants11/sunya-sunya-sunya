"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import type React from "react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Mail className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-primary-foreground/80 mb-6">
            Get exclusive offers and health tips delivered to your inbox.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 flex-1"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              className="whitespace-nowrap"
            >
              {subscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>

          {subscribed && (
            <p className="text-sm text-primary-foreground/80 mt-4">
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
