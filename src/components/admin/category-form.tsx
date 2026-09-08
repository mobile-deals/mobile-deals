"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction, updateCategoryAction } from "@/app/actions/admin";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Category } from "@/types/database";
import { Plus, Edit2, X, Loader2, Layers } from "lucide-react";

export function CategoryForm({
  category,
  trigger,
}: {
  category?: Category;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(category?.id);

  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [description, setDescription] = useState(category?.description || "");
  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [displayOrder, setDisplayOrder] = useState(String(category?.display_order ?? 0));
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let res;
      if (isEditing && category?.id) {
        res = await updateCategoryAction(category.id, {
          name,
          slug,
          description: description || undefined,
          image_url: imageUrl || undefined,
          display_order: parseInt(displayOrder) || 0,
          is_active: isActive,
        });
      } else {
        res = await createCategoryAction({
          name,
          slug,
          description: description || undefined,
          image_url: imageUrl || undefined,
          display_order: parseInt(displayOrder) || 0,
          is_active: isActive,
        });
      }

      if (!res.success) {
        throw new Error(res.error || "Failed to save category.");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8A1538] hover:bg-[#6c102c] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#ff4b77]" />
                <h2 className="text-base font-black text-white tracking-tight">
                  {isEditing ? `Edit "${category?.name}"` : "Create New Category"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Keyboard & Mouse"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="keyboard-mouse"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-[#8A1538]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-[#8A1538]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for category storefront banner"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Category Cover Image"
                folder="mobile-deals/categories"
              />

              <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#8A1538] rounded"
                />
                <span className="font-semibold text-emerald-400">Active in Store Navigation</span>
              </label>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#8A1538] hover:bg-[#6c102c] text-white font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isEditing ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
