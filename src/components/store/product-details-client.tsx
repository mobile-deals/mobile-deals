"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductVariant } from "@/types/database";
import { useCart } from "@/hooks/use-cart";
import { generateProductWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShoppingCart,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  Gift,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: Product;
  whatsappNumber?: string;
  currency?: string;
}

export function ProductDetailsClient({
  product,
  whatsappNumber = "+97455000000",
  currency = "QAR",
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  // Selected variant state
  const variants = product.product_variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Price calculations
  const currentPrice = selectedVariant?.price ?? product.price;
  const comparePrice = selectedVariant?.compare_at_price ?? product.compare_at_price;
  const hasDiscount = comparePrice && comparePrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0;

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "";

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: selectedVariant?.id,
        variantName: selectedVariant?.name,
        price: currentPrice,
        imageUrl: primaryImage,
      },
      quantity
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyWithCOD = () => {
    addItem(
      {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: selectedVariant?.id,
        variantName: selectedVariant?.name,
        price: currentPrice,
        imageUrl: primaryImage,
      },
      quantity
    );
    router.push("/checkout");
  };

  const whatsAppUrl = generateProductWhatsAppUrl({
    storeNumber: whatsappNumber,
    productName: product.name,
    variantName: selectedVariant?.name,
    price: currentPrice,
    quantity: quantity,
    currency: currency,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Brand & Badge */}
      <div className="flex items-center gap-3">
        {product.brand && (
          <span className="px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-bold text-neutral-700 uppercase tracking-wider">
            {product.brand.name}
          </span>
        )}
        {product.badge_text && (
          <span className="px-2.5 py-1 bg-[#F59E0B] text-neutral-900 rounded-md text-xs font-bold uppercase tracking-wider">
            {product.badge_text}
          </span>
        )}
        {product.free_gift && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            <span>Free Gift Included</span>
          </span>
        )}
      </div>

      {/* Product Name & Short Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
          {product.name}
        </h1>
        {product.short_description && (
          <p className="text-sm text-neutral-500 mt-2 font-medium leading-relaxed">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Pricing Block */}
      <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
        <span className="text-3xl sm:text-4xl font-black text-[#8A1538] tracking-tight">
          {currency} {currentPrice.toLocaleString()}
        </span>
        {hasDiscount && (
          <>
            <span className="text-base text-neutral-400 line-through">
              {currency} {comparePrice.toLocaleString()}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
              Save {discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Variant Selection */}
      {variants.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase text-neutral-700 tracking-wider">
            Select Model / Variant:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? "border-[#8A1538] bg-[#8A1538]/5 text-[#8A1538] ring-2 ring-[#8A1538]/20"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase text-neutral-700 tracking-wider">
          Quantity:
        </span>
        <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2.5 text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center font-bold text-sm text-neutral-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2.5 text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#8A1538] hover:bg-[#700f2c] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{addedToast ? "Added to Cart!" : "Add to Cart"}</span>
        </button>

        {/* Buy with COD Direct Checkout */}
        <button
          type="button"
          onClick={handleBuyWithCOD}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1A1A1A] hover:bg-neutral-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
        >
          <Zap className="w-5 h-5 text-[#F59E0B]" />
          <span>Buy with Cash on Delivery</span>
        </button>

        {/* Order on WhatsApp */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Order via WhatsApp</span>
        </a>
      </div>

      {/* Free Gift Details if set */}
      {product.free_gift && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <Gift className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Complimentary Gift: </span>
            <span>{product.free_gift}</span>
          </div>
        </div>
      )}

      {/* Trust & Guarantees Box */}
      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5 text-xs text-neutral-600">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#8A1538] shrink-0" />
          <span>
            <strong>Free Express Delivery</strong> anywhere in Qatar (24–48 hours)
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#8A1538] shrink-0" />
          <span>
            <strong>Warranty:</strong> {product.warranty || "1 Year Official Qatar Warranty"}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>100% Genuine:</strong> Sealed original unit with verification
          </span>
        </div>
      </div>
    </div>
  );
}
