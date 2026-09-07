import React from "react";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryActions } from "@/components/admin/category-actions";
import { Category } from "@/types/database";
import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  const categories = (data as Category[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Manage public navigation categories, images, and sort order.
          </p>
        </div>

        <CategoryForm />
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Layers className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No Categories Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              Add your first category or click &ldquo;Populate Initial 10 Categories&rdquo; on the Dashboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 text-neutral-500 uppercase font-bold text-[10px]">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-3">Slug</th>
                  <th className="py-3.5 px-3">Description</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">
                      #{cat.display_order}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          {cat.image_url ? (
                            <Image
                              src={cat.image_url}
                              alt={cat.name}
                              fill
                              sizes="36px"
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-sm">📦</span>
                          )}
                        </div>
                        <span className="font-bold text-neutral-900">
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-neutral-500">
                      {cat.slug}
                    </td>

                    <td className="py-3.5 px-3 text-neutral-500 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cat.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {cat.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <CategoryActions
                        categoryId={cat.id}
                        categoryName={cat.name}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
