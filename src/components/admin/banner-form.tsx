"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createBannerAction, updateBannerAction } from "@/app/actions/admin";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Banner } from "@/types/database";
import {
  Plus,
  Edit2,
  X,
  Loader2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Link2,
  MessageCircle,
} from "lucide-react";

export function BannerForm({
  banner,
  trigger,
}: {
  banner?: Banner;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isEditing = Boolean(banner?.id);

  // Form State
  const [title, setTitle] = useState(banner?.title || "");
  const [highlightedText, setHighlightedText] = useState(
    banner?.highlighted_text || ""
  );
  const [description, setDescription] = useState(
    banner?.description || ""
  );
  const [primaryCtaText, setPrimaryCtaText] = useState(
    banner?.primary_cta_text || ""
  );
  const [primaryCtaLink, setPrimaryCtaLink] = useState(
    banner?.primary_cta_link || ""
  );
  const [secondaryCtaText, setSecondaryCtaText] = useState(
    banner?.secondary_cta_text || ""
  );
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(
    banner?.secondary_cta_link || ""
  );
  const [desktopImageUrl, setDesktopImageUrl] = useState(
    banner?.desktop_image_url || ""
  );
  const [mobileImageUrl, setMobileImageUrl] = useState(
    banner?.mobile_image_url || ""
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(banner?.display_order ?? 1)
  );
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopImageUrl.trim()) {
      setError("Please upload or provide a banner background image.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bannerData = {
        title: title.trim(),
        highlighted_text: highlightedText?.trim() || null,
        description: description?.trim() || null,
        primary_cta_text: primaryCtaText?.trim() || null,
        primary_cta_link: primaryCtaLink?.trim() || null,
        secondary_cta_text: secondaryCtaText?.trim() || null,
        secondary_cta_link: secondaryCtaLink?.trim() || null,
        desktop_image_url: desktopImageUrl.trim(),
        mobile_image_url: mobileImageUrl?.trim() || null,
        position: "hero",
        display_order: parseInt(displayOrder) || 1,
        is_active: isActive,
      };

      let res;
      if (isEditing && banner?.id) {
        res = await updateBannerAction(banner.id, bannerData);
      } else {
        res = await createBannerAction(bannerData);
      }

      if (!res.success) {
        throw new Error(res.error || "Failed to save banner.");
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
          onClick={() => {
            setIsOpen(true);
            setError(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8A1538] hover:bg-[#6c102c] text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full my-6 flex flex-col shadow-2xl overflow-hidden text-neutral-100">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#8A1538]/20 text-[#ff4b77]">
                  {isEditing ? <Edit2 className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {isEditing ? "Edit Hero Banner" : "New Hero Banner"}
                  </h2>
                  <p className="text-[11px] text-neutral-400">
                    Upload your banner graphic. All text and button fields are optional.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto max-h-[75vh]">
              {/* 1. Main Banner Image Upload (Required) */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block text-xs">
                  Banner Background Image * <span className="text-[10px] text-neutral-400 font-normal">(Edge-to-edge full width)</span>
                </label>
                <ImageUploader
                  value={desktopImageUrl}
                  onChange={setDesktopImageUrl}
                  label="Upload or Paste Image URL"
                  folder="mobile-deals/banners"
                />
              </div>

              {/* 2. Optional Text Overlay Section */}
              <div className="space-y-3.5 pt-2 border-t border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-300 text-xs">
                    Text Overlays (Optional)
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Leave blank for clean image-only banner
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-neutral-400 block text-xs">
                      Main Headline (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Latest Tech Deals in Qatar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-400 block text-xs">
                      Small Tag / Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={highlightedText}
                      onChange={(e) => setHighlightedText(e.target.value)}
                      placeholder="e.g. Special Offer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-400 block text-xs">
                    Description Text (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short subtitle or promotional details..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538]"
                  />
                </div>
              </div>

              {/* 3. Button / Destination Links (Optional) */}
              <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-300 text-xs">
                    Link &amp; Action Button (Optional)
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Configure banner CTA or destination
                  </span>
                </div>

                {/* Action Type Selector */}
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-400 block text-xs">
                    Action Type / Destination
                  </label>
                  <select
                    value={
                      primaryCtaLink === "/service-enquiry"
                        ? "service_enquiry"
                        : primaryCtaLink === "/#deals"
                        ? "deals"
                        : primaryCtaLink === "/#categories"
                        ? "categories"
                        : primaryCtaLink === "/products"
                        ? "products"
                        : primaryCtaLink
                        ? "custom"
                        : "none"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "service_enquiry") {
                        setPrimaryCtaLink("/service-enquiry");
                        if (!primaryCtaText || primaryCtaText === "Shop Now" || primaryCtaText === "Explore Deals" || primaryCtaText === "Browse Categories") {
                          setPrimaryCtaText("Service Enquiry");
                        }
                      } else if (val === "deals") {
                        setPrimaryCtaLink("/#deals");
                        if (!primaryCtaText || primaryCtaText === "Service Enquiry") {
                          setPrimaryCtaText("Explore Deals");
                        }
                      } else if (val === "categories") {
                        setPrimaryCtaLink("/#categories");
                        if (!primaryCtaText || primaryCtaText === "Service Enquiry") {
                          setPrimaryCtaText("Browse Categories");
                        }
                      } else if (val === "products") {
                        setPrimaryCtaLink("/products");
                        if (!primaryCtaText || primaryCtaText === "Service Enquiry") {
                          setPrimaryCtaText("Shop All Products");
                        }
                      } else if (val === "none") {
                        setPrimaryCtaLink("");
                        setPrimaryCtaText("");
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538] text-xs cursor-pointer"
                  >
                    <option value="none">No Action / Pure Graphic</option>
                    <option value="service_enquiry">🛠️ Service Enquiry Form (/service-enquiry)</option>
                    <option value="deals">🔥 Best Deals Section (/#deals)</option>
                    <option value="categories">📦 Categories (/#categories)</option>
                    <option value="products">🛍️ All Products Page (/products)</option>
                    <option value="custom">🔗 Custom Link / URL</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-400 block text-xs">
                      Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={primaryCtaText}
                      onChange={(e) => setPrimaryCtaText(e.target.value)}
                      placeholder="e.g. Service Enquiry or Shop Now"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-400 block text-xs">
                      Destination URL
                    </label>
                    <input
                      type="text"
                      value={primaryCtaLink}
                      onChange={(e) => setPrimaryCtaLink(e.target.value)}
                      placeholder="e.g. /service-enquiry or /#deals"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#8A1538]"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500 italic">
                  Tip: When Button Text is provided, an interactive CTA button will be displayed on the banner. If Button Text is left blank, the entire banner image will link to the Destination URL.
                </p>
              </div>

              {/* 4. Collapsible Advanced Options */}
              <div className="pt-2 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-white transition-colors"
                >
                  <span>{showAdvanced ? "Hide Advanced Options" : "+ Show Mobile Image & Ordering Options"}</span>
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 animate-fade-in">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-400 text-xs">
                        Mobile Specific Banner Image (Optional)
                      </label>
                      <ImageUploader
                        value={mobileImageUrl}
                        onChange={setMobileImageUrl}
                        label="Upload Mobile Image (Optional)"
                        folder="mobile-deals/banners"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="font-semibold text-neutral-400 text-xs">
                          Display Sequence (Order)
                        </label>
                        <input
                          type="number"
                          value={displayOrder}
                          onChange={(e) => setDisplayOrder(e.target.value)}
                          placeholder="1"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-neutral-400 text-xs">
                          WhatsApp Button Text (Optional)
                        </label>
                        <input
                          type="text"
                          value={secondaryCtaText}
                          onChange={(e) => setSecondaryCtaText(e.target.value)}
                          placeholder="e.g. Order on WhatsApp"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <label className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#8A1538] rounded"
                />
                <span className="font-bold text-emerald-400">
                  Active (Show on Home Page Hero)
                </span>
              </label>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                  <span>{isEditing ? "Save Changes" : "Publish Banner"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
