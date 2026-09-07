"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Flame, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface MobileBottomNavProps {
  whatsappNumber?: string;
}

export function MobileBottomNav({
  whatsappNumber = "+97455000000",
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const whatsappCleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Categories",
      href: "/#categories",
      icon: Grid,
      isActive: pathname.startsWith("/categories"),
    },
    {
      label: "Deals",
      href: "/#deals",
      icon: Flame,
      isActive: false,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
        "Hello Mobile Deals 👋 I would like to inquire about your products."
      )}`,
      icon: MessageCircle,
      isActive: false,
      isExternal: true,
      color: "text-[#25D366]",
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      isActive: pathname === "/cart",
      badge: totalItems,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg py-1 px-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isCurrent = item.isActive;

          if (item.isExternal) {
            return (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center py-1 px-2 min-w-14 text-neutral-600 hover:text-[#25D366] transition-colors"
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${item.color || ""}`} />
                </div>
                <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-14 transition-colors ${
                isCurrent ? "text-[#8A1538]" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isCurrent ? "stroke-[2.5]" : ""}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#8A1538] text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 ${
                  isCurrent ? "font-bold text-[#8A1538]" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
