import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings, getCategories } from "@/lib/data";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { MainNavbar } from "@/components/store/main-navbar";
import { CategoryNav } from "@/components/store/category-nav";
import { Footer } from "@/components/store/footer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";
import { ShieldCheck, Truck, Award, Phone, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Mobile Deals Qatar",
  description:
    "Learn more about Mobile Deals Qatar — your premier destination for authentic smartphones, electronics, accessories, and gadgets in Doha, Qatar.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar items={settings.announcement_bar?.items} />
      <MainNavbar
        whatsappNumber={settings.whatsapp_number}
        currency={settings.currency}
      />
      <CategoryNav categories={categories} />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16 w-full">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#8A1538]/10 text-[#8A1538] font-bold text-xs uppercase tracking-wider rounded-full mb-3">
            About Mobile Deals
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Qatar&apos;s Trusted Destination for Tech &amp; Gadgets
          </h1>
          <p className="text-sm text-neutral-500 mt-3 leading-relaxed">
            Delivering authentic smartphones, premium accessories, and electronics with fast doorstep delivery and Cash on Delivery across all municipalities in Qatar.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">100% Genuine Tech</h3>
            <p className="text-xs text-neutral-500">Every item is brand new, sealed, and authentic.</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Qatar-Wide Delivery</h3>
            <p className="text-xs text-neutral-500">Rapid doorstep shipping across Doha and beyond.</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Cash on Delivery</h3>
            <p className="text-xs text-neutral-500">Pay safely when your package arrives at your door.</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Direct WhatsApp Care</h3>
            <p className="text-xs text-neutral-500">Fast assistance and order tracking via WhatsApp.</p>
          </div>
        </div>

        {/* Story & Commitment */}
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#8A1538] rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Our Mission
            </h2>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            At Mobile Deals Qatar, our goal is to provide Qatar shoppers with top-tier technology at competitive prices. Whether you are looking for the newest flagship smartphones, audio gear, fast chargers, or ergonomic accessories, we ensure a seamless and safe shopping experience from checkout to doorstep.
          </p>

          <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Doha-based support &amp; genuine stock</span>
            </div>
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-[#8A1538] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#70102d] transition-colors"
            >
              Browse Shop Catalog
            </Link>
          </div>
        </div>
      </main>

      <Footer
        whatsappNumber={settings.whatsapp_number}
        storeEmail={settings.store_email}
        categories={categories}
      />
      <MobileBottomNav whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
