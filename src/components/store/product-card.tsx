"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/database";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

interface ProductCardProps {
  product: Product;
  currency?: string;
}

export function ProductCard({ product, currency = "QAR" }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    null;

  const optimizedImgUrl = getOptimizedImageUrl(primaryImage, "card");
  const inWishlist = isInWishlist(product.id);

  // Determine badge text
  let badge = product.badge_text;
  if (!badge) {
    if (product.free_gift) badge = "Free Gift";
    else if (product.is_best_seller) badge = "Best Seller";
    else if (product.is_today_deal) badge = "Deal";
    else if (product.is_new_arrival) badge = "New";
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      imageUrl: optimizedImgUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-lg hover:border-[#8A1538]/30 transition-all p-3.5 sm:p-4">
      {/* Top Header: Badge + Wishlist */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div>
          {badge ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-[#F59E0B] text-neutral-900 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
              {badge}
            </span>
          ) : (
            <span className="h-4" />
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`p-1.5 rounded-full transition-colors ${
            inWishlist
              ? "text-[#8A1538] bg-rose-50"
              : "text-neutral-400 hover:text-[#8A1538] hover:bg-neutral-50"
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative mb-3">
        <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
          {primaryImage ? (
            <Image
              src={optimizedImgUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 280px"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 bg-neutral-50 rounded-lg">
              <span className="text-3xl">📱</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#8A1538] transition-colors">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {product.short_description && (
            <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1 font-medium">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-2.5 mb-3 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-black text-[#8A1538] tracking-tight">
            {currency} {product.price.toLocaleString()}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-neutral-400 line-through">
              {currency} {product.compare_at_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2 sm:py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
            product.stock <= 0
              ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
              : added
              ? "bg-emerald-700 text-white"
              : "bg-[#8A1538] hover:bg-[#720e2c] text-white active:scale-98"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : product.stock <= 0 ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
