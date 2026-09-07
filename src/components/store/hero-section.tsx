"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/types/database";
import { ArrowRight, MessageCircle, Truck, Banknote, ShieldCheck, PhoneCall } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

interface HeroSectionProps {
  banners?: Banner[];
  whatsappNumber?: string;
}

export function HeroSection({
  banners = [],
  whatsappNumber = "+97455000000",
}: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentBanner = banners.length > 0 ? banners[activeSlide] : null;

  const whatsappCleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  // Trust items shown under hero
  const trustFeatures = [
    { icon: Truck, label: "Free Delivery Across Qatar" },
    { icon: Banknote, label: "Cash on Delivery Available" },
    { icon: PhoneCall, label: "WhatsApp Support" },
    { icon: ShieldCheck, label: "100% Genuine Products" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white py-6 md:py-10 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Hero Card Container */}
        <div className="relative rounded-3xl bg-neutral-100/70 border border-neutral-200/60 p-6 md:p-12 lg:p-14 overflow-hidden shadow-xs">
          {/* Doha Skyline Maroon Backdrop Graphic on Right */}
          <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full pointer-events-none overflow-hidden select-none">
            {/* Curved maroon banner shape */}
            <div className="absolute -top-12 -right-16 w-full lg:w-[680px] h-[680px] rounded-full bg-gradient-to-br from-[#8A1538] via-[#74102E] to-[#450717] opacity-95 transform -rotate-12 translate-x-12 translate-y-6" />
            
            {/* Doha Skyline silhouette architectural pattern */}
            <svg
              className="absolute bottom-0 right-0 w-full lg:w-[580px] h-64 text-white/10 fill-current opacity-60"
              viewBox="0 0 600 240"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Stylized Lusail, Tornado Tower, The Pearl and Doha skyline silhouettes */}
              <rect x="20" y="80" width="24" height="160" rx="3" />
              <rect x="52" y="110" width="30" height="130" rx="2" />
              <polygon points="100,240 105,40 120,40 125,240" />
              <ellipse cx="148" cy="120" rx="18" ry="120" />
              <polygon points="180,240 192,20 204,240" />
              <rect x="218" y="90" width="34" height="150" rx="4" />
              <polygon points="265,240 275,50 290,240" />
              <rect x="305" y="70" width="40" height="170" rx="2" />
              <ellipse cx="365" cy="100" rx="14" ry="140" />
              <rect x="395" y="130" width="28" height="110" rx="2" />
              <polygon points="440,240 455,30 470,240" />
              <rect x="490" y="85" width="36" height="155" rx="3" />
              <rect x="540" y="120" width="40" height="120" rx="4" />
            </svg>

            {/* Gold Script Badge: "Deals Beyond Borders" */}
            <div className="absolute top-8 right-10 lg:right-16 text-right hidden sm:block">
              <span className="font-serif italic text-xl md:text-2xl text-[#F59E0B] drop-shadow-sm font-light tracking-wide">
                Deals Beyond Borders
              </span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 md:space-y-6">
              <div className="space-y-1">
                <span className="text-sm md:text-base font-semibold text-neutral-600 tracking-wide uppercase">
                  {currentBanner?.title ? "Official Qatar Electronics" : "Latest Tech"}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.08]">
                  {currentBanner ? (
                    currentBanner.title
                  ) : (
                    <>
                      <span className="text-[#8A1538] block">Best Deals</span>
                      <span>in Qatar</span>
                    </>
                  )}
                </h1>
              </div>

              <p className="text-sm md:text-base text-neutral-600 max-w-lg leading-relaxed">
                {currentBanner?.description ||
                  "Mobiles, accessories and more at the best prices. Cash on delivery. Fast & reliable."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <Link
                  href={currentBanner?.primary_cta_link || "#deals"}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#8A1538] hover:bg-[#720e2c] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all group"
                >
                  <span>{currentBanner?.primary_cta_text || "Shop Now"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={
                    currentBanner?.secondary_cta_link ||
                    `https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
                      "Hello Mobile Deals 👋 I saw the latest tech deals on your website and want to place an order."
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Product Showcase / Banner Graphic */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[260px] sm:min-h-[320px] md:min-h-[380px]">
              {currentBanner?.desktop_image_url ? (
                <div className="relative w-full h-[280px] sm:h-[350px]">
                  <Image
                    src={getOptimizedImageUrl(currentBanner.desktop_image_url, "hero_desktop")}
                    alt={currentBanner.title || "Mobile Deals Qatar"}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              ) : (
                /* Default Approved Aesthetic Showcase matching reference */
                <div className="relative w-full max-w-md h-[280px] sm:h-[360px] flex items-center justify-center">
                  {/* Smartphone Graphic */}
                  <div className="relative w-44 sm:w-52 h-[260px] sm:h-[320px] rounded-3xl bg-neutral-900 border-4 border-neutral-700 shadow-2xl p-2 z-20 flex flex-col justify-between overflow-hidden">
                    <div className="w-16 h-3 bg-neutral-800 rounded-full mx-auto" />
                    <div className="flex-1 my-2 rounded-2xl bg-gradient-to-tr from-neutral-800 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-3 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#8A1538]/30 flex items-center justify-center mb-2 border border-[#8A1538]/40">
                        <span className="text-xl">⚡</span>
                      </div>
                      <span className="text-white font-bold text-xs uppercase tracking-wider">
                        Flagship
                      </span>
                      <span className="text-[#F59E0B] text-[10px] font-semibold">
                        Exclusive Deals
                      </span>
                    </div>
                    <div className="w-16 h-1 bg-white/40 rounded-full mx-auto" />
                  </div>

                  {/* Smartwatch Accent */}
                  <div className="absolute -left-2 sm:left-2 bottom-6 w-28 h-28 rounded-2xl bg-neutral-900/95 border-2 border-neutral-700 shadow-xl z-30 p-2 flex flex-col items-center justify-center text-white">
                    <span className="text-2xl">⌚</span>
                    <span className="text-[10px] font-bold mt-1 text-white">Smartwatch</span>
                    <span className="text-[9px] text-[#F59E0B]">Best Battery</span>
                  </div>

                  {/* Wireless Earbuds Case Accent */}
                  <div className="absolute right-0 sm:right-2 bottom-10 w-28 h-24 rounded-2xl bg-white border border-neutral-200 shadow-xl z-30 p-2 flex flex-col items-center justify-center text-neutral-800">
                    <span className="text-2xl">🎧</span>
                    <span className="text-[10px] font-bold text-neutral-800">TWS Audio</span>
                    <span className="text-[9px] text-emerald-600 font-semibold">ANC Active</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dots pagination if multiple banners exist */}
          {banners.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activeSlide ? "w-7 bg-[#8A1538]" : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4 Trust Features Bar Directly Below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          {trustFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs hover:border-[#8A1538]/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800 leading-snug">
                  {feat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
