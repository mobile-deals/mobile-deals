import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByCategory, getSiteSettings } from "@/lib/data";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { MainNavbar } from "@/components/store/main-navbar";
import { ProductCard } from "@/components/store/product-card";
import { TrustBar } from "@/components/store/trust-bar";
import { Footer } from "@/components/store/footer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";
import { ChevronRight, PackageOpen } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getProductsByCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | Mobile Deals Qatar`,
    description:
      category.description ||
      `Explore best deals on ${category.name} in Qatar with Cash on Delivery at Mobile Deals.`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [{ category, products }, settings] = await Promise.all([
    getProductsByCategory(slug),
    getSiteSettings(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar items={settings.announcement_bar?.items} />
      <MainNavbar whatsappNumber={settings.whatsapp_number} />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-neutral-50/80 border-b border-neutral-200/80 py-2.5 text-xs text-neutral-500"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#8A1538] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href="/#categories" className="hover:text-[#8A1538] font-medium transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">{category.name}</span>
        </div>
      </nav>

      {/* Category Header */}
      <section className="bg-gradient-to-b from-neutral-50 to-white py-8 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#8A1538] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {category.name}
            </h1>
          </div>
          {category.description && (
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-2xl font-medium">
              {category.description}
            </p>
          )}
          <div className="mt-3 text-xs text-neutral-500 font-semibold">
            Showing {products.length} {products.length === 1 ? "Product" : "Products"}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {products.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-neutral-50 border border-dashed border-neutral-200">
            <PackageOpen className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-800">
              No products available in this category yet
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-5">
              Products assigned to {category.name} in the Admin Dashboard will appear here automatically.
            </p>
            <Link
              href="/#categories"
              className="inline-flex items-center px-5 py-2.5 bg-[#8A1538] text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-[#720e2c] transition-colors"
            >
              Browse Other Categories
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
