import React from "react";
import {
  getBanners,
  getCategories,
  getBestDeals,
  getFeaturedProducts,
  getSiteSettings,
  getTodayDeals,
} from "@/lib/data";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { MainNavbar } from "@/components/store/main-navbar";
import { CategoryNav } from "@/components/store/category-nav";
import { HeroSection } from "@/components/store/hero-section";
import { CategoryGrid } from "@/components/store/category-grid";
import { TodaysDeals } from "@/components/store/todays-deals";
import { FeaturedSection } from "@/components/store/featured-section";
import { TrustBar } from "@/components/store/trust-bar";
import { Footer } from "@/components/store/footer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";

// Dynamic rendering ensures fresh data while avoiding client-side waterfalls
export const revalidate = 60; // ISR cache 60 seconds

export default async function HomePage() {
  // Efficient parallel data fetching: single round-trip execution
  const [categories, banners, bestDeals, todayDeals, featuredProducts, settings] =
    await Promise.all([
      getCategories(),
      getBanners(),
      getBestDeals(),
      getTodayDeals(),
      getFeaturedProducts(),
      getSiteSettings(),
    ]);


  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar items={settings.announcement_bar?.items} />

      {/* 2. Main Sticky Navbar */}
      <MainNavbar whatsappNumber={settings.whatsapp_number} />

      {/* 3. Horizontal Category Navigation */}
      <CategoryNav categories={categories} />

      {/* 4. Hero Section with Approved Qatar Maroon Design */}
      <HeroSection
        banners={banners}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* 5. Shop by Category (Horizontal Grid) */}
      <CategoryGrid categories={categories} />

      {/* 6. Best Deals Section (Dynamic — only is_best_deal products, max 10) */}
      <TodaysDeals products={bestDeals} currency={settings.currency} />

      {/* 7. Featured Products Collection (if any active) */}
      <FeaturedSection
        products={featuredProducts}
        currency={settings.currency}
      />

      {/* 8. Black Bottom Trust Bar */}
      <TrustBar />

      {/* 9. Store Footer */}
      <Footer
        whatsappNumber={settings.whatsapp_number}
        storeEmail={settings.store_email}
        categories={categories}
      />

      {/* 10. Sticky Mobile Bottom Navigation */}
      <MobileBottomNav whatsappNumber={settings.whatsapp_number} />
    </main>
  );
}
