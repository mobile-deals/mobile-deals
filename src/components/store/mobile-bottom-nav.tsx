"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Flame, MessageCircle, User, LucideIcon } from "lucide-react";

interface MobileBottomNavProps {
  whatsappNumber?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  isExternal?: boolean;
}

export function MobileBottomNav({
  whatsappNumber = "+97455000000",
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const whatsappCleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Categories",
      href: "/#categories",
      icon: LayoutGrid,
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
    },
    {
      label: "Account",
      href: "/admin",
      icon: User,
      isActive: pathname.startsWith("/admin"),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-lg py-1 px-1 safe-area-pb">
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
                <Icon className="w-5 h-5 text-[#25D366]" />
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
              <Icon className={`w-5 h-5 ${isCurrent ? "stroke-[2.5]" : ""}`} />
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
