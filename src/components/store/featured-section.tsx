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
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                Featured Gear
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Top rated electronics and customer favorites in Qatar
              </p>
            </div>
          </div>

          <Link
            href="/#deals"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#8A1538] hover:text-[#6e132d] transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  );
}
