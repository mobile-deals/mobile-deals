import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mobiledeals.qa";

  const supabase = createAdminClient();

  // Fetch active products and categories for sitemap
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("categories").select("slug, updated_at").eq("is_active", true),
  ]);

  const productUrls: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
