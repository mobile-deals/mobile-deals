import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/database";
import { ArrowRight, PackageOpen } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories = [] }: CategoryGridProps) {
  return (
    <section id="categories" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-[#8A1538] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/#categories"
            className="group flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#8A1538] hover:text-[#6e132d] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories List / Empty State */}
        {categories.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-neutral-50 border border-dashed border-neutral-200">
            <PackageOpen className="w-10 h-10 mx-auto text-neutral-400 mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No Categories Yet</h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              All categories are managed dynamically via the Admin Dashboard. Add categories or run the database seed script to populate.
            </p>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8A1538] text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-[#720e2c]"
            >
              Add Categories in Admin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const displayImg = getOptimizedImageUrl(cat.image_url, "thumb");
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-[#8A1538]/30 hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 mb-2.5 rounded-xl bg-neutral-50 p-2 flex items-center justify-center overflow-hidden">
                    {cat.image_url ? (
                      <Image
                        src={displayImg}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 70px, 80px"
                        className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 line-clamp-2 leading-tight group-hover:text-[#8A1538] transition-colors">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
