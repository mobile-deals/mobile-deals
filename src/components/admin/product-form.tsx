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
  Trash2,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Flame,
  Star,
  Award,
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
      const giftImgFromSpecs = product.specifications?.gift_image || "";
      const isGiftActive = Boolean(
        product.free_gift ||
          giftImgFromSpecs ||
          product.specifications?.gift_enabled === "true" ||
          (product.badge_text && product.badge_text.toLowerCase().includes("gift"))
      );
      setGiftEnabled(isGiftActive);
      setBadgeText(product.badge_text || (isGiftActive ? "Free Gift" : ""));
      setGiftName(product.free_gift || "");
      setGiftImage(giftImgFromSpecs);

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

  // Prevent background page from scrolling while modal is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

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

      // Prepare specifications ensuring gift_image and gift_enabled are stored in specifications JSON
      const finalSpecifications: Record<string, string> = {
        ...(product?.specifications || {}),
      };

      if (giftImage && giftImage.trim()) {
        finalSpecifications["gift_image"] = giftImage.trim();
      } else {
        delete finalSpecifications["gift_image"];
      }

      if (giftEnabled) {
        finalSpecifications["gift_enabled"] = "true";
      } else {
        delete finalSpecifications["gift_enabled"];
      }

      const payload: ProductInputPayload = {
        name: name.trim(),
        slug: slug.trim(),
        category_id: categoryId || null,
        brand_id: brandId || null,
        short_description: (shortDesc.trim() || null) as unknown as string,
        description: (description.trim() || null) as unknown as string,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        stock: stock !== "" ? Number(stock) : 10,
        warranty: (warranty.trim() || null) as unknown as string,
        free_gift: giftEnabled && giftName.trim() ? giftName.trim() : (null as unknown as string),
        badge_text: giftEnabled ? (badgeText.trim() || "Free Gift") : (badgeText.trim() || (null as unknown as string)),
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8A1538] hover:bg-[#6c102c] text-white font-bold text-xs transition-all hover:scale-102 active:scale-98 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-[96vw] max-w-7xl my-auto max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100">
            {/* Header */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-neutral-950/90 backdrop-blur-md z-20">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-[#8A1538]/20 text-[#ff4b77] border border-[#8A1538]/30">
                  {isEditing ? <Edit2 className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {isEditing ? `Edit Product "${product?.name}"` : "Create New Product"}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                    Configure Qatar catalog pricing, Cloudinary images, marketing badges, and variants.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-6 sm:mx-8 mt-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Scrollable Form Body - 2-Column Desktop Widescreen Layout */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (7 cols): General Information, Pricing, Variants */}
                <div className="lg:col-span-7 space-y-6">
                  {/* SECTION 1: General Product Information */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#ff4b77]" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                          1. General Product Information
                        </h3>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-normal">Catalog identity</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product Name */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Samsung Galaxy S25 Ultra 5G"
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] text-xs sm:text-sm"
                        />
                      </div>

                      {/* Slug */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          URL Slug *
                        </label>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="samsung-galaxy-s25-ultra-5g"
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] text-xs sm:text-sm"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Category
                        </label>
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] text-xs sm:text-sm cursor-pointer"
                        >
                          <option value="">-- Select Store Category --</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Brand */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Brand / Manufacturer
                        </label>
                        <select
                          value={brandId}
                          onChange={(e) => setBrandId(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] text-xs sm:text-sm cursor-pointer"
                        >
                          <option value="">-- Select Brand --</option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Warranty */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Warranty Coverage
                        </label>
                        <input
                          type="text"
                          value={warranty}
                          onChange={(e) => setWarranty(e.target.value)}
                          placeholder="1 Year Official Qatar Warranty"
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] text-xs sm:text-sm"
                        />
                      </div>

                      {/* Subtitle / Specs */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Short Subtitle / Key Highlight Specs
                        </label>
                        <input
                          type="text"
                          value={shortDesc}
                          onChange={(e) => setShortDesc(e.target.value)}
                          placeholder="e.g. 12GB RAM / 512GB Storage - Titanium Black - Snapdragon 8 Elite"
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] text-xs sm:text-sm"
                        />
                      </div>

                      {/* Detailed Description */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-semibold text-neutral-300 flex items-center justify-between text-xs">
                          <span>Detailed Description &amp; Overview</span>
                          <span className="text-[11px] text-neutral-500 font-normal">Shown in Product Overview tab</span>
                        </label>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Comprehensive product specifications, features, in-the-box contents, key highlights..."
                          className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] resize-y text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Pricing & Inventory */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                          2. Pricing &amp; Stock Inventory
                        </h3>
                      </div>
                      <span className="text-[11px] text-neutral-500">Amounts in Qatari Riyal (QAR)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Sale Price */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Sale Price (QAR) *
                        </label>
                        <input
                          type="number"
                          required
                          step="any"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="5649"
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono font-bold text-xs sm:text-sm focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
                        />
                      </div>

                      {/* Compare at Price */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Original Price (QAR)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={compareAtPrice}
                          onChange={(e) => setCompareAtPrice(e.target.value)}
                          placeholder="6199"
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
                        />
                      </div>

                      {/* Stock Count */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Available Stock Qty
                        </label>
                        <input
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          placeholder="10"
                          className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Product Variants */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-400" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                          3. Product Variants (Storage / Color Options)
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500/25 transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Variant</span>
                      </button>
                    </div>

                    {variants.length === 0 ? (
                      <p className="text-[11px] text-neutral-500 italic p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                        No variants configured. The primary product price and stock quantity will apply to all orders.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 text-[11px] font-bold text-neutral-400">
                          <span className="sm:col-span-5">Variant Title &amp; Specification</span>
                          <span className="sm:col-span-2">SKU Code</span>
                          <span className="sm:col-span-2">Price (QAR)</span>
                          <span className="sm:col-span-2">Stock Qty</span>
                          <span className="sm:col-span-1 text-right">Action</span>
                        </div>

                        {variants.map((v, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 items-center"
                          >
                            <div className="sm:col-span-5">
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                                placeholder="e.g. 512GB Titanium Black"
                                className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#8A1538]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                                placeholder="SKU-256GB"
                                className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#8A1538]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                                placeholder="Price"
                                className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#8A1538]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                                placeholder="Stock"
                                className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#8A1538]"
                              />
                            </div>
                            <div className="sm:col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(idx)}
                                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                title="Remove variant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (5 cols): Media Gallery, Marketing Badges, Visibility Switches */}
                <div className="lg:col-span-5 space-y-6">
                  {/* SECTION 4: Media Gallery */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                          4. Product Media Gallery
                        </h3>
                      </div>
                      <span className="text-[11px] text-neutral-500">Cloudinary CDN</span>
                    </div>

                    <div className="space-y-4">
                      <ImageUploader
                        value=""
                        onChange={handleAddImage}
                        label="Upload Image to Cloudinary"
                      />

                      {/* Gallery Grid of Uploaded Images */}
                      <div className="space-y-2.5 pt-1">
                        {images.filter((img) => img.image_url.trim().length > 0).length === 0 ? (
                          <p className="text-[11px] text-neutral-500 italic p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
                            No product images attached yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {images
                              .filter((img) => img.image_url.trim().length > 0)
                              .map((img, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs hover:border-neutral-700 transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <img
                                      src={img.image_url}
                                      alt="thumb"
                                      className="w-12 h-12 object-contain rounded-xl bg-neutral-950 border border-neutral-800 shrink-0 p-1"
                                    />
                                    <div className="min-w-0">
                                      <p className="font-mono text-[11px] text-neutral-300 truncate max-w-[170px]" title={img.image_url}>
                                        {img.image_url}
                                      </p>
                                      <span className="text-[10px] text-neutral-500">
                                        Slot #{idx + 1}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleSetPrimaryImage(idx)}
                                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                        img.is_primary
                                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                          : "bg-neutral-800 text-neutral-400 hover:text-white"
                                      }`}
                                    >
                                      {img.is_primary ? "✓ Cover" : "Make Cover"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(idx)}
                                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                      title="Delete image"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: Badges & Free Gift Offer */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                          5. Promotional Badge &amp; Free Gift
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-neutral-300 block text-xs">
                            Custom Badge Text
                          </label>
                          <input
                            type="text"
                            value={badgeText}
                            onChange={(e) => setBadgeText(e.target.value)}
                            placeholder="e.g. Free Gift, With Buds"
                            className="w-full h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-neutral-300 block text-xs">
                            Gift Item Name
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
                            placeholder="e.g. Samsung 45W Charger"
                            className="w-full h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] text-xs"
                          />
                        </div>
                      </div>

                      {/* Gift Image */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-300 block text-xs">
                          Gift Thumbnail Image (Optional)
                        </label>
                        <ImageUploader
                          value={giftImage}
                          onChange={(url) => {
                            setGiftImage(url);
                            if (url && !giftEnabled) {
                              setGiftEnabled(true);
                            }
                          }}
                          label="Upload Gift Thumbnail"
                          folder="mobile-deals/gifts"
                        />
                      </div>

                      {/* Gift Enabled Switch */}
                      <label className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={giftEnabled}
                          onChange={(e) => setGiftEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer mt-0.5"
                        />
                        <div>
                          <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5" />
                            <span>Enable Free Gift Badge on Storefront</span>
                          </span>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            Highlights the product with a promotional gift badge and gift subtitle.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* SECTION 6: Deal Toggles & Visibility */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                        6. Storefront Visibility &amp; Deals
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={isTodayDeal}
                          onChange={(e) => setIsTodayDeal(e.target.checked)}
                          className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                        />
                        <span className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span>Today&apos;s Deal</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={isBestDeal}
                          onChange={(e) => setIsBestDeal(e.target.checked)}
                          className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                        />
                        <span className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Best Deal</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                        />
                        <span className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Featured</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={isBestSeller}
                          onChange={(e) => setIsBestSeller(e.target.checked)}
                          className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                        />
                        <span className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Best Seller</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={isNewArrival}
                          onChange={(e) => setIsNewArrival(e.target.checked)}
                          className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                        />
                        <span className="font-semibold text-neutral-200 text-xs flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-cyan-400" />
                          <span>New Arrival</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="w-4 h-4 accent-[#8A1538] rounded cursor-pointer"
                        />
                        <span className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active in Store</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Action Buttons Footer */}
              <div className="mt-6 pt-5 border-t border-neutral-800 flex items-center justify-end gap-3 sticky bottom-0 bg-neutral-900 py-3 z-10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl bg-[#8A1538] hover:bg-[#6c102c] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isEditing ? "Save Product Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
