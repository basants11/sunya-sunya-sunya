/**
 * Server-Side SEO Middleware
 * Injects SEO metadata and structured data at the response level
 * Backend-only implementation - Zero frontend changes
 * @module lib/seo/middleware
 */

import type { Metadata } from "next";
import { NextRequest, NextResponse } from "next/server";
import {
  BRAND_CONFIG,
  GEO_TARGETING,
  generateCanonicalUrl,
  generateMetaDescription,
  generateMetaTitle,
} from "./config";
import {
  generateAboutMetadata,
  generateContactMetadata,
  generateFAQMetadata,
  generateGiftingMetadata,
  generateHomeMetadata,
  generateNutritionMetadata,
  generateProductsMetadata,
  generateRetailerMetadata,
  generateSubscriptionMetadata,
  generateVIPMetadata,
  generateWhyUsMetadata,
} from "./meta";
import {
  generateFAQPageSchemas,
  generateHomePageSchemas,
  generateProductsPageSchemas,
} from "./schema";
import { generateCacheHeaders, generateSecurityHeaders } from "./sitemap";

// ============================================
// SEO MIDDLEWARE CONFIGURATION
// ============================================

interface SEOMiddlewareConfig {
  // Enable/disable specific SEO features
  features: {
    metaTags: boolean;
    structuredData: boolean;
    securityHeaders: boolean;
    cacheHeaders: boolean;
    geoTargeting: boolean;
  };
  // Cache settings
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

const defaultConfig: SEOMiddlewareConfig = {
  features: {
    metaTags: true,
    structuredData: true,
    securityHeaders: true,
    cacheHeaders: true,
    geoTargeting: true,
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
};

// ============================================
// PAGE-SPECIFIC SEO MAPPING
// ============================================

const pageSEOMapping: Record<
  string,
  {
    metadata: () => Metadata;
    schemas: () => string[];
  }
> = {
  "/": {
    metadata: generateHomeMetadata,
    schemas: generateHomePageSchemas,
  },
  "/products": {
    metadata: generateProductsMetadata,
    schemas: generateProductsPageSchemas,
  },
  "/about": {
    metadata: generateAboutMetadata,
    schemas: () => [],
  },
  "/gifting": {
    metadata: generateGiftingMetadata,
    schemas: () => [],
  },
  "/subscription": {
    metadata: generateSubscriptionMetadata,
    schemas: () => [],
  },
  "/vip": {
    metadata: generateVIPMetadata,
    schemas: () => [],
  },
  "/why-us": {
    metadata: generateWhyUsMetadata,
    schemas: () => [],
  },
  "/nutrition": {
    metadata: generateNutritionMetadata,
    schemas: () => [],
  },
  "/faq": {
    metadata: generateFAQMetadata,
    schemas: generateFAQPageSchemas,
  },
  "/contact": {
    metadata: generateContactMetadata,
    schemas: () => [],
  },
  "/retailer": {
    metadata: generateRetailerMetadata,
    schemas: () => [],
  },
};

// ============================================
// SEO HEADER INJECTION
// ============================================

/**
 * Generate SEO headers for response
 */
function generateSEOHeaders(
  pathname: string,
  config: SEOMiddlewareConfig = defaultConfig,
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Security headers
  if (config.features.securityHeaders) {
    Object.assign(headers, generateSecurityHeaders());
  }

  // Cache headers
  if (config.features.cacheHeaders) {
    const pageType = pathname.startsWith("/api") ? "api" : "dynamic";
    Object.assign(headers, generateCacheHeaders(pageType));
  }

  // Geo-targeting headers
  if (config.features.geoTargeting) {
    headers["X-Geo-Country"] = GEO_TARGETING.country;
    headers["X-Geo-Region"] = GEO_TARGETING.countryName;
    headers["X-Geo-Currency"] = GEO_TARGETING.currency;
    headers["X-Geo-Language"] = GEO_TARGETING.language;
  }

  return headers;
}

/**
 * Generate Link headers for SEO
 */
function generateLinkHeaders(pathname: string): string {
  const links: string[] = [];

  // Canonical URL
  const canonicalUrl = generateCanonicalUrl(pathname);
  links.push(`<${canonicalUrl}>; rel="canonical"`);

  // Alternate language versions
  links.push(
    `<${generateCanonicalUrl(pathname)}>; rel="alternate"; hreflang="en-NP"`,
  );
  links.push(
    `<${generateCanonicalUrl(pathname)}>; rel="alternate"; hreflang="ne-NP"`,
  );
  links.push(
    `<${generateCanonicalUrl(pathname)}>; rel="alternate"; hreflang="x-default"`,
  );

  return links.join(", ");
}

// ============================================
// META TAG INJECTION (Server Response Headers)
// ============================================

/**
 * Generate X-Meta-* headers for meta tag injection
 * These can be processed by edge/CDN to inject actual meta tags
 */
function generateMetaHeaders(pathname: string): Record<string, string> {
  const pageConfig = pageSEOMapping[pathname];
  if (!pageConfig) return {};

  const metadata = pageConfig.metadata();
  const headers: Record<string, string> = {};

  // Title
  headers["X-Meta-Title"] = generateMetaTitle(
    typeof metadata.title === "string"
      ? metadata.title
      : String(metadata.title),
  );

  // Description
  headers["X-Meta-Description"] = generateMetaDescription(
    metadata.description || "",
  );

  // Keywords
  if (metadata.keywords && Array.isArray(metadata.keywords)) {
    headers["X-Meta-Keywords"] = metadata.keywords.join(", ");
  }

  // Robots
  headers["X-Meta-Robots"] = "index, follow";

  // Geo tags
  headers["X-Meta-Geo-Region"] = GEO_TARGETING.country;
  headers["X-Meta-Geo-Placename"] = BRAND_CONFIG.location.city;
  headers["X-Meta-Geo-Position"] =
    `${BRAND_CONFIG.location.geo.latitude};${BRAND_CONFIG.location.geo.longitude}`;

  // Language
  headers["X-Meta-Language"] = GEO_TARGETING.language;
  headers["X-Meta-Content-Language"] = GEO_TARGETING.language;

  return headers;
}

/**
 * Generate Open Graph headers
 */
function generateOpenGraphHeaders(pathname: string): Record<string, string> {
  const pageConfig = pageSEOMapping[pathname];
  if (!pageConfig) return {};

  const metadata = pageConfig.metadata();
  const headers: Record<string, string> = {};

  headers["X-OG-Title"] =
    typeof metadata.title === "string"
      ? metadata.title
      : String(metadata.title);
  headers["X-OG-Description"] = metadata.description || "";
  headers["X-OG-Type"] = "website";
  headers["X-OG-Url"] = generateCanonicalUrl(pathname);
  headers["X-OG-Site-Name"] = BRAND_CONFIG.fullName;
  headers["X-OG-Locale"] = GEO_TARGETING.language;
  headers["X-OG-Image"] = `${BRAND_CONFIG.url}/og-image-home.jpg`;

  return headers;
}

/**
 * Generate Twitter Card headers
 */
function generateTwitterCardHeaders(pathname: string): Record<string, string> {
  const pageConfig = pageSEOMapping[pathname];
  if (!pageConfig) return {};

  const metadata = pageConfig.metadata();
  const headers: Record<string, string> = {};

  headers["X-Twitter-Card"] = "summary_large_image";
  headers["X-Twitter-Title"] =
    typeof metadata.title === "string"
      ? metadata.title
      : String(metadata.title);
  headers["X-Twitter-Description"] = metadata.description || "";
  headers["X-Twitter-Image"] = `${BRAND_CONFIG.url}/og-image-home.jpg`;
  headers["X-Twitter-Site"] = "@mandirafoods";
  headers["X-Twitter-Creator"] = "@mandirafoods";

  return headers;
}

// ============================================
// STRUCTURED DATA INJECTION
// ============================================

/**
 * Generate structured data headers
 * These contain JSON-LD that can be injected into the page head
 */
function generateStructuredDataHeaders(
  pathname: string,
): Record<string, string> {
  const pageConfig = pageSEOMapping[pathname];
  if (!pageConfig) return {};

  const schemas = pageConfig.schemas();
  const headers: Record<string, string> = {};

  schemas.forEach((schema, index) => {
    headers[`X-Structured-Data-${index}`] = schema;
  });

  return headers;
}

// ============================================
// MAIN MIDDLEWARE FUNCTION
// ============================================

/**
 * SEO Middleware for Next.js
 * Injects SEO metadata via response headers
 *
 * Usage in middleware.ts:
 * ```typescript
 * import { seoMiddleware } from "@/lib/seo/middleware";
 *
 * export function middleware(request: NextRequest) {
 *   return seoMiddleware(request);
 * }
 * ```
 */
export async function seoMiddleware(
  request: NextRequest,
  config: SEOMiddlewareConfig = defaultConfig,
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Create base response
  const response = NextResponse.next();

  // Add SEO headers
  const seoHeaders = generateSEOHeaders(pathname, config);
  Object.entries(seoHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add Link headers
  const linkHeader = generateLinkHeaders(pathname);
  if (linkHeader) {
    response.headers.set("Link", linkHeader);
  }

  // Add meta headers
  if (config.features.metaTags) {
    const metaHeaders = generateMetaHeaders(pathname);
    Object.entries(metaHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Add Open Graph headers
    const ogHeaders = generateOpenGraphHeaders(pathname);
    Object.entries(ogHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Add Twitter Card headers
    const twitterHeaders = generateTwitterCardHeaders(pathname);
    Object.entries(twitterHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // Add structured data headers
  if (config.features.structuredData) {
    const structuredDataHeaders = generateStructuredDataHeaders(pathname);
    Object.entries(structuredDataHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

// ============================================
// EDGE CONFIGURATION
// ============================================

/**
 * Edge-compatible SEO middleware
 * For use with Next.js Edge Runtime
 */
export async function seoEdgeMiddleware(
  request: NextRequest,
): Promise<NextResponse> {
  return seoMiddleware(request, {
    ...defaultConfig,
    features: {
      ...defaultConfig.features,
      // Disable features that may not work in Edge
      structuredData: false,
    },
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if a path should be processed for SEO
 */
export function shouldProcessSEO(pathname: string): boolean {
  // Skip API routes
  if (pathname.startsWith("/api/")) return false;

  // Skip static files
  if (
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    return false;
  }

  // Skip internal Next.js routes
  if (pathname.startsWith("/_next/")) return false;

  return true;
}

/**
 * Get SEO configuration for a specific path
 */
export function getPathSEOConfig(pathname: string) {
  return pageSEOMapping[pathname] || null;
}

/**
 * Generate complete SEO header package
 * For use in API routes or custom middleware
 */
export function generateCompleteSEOHeaders(
  pathname: string,
): Record<string, string> {
  return {
    ...generateSEOHeaders(pathname),
    ...generateMetaHeaders(pathname),
    ...generateOpenGraphHeaders(pathname),
    ...generateTwitterCardHeaders(pathname),
    ...generateStructuredDataHeaders(pathname),
    Link: generateLinkHeaders(pathname),
  };
}
