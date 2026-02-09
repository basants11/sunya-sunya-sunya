import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface WarmBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'beige' | 'cream' | 'peach';
}

export default function WarmBackground({
  children,
  className,
  variant = 'beige',
}: WarmBackgroundProps) {
  const bgClass = {
    beige: 'bg-warm-beige',
    cream: 'bg-warm-cream',
    peach: 'bg-warm-peach',
  }[variant];

  const textClass = {
    beige: 'text-foreground',
    cream: 'text-foreground',
    peach: 'text-luxury-charcoal',
  }[variant];

  return (
    <div
      className={cn(
        'relative',
        bgClass,
        textClass,
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-warm-amber/10 before:to-warm-gold/5 before:pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
}