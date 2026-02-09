/**
 * Sitemap.xml and Robots.txt Generation
 * Backend-only SEO file generation for Next.js
 * @module lib/seo/sitemap
 */

import { BRAND_CONFIG, GEO_TARGETING, TECHNICAL_SEO } from "./config";

// ============================================
// SITEMAP TYPES
// ============================================

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  images?: SitemapImage[];
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
}

// ============================================
// URL GENERATION
// ============================================

/**
 * Generate all sitemap URLs for the website
 */
export function generateSitemapUrls(): SitemapUrl[] {
  const now = new Date().toISOString();

  const urls: SitemapUrl[] = [
    // Homepage
    {
      loc: `${BRAND_CONFIG.url}/`,
      lastmod: now,
      changefreq: "daily",
      priority: 1.0,
      images: [
        {
          loc: `${BRAND_CONFIG.url}/og-image-home.jpg`,
          title: "Mandira Foods Premium Dehydrated Fruits",
          caption: "Hand-selected, slow-dehydrated fruits from Nepal",
        },
      ],
    },

    // Products page
    {
      loc: `${BRAND_CONFIG.url}/products`,
      lastmod: now,
      changefreq: "daily",
      priority: 0.9,
      images: [
        {
          loc: `${BRAND_CONFIG.url}/og-image-products.jpg`,
          title: "Premium Dehydrated Fruits Collection",
          caption: "Explore our curated collection of dehydrated fruits",
        },
      ],
    },

    // Gifting page
    {
      loc: `${BRAND_CONFIG.url}/gifting`,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.8,
      images: [
        {
          loc: `${BRAND_CONFIG.url}/og-image-gifting.jpg`,
          title: "Luxury Dried Fruit Gift Boxes",
          caption: "Premium gifting options for all occasions",
        },
      ],
    },

    // Subscription page
    {
      loc: `${BRAND_CONFIG.url}/subscription`,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.8,
      images: [
        {
          loc: `${BRAND_CONFIG.url}/og-image-subscription.jpg`,
          title: "Monthly Dried Fruit Subscription",
          caption: "Healthy snacks delivered to your door",
        },
      ],
    },

    // About page
    {
      loc: `${BRAND_CONFIG.url}/about`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.7,
    },

    // Why Us page
    {
      loc: `${BRAND_CONFIG.url}/why-us`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.7,
    },

    // Nutrition page
    {
      loc: `${BRAND_CONFIG.url}/nutrition`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.7,
    },

    // FAQ page
    {
      loc: `${BRAND_CONFIG.url}/faq`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.6,
    },

    // VIP page
    {
      loc: `${BRAND_CONFIG.url}/vip`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.6,
    },

    // Contact page
    {
      loc: `${BRAND_CONFIG.url}/contact`,
      lastmod: now,
      changefreq: "yearly",
      priority: 0.6,
    },

    // Retailer page
    {
      loc: `${BRAND_CONFIG.url}/retailer`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.6,
    },

    // Privacy Policy
    {
      loc: `${BRAND_CONFIG.url}/privacy-policy`,
      lastmod: now,
      changefreq: "yearly",
      priority: 0.3,
    },

    // Terms and Conditions
    {
      loc: `${BRAND_CONFIG.url}/terms-and-conditions`,
      lastmod: now,
      changefreq: "yearly",
      priority: 0.3,
    },
  ];

  return urls;
}

// ============================================
// SITEMAP XML GENERATION
// ============================================

/**
 * Generate sitemap.xml content
 */
export function generateSitemapXML(): string {
  const urls = generateSitemapUrls();

  const urlEntries = urls.map((url) => {
    let entry = `  <url>\n`;
    entry += `    <loc>${escapeXml(url.loc)}</loc>\n`;

    if (url.lastmod) {
      entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }

    if (url.changefreq) {
      entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    if (url.priority !== undefined) {
      entry += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }

    // Add image sitemap entries
    if (url.images && url.images.length > 0) {
      url.images.forEach((image) => {
        entry += `    <image:image>\n`;
        entry += `      <image:loc>${escapeXml(image.loc)}</image:loc>\n`;
        if (image.caption) {
          entry += `      <image:caption>${escapeXml(image.caption)}</image:caption>\n`;
        }
        if (image.title) {
          entry += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
        }
        entry += `    </image:image>\n`;
      });
    }

    entry += `  </url>`;
    return entry;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlEntries.join("\n")}\n</urlset>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ============================================
// ROBOTS.TXT GENERATION
// ============================================

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  const { robots } = TECHNICAL_SEO;

  let content = `# robots.txt for ${BRAND_CONFIG.url}\n`;
  content += `# Generated: ${new Date().toISOString()}\n`;
  content += `# Website: ${BRAND_CONFIG.fullName}\n`;
  content += `# Location: ${BRAND_CONFIG.location.city}, ${GEO_TARGETING.countryName}\n\n`;

  // Main user agent rules
  content += `User-agent: ${robots.userAgent}\n`;

  // Allow rules
  robots.allow.forEach((path) => {
    content += `Allow: ${path}\n`;
  });

  // Disallow rules
  robots.disallow.forEach((path) => {
    content += `Disallow: ${path}\n`;
  });

  // Crawl delay
  content += `Crawl-delay: ${robots.crawlDelay}\n\n`;

  // Googlebot specific rules
  content += `# Googlebot specific rules\n`;
  content += `User-agent: Googlebot\n`;
  content += `Allow: /\n`;
  robots.disallow.forEach((path) => {
    content += `Disallow: ${path}\n`;
  });
  content += `\n`;

  // Googlebot-Image
  content += `# Googlebot-Image\n`;
  content += `User-agent: Googlebot-Image\n`;
  content += `Allow: /\n`;
  content += `Allow: /*.jpg$\n`;
  content += `Allow: /*.jpeg$\n`;
  content += `Allow: /*.png$\n`;
  content += `Allow: /*.webp$\n`;
  content += `Allow: /*.svg$\n\n`;

  // Bingbot
  content += `# Bingbot\n`;
  content += `User-agent: Bingbot\n`;
  content += `Allow: /\n`;
  robots.disallow.forEach((path) => {
    content += `Disallow: ${path}\n`;
  });
  content += `\n`;

  // Sitemap reference
  content += `# Sitemap\n`;
  content += `Sitemap: ${robots.sitemap}\n`;

  return content;
}

// ============================================
// RSS FEED GENERATION (for blog/news)
// ============================================

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

/**
 * Generate RSS feed XML
 */
export function generateRSSFeed(items: RSSItem[]): string {
  const now = new Date().toUTCString();

  const itemEntries = items.map((item) => {
    return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BRAND_CONFIG.fullName)}</title>
    <link>${BRAND_CONFIG.url}</link>
    <description>${escapeXml(BRAND_CONFIG.description)}</description>
    <language>${GEO_TARGETING.language}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BRAND_CONFIG.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BRAND_CONFIG.logo}</url>
      <title>${escapeXml(BRAND_CONFIG.fullName)}</title>
      <link>${BRAND_CONFIG.url}</link>
    </image>
${itemEntries.join("\n")}
  </channel>
</rss>`;
}

// ============================================
// SECURITY HEADERS GENERATION
// ============================================

/**
 * Generate security headers for SEO
 */
export function generateSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy":
      TECHNICAL_SEO.securityHeaders.contentSecurityPolicy,
    "Strict-Transport-Security":
      TECHNICAL_SEO.securityHeaders.strictTransportSecurity,
    "X-Content-Type-Options": TECHNICAL_SEO.securityHeaders.xContentTypeOptions,
    "X-Frame-Options": TECHNICAL_SEO.securityHeaders.xFrameOptions,
    "Referrer-Policy": TECHNICAL_SEO.securityHeaders.referrerPolicy,
    // Additional SEO-friendly headers
    "X-Robots-Tag": "index, follow",
    "X-Geo-Country": GEO_TARGETING.country,
    "X-Geo-Region": GEO_TARGETING.countryName,
  };
}

// ============================================
// CACHE CONTROL HEADERS
// ============================================

/**
 * Generate cache control headers for different page types
 */
export function generateCacheHeaders(
  pageType: "static" | "dynamic" | "api",
): Record<string, string> {
  switch (pageType) {
    case "static":
      return {
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000",
        "Vercel-CDN-Cache-Control": "public, max-age=31536000",
      };
    case "dynamic":
      return {
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control":
          "public, max-age=3600, stale-while-revalidate=86400",
        "Vercel-CDN-Cache-Control":
          "public, max-age=3600, stale-while-revalidate=86400",
      };
    case "api":
      return {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      };
    default:
      return {
        "Cache-Control": "public, max-age=3600",
      };
  }
}
