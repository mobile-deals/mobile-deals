"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingCart, MessageCircle, Menu, X, ChevronRight, Sparkles, Loader2, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  badge_text: string | null;
  product_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
  }>;
}

interface MainNavbarProps {
  whatsappNumber?: string;
  currency?: string;
}

export function MainNavbar({ whatsappNumber = "+97455000000", currency = "QAR" }: MainNavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const desktopSearchRef = React.useRef<HTMLDivElement>(null);
  const mobileSearchRef = React.useRef<HTMLDivElement>(null);
  
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  // Instant live search debounced fetcher
  React.useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products || []);
        }
      } catch (err) {
        console.error("Live search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside to close dropdowns
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowDesktopDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setShowMobileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDesktopDropdown(false);
      setShowMobileDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);
    router.push(`/products/${slug}`);
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);
  };

  const popularTags = ["iPhone", "Samsung", "AirPods", "Charger", "Watch"];

  const renderSearchResultsPopup = (isMobile = false) => {
    if (!searchQuery.trim()) return null;

    return (
      <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-98 duration-150 ${isMobile ? "max-h-[75vh]" : "max-h-[500px]"} flex flex-col`}>
        {/* Top Header */}
        <div className="px-4 py-2.5 bg-neutral-50/90 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">
            {isLoading ? "Searching..." : searchResults.length > 0 ? `Matching Products (${searchResults.length})` : "Search Results"}
          </span>
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A1538]" />}
        </div>

        {/* Results List or Empty State */}
        <div className="overflow-y-auto divide-y divide-neutral-100 flex-1">
          {isLoading && searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#8A1538]" />
              <span>Looking for best deals...</span>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => {
              const primaryImg = product.product_images?.find((img) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || "/placeholder-phone.png";
              const discountPercent = product.compare_at_price && product.compare_at_price > product.price
                ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="flex items-center gap-3 p-3 hover:bg-[#8A1538]/5 cursor-pointer transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 bg-neutral-50 rounded-xl overflow-hidden shrink-0 border border-neutral-150 p-1 flex items-center justify-center">
                    <Image
                      src={primaryImg}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 group-hover:text-[#8A1538] transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#8A1538]">
                        {currency} {Number(product.price).toLocaleString()}
                      </span>
                      {product.compare_at_price && product.compare_at_price > product.price && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {currency} {Number(product.compare_at_price).toLocaleString()}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#8A1538] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-neutral-600 font-medium">
                No products found for &ldquo;<span className="font-semibold text-neutral-900">{searchQuery}</span>&rdquo;
              </p>
              <div className="mt-3">
                <p className="text-[11px] text-neutral-400 mb-2 flex items-center justify-center gap-1">
                  <Tag className="w-3 h-3" /> Popular Searches:
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQuickTagClick(tag)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 hover:bg-[#8A1538]/10 hover:text-[#8A1538] text-neutral-700 rounded-full transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Link to full search results */}
        {searchResults.length > 0 && (
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="w-full py-2.5 px-4 bg-neutral-50 hover:bg-neutral-100 border-t border-neutral-100 text-xs font-bold text-[#8A1538] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  const whatsappCleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3.5">
        {/* Mobile Header Row (Logo on Left | Cart & Menu on Right) */}
        <div className="flex md:hidden items-center justify-between gap-3 py-0.5">
          {/* Left: Mobile Logo */}
          <div className="shrink-0 flex items-center">
            <Logo size="md" />
          </div>

          {/* Right: Cart Button + Hamburger Menu Button */}
          <div className="flex items-center gap-1.5">
            {/* Cart Button with Red Count Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-neutral-800 hover:text-[#8A1538] active:scale-95 transition-all"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0.5 right-0.5 bg-[#8A1538] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            </Link>

            {/* Mobile Menu Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -mr-1.5 text-neutral-800 hover:text-[#8A1538] active:scale-95 transition-all focus:outline-none cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Desktop Navbar Row (Completely Untouched for Desktop) */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Desktop Logo */}
          <div className="shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Search Bar */}
          <div ref={desktopSearchRef} className="flex flex-1 max-w-xl items-center relative">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowDesktopDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDesktopDropdown(true);
                  }}
                  placeholder="Search for mobiles, accessories, deals..."
                  className="w-full pl-10 pr-28 py-2.5 bg-neutral-50 border border-neutral-300 rounded-full text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#8A1538] focus:bg-white focus:ring-2 focus:ring-[#8A1538]/10 transition-all"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowDesktopDropdown(false);
                    }}
                    className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-[#8A1538] hover:bg-[#700f2c] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Live Autocomplete Popup */}
            {showDesktopDropdown && renderSearchResultsPopup(false)}
          </div>

          {/* Right Action Icons & WhatsApp Button */}
          <div className="flex items-center gap-4 md:gap-5">
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
              className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-sm transition-all"
              aria-label="Order on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="whitespace-nowrap">Order on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div ref={mobileSearchRef} className="mt-2.5 md:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowMobileDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowMobileDropdown(true);
                }}
                placeholder="Search for mobiles, accessories, deals..."
                className="w-full pl-10 pr-9 py-2.5 bg-neutral-100/90 border border-neutral-200/80 rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#8A1538] focus:bg-white focus:ring-1 focus:ring-[#8A1538]/20 transition-all shadow-2xs"
              />
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowMobileDropdown(false);
                  }}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-600 focus:outline-none p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Live Autocomplete Popup */}
          {showMobileDropdown && renderSearchResultsPopup(true)}
        </div>
      </div>

      {/* Mobile Slide-in Drawer on RIGHT Side */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Dark Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Right Sidebar Menu Panel */}
          <div className="relative z-50 w-72 sm:w-80 h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Sidebar Header */}
            <div>
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
                <Logo size="md" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-neutral-200/70 hover:bg-neutral-300 text-neutral-700 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1.5 text-sm">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl font-bold text-neutral-900 hover:bg-[#8A1538]/5 hover:text-[#8A1538] transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
                <Link
                  href="/#categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl font-bold text-neutral-900 hover:bg-[#8A1538]/5 hover:text-[#8A1538] transition-colors"
                >
                  <span>All Categories</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
                <Link
                  href="/#deals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl font-bold text-neutral-900 hover:bg-[#8A1538]/5 hover:text-[#8A1538] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>Today&apos;s Best Deals</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl font-bold text-neutral-900 hover:bg-[#8A1538]/5 hover:text-[#8A1538] transition-colors"
                >
                  <span>Shopping Cart</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#8A1538] text-white text-xs font-bold">
                    {totalItems}
                  </span>
                </Link>
              </div>
            </div>

            {/* Sidebar Bottom WhatsApp Action */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-2">
              <a
                href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
                  "Hello Mobile Deals 👋 I would like to place an order or inquire about products."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-sm hover:bg-[#20ba59] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </a>
              <p className="text-[11px] text-center text-neutral-400 font-medium">
                Fast doorstep delivery across Qatar 🇶🇦
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
