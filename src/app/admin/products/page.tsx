import React from "react";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "@/components/admin/product-form";
import { ProductActions } from "@/components/admin/product-actions";
import { Category, Product } from "@/types/database";
import { Package, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = createAdminClient();

  const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(*), product_images(*)")
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  const products = (productsData as unknown as Product[]) || [];
  const categories = (categoriesData as Category[]) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Manage prices, stock, promotions, warranty and Cloudinary images.
          </p>
        </div>

        <ProductForm categories={categories} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="text-base font-bold text-neutral-800">
              No products found in the database
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              Click &ldquo;Add New Product&rdquo; above or use &ldquo;Populate Initial Categories &amp; Deals&rdquo; on the Dashboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 text-neutral-500 uppercase font-bold text-[10px]">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Price</th>
                  <th className="py-3.5 px-3">Stock</th>
                  <th className="py-3.5 px-3">Badges &amp; Deals</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {products.map((prod) => {
                  const img =
                    prod.product_images?.find((i) => i.is_primary)?.image_url ||
                    prod.product_images?.[0]?.image_url;

                  return (
                    <tr key={prod.id} className="hover:bg-neutral-50/70">
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                            {img ? (
                              <Image
                                src={img}
                                alt={prod.name}
                                fill
                                sizes="44px"
                                className="object-contain p-0.5"
                              />
                            ) : (
                              <span className="text-base">📱</span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block line-clamp-1">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              /{prod.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-neutral-600">
                        {prod.category?.name || "Uncategorized"}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-[#8A1538]">
                          QAR {prod.price.toLocaleString()}
                        </span>
                        {prod.compare_at_price && (
                          <span className="text-[10px] text-neutral-400 line-through block">
                            QAR {prod.compare_at_price.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-semibold ${
                            prod.stock < 5 ? "text-rose-600 font-bold" : "text-neutral-700"
                          }`}
                        >
                          {prod.stock} in stock
                        </span>
                      </td>

                      {/* Badges / Deal flags */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {prod.is_today_deal && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded text-[9px] font-bold">
                              Today&apos;s Deal
                            </span>
                          )}
                          {prod.is_best_deal && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[9px] font-bold">
                              Best Deal
                            </span>
                          )}
                          {prod.is_featured && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px] font-bold">
                              Featured
                            </span>
                          )}
                          {prod.badge_text && (
                            <span className="px-1.5 py-0.5 bg-[#F59E0B]/20 text-neutral-900 rounded text-[9px] font-bold flex items-center gap-0.5">
                              <Tag className="w-2.5 h-2.5" />
                              {prod.badge_text}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.is_active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {prod.is_active ? "Active" : "Hidden"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <ProductActions
                          productId={prod.id}
                          isActive={prod.is_active}
                          productName={prod.name}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
