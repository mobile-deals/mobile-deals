import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  whatsappNumber?: string;
  storeEmail?: string;
}

export function Footer({
  whatsappNumber = "+97455000000",
  storeEmail = "support@mobiledeals.qa",
}: FooterProps) {
  const whatsappCleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl inline-block shadow-sm">
              <Logo size="md" />
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Mobile Deals is Qatar&apos;s premier online destination for mobile phones, electronics,
              accessories, and gadgets with guaranteed Cash on Delivery and fast nationwide delivery.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappCleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:scale-105 transition-transform"
                title="WhatsApp Mobile Deals"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
              </a>
              <a
                href={`mailto:${storeEmail}`}
                className="w-9 h-9 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center hover:scale-105 transition-transform"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition-colors">
                  Shop Categories
                </Link>
              </li>
              <li>
                <Link href="/#deals" className="hover:text-white transition-colors">
                  Today&apos;s Best Deals
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  My Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Cash on Delivery Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              Customer Care
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>Cash on Delivery Policy</li>
              <li>Qatar Nationwide Shipping</li>
              <li>Warranty &amp; Returns</li>
              <li>WhatsApp Direct Help</li>
              <li>24/7 Order Support</li>
            </ul>
          </div>

          {/* Col 4: Qatar Contact Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase">
              Contact &amp; Location
            </h4>
            <div className="space-y-2.5 text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8A1538] shrink-0 mt-0.5" />
                <span>Doha, State of Qatar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8A1538] shrink-0" />
                <span>{whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8A1538] shrink-0" />
                <span>{storeEmail}</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-[#8A1538]/30 border border-[#8A1538]/50 text-white font-semibold text-[11px]">
                  Cash on Delivery Available Across Qatar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} MOBILE DEALS. All rights reserved. Doha, Qatar.</p>
          <div className="flex items-center gap-4">
            <span>Guaranteed 100% Genuine Tech</span>
            <span>•</span>
            <span>Fast Qatar Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
