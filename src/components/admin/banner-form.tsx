"use client";

import React, { useState } from "react";
import { createBannerAction } from "@/app/actions/admin";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Plus, X, Loader2 } from "lucide-react";

export function BannerForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    highlighted_text: "",
    description: "",
    primary_cta_text: "Shop Now",
    primary_cta_link: "#deals",
    secondary_cta_text: "Order on WhatsApp",
    secondary_cta_link: "",
    desktop_image_url: "",
    display_order: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desktop_image_url) {
      alert("Please provide a banner title and image URL.");
      return;
    }

    setLoading(true);
    const res = await createBannerAction({
      title: formData.title,
      highlighted_text: formData.highlighted_text,
      description: formData.description,
      primary_cta_text: formData.primary_cta_text,
      primary_cta_link: formData.primary_cta_link,
      secondary_cta_text: formData.secondary_cta_text,
      secondary_cta_link: formData.secondary_cta_link,
      desktop_image_url: formData.desktop_image_url,
      display_order: parseInt(formData.display_order) || 0,
      is_active: true,
    });
    setLoading(false);

    if (res.success) {
      setIsOpen(false);
      setFormData({
        title: "",
        highlighted_text: "",
        description: "",
        primary_cta_text: "Shop Now",
        primary_cta_link: "#deals",
        secondary_cta_text: "Order on WhatsApp",
        secondary_cta_link: "",
        desktop_image_url: "",
        display_order: "1",
      });
    } else {
      alert("Error creating banner: " + res.error);
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
        <span>Add Hero Banner</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-base font-black text-neutral-900 tracking-tight">
                Create Hero Banner
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
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Latest Tech Best Deals in Qatar"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <ImageUploader
                value={formData.desktop_image_url}
                onChange={(url) =>
                  setFormData({ ...formData, desktop_image_url: url })
                }
                folder="mobile-deals/banners"
                label="Desktop Banner Image (Cloudinary Direct)"
              />

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
                  placeholder="Mobiles, accessories and more at the best prices..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#8A1538]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Primary CTA Text
                  </label>
                  <input
                    type="text"
                    value={formData.primary_cta_text}
                    onChange={(e) =>
                      setFormData({ ...formData, primary_cta_text: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    value={formData.primary_cta_link}
                    onChange={(e) =>
                      setFormData({ ...formData, primary_cta_link: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
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
                  <span>Save Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
