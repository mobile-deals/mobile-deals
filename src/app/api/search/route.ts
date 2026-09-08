import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q || q.length < 1) {
    return NextResponse.json({ products: [] });
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, name, slug, price, compare_at_price, stock, badge_text, is_today_deal, is_best_deal,
        product_images (
          id, image_url, is_primary
        )
      `)
      .eq("is_active", true)
      .ilike("name", `%${q}%`)
      .limit(6);

    if (error) {
      console.error("API search error:", error);
      return NextResponse.json({ products: [] });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err) {
    console.error("API search exception:", err);
    return NextResponse.json({ products: [] });
  }
}
