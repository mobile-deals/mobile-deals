"use client";

import React, { useState } from "react";
import { updateSiteSettingsAction } from "@/app/actions/admin";
import { SiteSettings } from "@/types/database";
import { Loader2, CheckCircle2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    store_name: initialSettings.store_name || "MOBILE DEALS",
    whatsapp_number: initialSettings.whatsapp_number || "+97455000000",
    support_phone: initialSettings.support_phone || "+97455000000",
    store_email: initialSettings.store_email || "support@mobiledeals.qa",
    currency: initialSettings.currency || "QAR",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateSiteSettingsAction(formData);
    setLoading(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Failed to save settings: " + res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl text-xs">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-black text-neutral-900 tracking-tight">
          Store &amp; Contact Configurations
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={formData.store_name}
              onChange={(e) =>
                setFormData({ ...formData, store_name: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Store WhatsApp Order Number *
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp_number}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp_number: e.target.value })
              }
              placeholder="+974 5500 0000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Used across the entire website for 1-click WhatsApp order generation and support.
            </p>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Customer Support Phone
            </label>
            <input
              type="text"
              value={formData.support_phone}
              onChange={(e) =>
                setFormData({ ...formData, support_phone: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Official Store Email
            </label>
            <input
              type="email"
              value={formData.store_email}
              onChange={(e) =>
                setFormData({ ...formData, store_email: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Default Currency Display
            </label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#8A1538]"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings Saved Successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#8A1538] hover:bg-[#700f2c] text-white font-bold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </form>
  );
}
