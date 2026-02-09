"use client"

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GiftBox {
  id: string
  title: string
  description: string
  themeColor: string
  illustration: ReactNode
  price: string
  tooltip: string
  isMostLoved?: boolean
}

interface HeaderGiftBoxesProps {
  onClick: (boxId: string) => void
}

const giftBoxes: GiftBox[] = [
  {
    id: 'energy-vitality',
    title: 'Energy & Vitality',
    description: 'Energizing fruits to boost vitality during your cycle',
    themeColor: 'vibrant-orange',
    illustration: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M24 4v8M24 36v8M4 24h8M36 24h8M8.5 8.5l5.7 5.7M33.8 33.8l5.7 5.7M8.5 39.5l5.7-5.7M33.8 14.2l5.7-5.7" stroke="currentColor" strokeWidth="2"/>
        <circle cx="24" cy="24" r="8" fill="currentColor"/>
      </svg>
    ),
    price: '$49.99',
    tooltip: 'A surprise gift for your care.'
  },
  {
    id: 'calm-comfort',
    title: 'Calm & Comfort',
    description: 'Soothing selections for peaceful comfort and relaxation',
    themeColor: 'soft-lavender',
    illustration: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8c-8 0-12 8-12 16s4 16 12 16 12-8 12-16-4-16-12-16z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M16 20c2-2 4-4 8-4s6 2 8 4M20 28c2 2 4 4 4 4s2-2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    price: '$59.99',
    tooltip: 'A surprise gift for your care.',
    isMostLoved: true
  },
  {
    id: 'luxury-indulgence',
    title: 'Luxury Indulgence',
    description: 'Premium indulgence with the finest artisanal treats',
    themeColor: 'deep-burgundy',
    illustration: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="24,4 32,16 44,16 34,26 38,38 24,30 10,38 14,26 4,16 16,16" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
      </svg>
    ),
    price: '$79.99',
    tooltip: 'A surprise gift for your care.'
  }
]

const getTextClass = (themeColor: string) => {
  switch (themeColor) {
    case 'vibrant-orange': return 'text-vibrant-orange'
    case 'soft-lavender': return 'text-soft-lavender'
    case 'deep-burgundy': return 'text-deep-burgundy'
    default: return 'text-muted-rose'
  }
}

const getBgClass = (themeColor: string) => {
  switch (themeColor) {
    case 'vibrant-orange': return 'bg-vibrant-orange'
    case 'soft-lavender': return 'bg-soft-lavender'
    case 'deep-burgundy': return 'bg-deep-burgundy'
    default: return 'bg-muted-rose'
  }
}

const getRibbonFill = (themeColor: string) => {
  switch (themeColor) {
    case 'vibrant-orange': return '#FF6B35'
    case 'soft-lavender': return '#C8A2C8'
    case 'deep-burgundy': return '#722F37'
    default: return '#E6B8C3'
  }
}

export default function HeaderGiftBoxes({ onClick }: HeaderGiftBoxesProps) {
  return (
    <div className="flex space-x-4">
      {giftBoxes.map((box, index) => (
        <div
          key={box.id}
          className={cn(
            'relative w-36 h-28 p-3 bg-white border border-border/30 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group'
          )}
          onClick={() => onClick(box.id)}
          title={box.tooltip}
        >
          {/* Ribbon Accent */}
          <div className="absolute top-1 right-1 w-4 h-4">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2C6 2 4 4 4 6c0 2 2 4 4 4s4-2 4-4c0-2-2-4-4-4z" fill={getRibbonFill(box.themeColor)} />
              <path d="M8 0v4M4 6h8" stroke="white" strokeWidth="1" />
            </svg>
          </div>

          {/* Most Loved Badge */}
          {box.isMostLoved && (
            <div className="absolute top-1 left-1 text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}

          {/* Illustration */}
          <div className="flex justify-center mb-1">
            <div className={getTextClass(box.themeColor)}>
              {box.illustration}
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center">
            <h3 className="text-xs font-semibold text-foreground leading-tight">{box.title}</h3>
            <p className="text-xs text-muted-foreground leading-tight mt-1">{box.description}</p>
          </div>

          {/* Price Badge */}
          <div className={cn('absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full text-white text-xs font-semibold', getBgClass(box.themeColor))}>
            {box.price}
          </div>
        </div>
      ))}
    </div>
  )
}