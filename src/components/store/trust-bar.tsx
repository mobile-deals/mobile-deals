import React from "react";
import { Trophy, Truck, ThumbsUp, Headset, ShieldCheck } from "lucide-react";

export function TrustBar() {
  const items = [
    { icon: Trophy, title: "Top Brands", subtitle: "100% genuine products" },
    { icon: Truck, title: "Qatar Wide Delivery", subtitle: "Fast doorstep service" },
    { icon: ThumbsUp, title: "Best Prices", subtitle: "Unbeatable deals" },
    { icon: Headset, title: "Dedicated Support", subtitle: "Direct WhatsApp care" },
    { icon: ShieldCheck, title: "Secure Ordering", subtitle: "Cash on delivery safe" },
  ];

  return (
    <div className="w-full bg-[#111111] text-white border-t border-neutral-800 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center md:text-left">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 p-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
