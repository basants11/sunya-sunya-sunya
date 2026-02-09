"use client";

import { AnimatedCartIcon } from "@/components/animated-cart-icon";
import { LoginModal } from "@/components/auth/login-modal";
import { ProfileButton } from "@/components/auth/profile-button";
import { CartDrawer, useCartDrawer } from "@/components/cart-drawer";
import { SunyaColoredText } from "@/components/sunya-colored-text";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const cartDrawer = useCartDrawer();

  const router = useRouter();

  const runSearch = () => {
    if (!searchValue.trim()) {
      router.push("/products");
      return;
    }
    router.push(`/products?q=${encodeURIComponent(searchValue.trim())}`);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <SunyaColoredText size="5xl" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search & Cart */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Desktop */}
            <div className="relative hidden sm:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch();
                }}
                className="flex items-center"
              >
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  placeholder="Search..."
                  aria-label="Search products"
                  className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-muted border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              </form>
            </div>

            {/* Cart */}
            <AnimatedCartIcon
              onClick={cartDrawer.toggle}
              className="p-2 hover:bg-muted rounded-md transition cursor-pointer"
              showBadge={true}
              showRipple={true}
              badgeColor="#FF6900"
            />

            {/* Profile Button */}
            <ProfileButton />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-md transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal />

        {/* Cart Drawer */}
        <CartDrawer isOpen={cartDrawer.isOpen} onClose={cartDrawer.close} />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-2 text-sm font-medium text-foreground hover:bg-muted rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Search */}
            <div className="mt-4 px-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch();
                  setMobileMenuOpen(false);
                }}
                className="relative"
              >
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-input rounded-md text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </form>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
