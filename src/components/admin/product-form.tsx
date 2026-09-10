"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  FileText,
} from "lucide-react";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  brands?: Brand[];
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
  onSuccess?: (savedProduct?: Product) => void;
}

export function ProductForm({
  product,
  categories,
  brands = [],
  isOpen,
  onClose,
  trigger,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isControlled = typeof isOpen === "boolean";
  const open = isControlled ? isOpen : internalOpen;

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const isEditing = Boolean(product?.id);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [warranty, setWarranty] = useState("1 Year Qatar Official Warranty");

  // Gift & Promotional Badge State
  const [badgeText, setBadgeText] = useState("");
  const [giftName, setGiftName] = useState("");
  const [giftImage, setGiftImage] = useState("");
  const [giftEnabled, setGiftEnabled] = useState(false);

  // Promotional Flags
  const [isTodayDeal, setIsTodayDeal] = useState(false);
  const [isBestDeal, setIsBestDeal] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [dealEndsAt, setDealEndsAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Images state
  const [images, setImages] = useState<
    Array<{ image_url: string; cloudinary_public_id: string | null; is_primary: boolean }>
  >([{ image_url: "", cloudinary_public_id: null, is_primary: true }]);

  // Variants state
  const [variants, setVariants] = useState<
    Array<{ name: string; sku: string; price: string; stock: string }>
  >([]);

  // Function to initialize/reset form with current product data or defaults
  const resetForm = useCallback(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setCategoryId(product.category_id || "");
      setBrandId(product.brand_id || "");
      setShortDesc(product.short_description || "");
      setDescription(product.description || "");
      setPrice(product.price !== undefined && product.price !== null ? String(product.price) : "");
      setCompareAtPrice(
        product.compare_at_price !== undefined && product.compare_at_price !== null
          ? String(product.compare_at_price)
          : ""
      );
      setStock(product.stock !== undefined && product.stock !== null ? String(product.stock) : "10");
      setWarranty(product.warranty || "1 Year Qatar Official Warranty");

      // Initialize Gift & Badge
      const isGiftActive = Boolean(
        product.free_gift ||
          product.specifications?.gift_enabled === "true" ||
          (product.badge_text && product.badge_text.toLowerCase().includes("gift"))
      );
      setGiftEnabled(isGiftActive);
      setBadgeText(product.badge_text || (isGiftActive ? "Free Gift" : ""));
      setGiftName(product.free_gift || "");
      setGiftImage(product.specifications?.gift_image || "");

      setIsTodayDeal(product.is_today_deal ?? false);
      setIsBestDeal(product.is_best_deal ?? false);
      setIsFeatured(product.is_featured ?? false);
      setIsBestSeller(product.is_best_seller ?? false);
      setIsNewArrival(product.is_new_arrival ?? false);
      setDealEndsAt(product.deal_ends_at ? product.deal_ends_at.slice(0, 16) : "");
      setIsActive(product.is_active ?? true);

      const loadedImages =
        product.product_images && product.product_images.length > 0
          ? product.product_images.map((img) => ({
              image_url: img.image_url,
              cloudinary_public_id: img.cloudinary_public_id || null,
              is_primary: Boolean(img.is_primary),
            }))
          : [{ image_url: "", cloudinary_public_id: null, is_primary: true }];
      setImages(loadedImages);

      const loadedVariants =
        product.product_variants && product.product_variants.length > 0
          ? product.product_variants.map((v) => ({
              name: v.name,
              sku: v.sku || "",
              price: v.price !== undefined && v.price !== null ? String(v.price) : "",
              stock: String(v.stock ?? 5),
            }))
          : [];
      setVariants(loadedVariants);
    } else {
      setName("");
      setSlug("");
      setCategoryId("");
      setBrandId("");
      setShortDesc("");
      setDescription("");
      setPrice("");
      setCompareAtPrice("");
      setStock("10");
      setWarranty("1 Year Qatar Official Warranty");
      setBadgeText("Free Gift");
      setGiftName("");
      setGiftImage("");
      setGiftEnabled(false);
      setIsTodayDeal(false);
      setIsBestDeal(false);
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsNewArrival(false);
      setDealEndsAt("");
      setIsActive(true);
      setImages([{ image_url: "", cloudinary_public_id: null, is_primary: true }]);
      setVariants([]);
    }
    setError(null);
  }, [product]);

  // Sync state whenever modal opens or product changes
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  // Auto-generate slug from name when creating
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
      return [
        ...filtered,
        { image_url: url, cloudinary_public_id: null, is_primary: filtered.length === 0 },
      ];
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
      if (!price || Number(price) <= 0) throw new Error("A valid positive price is required.");

      const validImages = images
        .filter((img) => img.image_url.trim().length > 0)
        .map((img, idx) => ({
          image_url: img.image_url.trim(),
          cloudinary_public_id: img.cloudinary_public_id || null,
          is_primary: img.is_primary ?? idx === 0,
          display_order: idx + 1,
        }));

      const formattedVariants = variants.map((v) => ({
        name: v.name.trim(),
        sku: v.sku.trim() || undefined,
        price: v.price ? Number(v.price) : undefined,
        stock: v.stock ? Number(v.stock) : 5,
      }));

      // Only keep real product spec keys — gift fields are stored in dedicated columns
      const existingSpecs = { ...(product?.specifications || {}) } as Record<string, string>;
      delete existingSpecs["gift_enabled"];
      delete existingSpecs["gift_image"];
      const finalSpecifications: Record<string, string> = existingSpecs;

      const payload: ProductInputPayload = {
        name: name.trim(),
        slug: slug.trim(),
        category_id: categoryId || null,
        brand_id: brandId || null,
        short_description: shortDesc.trim() || null as unknown as string,
        description: description.trim() || null as unknown as string,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        stock: stock !== "" ? Number(stock) : 10,
        warranty: warranty.trim() || null as unknown as string,
        free_gift: giftEnabled && giftName.trim() ? giftName.trim() : null as unknown as string,
        badge_text: giftEnabled ? (badgeText.trim() || "Free Gift") : (badgeText.trim() || null as unknown as string),
        is_today_deal: isTodayDeal,
        is_best_deal: isBestDeal,
        is_featured: isFeatured,
        is_best_seller: isBestSeller,
        is_new_arrival: isNewArrival,
        deal_ends_at: dealEndsAt ? new Date(dealEndsAt).toISOString() : null,
        is_active: isActive,
        specifications: finalSpecifications,
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

      handleClose();
      router.refresh();
      if (onSuccess) onSuccess(res.data as Product | undefined);
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => (isControlled ? undefined : setInternalOpen(true))} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => (isControlled ? undefined : setInternalOpen(true))}
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
                onClick={handleClose}
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

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-neutral-300 flex items-center justify-between">
                      <span>Detailed Description</span>
                      <span className="text-[10px] text-neutral-500 font-normal">Shown as "Product Overview" on store page</span>
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Comprehensive product specifications, features, in-the-box contents..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] resize-y text-xs"
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>3. Promotions &amp; Badges</span>
                  </h3>
                </div>

                {/* Free Gift & Custom Badge Inputs */}
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300 flex items-center justify-between">
                        <span>Custom Badge</span>
                        <span className="text-[10px] text-neutral-500 font-normal">e.g. Free Gift, With Buds</span>
                      </label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="Free Gift"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300 flex items-center justify-between">
                        <span>Gift Name</span>
                        <span className="text-[10px] text-neutral-500 font-normal">Product item name</span>
                      </label>
                      <input
                        type="text"
                        value={giftName}
                        onChange={(e) => {
                          setGiftName(e.target.value);
                          if (e.target.value.trim() && !giftEnabled) {
                            setGiftEnabled(true);
                          }
                        }}
                        placeholder="e.g. Samsung 45 PD Charger"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
                      />
                    </div>
                  </div>

                  {/* Gift Image (Optional) */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-300 flex items-center justify-between">
                      <span>Gift Image (Optional)</span>
                      <span className="text-[10px] text-neutral-500 font-normal">Direct image URL or upload</span>
                    </label>
                    <ImageUploader
                      value={giftImage}
                      onChange={(url) => setGiftImage(url)}
                      label="Upload Gift Thumbnail or enter URL"
                    />
                  </div>

                  {/* Gift Enabled Checkbox */}
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={giftEnabled}
                      onChange={(e) => setGiftEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#8A1538] rounded"
                    />
                    <div>
                      <span className="font-semibold text-amber-400 text-xs flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Gift Enabled</span>
                      </span>
                      <p className="text-[10px] text-neutral-400">
                        When enabled, displays the promotional gift badge and gift subtitle on the product card.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Promotional Toggles */}
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
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold cursor-pointer"
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
