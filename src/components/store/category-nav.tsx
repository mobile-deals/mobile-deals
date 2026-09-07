"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/types/database";
import {
  Menu,
  Smartphone,
  Keyboard,
  Headphones,
  Zap,
  Watch,
  Sparkles,
  Shield,
  BatteryCharging,
  Volume2,
  Gamepad2,
  Package,
} from "lucide-react";

interface CategoryNavProps {
  categories: Category[];
}

// Icon mapper for categories based on slug or icon_name
const getCategoryIcon = (slug: string, iconName?: string | null) => {
  const icon = (iconName || slug).toLowerCase();
  if (icon.includes("phone") || icon.includes("mobile") || icon.includes("tablet")) {
    return Smartphone;
  }
  if (icon.includes("keyboard") || icon.includes("mouse")) {
    return Keyboard;
  }
  if (icon.includes("holder")) {
    return Smartphone;
  }
  if (icon.includes("earphone") || icon.includes("bud") || icon.includes("headphone")) {
    return Headphones;
  }
  if (icon.includes("charger") || icon.includes("adapter") || icon.includes("cable")) {
    return Zap;
  }
  if (icon.includes("watch") || icon.includes("strap")) {
    return Watch;
  }
  if (icon.includes("perfume") || icon.includes("fragrance")) {
    return Sparkles;
  }
  if (icon.includes("cover") || icon.includes("glass") || icon.includes("case")) {
    return Shield;
  }
  if (icon.includes("power") || icon.includes("battery")) {
    return BatteryCharging;
  }
  if (icon.includes("speaker") || icon.includes("audio")) {
    return Volume2;
  }
  if (icon.includes("toy") || icon.includes("game")) {
    return Gamepad2;
  }
  return Package;
};

export function CategoryNav({ categories = [] }: CategoryNavProps) {
  return (
    <nav
      aria-label="Category Navigation"
      className="bg-white border-b border-neutral-200 text-neutral-800 text-xs shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-hidden">
        {/* Categories Dropdown trigger */}
        <Link
          href="/#categories"
          className="flex items-center gap-2 py-3 px-3 font-bold text-neutral-900 hover:text-[#8A1538] border-r border-neutral-200 shrink-0 transition-colors"
        >
          <Menu className="w-4 h-4 text-[#8A1538]" />
          <span className="uppercase tracking-wider text-[11px]">Categories</span>
        </Link>

        {/* Scrollable Horizontal Category Bar */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2.5 scroll-smooth">
          {categories.length === 0 ? (
            <span className="text-neutral-400 py-1 italic text-[11px]">
              Categories managed via Admin
            </span>
          ) : (
            categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.slug, cat.icon_name);
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group flex items-center gap-1.5 whitespace-nowrap text-neutral-600 hover:text-[#8A1538] transition-colors py-0.5"
                >
                  <IconComponent className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#8A1538] transition-colors" />
                  <span className="font-medium text-[12px] group-hover:font-semibold">
                    {cat.name}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </nav>
  );
}
