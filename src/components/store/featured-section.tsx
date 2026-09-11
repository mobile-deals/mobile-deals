import React from "react";
import Link from "next/link";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/store/product-card";
import { Star, ArrowRight } from "lucide-react";

interface FeaturedSectionProps {
  products: Product[];
  currency?: string;
}

export function FeaturedSection({
  products = [],
  currency = "QAR",
}: FeaturedSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-6 sm:py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-neutral-900">
                Featured Gear
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Top rated electronics and customer favorites in Qatar
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#8A1538] hover:text-[#6e132d] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Exact same 5-column desktop, 3-column tablet, 2-column mobile grid matching Today's Best Deals */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  );
}
