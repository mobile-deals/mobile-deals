import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/checkout", "/order-success/"],
      },
    ],
    sitemap: "https://mobiledeals.qa/sitemap.xml",
  };
}
