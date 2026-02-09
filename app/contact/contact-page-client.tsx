"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SunyaColoredText } from "@/components/sunya-colored-text"
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import type React from "react"
import { useState } from "react"

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({
      name: "",
      email: "",
      phone: "",
      inquiry: "",
    })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <main>
      {/* Hero */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-6xl sm:text-7xl font-bold text-foreground text-pretty leading-tight">
            <SunyaColoredText size="7xl" />
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            WhatsApp for fastest response. We're here for your premium selections and inquiries.
          </p>
        </div>
      </section>

      {/* Primary CTA - WhatsApp */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-bold text-primary-foreground">Order via WhatsApp (Fastest)</h2>
          <p className="text-lg text-primary-foreground/90 font-light">
            Direct access to our team. Order, inquire, or discuss bulk purchases instantly.
          </p>
          <Button
            asChild
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xl font-bold py-8 px-10"
          >
            <a href="https://wa.me/9779867333080?text=Hello%20Basant" target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp: +977986733080
            </a>
          </Button>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="p-10 text-center space-y-4 bg-white border border-border/30 hover:shadow-lg transition">
              <MessageCircle className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-bold text-foreground text-lg">WhatsApp</h3>
              <a
                href="https://wa.me/9779867333080?text=Hello%20Basant"
                className="text-primary hover:text-primary/80 transition font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                +977-986-733-080
              </a>
              <p className="text-xs text-muted-foreground font-light">Fastest response</p>
            </Card>

            <Card className="p-10 text-center space-y-4 bg-white border border-border/30 hover:shadow-lg transition">
              <Phone className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-bold text-foreground text-lg">Phone</h3>
              <a href="tel:+977986733380" className="text-primary hover:text-primary/80 transition font-semibold">
                +977-986-733-080
              </a>
              <p className="text-xs text-muted-foreground font-light">9 AM - 6 PM</p>
            </Card>

            <Card className="p-10 text-center space-y-4 bg-white border border-border/30 hover:shadow-lg transition">
              <Mail className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-bold text-foreground text-lg">Email</h3>
              <a href="mailto:pokhrelbasant00@gmail.com" className="text-primary hover:text-primary/80 transition font-semibold">
                pokhrelbasant00@gmail.com
              </a>
              <p className="text-xs text-muted-foreground font-light">24-hour response</p>
            </Card>

            <Card className="p-10 text-center space-y-4 bg-white border border-border/30 hover:shadow-lg transition">
              <MapPin className="w-12 h-12 text-primary mx-auto" />
              <h3 className="font-bold text-foreground text-lg">Location</h3>
              <p className="text-primary font-semibold">Kathmandu, Nepal</p>
              <p className="text-xs text-muted-foreground font-light">Delivery nationwide</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <h2 className="text-5xl font-bold text-foreground text-center">General Inquiry</h2>
            <Card className="p-12 bg-white border border-border/30">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full border-2 border-border/30 py-3"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="border-2 border-border/30 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+9779867333080"
                      required
                      className="border-2 border-border/30 py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-border/30 rounded-lg bg-white text-foreground font-medium"
                  >
                    <option value="">Select inquiry type...</option>
                    <option value="product-info">Product Information</option>
                    <option value="bulk-order">Bulk Order Inquiry</option>
                    <option value="corporate-gift">Corporate Gifting</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full cta-button text-primary-foreground py-4 font-bold text-lg"
                >
                  {submitted ? "Inquiry Submitted!" : "Submit Inquiry"}
                </Button>

                {submitted && (
                  <p className="text-center text-primary font-semibold">
                    Thank you! We'll respond within 2-4 hours via WhatsApp or email.
                  </p>
                )}
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ & Info */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-foreground text-center mb-16">Delivery & Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-10 bg-white border border-border/30 space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Premium Delivery</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Orders processed within 24 hours. Nationwide delivery within 3-5 business days with premium packaging.
              </p>
            </Card>
            <Card className="p-10 bg-white border border-border/30 space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Bulk & Corporate Orders</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Special pricing available. Contact us via WhatsApp for custom quotes on bulk purchases and corporate
                gifting.
              </p>
            </Card>
            <Card className="p-10 bg-white border border-border/30 space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Payment Methods</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Cash on Delivery (COD) | Bank Transfer | Mobile Wallets (esewa, ime-pay, khalti)
              </p>
            </Card>
            <Card className="p-10 bg-white border border-border/30 space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Storage & Shelf Life</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Store in cool, dry place. Once opened, consume within 2 weeks for optimal freshness and nutrition.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-primary/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-10">
            <h2 className="text-3xl font-bold text-foreground">Verified Excellence</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="p-8 border-2 border-primary/20 bg-white">
                <p className="font-bold text-foreground mb-2">DFTQC Approved</p>
                <p className="text-sm text-muted-foreground font-light">Certified food quality</p>
              </Card>
              <Card className="p-8 border-2 border-primary/20 bg-white">
                <p className="font-bold text-foreground mb-2">Lab Tested</p>
                <p className="text-sm text-muted-foreground font-light">100% purity assured</p>
              </Card>
              <Card className="p-8 border-2 border-primary/20 bg-white">
                <p className="font-bold text-foreground mb-2">Export Grade</p>
                <p className="text-sm text-muted-foreground font-light">International standards</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
