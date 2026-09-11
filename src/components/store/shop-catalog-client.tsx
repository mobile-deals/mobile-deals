"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category, Brand, Product } from "@/types/database";
import { ProductCard } from "@/components/store/product-card";
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
  Sparkles,
  Gift,
  Flame,
  Star,
  Award,
  Tag,
  Check,
  ChevronDown,
  ChevronUp,
  PackageOpen,
  ArrowUpDown,
  ShoppingBag,
  Filter,
} from "lucide-react";

interface ShopCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  currency?: string;
}

type SortOption = "featured" | "price_asc" | "price_desc" | "discount" | "newest" | "name";

export function ShopCatalogClient({
  initialProducts = [],
  categories = [],
  brands = [],
  currency = "QAR",
}: ShopCatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Search & Filter State (initialized from URL query params if present)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get("category");
    return cat ? cat.split(",") : [];
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = searchParams.get("brand");
    return b ? b.split(",") : [];
  });
  const [selectedDealType, setSelectedDealType] = useState<string>(
    searchParams.get("deal") || "all"
  );
  const [pricePreset, setPricePreset] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("max_price") || "");
  const [inStockOnly, setInStockOnly] = useState<boolean>(
    searchParams.get("in_stock") === "true"
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "featured"
  );

  // Mobile Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Collapsible sidebar sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    deals: true,
    price: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync filters to URL query string without reloading page
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    if (selectedDealType !== "all") params.set("deal", selectedDealType);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (inStockOnly) params.set("in_stock", "true");
    if (sortBy !== "featured") params.set("sort", sortBy);

    const queryStr = params.toString();
    const targetUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
    startTransition(() => {
      window.history.replaceState(null, "", targetUrl);
    });
  }, [searchQuery, selectedCategories, selectedBrands, selectedDealType, minPrice, maxPrice, inStockOnly, sortBy, pathname]);

  // Lock background body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileFilterOpen]);

  // Pre-calculate Category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach((p) => {
      if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      if (p.category?.slug) counts[p.category.slug] = (counts[p.category.slug] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // Pre-calculate Brand product counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach((p) => {
      if (p.brand_id) counts[p.brand_id] = (counts[p.brand_id] || 0) + 1;
      if (p.brand?.slug) counts[p.brand.slug] = (counts[p.brand.slug] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // Apply Price Preset
  const handlePricePreset = (preset: string) => {
    setPricePreset(preset);
    if (preset === "all") {
      setMinPrice("");
      setMaxPrice("");
    } else if (preset === "under_500") {
      setMinPrice("");
      setMaxPrice("500");
    } else if (preset === "500_1500") {
      setMinPrice("500");
      setMaxPrice("1500");
    } else if (preset === "1500_3000") {
      setMinPrice("1500");
      setMaxPrice("3000");
    } else if (preset === "above_3000") {
      setMinPrice("3000");
      setMaxPrice("");
    }
  };

  // Toggle Category Selection
  const toggleCategory = (slugOrId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slugOrId) ? prev.filter((c) => c !== slugOrId) : [...prev, slugOrId]
    );
  };

  // Toggle Brand Selection
  const toggleBrand = (slugOrId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slugOrId) ? prev.filter((b) => b !== slugOrId) : [...prev, slugOrId]
    );
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedDealType("all");
    setPricePreset("all");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("featured");
  };

  // Active filters count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (selectedDealType !== "all") count++;
    if (minPrice || maxPrice) count++;
    if (inStockOnly) count++;
    return count;
  }, [searchQuery, selectedCategories, selectedBrands, selectedDealType, minPrice, maxPrice, inStockOnly]);

  // Master Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // 1. Text Search Filter (name, brand name, short description, specifications)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = product.name.toLowerCase().includes(q);
          const brandMatch = product.brand?.name?.toLowerCase().includes(q) || false;
          const shortDescMatch = product.short_description?.toLowerCase().includes(q) || false;
          const giftMatch = product.free_gift?.toLowerCase().includes(q) || false;
          if (!nameMatch && !brandMatch && !shortDescMatch && !giftMatch) {
            return false;
          }
        }

        // 2. Category Filter
        if (selectedCategories.length > 0) {
          const catMatch =
            (product.category_id && selectedCategories.includes(product.category_id)) ||
            (product.category?.slug && selectedCategories.includes(product.category.slug));
          if (!catMatch) return false;
        }

        // 3. Brand Filter
        if (selectedBrands.length > 0) {
          const brandMatch =
            (product.brand_id && selectedBrands.includes(product.brand_id)) ||
            (product.brand?.slug && selectedBrands.includes(product.brand.slug));
          if (!brandMatch) return false;
        }

        // 4. Special Deal / Offer Badges Filter
        if (selectedDealType !== "all") {
          if (selectedDealType === "free_gift") {
            const hasGift =
              Boolean(product.free_gift) ||
              product.specifications?.gift_enabled === "true" ||
              Boolean(product.badge_text?.toLowerCase().includes("gift"));
            if (!hasGift) return false;
          } else if (selectedDealType === "today_deal" && !product.is_today_deal) {
            return false;
          } else if (selectedDealType === "best_deal" && !product.is_best_deal) {
            return false;
          } else if (selectedDealType === "featured" && !product.is_featured) {
            return false;
          } else if (selectedDealType === "best_seller" && !product.is_best_seller) {
            return false;
          } else if (selectedDealType === "new_arrival" && !product.is_new_arrival) {
            return false;
          }
        }

        // 5. Price Range Filter
        const productPrice = Number(product.price);
        if (minPrice && productPrice < Number(minPrice)) return false;
        if (maxPrice && productPrice > Number(maxPrice)) return false;

        // 6. In-Stock Availability Filter
        if (inStockOnly && product.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        // Sorting
        if (sortBy === "price_asc") {
          return a.price - b.price;
        }
        if (sortBy === "price_desc") {
          return b.price - a.price;
        }
        if (sortBy === "discount") {
          const discountA =
            a.compare_at_price && a.compare_at_price > a.price
              ? (a.compare_at_price - a.price) / a.compare_at_price
              : 0;
          const discountB =
            b.compare_at_price && b.compare_at_price > b.price
              ? (b.compare_at_price - b.price) / b.compare_at_price
              : 0;
          return discountB - discountA;
        }
        if (sortBy === "newest") {
          return (
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        // Default "featured" sort: prioritize deal flags then newest
        const scoreA =
          (a.is_today_deal ? 4 : 0) +
          (a.is_best_deal ? 3 : 0) +
          (a.is_featured ? 2 : 0) +
          (a.is_best_seller ? 1 : 0);
        const scoreB =
          (b.is_today_deal ? 4 : 0) +
          (b.is_best_deal ? 3 : 0) +
          (b.is_featured ? 2 : 0) +
          (b.is_best_seller ? 1 : 0);
        return scoreB - scoreA;
      });
  }, [
    initialProducts,
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedDealType,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  // Render Sidebar Content (Shared between Desktop Sidebar and Mobile Slide Drawer)
  const renderFilterControls = () => (
    <div className="space-y-6 text-xs text-neutral-800">
      {/* 1. Categories Filter */}
      {categories.length > 0 && (
        <div className="border-b border-neutral-200/80 pb-5">
          <button
            type="button"
            onClick={() => toggleSection("categories")}
            className="flex items-center justify-between w-full font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider mb-3 cursor-pointer"
          >
            <span>Categories</span>
            {openSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.categories && (
            <div className="space-y-1.5 pt-1">
              {categories.map((cat) => {
                const isSelected =
                  selectedCategories.includes(cat.id) || selectedCategories.includes(cat.slug);
                const count = categoryCounts[cat.id] || categoryCounts[cat.slug] || 0;

                return (
                  <label
                    key={cat.id}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      isSelected ? "bg-[#8A1538]/10 text-[#8A1538] font-bold" : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategory(cat.slug || cat.id)}
                        className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                      />
                      <span className="truncate text-xs">{cat.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Brands Filter */}
      {brands.length > 0 && (
        <div className="border-b border-neutral-200/80 pb-5">
          <button
            type="button"
            onClick={() => toggleSection("brands")}
            className="flex items-center justify-between w-full font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider mb-3 cursor-pointer"
          >
            <span>Brands</span>
            {openSections.brands ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.brands && (
            <div className="space-y-1.5 pt-1">
              {brands.map((b) => {
                const isSelected =
                  selectedBrands.includes(b.id) || selectedBrands.includes(b.slug);
                const count = brandCounts[b.id] || brandCounts[b.slug] || 0;

                return (
                  <label
                    key={b.id}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      isSelected ? "bg-[#8A1538]/10 text-[#8A1538] font-bold" : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleBrand(b.slug || b.id)}
                        className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                      />
                      <span className="truncate text-xs">{b.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Deals & Special Offers */}
      <div className="border-b border-neutral-200/80 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("deals")}
          className="flex items-center justify-between w-full font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider mb-3 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8A1538]" />
            <span>Special Deals &amp; Offers</span>
          </span>
          {openSections.deals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.deals && (
          <div className="space-y-1.5 pt-1">
            {[
              { key: "all", label: "All Items", icon: ShoppingBag, color: "text-neutral-500" },
              { key: "free_gift", label: "🎁 Free Gift Included", icon: Gift, color: "text-amber-600" },
              { key: "today_deal", label: "🔥 Today's Best Deals", icon: Flame, color: "text-orange-600" },
              { key: "best_deal", label: "⭐ Best Deals", icon: Sparkles, color: "text-amber-500" },
              { key: "featured", label: "✨ Featured Gear", icon: Star, color: "text-yellow-600" },
              { key: "best_seller", label: "🏆 Best Sellers", icon: Award, color: "text-indigo-600" },
              { key: "new_arrival", label: "🚀 New Arrivals", icon: Tag, color: "text-cyan-600" },
            ].map((deal) => {
              const isSelected = selectedDealType === deal.key;
              return (
                <button
                  key={deal.key}
                  type="button"
                  onClick={() => setSelectedDealType(deal.key)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#8A1538] text-white shadow-xs"
                      : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <deal.icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : deal.color}`} />
                    <span>{deal.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Price Range Filter */}
      <div className="border-b border-neutral-200/80 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider mb-3 cursor-pointer"
        >
          <span>Price Range ({currency})</span>
          {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.price && (
          <div className="space-y-3">
            {/* Price Preset Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "under_500", label: `< 500` },
                { id: "500_1500", label: "500–1.5k" },
                { id: "1500_3000", label: "1.5k–3k" },
                { id: "above_3000", label: `3k+` },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePricePreset(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    pricePreset === p.id
                      ? "bg-[#8A1538] text-white border-[#8A1538]"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Min / Max Inputs */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] font-semibold text-neutral-500 block mb-1">
                  Min (QAR)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPricePreset("custom");
                  }}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-mono focus:outline-none focus:border-[#8A1538]"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-neutral-500 block mb-1">
                  Max (QAR)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPricePreset("custom");
                  }}
                  placeholder="5000"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-mono focus:outline-none focus:border-[#8A1538]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. In-Stock Availability */}
      <div>
        <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 cursor-pointer hover:border-neutral-300 transition-colors">
          <span className="font-bold text-neutral-800 text-xs">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Reset All Filters */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={handleClearAllFilters}
          className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters ({activeFiltersCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ── Breadcrumb Header ── */}
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 mb-3 flex items-center gap-2">
          <Link href="/" className="hover:text-[#8A1538] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="font-bold text-neutral-900">Shop</span>
        </nav>

        {/* ── Shop Hero Title & Live Controls ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-7 bg-[#8A1538] rounded-full inline-block" />
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Shop
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Explore authentic Qatar tech deals, smartphones, laptops, audio, and official accessories.
            </p>
          </div>

          {/* Search bar inside shop catalog */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]/20 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Top Filter Bar & Sort Controls ── */}
        <div className="flex items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs flex-wrap">
          {/* Left: Mobile Filter Button & Active Results Count */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-[#8A1538] text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
            </button>

            <span className="text-xs sm:text-sm font-bold text-neutral-800">
              {filteredAndSortedProducts.length}{" "}
              <span className="text-neutral-500 font-normal">
                {filteredAndSortedProducts.length === 1 ? "product" : "products"} found
              </span>
            </span>
          </div>

          {/* Right: Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-neutral-500 hidden sm:inline-block">
              Sort by:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#8A1538] cursor-pointer"
              >
                <option value="featured">✨ Featured &amp; Deals</option>
                <option value="price_asc">💵 Price: Low to High</option>
                <option value="price_desc">💎 Price: High to Low</option>
                <option value="discount">🔥 Highest Discount</option>
                <option value="newest">🚀 Newest Arrivals</option>
                <option value="name">🔤 Alphabetical (A-Z)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Dismissible Active Filter Tags ── */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Active:</span>
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8A1538]/10 text-[#8A1538] text-xs font-bold">
                <span>Search: &quot;{searchQuery}&quot;</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </span>
            )}

            {selectedDealType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <span>Offer: {selectedDealType.replace("_", " ")}</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDealType("all")} />
              </span>
            )}

            {selectedCategories.map((catIdOrSlug) => {
              const cat = categories.find((c) => c.id === catIdOrSlug || c.slug === catIdOrSlug);
              return (
                <span
                  key={catIdOrSlug}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-semibold"
                >
                  <span>{cat?.name || catIdOrSlug}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(catIdOrSlug)} />
                </span>
              );
            })}

            {selectedBrands.map((brandIdOrSlug) => {
              const b = brands.find((brand) => brand.id === brandIdOrSlug || brand.slug === brandIdOrSlug);
              return (
                <span
                  key={brandIdOrSlug}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-semibold"
                >
                  <span>{b?.name || brandIdOrSlug}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(brandIdOrSlug)} />
                </span>
              );
            })}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <span>
                  Price: {minPrice || "0"} - {maxPrice || "Any"} {currency}
                </span>
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setPricePreset("all");
                  }}
                />
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
                <span>In Stock Only</span>
                <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
              </span>
            )}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-[#8A1538] hover:underline cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── Main Catalog Grid + Desktop Sidebar Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Desktop Left Filter Sidebar (3 cols) with Fixed Header & Scrollable Body */}
          <aside className="hidden lg:flex lg:flex-col lg:col-span-3 bg-white rounded-3xl border border-neutral-200/80 shadow-xs sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden">
            {/* Sticky Header inside sidebar */}
            <div className="flex items-center justify-between p-5 pb-4 border-b border-neutral-200/80 bg-white shrink-0 z-10">
              <div className="flex items-center gap-2 font-black text-neutral-900 text-sm tracking-tight uppercase">
                <SlidersHorizontal className="w-4 h-4 text-[#8A1538]" />
                <span>Filters</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-[11px] font-bold text-[#8A1538] hover:underline cursor-pointer"
                >
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Scrollable Filter Controls */}
            <div className="p-5 pt-4 overflow-y-auto flex-1 overscroll-contain pr-4 space-y-6 [scrollbar-width:thin] [scrollbar-color:#8A1538_transparent] hover:[scrollbar-color:#8A1538_#f5f5f5]">
              {renderFilterControls()}
            </div>
          </aside>

          {/* Right Product Grid (9 cols) */}
          <main className="lg:col-span-9 flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-white border border-dashed border-neutral-300 shadow-xs">
                <PackageOpen className="w-14 h-14 mx-auto text-neutral-400 mb-3" />
                <h3 className="text-lg font-bold text-neutral-800">
                  No products match your filters
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mt-1 mb-6">
                  Try adjusting your search query, clearing specific category or price filters to see more results.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8A1538] text-white text-xs font-bold shadow hover:bg-[#720e2c] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              /* Exact matching card sizing grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredAndSortedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} currency={currency} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Slide-Out Filter Drawer ── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
          {/* Dark Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide panel */}
          <div className="relative z-50 w-80 sm:w-96 h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-[#8A1538]" />
                <span>Filter Catalog</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {renderFilterControls()}
            </div>

            {/* Drawer Footer Action Buttons */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-200 text-neutral-800 font-bold text-xs"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-2 py-2.5 px-4 rounded-xl bg-[#8A1538] text-white font-bold text-xs shadow-md"
              >
                Show {filteredAndSortedProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
