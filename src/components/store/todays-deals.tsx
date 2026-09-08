"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/store/product-card";
import { Flame, ArrowRight, Clock, Sparkles } from "lucide-react";

interface TodaysDealsProps {
  products: Product[];
  currency?: string;
}

export function TodaysDeals({ products = [], currency = "QAR" }: TodaysDealsProps) {
  // Client-side deal countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, "0");

  return (
    <section id="deals" className="py-6 sm:py-10 md:py-12 bg-neutral-50/60 border-t border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header (Matching Referral: Left 🔥 Today's Best Deals | Right: View All) */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🔥</span>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              Today&apos;s Best Deals
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Countdown Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#8A1538]" />
              <span className="text-[11px] text-neutral-600">Ends in</span>
              <div className="flex items-center gap-1 font-mono font-bold text-white">
                <span className="bg-[#6E132D] px-1.5 py-0.5 rounded text-[11px]">
                  {formatDigit(timeLeft.hours)}
                </span>
                <span className="text-neutral-900">:</span>
                <span className="bg-[#6E132D] px-1.5 py-0.5 rounded text-[11px]">
                  {formatDigit(timeLeft.minutes)}
                </span>
                <span className="text-neutral-900">:</span>
                <span className="bg-[#6E132D] px-1.5 py-0.5 rounded text-[11px]">
                  {formatDigit(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <Link
              href="/#deals"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#8A1538] hover:text-[#6e102c] transition-all group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Products Grid or Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-neutral-300">
            <Sparkles className="w-10 h-10 mx-auto text-[#F59E0B] mb-2" />
            <h3 className="text-base font-bold text-neutral-800">
              No Active Deals Scheduled Right Now
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              Products can be flagged as &ldquo;Today&rsquo;s Deal&rdquo; directly in the Admin Panel.
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8A1538] text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-[#720e2c]"
            >
              Add Deals in Admin
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Mobile 2-Columns Grid (Max 6 products, 2 per row) */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {products.slice(0, 6).map((prod) => (
                <ProductCard key={prod.id} product={prod} currency={currency} />
              ))}
            </div>

            {/* 2. Desktop / Tablet Grid (Completely Untouched for Desktop) */}
            <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} currency={currency} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
