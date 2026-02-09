/**
 * Sitemap.xml API Route
 * Dynamically generates sitemap.xml for SEO
 * @route GET /sitemap.xml
 */

import { generateSitemapXML } from "@/lib/seo/sitemap";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const sitemap = generateSitemapXML();

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "X-Robots-Tag": "noindex",
        // SEO Headers for Nepal targeting
        "X-Geo-Country": "NP",
        "X-Geo-Region": "Nepal",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mandirafoods.com.np/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
        },
      },
    );
  }
}
