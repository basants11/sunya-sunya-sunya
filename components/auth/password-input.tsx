/**
 * Password Input Component
 * Enhanced password input with strength indicator and visibility toggle
 */

"use client";

import { Input } from "@/components/ui/input";
import {
  checkPasswordStrength,
  type PasswordStrength,
} from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, Lock, X } from "lucide-react";
import { useCallback, useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  showStrength?: boolean;
  showRequirements?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
}

/**
 * Password Input with Strength Indicator
 *
 * Features:
 * - Password visibility toggle
 * - Real-time strength indicator
 * - Password requirement checklist
 * - Accessible with proper ARIA labels
 */
export function PasswordInput({
  value,
  onChange,
  placeholder = "Enter your password",
  label = "Password",
  error,
  showStrength = true,
  showRequirements = true,
  disabled = false,
  required = false,
  className = "",
  id = "password",
  name = "password",
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Check password strength on change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      if (showStrength) {
        setStrength(checkPasswordStrength(newValue));
      }
    },
    [onChange, showStrength],
  );

  // Toggle password visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  // Password requirements
  const requirements = [
    { label: "At least 8 characters", met: value.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(value) },
    { label: "One lowercase letter", met: /[a-z]/.test(value) },
    { label: "One number", met: /[0-9]/.test(value) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(value) },
  ];

  const allRequirementsMet = requirements.every((req) => req.met);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Lock Icon */}
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />

        {/* Password Input */}
        <Input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={cn(
            "pl-10 pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {/* Visibility Toggle */}
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isVisible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {isVisible ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${id}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {/* Strength Indicator */}
      {showStrength && value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          {/* Strength Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Password strength</span>
              <span className="font-medium" style={{ color: strength?.color }}>
                {strength?.label}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((strength?.score || 0) / 5) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full rounded-full transition-colors duration-300"
                style={{ backgroundColor: strength?.color }}
              />
            </div>
          </div>

          {/* Requirements Checklist */}
          {showRequirements && (
            <AnimatePresence>
              {(isFocused || !allRequirementsMet) && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 pt-1"
                >
                  {requirements.map((req, index) => (
                    <motion.li
                      key={req.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-center gap-2 text-xs transition-colors duration-200",
                        req.met
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {req.met ? (
                        <Check className="w-3.5 h-3.5 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />
                      )}
                      {req.label}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default PasswordInput;
