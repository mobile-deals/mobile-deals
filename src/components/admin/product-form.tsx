"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction, ProductInputPayload } from "@/app/actions/admin";
import { Category, Brand, Product } from "@/types/database";
import { ImageUploader } from "./image-uploader";
import {
  Plus,
  Edit2,
  X,
  Loader2,
  Tag,
  Sparkles,
  Layers,
  DollarSign,
  Package,
  Gift,
  Shield,
  Clock,
  Trash2,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  brands?: Brand[];
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ProductForm({
  product,
  categories,
  brands = [],
  trigger,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(product?.id);

  // Form State
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [brandId, setBrandId] = useState(product?.brand_id || "");
  const [shortDesc, setShortDesc] = useState(product?.short_description || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price ? String(product.compare_at_price) : ""
  );
  const [stock, setStock] = useState(product?.stock !== undefined ? String(product.stock) : "10");
  const [warranty, setWarranty] = useState(product?.warranty || "1 Year Qatar Official Warranty");
  const [freeGift, setFreeGift] = useState(product?.free_gift || "");
  const [badgeText, setBadgeText] = useState(product?.badge_text || "");

  // Promotional Flags
  const [isTodayDeal, setIsTodayDeal] = useState(product?.is_today_deal ?? false);
  const [isBestDeal, setIsBestDeal] = useState(product?.is_best_deal ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.is_best_seller ?? false);
  const [isNewArrival, setIsNewArrival] = useState(product?.is_new_arrival ?? false);
  const [dealEndsAt, setDealEndsAt] = useState(
    product?.deal_ends_at ? product.deal_ends_at.slice(0, 16) : ""
  );
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  // Images state
  const initialImages =
    product?.product_images && product.product_images.length > 0
      ? product.product_images.map((img) => ({
          image_url: img.image_url,
          cloudinary_public_id: img.cloudinary_public_id || null,
          is_primary: img.is_primary,
        }))
      : [{ image_url: "", cloudinary_public_id: null, is_primary: true }];

  const [images, setImages] = useState(initialImages);

  // Variants state
  const initialVariants =
    product?.product_variants && product.product_variants.length > 0
      ? product.product_variants.map((v) => ({
          name: v.name,
          sku: v.sku || "",
          price: v.price ? String(v.price) : "",
          stock: String(v.stock ?? 5),
        }))
      : [];

  const [variants, setVariants] = useState(initialVariants);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleAddImage = (url: string) => {
    if (!url) return;
    setImages((prev) => {
      const filtered = prev.filter((i) => i.image_url.trim().length > 0);
      return [...filtered, { image_url: url, cloudinary_public_id: null, is_primary: filtered.length === 0 }];
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      if (updated.length > 0 && !updated.some((i) => i.is_primary)) {
        updated[0].is_primary = true;
      }
      return updated.length > 0 ? updated : [{ image_url: "", cloudinary_public_id: null, is_primary: true }];
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_primary: idx === index,
      }))
    );
  };

  // Add/Remove Variant
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "12GB / 256GB - Phantom Black", sku: "", price: price || "0", stock: "5" },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: string, val: string) => {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === index ? { ...v, [field]: val } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!name.trim()) throw new Error("Product name is required.");
      if (!slug.trim()) throw new Error("Product slug is required.");
      if (!price || Number(price) <= 0) throw new Error("A valid price is required.");

      const validImages = images
        .filter((img) => img.image_url.trim().length > 0)
        .map((img, idx) => ({
          image_url: img.image_url.trim(),
          cloudinary_public_id: img.cloudinary_public_id,
          is_primary: img.is_primary ?? idx === 0,
          display_order: idx + 1,
        }));

      const formattedVariants = variants.map((v) => ({
        name: v.name,
        sku: v.sku || undefined,
        price: v.price ? Number(v.price) : undefined,
        stock: v.stock ? Number(v.stock) : 5,
      }));

      const payload: ProductInputPayload = {
        name,
        slug,
        category_id: categoryId || null,
        brand_id: brandId || null,
        short_description: shortDesc || undefined,
        description: description || undefined,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        stock: Number(stock) || 0,
        warranty: warranty || undefined,
        free_gift: freeGift || undefined,
        badge_text: badgeText || undefined,
        is_today_deal: isTodayDeal,
        is_best_deal: isBestDeal,
        is_featured: isFeatured,
        is_best_seller: isBestSeller,
        is_new_arrival: isNewArrival,
        deal_ends_at: dealEndsAt ? new Date(dealEndsAt).toISOString() : null,
        is_active: isActive,
        images: validImages,
        variants: formattedVariants,
      };

      let res;
      if (isEditing && product?.id) {
        res = await updateProductAction(product.id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (!res.success) {
        throw new Error(res.error || "Failed to save product.");
      }

      setOpen(false);
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8A1538] hover:bg-[#6c102c] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl my-8 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100">
            {/* Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-neutral-900 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#8A1538]/20 text-[#ff4b77]">
                  {isEditing ? <Edit2 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    {isEditing ? `Edit "${product?.name}"` : "Create New Product"}
                  </h2>
                  <p className="text-[11px] text-neutral-400">
                    Configure Qatar catalog pricing, Cloudinary images, badges, and variants.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* SECTION 1: Basic Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#ff4b77]" />
                  <span>1. General Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-neutral-300">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Samsung Galaxy Z Fold 8 5G"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="samsung-galaxy-z-fold-8"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Brand</label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                    >
                      <option value="">-- Select Brand --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Warranty
                    </label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="1 Year Official Qatar Warranty"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-neutral-300">
                      Short Subtitle / Variant Specs
                    </label>
                    <input
                      type="text"
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="e.g. 12GB RAM / 256GB Storage - Phantom Black"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Pricing & Inventory */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Pricing &amp; Stock</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Sale Price (QAR) *
                    </label>
                    <input
                      type="number"
                      required
                      step="any"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="5649"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Compare Price (Original QAR)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="6199"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Marketing Badges & Promotional Flags */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. Promotions &amp; Badges</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Custom Badge (e.g. &ldquo;Free Gift&rdquo;, &ldquo;With Buds&rdquo;)
                    </label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="Free Gift"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Free Gift Description
                    </label>
                    <input
                      type="text"
                      value={freeGift}
                      onChange={(e) => setFreeGift(e.target.value)}
                      placeholder="Samsung 65W GaN Fast Charger"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                    <input
                      type="checkbox"
                      checked={isTodayDeal}
                      onChange={(e) => setIsTodayDeal(e.target.checked)}
                      className="w-4 h-4 accent-[#8A1538] rounded"
                    />
                    <span className="font-semibold text-neutral-200">Today&apos;s Deal</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                    <input
                      type="checkbox"
                      checked={isBestDeal}
                      onChange={(e) => setIsBestDeal(e.target.checked)}
                      className="w-4 h-4 accent-[#8A1538] rounded"
                    />
                    <span className="font-semibold text-neutral-200">Best Deal</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#8A1538] rounded"
                    />
                    <span className="font-semibold text-neutral-200">Featured</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="w-4 h-4 accent-[#8A1538] rounded"
                    />
                    <span className="font-semibold text-neutral-200">Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="w-4 h-4 accent-[#8A1538] rounded"
                    />
                    <span className="font-semibold text-neutral-200">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#8A1538] rounded"
                    />
                    <span className="font-semibold text-emerald-400">Active in Store</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: Multi-Image Gallery */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>4. Product Images (Cloudinary)</span>
                </h3>

                <ImageUploader
                  value=""
                  onChange={handleAddImage}
                  label="Upload to Cloudinary or Add Image URL"
                />

                {/* Gallery List */}
                <div className="space-y-2 mt-3">
                  {images
                    .filter((img) => img.image_url.trim().length > 0)
                    .map((img, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img
                            src={img.image_url}
                            alt="thumb"
                            className="w-9 h-9 object-contain rounded bg-neutral-900 border border-neutral-800 shrink-0"
                          />
                          <span className="font-mono text-neutral-400 truncate max-w-xs">
                            {img.image_url}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                              img.is_primary
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-neutral-800 text-neutral-400 hover:text-white"
                            }`}
                          >
                            {img.is_primary ? "Primary Cover" : "Make Cover"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* SECTION 5: Variants Matrix */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                    <span>5. Product Variants (Storage / Color)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff4b77] hover:underline"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Variant</span>
                  </button>
                </div>

                {variants.length === 0 ? (
                  <p className="text-[11px] text-neutral-500 italic p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    No variants added. The main price and stock will be used.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 items-center"
                      >
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                          placeholder="Variant Name (e.g. 512GB Black)"
                          className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                        />
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                          placeholder="Price (QAR)"
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs font-mono"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                            placeholder="Stock"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-neutral-800 flex items-center justify-end gap-3 sticky bottom-0 bg-neutral-900 z-10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#8A1538] hover:bg-[#6c102c] text-white font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isEditing ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
