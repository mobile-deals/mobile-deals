"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingCart, MessageCircle, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

interface MainNavbarProps {
  whatsappNumber?: string;
}

export function MainNavbar({ whatsappNumber = "+97455000000" }: MainNavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const whatsappCleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-[#8A1538] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Approved Logo */}
          <div className="shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for mobiles, accessories, deals..."
                className="w-full pl-10 pr-24 py-2.5 bg-neutral-50 border border-neutral-300 rounded-full text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#8A1538] focus:bg-white focus:ring-2 focus:ring-[#8A1538]/10 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-[#8A1538] hover:bg-[#700f2c] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons & WhatsApp Button */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
            {/* Account / Admin Link */}
            <Link
              href="/admin"
              className="flex flex-col items-center text-neutral-700 hover:text-[#8A1538] transition-colors p-1"
              title="Admin & Account"
            >
              <User className="w-5 h-5 text-neutral-600 hover:text-[#8A1538]" />
              <span className="text-[11px] font-medium hidden lg:inline mt-0.5">Account</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/#deals"
              className="relative flex flex-col items-center text-neutral-700 hover:text-[#8A1538] transition-colors p-1"
              title="Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-neutral-600 hover:text-[#8A1538]" />
                {totalWishlist > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#8A1538] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {totalWishlist}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium hidden lg:inline mt-0.5">Wishlist</span>
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex flex-col items-center text-neutral-700 hover:text-[#8A1538] transition-colors p-1"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-neutral-600 hover:text-[#8A1538]" />
                <span className="absolute -top-1.5 -right-2 bg-[#8A1538] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="text-[11px] font-medium hidden lg:inline mt-0.5">Cart</span>
            </Link>

            {/* WhatsApp Order CTA Button */}
            <a
              href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
                "Hello Mobile Deals 👋 I would like to inquire about your latest deals and products."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-sm transition-all"
              aria-label="Order on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="whitespace-nowrap">Order on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar (prominent under logo on mobile) */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for mobiles, accessories, deals..."
              className="w-full pl-9 pr-20 py-2 bg-neutral-50 border border-neutral-300 rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#8A1538] focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#8A1538] text-white text-[11px] font-semibold rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-3 space-y-2 text-sm shadow-md animate-in slide-in-from-top duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-800 font-medium hover:text-[#8A1538]"
          >
            Home
          </Link>
          <Link
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-800 font-medium hover:text-[#8A1538]"
          >
            All Categories
          </Link>
          <Link
            href="/#deals"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-800 font-medium hover:text-[#8A1538]"
          >
            Today&apos;s Best Deals
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-neutral-800 font-medium hover:text-[#8A1538]"
          >
            Cart ({totalItems} items)
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#8A1538] font-semibold hover:underline"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
