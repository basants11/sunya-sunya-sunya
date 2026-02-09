import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-primary/20 bg-background text-foreground hover:bg-primary/5 hover:border-primary/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg hover:-translate-y-0.5',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-foreground/80 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        cta: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        cart: 'text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:shadow-md focus-visible:ring-orange-500/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background font-bold',
        success: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:-translate-y-0.5',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs',
        lg: 'h-12 rounded-lg px-8 has-[>svg]:px-4 text-base',
        xl: 'h-14 rounded-lg px-10 has-[>svg]:px-5 text-lg',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
