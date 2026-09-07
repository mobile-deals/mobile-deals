"use client";

import React, { useState } from "react";
import { createProductAction } from "@/app/actions/admin";
import { Category } from "@/types/database";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Plus, X, Loader2 } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_id: categories[0]?.id || "",
    price: "",
    compare_at_price: "",
    stock: "10",
    short_description: "",
    description: "",
    free_gift: "",
    warranty: "1 Year Official Qatar Warranty",
    badge_text: "",
    image_url: "",
    is_today_deal: false,
    is_best_deal: false,
    is_featured: false,
    is_best_seller: false,
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, name: val, slug: generatedSlug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please fill in the product name and price.");
      return;
    }

    setLoading(true);
    const res = await createProductAction({
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      category_id: formData.category_id || null,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price
        ? parseFloat(formData.compare_at_price)
        : null,
      stock: parseInt(formData.stock) || 10,
      short_description: formData.short_description,
      description: formData.description,
      free_gift: formData.free_gift,
      warranty: formData.warranty,
      badge_text: formData.badge_text,
      image_url: formData.image_url,
      is_today_deal: formData.is_today_deal,
      is_best_deal: formData.is_best_deal,
      is_featured: formData.is_featured,
      is_best_seller: formData.is_best_seller,
    });
    setLoading(false);

    if (res.success) {
      setIsOpen(false);
      setFormData({
        name: "",
        slug: "",
        category_id: categories[0]?.id || "",
        price: "",
        compare_at_price: "",
        stock: "10",
        short_description: "",
        description: "",
        free_gift: "",
        warranty: "1 Year Official Qatar Warranty",
        badge_text: "",
        image_url: "",
        is_today_deal: false,
        is_best_deal: false,
        is_featured: false,
        is_best_seller: false,
      });
    } else {
      alert("Failed to create product: " + res.error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8A1538] hover:bg-[#700f2c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Product</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">
                Add New Tech Product
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Samsung Galaxy S25 FE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Slug (URL Friendly)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="samsung-galaxy-s25-fe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:border-[#8A1538]"
                  >
                    <option value="">None / Unassigned</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Price (QAR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="1829"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Old Price / Compare (QAR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price}
                    onChange={(e) =>
                      setFormData({ ...formData, compare_at_price: e.target.value })
                    }
                    placeholder="2199"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
                  />
                </div>
              </div>

              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="mobile-deals/products"
                label="Product Image (Cloudinary Direct)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge_text}
                    onChange={(e) =>
                      setFormData({ ...formData, badge_text: e.target.value })
                    }
                    placeholder="e.g. Free Gift, Deal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Free Gift Offer
                  </label>
                  <input
                    type="text"
                    value={formData.free_gift}
                    onChange={(e) =>
                      setFormData({ ...formData, free_gift: e.target.value })
                    }
                    placeholder="e.g. Free Buds / Charger"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({ ...formData, short_description: e.target.value })
                  }
                  placeholder="e.g. 12GB RAM / 256GB Storage"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                />
              </div>

              {/* Deal Flags */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
                <span className="font-bold text-neutral-700 block mb-1">
                  Promotional Placement:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_today_deal}
                      onChange={(e) =>
                        setFormData({ ...formData, is_today_deal: e.target.checked })
                      }
                      className="rounded text-[#8A1538] focus:ring-[#8A1538]"
                    />
                    <span className="font-semibold text-neutral-800">
                      Today&apos;s Deal
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_best_deal}
                      onChange={(e) =>
                        setFormData({ ...formData, is_best_deal: e.target.checked })
                      }
                      className="rounded text-[#8A1538] focus:ring-[#8A1538]"
                    />
                    <span className="font-semibold text-neutral-800">
                      Best Deal
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      className="rounded text-[#8A1538] focus:ring-[#8A1538]"
                    />
                    <span className="font-semibold text-neutral-800">
                      Featured
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_best_seller}
                      onChange={(e) =>
                        setFormData({ ...formData, is_best_seller: e.target.checked })
                      }
                      className="rounded text-[#8A1538] focus:ring-[#8A1538]"
                    />
                    <span className="font-semibold text-neutral-800">
                      Best Seller
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#8A1538] hover:bg-[#700f2c] text-white font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
