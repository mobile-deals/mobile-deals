import React from "react";
import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-medium">
          Configure global store properties, WhatsApp numbers, and notification defaults.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
