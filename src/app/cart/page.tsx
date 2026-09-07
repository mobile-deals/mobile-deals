"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { generateCartWhatsAppUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/logo";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    total,
    totalItems,
  } = useCart();

  const whatsAppOrderUrl = generateCartWhatsAppUrl({
    storeNumber: "+97455000000",
    items: items,
    total: total,
    currency: "QAR",
  });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/60">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#8A1538] transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-white border border-neutral-200 shadow-2xs">
            <ShoppingBag className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
            <h2 className="text-xl font-bold text-neutral-800">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mt-2 mb-6">
              Looks like you haven&apos;t added any electronics or deals to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8A1538] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:bg-[#720e2c] transition-all"
            >
              <span>Explore Today&apos;s Best Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs divide-y divide-neutral-100 overflow-hidden">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || "default"}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Image + Details */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl border border-neutral-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="96px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-2xl">📱</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="font-bold text-sm text-neutral-900 hover:text-[#8A1538] transition-colors line-clamp-2"
                        >
                          {item.productName}
                        </Link>
                        {item.variantName && (
                          <p className="text-xs text-neutral-500 font-medium">
                            Variant: {item.variantName}
                          </p>
                        )}
                        <p className="text-sm font-black text-[#8A1538]">
                          QAR {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                      <div className="flex items-center border border-neutral-300 rounded-xl bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variantId)
                          }
                          className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-xs sm:text-sm text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variantId)
                          }
                          className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="text-sm sm:text-base font-black text-neutral-900 w-24 text-right">
                        QAR {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="p-2 text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Qatar Delivery Promise */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 flex items-center gap-3 text-xs text-neutral-600">
                <Truck className="w-5 h-5 text-[#8A1538] shrink-0" />
                <span>
                  <strong>Free Express Nationwide Delivery</strong> within Qatar. Cash on Delivery is collected safely at your doorstep.
                </span>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-5 lg:sticky lg:top-24">
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm divide-y divide-neutral-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-500">Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-neutral-900">QAR {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-neutral-500">Delivery Fee Across Qatar</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>

                <div className="flex items-center justify-between pt-3 text-base sm:text-lg">
                  <span className="font-bold text-neutral-900">Total</span>
                  <span className="font-black text-[#8A1538]">
                    QAR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#8A1538] hover:bg-[#700f2c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Proceed to Cash on Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsAppOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order Entire Cart on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Safe &amp; Verified Doorstep Transaction</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
