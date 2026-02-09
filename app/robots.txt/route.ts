/**
 * Robots.txt API Route
 * Dynamically generates robots.txt for SEO
 * @route GET /robots.txt
 */

import { generateRobotsTxt } from "@/lib/seo/sitemap";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const robots = generateRobotsTxt();

    return new NextResponse(robots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        // SEO Headers
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("Error generating robots.txt:", error);

    // Fallback robots.txt
    return new NextResponse(
      `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout
Disallow: /admin/

Sitemap: https://mandirafoods.com.np/sitemap.xml`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      },
    );
  }
}
