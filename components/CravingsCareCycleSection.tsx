"use client"

import { useState } from "react"
import EnhancedCalendarPicker from "./EnhancedCalendarPicker"
import GiftBoxCard from "./GiftBoxCard"
import WarmBackground from "./WarmBackground"

export default function CravingsCareCycleSection() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  const giftBoxes = [
    {
      id: 'energy-vitality',
      title: 'Energy & Vitality',
      description: 'Energizing fruits to boost vitality during your cycle',
      themeColor: 'vibrant-orange',
      illustration: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-vibrant-orange">
          <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.3"/>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'calm-comfort',
      title: 'Calm & Comfort',
      description: 'Soothing selections for peaceful comfort and relaxation',
      themeColor: 'soft-lavender',
      illustration: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-soft-lavender">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor" opacity="0.3"/>
          <path d="M12 8C15.3 8 18 10.7 18 14C18 17.3 15.3 20 12 20C8.7 20 6 17.3 6 14C6 10.7 8.7 8 12 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M9 14L11 16L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'luxury-indulgence',
      title: 'Luxury Indulgence',
      description: 'Premium indulgence with the finest artisanal treats',
      themeColor: 'deep-burgundy',
      illustration: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-deep-burgundy">
          <path d="M12 2L15 8L21 9L16 14L17.5 20L12 17L6.5 20L8 14L3 9L9 8L12 2Z" fill="currentColor"/>
        </svg>
      )
    }
  ]

  return (
    <WarmBackground className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mb-16">
          <h2 className="text-5xl font-bold text-foreground">Cravings & Care Cycle™</h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light">A quiet act of kindness, wrapped in care.</p>
          <p className="text-lg text-muted-foreground">Care doesn't always need a name.</p>
        </div>

        {/* Gift Box Selection */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Choose Your Care Gift</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {giftBoxes.map((box) => (
              <GiftBoxCard
                key={box.id}
                id={box.id}
                title={box.title}
                description={box.description}
                themeColor={box.themeColor}
                illustration={box.illustration}
                isSelected={selectedBox === box.id}
                onSelect={setSelectedBox}
              />
            ))}
          </div>
        </div>

        {/* Menstruation Days Selection */}
        {selectedBox && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-8">Select Menstruation Days</h3>
            <p className="text-center text-muted-foreground mb-8">Choose up to 3 days per month that typically align with your cycle</p>
            <EnhancedCalendarPicker
              selectedDates={selectedDates}
              onDatesSelect={setSelectedDates}
              maxSelections={3}
            />
            {selectedDates.length > 0 && (
              <div className="mt-6 p-4 bg-muted-rose/20 rounded-lg">
                <h4 className="font-semibold mb-2">Selected Days:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((date, index) => (
                    <span key={index} className="px-3 py-1 bg-muted-rose text-luxury-charcoal rounded-full text-sm">
                      {date.toLocaleDateString()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </WarmBackground>
  )
}