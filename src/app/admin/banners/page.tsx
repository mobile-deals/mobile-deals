import React from "react";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { BannerForm } from "@/components/admin/banner-form";
import { BannerActions } from "@/components/admin/banner-actions";
import { Banner } from "@/types/database";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });

  const banners = (data as Banner[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Hero &amp; Promotional Banners
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Manage your homepage hero slides and promotional graphics.
          </p>
        </div>

        <BannerForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-neutral-200 shadow-xs p-6">
            <ImageIcon className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No Banners Configured</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              When no banners exist, the storefront gracefully displays the default Qatar approved hero showcase.
            </p>
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="relative w-full h-48 bg-neutral-100">
                <Image
                  src={b.desktop_image_url}
                  alt={b.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 font-mono">
                      Order #{b.display_order}
                    </span>
                    <h3 className="text-base font-bold text-neutral-900 line-clamp-1">
                      {b.title}
                    </h3>
                  </div>

                  <BannerActions bannerId={b.id} bannerTitle={b.title} />
                </div>

                {b.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {b.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 text-xs">
                  <span className="font-semibold text-[#8A1538]">
                    Button: {b.primary_cta_text} → {b.primary_cta_link}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
