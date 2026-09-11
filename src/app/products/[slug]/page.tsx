import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getSiteSettings } from "@/lib/data";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { MainNavbar } from "@/components/store/main-navbar";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductDetailsClient } from "@/components/store/product-details-client";

import { Footer } from "@/components/store/footer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";
import { ChevronRight, Shield } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url;

  return {
    title: `${product.name} | Best Price in Qatar`,
    description:
      product.short_description ||
      `Buy ${product.name} at Mobile Deals Qatar with Cash on Delivery and fast doorstep shipping.`,
    openGraph: {
      title: `${product.name} | Mobile Deals Qatar`,
      description:
        product.short_description || `Buy ${product.name} in Qatar at the best price.`,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url;

  // JSON-LD Structured Data for Google Product Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.short_description,
    image: primaryImage ? [primaryImage] : [],
    offers: {
      "@type": "Offer",
      priceCurrency: settings.currency || "QAR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  // Filter out internal gift/admin keys from the public-facing specs table
  const INTERNAL_SPEC_KEYS = new Set(["gift_enabled", "gift_image"]);
  const specs = Object.fromEntries(
    Object.entries((product.specifications || {}) as Record<string, string>).filter(
      ([key]) => !INTERNAL_SPEC_KEYS.has(key)
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AnnouncementBar items={settings.announcement_bar?.items} />
      <MainNavbar whatsappNumber={settings.whatsapp_number} />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="bg-neutral-50/80 border-b border-neutral-200/80 py-2.5 text-xs text-neutral-500"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#8A1538] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          {product.category && (
            <>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-[#8A1538] font-medium transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </>
          )}
          <span className="text-neutral-900 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </div>
      </nav>

      {/* Product Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <ProductGallery
              images={product.product_images}
              productName={product.name}
            />
          </div>

          {/* Right Column: Information & Checkout Options */}
          <div className="lg:col-span-6">
            <ProductDetailsClient
              product={product}
              whatsappNumber={settings.whatsapp_number}
              currency={settings.currency}
            />
          </div>
        </div>

        {/* Product Details & Specifications Section */}
        <div className="mt-14 pt-10 border-t border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Description */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#8A1538] rounded-full" />
              Product Overview
            </h3>
            <div className="prose prose-neutral text-sm text-neutral-600 leading-relaxed max-w-none">
              {product.description ? (
                <p className="whitespace-pre-line">{product.description}</p>
              ) : product.short_description ? (
                <p className="whitespace-pre-line">{product.short_description}</p>
              ) : (
                <p>
                  Genuine {product.name} available with fast doorstep delivery across Qatar.
                  Backed by our 100% authenticity guarantee and Cash on Delivery option.
                </p>
              )}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#8A1538]" />
              Technical Specifications
            </h3>

            {Object.keys(specs).length > 0 ? (
              <div className="rounded-2xl border border-neutral-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(specs).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-neutral-50" : "bg-white"}
                      >
                        <td className="py-2.5 px-4 font-bold text-neutral-700 w-1/3 border-b border-neutral-200/60">
                          {key}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-600 border-b border-neutral-200/60">
                          {String(val)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-50 text-neutral-500 text-xs border border-neutral-200">
                Official retail package specs. For in-depth variant queries, reach our team on WhatsApp.
              </div>
            )}
          </div>
        </div>
      </main>


      <Footer
        whatsappNumber={settings.whatsapp_number}
        storeEmail={settings.store_email}
      />
      <MobileBottomNav whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
