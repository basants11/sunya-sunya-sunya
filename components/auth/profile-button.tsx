/**
 * Profile Button Component
 * Displays user avatar/icon in header with dropdown menu
 * Shows login modal when user is not authenticated
 */

"use client";

import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Crown,
  Heart,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ProfileButtonProps {
  className?: string;
}

/**
 * Profile Button
 *
 * Features:
 * - Shows user avatar when authenticated
 * - Shows user icon when not authenticated
 * - Dropdown menu with user actions
 * - Opens login modal when not authenticated
 * - Smooth animations
 */
export function ProfileButton({ className = "" }: ProfileButtonProps) {
  const { user, isAuthenticated, isLoading, openLoginModal, logout } =
    useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle profile button click
  const handleClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Loading state
  if (isLoading) {
    return (
      <button
        className="relative p-2 rounded-full bg-muted animate-pulse"
        aria-label="Loading profile"
      >
        <div className="w-5 h-5 rounded-full bg-muted-foreground/20" />
      </button>
    );
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={handleClick}
        className={cn(
          "relative flex items-center gap-2 p-1.5 rounded-full transition-all duration-200 ease-out",
          isAuthenticated
            ? "hover:bg-muted active:scale-95"
            : "hover:bg-muted/80 active:scale-95",
          isDropdownOpen && "bg-muted",
        )}
        aria-label={isAuthenticated ? "Open profile menu" : "Login"}
        aria-expanded={isDropdownOpen}
        aria-haspopup={isAuthenticated}
      >
        {/* Avatar */}
        <div
          className={cn(
            "relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
            isAuthenticated
              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
              : "bg-muted border-2 border-dashed border-muted-foreground/30",
          )}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName || "User"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">
              {isAuthenticated ? getInitials() : <User className="w-4 h-4" />}
            </span>
          )}

          {/* Online indicator for authenticated users */}
          {isAuthenticated && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        {/* Chevron for authenticated users */}
        {isAuthenticated && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isDropdownOpen && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isAuthenticated && isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 mt-2 w-56 origin-top-right z-50"
          >
            <div className="rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.fullName || user?.email || "User"}
                </p>
                {user?.email && user?.fullName && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {user.email}
                  </p>
                )}
                {/* Subscription Badge */}
                {user?.subscriptionStatus === "active" && (
                  <div className="flex items-center gap-1 mt-2">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      Premium Member
                    </span>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <nav className="p-2">
                <Link
                  href="/account"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Account Settings
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Package className="w-4 h-4 text-muted-foreground" />
                  My Orders
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  Wishlist
                </Link>

                <Link
                  href="/subscription"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  Subscription
                </Link>
              </nav>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Logout Button */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileButton;
