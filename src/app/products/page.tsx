import React from "react";
import { Metadata } from "next";
import { getAllProducts, getSiteSettings } from "@/lib/data";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { MainNavbar } from "@/components/store/main-navbar";
import { ProductCard } from "@/components/store/product-card";
import { TrustBar } from "@/components/store/trust-bar";
import { Footer } from "@/components/store/footer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";
import { ShoppingBag, PackageOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "All Products | Mobile Deals Qatar",
  description:
    "Shop the complete Mobile Deals Qatar catalog — smartphones, tablets, laptops, accessories and more. Fast delivery across Qatar with Cash on Delivery.",
};

export const revalidate = 60;

export default async function AllProductsPage() {
  const [products, settings] = await Promise.all([
    getAllProducts(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar items={settings.announcement_bar?.items} />
      <MainNavbar whatsappNumber={settings.whatsapp_number} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#8A1538]" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              All Products
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {products.length > 0
              ? `${products.length} product${products.length === 1 ? "" : "s"} available`
              : "Browse our full catalog"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-neutral-50 border border-dashed border-neutral-200">
            <PackageOpen className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-800">
              No products available right now
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1">
              Check back soon — new products are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                currency={settings.currency}
              />
            ))}
          </div>
        )}
      </main>

      <TrustBar />
      <Footer
        whatsappNumber={settings.whatsapp_number}
        storeEmail={settings.store_email}
      />
      <MobileBottomNav whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
