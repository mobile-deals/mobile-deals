"use client";

import React, { useState } from "react";
import { updateSiteSettingsAction } from "@/app/actions/admin";
import { SiteSettings } from "@/types/database";
import { Loader2, CheckCircle2, Settings, MessageCircle, Truck, ShieldCheck, DollarSign } from "lucide-react";

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
    free_delivery_threshold: initialSettings.free_delivery_threshold || 100,
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl text-xs">
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-6 text-neutral-100">
        <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
          <Settings className="w-5 h-5 text-[#ff4b77]" />
          <div>
            <h2 className="text-base font-black text-white tracking-tight">
              Store &amp; Contact Configurations
            </h2>
            <p className="text-xs text-neutral-400">
              Manage global variables, official WhatsApp numbers, and Qatar currency formatting.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="font-semibold text-neutral-300">
              Store Brand Name
            </label>
            <input
              type="text"
              value={formData.store_name}
              onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#8A1538]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official WhatsApp Order Number (Qatar) *</span>
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              placeholder="+974 5500 0000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:outline-none focus:border-[#8A1538]"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Used across the entire storefront for 1-click WhatsApp order generation and customer checkout messages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                Customer Support Phone
              </label>
              <input
                type="text"
                value={formData.support_phone}
                onChange={(e) => setFormData({ ...formData, support_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-[#8A1538]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                Support Email
              </label>
              <input
                type="email"
                value={formData.store_email}
                onChange={(e) => setFormData({ ...formData, store_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-[#8A1538]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                Default Currency Code
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold focus:outline-none focus:border-[#8A1538]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-300">
                Free Delivery Threshold (QAR)
              </label>
              <input
                type="number"
                value={formData.free_delivery_threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    free_delivery_threshold: Number(e.target.value) || 0,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-[#8A1538]"
              />
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-neutral-800 flex items-center justify-between">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Store settings saved successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#8A1538] hover:bg-[#6c102c] text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Store Settings</span>
          </button>
        </div>
      </div>
    </form>
  );
}
