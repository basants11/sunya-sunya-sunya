import * as React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

function Icon({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('size-5', className)}
    >
      {children}
    </svg>
  )
}

function IconWarning(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M12 3 2.8 19a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L12 3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Icon>
  )
}

function IconCheck(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  )
}

function IconBatteryLow(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M3 7h15a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <path d="M23 11v2" />
      <path d="M6 12h3" />
    </Icon>
  )
}

function IconStomach(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M7 4c3 0 4 2 4 4v1c0 2-2 3-4 3H6" />
      <path d="M11 9c0 3 2 5 5 5 3 0 5-2 5-5V7c0-2-1-3-3-3" />
      <path d="M6 12c-2 0-3 1-3 3 0 3 2 5 6 5" />
    </Icon>
  )
}

function IconGuilt(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M12 21s-7-4.4-9-9a5 5 0 0 1 8-5 5 5 0 0 1 8 5c-2 4.6-9 9-9 9Z" />
      <path d="M9 11h.01" />
      <path d="M15 11h.01" />
      <path d="M9.5 15c1.4-1 3.6-1 5 0" />
    </Icon>
  )
}

function IconEnergy(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </Icon>
  )
}

function IconSmile(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path d="M8.5 10h.01" />
      <path d="M15.5 10h.01" />
      <path d="M8.5 14c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
    </Icon>
  )
}

function IconHeart(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M12 21s-7-4.4-9-9a5 5 0 0 1 8-5 5 5 0 0 1 8 5c-2 4.6-9 9-9 9Z" />
      <path d="M6.5 12h3l1.5-2.5L13 15l1.5-3h3" />
    </Icon>
  )
}

function CuePill({
  tone,
  icon,
  label,
}: {
  tone: 'bad' | 'good'
  icon: React.ReactNode
  label: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur',
        tone === 'good'
          ? 'border-emerald-200/70 bg-emerald-50 text-emerald-900'
          : 'border-amber-200/70 bg-amber-50 text-amber-950',
      )}
    >
      <span
        className={cn(
          'inline-flex size-6 items-center justify-center rounded-full',
          tone === 'good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900',
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="leading-none">{label}</span>
    </div>
  )
}

function MicroBullet({
  tone,
  text,
}: {
  tone: 'bad' | 'good'
  text: string
}) {
  return (
    <li className="flex items-start gap-2">
      <span
        className={cn(
          'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full',
          tone === 'good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900',
        )}
        aria-hidden="true"
      >
        {tone === 'good' ? <IconCheck className="size-3.5" /> : <IconWarning className="size-3.5" />}
      </span>
      <span className="text-sm leading-snug text-slate-700">{text}</span>
    </li>
  )
}

export default function HealthyVsJunkComparison() {
  return (
    <section
      aria-labelledby="healthy-vs-junk-title"
      className="bg-gradient-to-b from-white to-slate-50 py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="healthy-vs-junk-title"
            className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            Why Choose Healthy Snacks Over Junk Food?
          </h2>
          <p className="mt-2 text-pretty text-sm text-slate-600 sm:text-base">
            Quick comparison—same cravings, very different outcomes.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Unhealthy */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-300 via-amber-300/60 to-rose-300/60"
              aria-hidden="true"
            />
            <div className="grid gap-6 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unhealthy Choice</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Fast hit, hidden cost</p>
                </div>
                <span
                  className="inline-flex size-10 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-900"
                  aria-hidden="true"
                >
                  <IconWarning className="size-5" />
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/images/junk-snacks.svg"
                    alt="Junk snacks illustration"
                    fill
                    className="object-contain p-6 grayscale opacity-90"
                    sizes="(min-width: 768px) 520px, 100vw"
                    priority={false}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <CuePill tone="bad" icon={<IconBatteryLow className="size-4" />} label="Low energy" />
                <CuePill tone="bad" icon={<IconStomach className="size-4" />} label="Discomfort" />
                <CuePill tone="bad" icon={<IconGuilt className="size-4" />} label="Guilt" />
              </div>

              <ul className="space-y-2">
                <MicroBullet tone="bad" text="Sugar spike → crash" />
                <MicroBullet tone="bad" text="Cravings loop (harder to stop at one)" />
                <MicroBullet tone="bad" text="You pay later: mood, focus, and energy" />
              </ul>

              <p className="text-xs text-slate-500">
                Subtle loss aversion: that “cheap” snack can steal your next few hours.
              </p>
            </div>
          </div>

          {/* Healthy */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-white shadow-sm">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500/70 via-emerald-300/60 to-amber-200/50"
              aria-hidden="true"
            />
            <div className="grid gap-6 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80">Healthy Choice</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Same craving, better ending</p>
                </div>
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900"
                >
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800" aria-hidden="true">
                    <IconCheck className="size-3.5" />
                  </span>
                  Recommended
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-emerald-50/40">
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/images/healthy-snacks.svg"
                    alt="Healthy snacks illustration"
                    fill
                    className="object-contain p-6"
                    sizes="(min-width: 768px) 520px, 100vw"
                    priority={false}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <CuePill tone="good" icon={<IconEnergy className="size-4" />} label="Steady energy" />
                <CuePill tone="good" icon={<IconSmile className="size-4" />} label="Satisfaction" />
                <CuePill tone="good" icon={<IconHeart className="size-4" />} label="Well-being" />
              </div>

              <ul className="space-y-2">
                <MicroBullet tone="good" text="Real satiety (fiber + nutrients)" />
                <MicroBullet tone="good" text="Calmer energy—fewer crashes" />
                <MicroBullet tone="good" text="Feel-good after (no ‘why did I…’)" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

