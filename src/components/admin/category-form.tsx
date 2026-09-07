"use client";

import React, { useState } from "react";
import { createCategoryAction } from "@/app/actions/admin";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Plus, X, Loader2 } from "lucide-react";

export function CategoryForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    display_order: "0",
  });

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
    if (!formData.name) return;

    setLoading(true);
    const res = await createCategoryAction({
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      image_url: formData.image_url,
      display_order: parseInt(formData.display_order) || 0,
      is_active: true,
    });
    setLoading(false);

    if (res.success) {
      setIsOpen(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        display_order: "0",
      });
    } else {
      alert("Error creating category: " + res.error);
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
        <span>Add Category</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-base font-black text-neutral-900 tracking-tight">
                Create Category
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Earphones & Buds"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="earphones-buds"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="mobile-deals/categories"
                label="Category Image (Cloudinary Direct)"
              />

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Category description..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#8A1538] text-white font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
