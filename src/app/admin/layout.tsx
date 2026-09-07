import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  ShoppingBag,
  Settings,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Hero Banners", href: "/admin/banners", icon: ImageIcon },
    { label: "COD Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100/70 text-neutral-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200/80 p-4 md:p-6 flex flex-col justify-between shrink-0 shadow-2xs">
        <div className="space-y-6">
          {/* Logo */}
          <div className="pb-4 border-b border-neutral-100">
            <Logo size="md" />
            <span className="inline-block px-2 py-0.5 mt-2 bg-[#8A1538]/10 text-[#8A1538] font-bold text-[10px] rounded-md tracking-wider uppercase">
              Admin Portal
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 text-xs sm:text-sm font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-neutral-600 hover:text-[#8A1538] hover:bg-[#8A1538]/5 transition-all"
                >
                  <Icon className="w-4 h-4 text-neutral-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* View Storefront Link */}
        <div className="pt-6 border-t border-neutral-100 mt-6 md:mt-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700 hover:text-[#8A1538] hover:border-[#8A1538]/40 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
