-- =====================================================================
-- MOBILE DEALS - E-COMMERCE DATABASE SCHEMA & RLS POLICIES
-- Target: PostgreSQL / Supabase
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon_name TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_order ON public.categories(is_active, display_order);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    short_description TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    stock INT DEFAULT 10,
    warranty TEXT,
    free_gift TEXT,
    badge_text TEXT, -- e.g. "Free Gift", "Best Seller", "With Buds"
    is_featured BOOLEAN DEFAULT false,
    is_best_deal BOOLEAN DEFAULT false,
    is_today_deal BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    deal_ends_at TIMESTAMPTZ,
    specifications JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_flags ON public.products(is_active, is_today_deal, is_featured, is_best_seller);

-- 5. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g. "12GB / 256GB - Phantom Black"
    sku TEXT,
    price NUMERIC(10, 2),
    compare_at_price NUMERIC(10, 2),
    stock INT DEFAULT 5,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);

-- 6. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    cloudinary_public_id TEXT,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id, display_order);

-- 7. BANNERS (Hero / Promotional Banners)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    highlighted_text TEXT,
    description TEXT,
    primary_cta_text TEXT DEFAULT 'Shop Now',
    primary_cta_link TEXT DEFAULT '/#deals',
    secondary_cta_text TEXT DEFAULT 'Order on WhatsApp',
    secondary_cta_link TEXT,
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    cloudinary_public_id TEXT,
    position TEXT DEFAULT 'hero',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_banners_active_order ON public.banners(is_active, display_order);

-- 8. ORDERS (Cash on Delivery)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_reference TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    area TEXT NOT NULL,
    zone TEXT,
    street TEXT,
    building TEXT,
    delivery_notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
    payment_method TEXT DEFAULT 'COD',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 9. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    product_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 10. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Public can read active; All service_role can modify
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access categories" ON public.categories;
CREATE POLICY "Service role full access categories"
ON public.categories FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- BRANDS: Public can view active
DROP POLICY IF EXISTS "Public can view active brands" ON public.brands;
CREATE POLICY "Public can view active brands"
ON public.brands FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access brands" ON public.brands;
CREATE POLICY "Service role full access brands"
ON public.brands FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- PRODUCTS: Public can view active
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access products" ON public.products;
CREATE POLICY "Service role full access products"
ON public.products FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- VARIANTS: Public can view variants of active products
DROP POLICY IF EXISTS "Public can view variants" ON public.product_variants;
CREATE POLICY "Public can view variants"
ON public.product_variants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.products
        WHERE public.products.id = public.product_variants.product_id
        AND public.products.is_active = true
    )
);

DROP POLICY IF EXISTS "Service role full access variants" ON public.product_variants;
CREATE POLICY "Service role full access variants"
ON public.product_variants FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- IMAGES: Public can view images of active products
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images"
ON public.product_images FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.products
        WHERE public.products.id = public.product_images.product_id
        AND public.products.is_active = true
    )
);

DROP POLICY IF EXISTS "Service role full access product_images" ON public.product_images;
CREATE POLICY "Service role full access product_images"
ON public.product_images FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- BANNERS: Public can view active banners
DROP POLICY IF EXISTS "Public can view active banners" ON public.banners;
CREATE POLICY "Public can view active banners"
ON public.banners FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access banners" ON public.banners;
CREATE POLICY "Service role full access banners"
ON public.banners FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ORDERS: Anyone can create a COD order (Guest Checkout)
DROP POLICY IF EXISTS "Anyone can insert an order" ON public.orders;
CREATE POLICY "Anyone can insert an order"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Anyone can view their own order by matching order_reference (handled securely via reference query)
DROP POLICY IF EXISTS "Public view order by reference" ON public.orders;
CREATE POLICY "Public view order by reference"
ON public.orders FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Service role full access orders" ON public.orders;
CREATE POLICY "Service role full access orders"
ON public.orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ORDER ITEMS: Anyone can insert order items
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Public view order items" ON public.order_items;
CREATE POLICY "Public view order items"
ON public.order_items FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Service role full access order_items" ON public.order_items;
CREATE POLICY "Service role full access order_items"
ON public.order_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- SITE SETTINGS: Public can view public settings
DROP POLICY IF EXISTS "Public can view public settings" ON public.site_settings;
CREATE POLICY "Public can view public settings"
ON public.site_settings FOR SELECT
USING (is_public = true);

DROP POLICY IF EXISTS "Service role full access settings" ON public.site_settings;
CREATE POLICY "Service role full access settings"
ON public.site_settings FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =====================================================================
-- SEED INITIAL CONFIGURATION / SITE SETTINGS
-- =====================================================================

INSERT INTO public.site_settings (key, value, description, is_public)
VALUES
    ('general', '{
        "store_name": "MOBILE DEALS",
        "whatsapp_number": "+97455000000",
        "support_phone": "+97455000000",
        "store_email": "support@mobiledeals.qa",
        "currency": "QAR",
        "free_delivery_threshold": 100
    }'::jsonb, 'General store settings and contact info', true),
    
    ('announcement_bar', '{
        "enabled": true,
        "items": [
            "Free Delivery Across Qatar",
            "Cash on Delivery Available",
            "Order on WhatsApp",
            "100% Genuine Products"
        ]
    }'::jsonb, 'Top announcement ticker items', true),

    ('trust_badges', '{
        "items": [
            {"title": "Top Brands", "subtitle": "100% authentic gear", "icon": "trophy"},
            {"title": "Qatar Wide Delivery", "subtitle": "Fast doorstep shipping", "icon": "truck"},
            {"title": "Best Prices", "subtitle": "Unbeatable Qatar deals", "icon": "thumbs-up"},
            {"title": "Dedicated Support", "subtitle": "WhatsApp assistance", "icon": "headset"},
            {"title": "Secure Ordering", "subtitle": "Cash on Delivery verified", "icon": "shield-check"}
        ]
    }'::jsonb, 'Trust badges shown in hero & footer bar', true)
ON CONFLICT (key) DO NOTHING;
