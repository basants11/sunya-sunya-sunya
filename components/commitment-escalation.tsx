/**
 * Commitment Escalation System
 *
 * Progressive engagement system designed to increase user investment
 * through micro-commitments and loss aversion triggers.
 *
 * PUBLIC FACING: "Smart Onboarding"
 * INTERNAL: Commitment escalation framework
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// MICRO-COMMITMENT TOGGLE
// =============================================================================

interface MicroCommitmentProps {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * Micro-commitments: "Yes, I want to save!" toggle defaults ON
 */
export function MicroCommitment({
  label,
  defaultChecked = true,
  onChange,
  className,
}: MicroCommitmentProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const prefersReducedMotion = useReducedMotion();

  const toggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <motion.div
      onClick={toggle}
      animate={
        isChecked && !prefersReducedMotion
          ? {
              boxShadow: [
                "0 0 0 0 rgba(0, 201, 80, 0)",
                "0 0 10px 3px rgba(0, 201, 80, 0.2)",
                "0 0 0 0 rgba(0, 201, 80, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
        isChecked
          ? "border-green-500 bg-green-50"
          : "border-border bg-card hover:border-green-200",
        className,
      )}
    >
      {/* Toggle switch - defaults ON */}
      <div
        className={cn(
          "w-12 h-6 rounded-full transition-colors relative",
          isChecked ? "bg-green-500" : "bg-muted",
        )}
      >
        <motion.div
          animate={{ x: isChecked ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
        />
      </div>

      <div className="flex-1">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">
          {isChecked
            ? "✓ You're opted in for maximum savings!"
            : "Toggle to unlock exclusive benefits"}
        </p>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SMART DEFAULTS SELECTOR
// =============================================================================

interface SmartDefaultOption {
  id: string;
  label: string;
  description: string;
  isRecommended?: boolean;
}

interface SmartDefaultsSelectorProps {
  options: SmartDefaultOption[];
  defaultSelected: string;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Smart defaults: "Recommended for you" always selected
 */
export function SmartDefaultsSelector({
  options,
  defaultSelected,
  onSelect,
  className,
}: SmartDefaultsSelectorProps) {
  const [selected, setSelected] = useState(defaultSelected);
  const prefersReducedMotion = useReducedMotion();

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => {
        const isSelected = selected === option.id;
        const isRecommended = option.isRecommended;

        return (
          <motion.div
            key={option.id}
            onClick={() => handleSelect(option.id)}
            animate={
              isSelected && !prefersReducedMotion
                ? { scale: 1.01, x: 4 }
                : { scale: 1, x: 0 }
            }
            className={cn(
              "relative p-4 rounded-xl border-2 cursor-pointer transition-colors",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30",
            )}
          >
            {/* Recommended badge */}
            {isRecommended && (
              <div className="absolute -top-2 right-4">
                <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                  RECOMMENDED
                </span>
              </div>
            )}

            <div className="flex items-start gap-3">
              {/* Radio button */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground",
                )}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold">{option.label}</p>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// =============================================================================
// FUTURE PACING TOOLTIP
// =============================================================================

interface FuturePacingProps {
  children: React.ReactNode;
  message: string;
  className?: string;
}

/**
 * Future pacing: "Your future self will thank you!" tooltips
 */
export function FuturePacing({
  children,
  message,
  className,
}: FuturePacingProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg whitespace-nowrap z-50"
          >
            <span className="flex items-center gap-2">
              <span>🔮</span>
              {message}
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-purple-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// LOSS AVERSION TIMER
// =============================================================================

interface LossAversionTimerProps {
  itemCount: number;
  duration?: number; // in seconds
  onExpire?: () => void;
  className?: string;
}

/**
 * Loss aversion: "You'll lose these items in 04:32" cart timer
 */
export function LossAversionTimer({
  itemCount,
  duration = 600, // 10 minutes
  onExpire,
  className,
}: LossAversionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isUrgent = timeLeft < 120;

  return (
    <motion.div
      animate={
        isUrgent && !prefersReducedMotion
          ? {
              borderColor: [
                "rgba(239, 68, 68, 0.3)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(239, 68, 68, 0.3)",
              ],
            }
          : {}
      }
      transition={{ duration: 1, repeat: Infinity }}
      className={cn(
        "p-4 rounded-xl border-2",
        isUrgent
          ? "bg-red-50 border-red-300"
          : "bg-orange-50 border-orange-200",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <motion.span
          animate={
            isUrgent && !prefersReducedMotion ? { rotate: [0, 15, -15, 0] } : {}
          }
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-3xl"
        >
          ⚠️
        </motion.span>
        <div>
          <p
            className={cn(
              "font-bold",
              isUrgent ? "text-red-700" : "text-orange-800",
            )}
          >
            You&apos;ll lose these items in {formatTime(timeLeft)}!
          </p>
          <p className="text-sm text-muted-foreground">
            {itemCount} item{itemCount > 1 ? "s" : ""} in your cart are reserved
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SUNK COST REMINDER
// =============================================================================

interface SunkCostReminderProps {
  timeSpent: number; // in minutes
  itemsCustomized: number;
  onSave: () => void;
  className?: string;
}

/**
 * Sunk cost: "You've spent 5 minutes customizing - save now!"
 */
export function SunkCostReminder({
  timeSpent,
  itemsCustomized,
  onSave,
  className,
}: SunkCostReminderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Show after user has spent time
    if (timeSpent >= 3) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [timeSpent]);

  const handleSave = () => {
    onSave();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={cn(
          "fixed bottom-4 right-4 z-50 max-w-sm",
          "bg-gradient-to-r from-amber-500 to-orange-500",
          "rounded-xl p-4 shadow-2xl text-white",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <motion.span
            animate={!prefersReducedMotion ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-3xl"
          >
            ⏱️
          </motion.span>
          <div className="flex-1">
            <p className="font-bold mb-1">
              You&apos;ve spent {timeSpent} minutes customizing!
            </p>
            <p className="text-sm text-white/90 mb-3">
              Don&apos;t lose your {itemsCustomized} personalized item
              {itemsCustomized > 1 ? "s" : ""}.
            </p>
            <button
              onClick={handleSave}
              className="w-full py-2 bg-white text-orange-600 font-bold rounded-lg hover:bg-white/90 transition-colors"
            >
              Save Now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// PROGRESSIVE DISCLOSURE STEPPER
// =============================================================================

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressiveDisclosureProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

/**
 * Progressive disclosure: Step-by-step commitment builder
 */
export function ProgressiveDisclosure({
  steps,
  currentStep,
  onStepClick,
  className,
}: ProgressiveDisclosureProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <motion.button
                onClick={() => onStepClick?.(index)}
                animate={
                  isCurrent && !prefersReducedMotion
                    ? { scale: [1, 1.1, 1] }
                    : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors",
                  isCompleted && "bg-green-500 text-white",
                  isCurrent &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  isUpcoming && "bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? <span>✓</span> : <span>{index + 1}</span>}
              </motion.button>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 rounded-full",
                    isCompleted ? "bg-green-500" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          <p className="font-semibold text-lg">{steps[currentStep]?.label}</p>
          {steps[currentStep]?.description && (
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type MicroCommitmentProps,
  type SmartDefaultsSelectorProps,
  type FuturePacingProps,
  type LossAversionTimerProps,
  type SunkCostReminderProps,
  type ProgressiveDisclosureProps,
  type SmartDefaultOption,
  type Step,
};
