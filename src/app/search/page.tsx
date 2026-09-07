import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { searchProducts, getSiteSettings } from "@/lib/data";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { MainNavbar } from "@/components/store/main-navbar";
import { ProductCard } from "@/components/store/product-card";
import { TrustBar } from "@/components/store/trust-bar";
import { Footer } from "@/components/store/footer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";
import { Search, PackageOpen } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}" | Mobile Deals` : "Search Products | Mobile Deals",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const [products, settings] = await Promise.all([
    searchProducts(q),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar items={settings.announcement_bar?.items} />
      <MainNavbar whatsappNumber={settings.whatsapp_number} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <Search className="w-6 h-6 text-[#8A1538]" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Search Results
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {q.trim() ? (
              <>
                Showing {products.length} {products.length === 1 ? "result" : "results"} for &ldquo;
                <span className="text-neutral-900 font-semibold">{q}</span>&rdquo;
              </>
            ) : (
              "Please enter a product keyword above to search."
            )}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-neutral-50 border border-dashed border-neutral-200">
            <PackageOpen className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-800">
              {q.trim() ? `No products matching "${q}"` : "Search our tech catalog"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-6">
              Check your spelling or explore our popular categories and best deals.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 bg-[#8A1538] text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-[#720e2c]"
            >
              Back to Home Deals
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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
