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
  // Client-side deal countdown timer (zero API requests, purely local timer)
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
        return { hours: 23, minutes: 59, seconds: 59 }; // Cycle to next day
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, "0");

  return (
    <section id="deals" className="py-8 md:py-12 bg-neutral-50/50 border-t border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            {/* Flame Icon + Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shadow-2xs">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                  Today&apos;s Best Deals
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  Handpicked offers just for you
                </p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-300/80 rounded-xl text-xs font-semibold text-neutral-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#8A1538]" />
              <span className="text-[11px] text-neutral-600">Deals ends in</span>
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
          </div>

          <Link
            href="/#deals"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#8A1538] hover:text-[#6e132d] transition-colors self-start sm:self-center"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid or Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-neutral-300">
            <Sparkles className="w-10 h-10 mx-auto text-[#F59E0B] mb-2" />
            <h3 className="text-base font-bold text-neutral-800">
              No Active Deals Scheduled Right Now
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              Products can be flagged as &ldquo;Today&rsquo;s Deal&rdquo; or &ldquo;Best Deal&rdquo; directly in the Admin Panel to feature them here.
            </p>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8A1538] text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-[#720e2c]"
            >
              Add Deals in Admin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} currency={currency} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
