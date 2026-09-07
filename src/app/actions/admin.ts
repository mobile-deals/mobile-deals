"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { Category, Product, Banner, SiteSettings } from "@/types/database";

/* ======================================================================
   PRODUCT ACTIONS
   ====================================================================== */

export async function createProductAction(data: {
  name: string;
  slug: string;
  category_id?: string | null;
  brand_id?: string | null;
  short_description?: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  stock?: number;
  warranty?: string;
  free_gift?: string;
  badge_text?: string;
  is_featured?: boolean;
  is_best_deal?: boolean;
  is_today_deal?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  is_active?: boolean;
  image_url?: string;
}) {
  try {
    const supabase = createAdminClient();

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: data.name,
        slug: data.slug,
        category_id: data.category_id || null,
        brand_id: data.brand_id || null,
        short_description: data.short_description || null,
        description: data.description || null,
        price: data.price,
        compare_at_price: data.compare_at_price || null,
        stock: data.stock ?? 10,
        warranty: data.warranty || null,
        free_gift: data.free_gift || null,
        badge_text: data.badge_text || null,
        is_featured: data.is_featured ?? false,
        is_best_deal: data.is_best_deal ?? false,
        is_today_deal: data.is_today_deal ?? false,
        is_best_seller: data.is_best_seller ?? false,
        is_new_arrival: data.is_new_arrival ?? false,
        is_active: data.is_active ?? true,
      })
      .select("id")
      .single();

    if (error) throw error;

    // If an image URL was provided, link it in product_images
    if (data.image_url) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        image_url: data.image_url,
        is_primary: true,
        display_order: 1,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: unknown) {
    console.error("createProductAction error:", err);
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleProductActiveAction(id: string, currentStatus: boolean) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/* ======================================================================
   CATEGORY ACTIONS
   ====================================================================== */

export async function createCategoryAction(data: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("categories").insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      image_url: data.image_url || null,
      display_order: data.display_order ?? 0,
      is_active: data.is_active ?? true,
    });
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/* ======================================================================
   BANNER ACTIONS
   ====================================================================== */

export async function createBannerAction(data: {
  title: string;
  highlighted_text?: string;
  description?: string;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  desktop_image_url: string;
  mobile_image_url?: string;
  display_order?: number;
  is_active?: boolean;
}) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("banners").insert({
      title: data.title,
      highlighted_text: data.highlighted_text || null,
      description: data.description || null,
      primary_cta_text: data.primary_cta_text || "Shop Now",
      primary_cta_link: data.primary_cta_link || "#deals",
      secondary_cta_text: data.secondary_cta_text || "Order on WhatsApp",
      secondary_cta_link: data.secondary_cta_link || null,
      desktop_image_url: data.desktop_image_url,
      mobile_image_url: data.mobile_image_url || null,
      display_order: data.display_order ?? 0,
      is_active: data.is_active ?? true,
    });
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteBannerAction(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/* ======================================================================
   ORDER STATUS ACTION
   ====================================================================== */

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (error) throw error;

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/* ======================================================================
   SETTINGS ACTION
   ====================================================================== */

export async function updateSiteSettingsAction(settings: Partial<SiteSettings>) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("site_settings").upsert({
      key: "general",
      value: settings,
      is_public: true,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/* ======================================================================
   SEED INITIAL STORE DATA ACTION
   ====================================================================== */

export async function seedInitialDataAction() {
  try {
    const supabase = createAdminClient();

    // 1. Initial 10 Categories
    const categoriesToSeed = [
      {
        name: "Keyboard & Mouse",
        slug: "keyboard-mouse",
        description: "Gaming keyboards, wireless mice and desktop accessories",
        image_url:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80",
        display_order: 1,
        is_active: true,
      },
      {
        name: "Mobile & Tablet Holder",
        slug: "mobile-tablet-holder",
        description: "Desk stands, car mounts and ergonomic holders",
        image_url:
          "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&auto=format&fit=crop&q=80",
        display_order: 2,
        is_active: true,
      },
      {
        name: "Earphones & Buds",
        slug: "earphones-buds",
        description: "TWS earbuds, noise cancelling headphones & earphones",
        image_url:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80",
        display_order: 3,
        is_active: true,
      },
      {
        name: "Charger & Adapter",
        slug: "charger-adapter",
        description: "Fast charging wall adapters, GaN chargers and cables",
        image_url:
          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80",
        display_order: 4,
        is_active: true,
      },
      {
        name: "Watch & Straps",
        slug: "watch-straps",
        description: "Smartwatches, fitness bands and premium straps",
        image_url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
        display_order: 5,
        is_active: true,
      },
      {
        name: "Perfume",
        slug: "perfume",
        description: "Luxury Arabian and French fragrances for men and women",
        image_url:
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80",
        display_order: 6,
        is_active: true,
      },
      {
        name: "Covers & Glasses",
        slug: "covers-glasses",
        description: "Shockproof phone cases, screen protectors and lens guards",
        image_url:
          "https://images.unsplash.com/photo-1601593346740-925612772716?w=300&auto=format&fit=crop&q=80",
        display_order: 7,
        is_active: true,
      },
      {
        name: "Power Bank",
        slug: "power-bank",
        description: "High-capacity portable battery packs with fast charging",
        image_url:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop&q=80",
        display_order: 8,
        is_active: true,
      },
      {
        name: "Speaker",
        slug: "speaker",
        description: "Bluetooth portable speakers and home audio soundbars",
        image_url:
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80",
        display_order: 9,
        is_active: true,
      },
      {
        name: "Toys",
        slug: "toys",
        description: "RC cars, drones and smart interactive toys",
        image_url:
          "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&auto=format&fit=crop&q=80",
        display_order: 10,
        is_active: true,
      },
    ];

    await supabase.from("categories").upsert(categoriesToSeed, { onConflict: "slug" });

    // 2. Initial Sample Deals Products
    interface SeedProduct {
      name: string;
      slug: string;
      short_description: string;
      price: number;
      compare_at_price: number | null;
      stock: number;
      free_gift: string | null;
      badge_text: string | null;
      is_today_deal: boolean;
      is_best_deal: boolean;
      is_featured: boolean;
      is_best_seller: boolean;
      is_active: boolean;
      image_url: string;
    }

    const productsToSeed: SeedProduct[] = [
      {
        name: "Samsung Galaxy Z Fold 8 5G",
        slug: "samsung-galaxy-z-fold-8-5g",
        short_description: "12GB RAM / 256GB Storage",
        price: 5649,
        compare_at_price: 6199,
        stock: 8,
        free_gift: "Samsung 65W GaN Super Charger",
        badge_text: "Free Gift",
        is_today_deal: true,
        is_best_deal: true,
        is_featured: true,
        is_best_seller: false,
        is_active: true,
        image_url:
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Samsung Galaxy Z Fold 8 512GB",
        slug: "samsung-galaxy-z-fold-8-512gb",
        short_description: "12GB RAM / 512GB Storage",
        price: 6299,
        compare_at_price: 6899,
        stock: 5,
        free_gift: "Galaxy SmartTag 2",
        badge_text: "Free Gift",
        is_today_deal: true,
        is_best_deal: true,
        is_featured: false,
        is_best_seller: false,
        is_active: true,
        image_url:
          "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Samsung Galaxy S25 FE 5G",
        slug: "samsung-galaxy-s25-fe-5g",
        short_description: "8GB RAM / 256GB Storage",
        price: 1829,
        compare_at_price: 2199,
        stock: 14,
        free_gift: null,
        badge_text: "Best Seller",
        is_today_deal: true,
        is_best_deal: false,
        is_featured: true,
        is_best_seller: true,
        is_active: true,
        image_url:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Samsung Galaxy A57 5G",
        slug: "samsung-galaxy-a57-5g",
        short_description: "8GB RAM / 256GB Storage",
        price: 1259,
        compare_at_price: 1499,
        stock: 20,
        free_gift: "Original Samsung Back Cover",
        badge_text: "Free Gift",
        is_today_deal: true,
        is_best_deal: false,
        is_featured: false,
        is_best_seller: false,
        is_active: true,
        image_url:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Redmi A7 Dynamic Edition",
        slug: "redmi-a7-dynamic-edition",
        short_description: "3GB RAM / 64GB Storage",
        price: 349,
        compare_at_price: 399,
        stock: 25,
        free_gift: null,
        badge_text: null,
        is_today_deal: true,
        is_best_deal: false,
        is_featured: false,
        is_best_seller: false,
        is_active: true,
        image_url:
          "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Redmi 17 5G Tech Bundle",
        slug: "redmi-17-5g-tech-bundle",
        short_description: "8GB RAM / 256GB Storage",
        price: 769,
        compare_at_price: 899,
        stock: 18,
        free_gift: null,
        badge_text: "With Buds",
        is_today_deal: true,
        is_best_deal: false,
        is_featured: false,
        is_best_seller: false,
        is_active: true,
        image_url:
          "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
      },
    ];

    for (const p of productsToSeed) {
      const { image_url, ...productFields } = p;
      const { data: insertedProduct, error: pError } = await supabase
        .from("products")
        .upsert(productFields, { onConflict: "slug" })
        .select("id")
        .single();

      if (!pError && insertedProduct && image_url) {
        await supabase.from("product_images").upsert(
          {
            product_id: insertedProduct.id,
            image_url: image_url,
            is_primary: true,
            display_order: 1,
          },
          { onConflict: "id" }
        );
      }
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
