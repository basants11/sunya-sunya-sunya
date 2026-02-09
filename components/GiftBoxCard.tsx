"use client"

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GiftBoxCardProps {
  id: string
  title: string
  description: string
  themeColor: string
  illustration: ReactNode
  isSelected: boolean
  onSelect: (id: string) => void
  className?: string
}

export default function GiftBoxCard({
  id,
  title,
  description,
  themeColor,
  illustration,
  isSelected,
  onSelect,
  className
}: GiftBoxCardProps) {
  const getRingClass = () => {
    if (!isSelected) return ''
    switch (themeColor) {
      case 'vibrant-orange': return 'ring-2 ring-vibrant-orange'
      case 'soft-lavender': return 'ring-2 ring-soft-lavender'
      case 'deep-burgundy': return 'ring-2 ring-deep-burgundy'
      default: return 'ring-2 ring-muted-rose'
    }
  }

  const getBgClass = () => {
    switch (themeColor) {
      case 'vibrant-orange': return 'bg-vibrant-orange/10'
      case 'soft-lavender': return 'bg-soft-lavender/10'
      case 'deep-burgundy': return 'bg-deep-burgundy/10'
      default: return 'bg-muted-rose/10'
    }
  }

  const getBorderClass = () => {
    if (isSelected) {
      switch (themeColor) {
        case 'vibrant-orange': return 'bg-vibrant-orange border-vibrant-orange'
        case 'soft-lavender': return 'bg-soft-lavender border-soft-lavender'
        case 'deep-burgundy': return 'bg-deep-burgundy border-deep-burgundy'
        default: return 'bg-muted-rose border-muted-rose'
      }
    } else {
      switch (themeColor) {
        case 'vibrant-orange': return 'border-vibrant-orange/50'
        case 'soft-lavender': return 'border-soft-lavender/50'
        case 'deep-burgundy': return 'border-deep-burgundy/50'
        default: return 'border-muted-rose/50'
      }
    }
  }

  return (
    <div
      className={cn(
        'relative p-8 space-y-6 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer bg-white border border-border/30 rounded-lg',
        getRingClass(),
        className
      )}
      onClick={() => onSelect(id)}
    >
      {/* Selection Indicator */}
      <div className="flex justify-center">
        <div className={cn(
          'w-4 h-4 rounded-full border-2 transition-colors',
          getBorderClass()
        )}></div>
      </div>

      {/* Illustration */}
      <div className="flex justify-center">
        <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', getBgClass())}>
          {illustration}
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed font-light">{description}</p>
      </div>

      {/* Hover Effect Overlay */}
      <div className={cn(
        'absolute inset-0 rounded-lg transition-opacity duration-300',
        `bg-gradient-to-br from-${themeColor}/5 to-transparent`,
        'opacity-0 hover:opacity-100 pointer-events-none'
      )} />
    </div>
  )
}