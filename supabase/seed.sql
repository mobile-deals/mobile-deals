-- =====================================================================
-- MOBILE DEALS - OPTIONAL SEED DATA FOR SUPABASE SQL EDITOR
-- Run this AFTER running schema.sql if you wish to populate initial categories,
-- sample banners, and real Qatar tech products.
-- Note: You can edit or delete all of this anytime through the Admin Dashboard!
-- =====================================================================

-- 1. SEED INITIAL 10 CATEGORIES
INSERT INTO public.categories (name, slug, description, image_url, icon_name, display_order, is_active)
VALUES
    ('Keyboard & Mouse', 'keyboard-mouse', 'Gaming keyboards, wireless mice and desktop accessories', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80', 'keyboard', 1, true),
    ('Mobile & Tablet Holder', 'mobile-tablet-holder', 'Desk stands, car mounts and ergonomic holders', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&auto=format&fit=crop&q=80', 'smartphone', 2, true),
    ('Earphones & Buds', 'earphones-buds', 'TWS earbuds, noise cancelling headphones & earphones', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80', 'headphones', 3, true),
    ('Charger & Adapter', 'charger-adapter', 'Fast charging wall adapters, GaN chargers and cables', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80', 'zap', 4, true),
    ('Watch & Straps', 'watch-straps', 'Smartwatches, fitness bands and premium straps', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80', 'watch', 5, true),
    ('Perfume', 'perfume', 'Luxury Arabian and French fragrances for men and women', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80', 'sparkles', 6, true),
    ('Covers & Glasses', 'covers-glasses', 'Shockproof phone cases, screen protectors and lens guards', 'https://images.unsplash.com/photo-1601593346740-925612772716?w=300&auto=format&fit=crop&q=80', 'shield', 7, true),
    ('Power Bank', 'power-bank', 'High-capacity portable battery packs with fast charging', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop&q=80', 'battery-charging', 8, true),
    ('Speaker', 'speaker', 'Bluetooth portable speakers and home audio soundbars', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80', 'volume-2', 9, true),
    ('Toys', 'toys', 'RC cars, drones and smart interactive toys', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&auto=format&fit=crop&q=80', 'gamepad-2', 10, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;

-- 2. SEED HERO BANNER
INSERT INTO public.banners (title, highlighted_text, description, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, desktop_image_url, position, display_order, is_active)
VALUES
    (
        'Latest Tech Best Deals in Qatar',
        'Best Deals',
        'Mobiles, accessories and more at the best prices. Cash on delivery. Fast & reliable.',
        'Shop Now',
        '#deals',
        'Order on WhatsApp',
        'https://wa.me/97455000000',
        'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=1200&auto=format&fit=crop&q=80',
        'hero',
        1,
        true
    )
ON CONFLICT DO NOTHING;
