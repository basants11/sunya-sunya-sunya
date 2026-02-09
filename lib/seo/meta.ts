/**
 * Dynamic Meta Tags Generation
 * Backend-only SEO meta generation for Next.js App Router
 * @module lib/seo/meta
 */

import type { Product } from "@/lib/products";
import type { Metadata } from "next";
import {
  BRAND_CONFIG,
  GEO_TARGETING,
  PAGE_SEO_CONFIG,
  PRODUCT_SEO_TEMPLATES,
  SEO_KEYWORDS,
  generateCanonicalUrl,
  generateMetaDescription,
  generateMetaTitle,
} from "./config";

// ============================================
// META GENERATION FUNCTIONS
// ============================================

/**
 * Generate base metadata with Nepal geo-targeting
 */
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(BRAND_CONFIG.url),
    authors: [{ name: BRAND_CONFIG.name, url: BRAND_CONFIG.url }],
    creator: BRAND_CONFIG.name,
    publisher: BRAND_CONFIG.name,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: BRAND_CONFIG.url,
      languages: {
        "en-NP": BRAND_CONFIG.url,
        "ne-NP": `${BRAND_CONFIG.url}/ne`,
      },
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    other: {
      // Geo-targeting meta tags
      "geo.region": GEO_TARGETING.country,
      "geo.placename": BRAND_CONFIG.location.city,
      "geo.position": `${BRAND_CONFIG.location.geo.latitude};${BRAND_CONFIG.location.geo.longitude}`,
      ICBM: `${BRAND_CONFIG.location.geo.latitude}, ${BRAND_CONFIG.location.geo.longitude}`,
      // Language targeting
      language: GEO_TARGETING.language,
      "content-language": GEO_TARGETING.language,
      // Business verification
      "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
      // Additional SEO signals
      "revisit-after": "7 days",
      distribution: "global",
      rating: "general",
      // Open Graph locale
      "og:locale": GEO_TARGETING.language,
      "og:locale:alternate": GEO_TARGETING.alternateLanguage,
    },
  };
}

/**
 * Generate metadata for homepage
 */
export function generateHomeMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.home;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/"),
      languages: {
        "en-NP": generateCanonicalUrl("/"),
        "ne-NP": generateCanonicalUrl("/ne"),
      },
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-home.jpg`,
          width: 1200,
          height: 630,
          alt: `${BRAND_CONFIG.fullName} - Premium Dehydrated Fruits from Nepal`,
        },
      ],
      countryName: GEO_TARGETING.countryName,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-home.jpg`],
      creator: "@mandirafoods",
      site: "@mandirafoods",
    },
  };
}

/**
 * Generate metadata for products listing page
 */
export function generateProductsMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.products;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/products"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/products"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-products.jpg`,
          width: 1200,
          height: 630,
          alt: "Premium Dehydrated Fruits Collection - Mandira Foods Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-products.jpg`],
    },
  };
}

/**
 * Generate metadata for a specific product
 */
export function generateProductMetadata(product: Product): Metadata {
  const template =
    PRODUCT_SEO_TEMPLATES[product.name] || PRODUCT_SEO_TEMPLATES.default;

  // Extract fruit type from product name
  const fruitType = product.name.replace("Dried ", "").toLowerCase();

  // Generate dynamic content
  const title = template.titleTemplate
    .replace("{productName}", product.name)
    .replace("{fruitType}", fruitType);

  const description = template.descriptionTemplate
    .replace("{productName}", product.name)
    .replace("{fruitType}", fruitType)
    .replace("{benefits}", product.features.join(". "));

  const keywords = template.keywords.map((kw) =>
    kw
      .replace(/{fruitType}/g, fruitType)
      .replace(/{productName}/g, product.name),
  );

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${BRAND_CONFIG.url}${product.image}`;

  return {
    ...generateBaseMetadata(),
    title: generateMetaTitle(title),
    description: generateMetaDescription(description),
    keywords: [...keywords, ...SEO_KEYWORDS.brand],
    alternates: {
      canonical: generateCanonicalUrl(
        `/products?product=${encodeURIComponent(product.name)}`,
      ),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl(
        `/products?product=${encodeURIComponent(product.name)}`,
      ),
      siteName: BRAND_CONFIG.fullName,
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${product.name} - Premium Dehydrated Fruit from Mandira Foods Nepal`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
    other: {
      // Product-specific meta
      "product:price:amount": product.nrsPrice.toString(),
      "product:price:currency": GEO_TARGETING.currency,
      "product:availability": "in stock",
      "product:condition": "new",
      "product:brand": BRAND_CONFIG.name,
      "product:category": "Dehydrated Fruits",
      "product:catalog_id": product.id.toString(),
    },
  };
}

/**
 * Generate metadata for gifting page
 */
export function generateGiftingMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.gifting;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/gifting"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/gifting"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-gifting.jpg`,
          width: 1200,
          height: 630,
          alt: "Luxury Dried Fruit Gift Boxes - Mandira Foods Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-gifting.jpg`],
    },
  };
}

/**
 * Generate metadata for subscription page
 */
export function generateSubscriptionMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.subscription;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/subscription"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/subscription"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-subscription.jpg`,
          width: 1200,
          height: 630,
          alt: "Monthly Dried Fruit Subscription - Mandira Foods Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-subscription.jpg`],
    },
  };
}

/**
 * Generate metadata for VIP page
 */
export function generateVIPMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.vip;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/vip"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/vip"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-vip.jpg`,
          width: 1200,
          height: 630,
          alt: "VIP Membership - Mandira Foods Premium Fruits Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-vip.jpg`],
    },
  };
}

/**
 * Generate metadata for about page
 */
export function generateAboutMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.about;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/about"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/about"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-about.jpg`,
          width: 1200,
          height: 630,
          alt: "About Mandira Foods - Premium Dehydrated Fruits Brand Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-about.jpg`],
    },
  };
}

/**
 * Generate metadata for why-us page
 */
export function generateWhyUsMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.whyUs;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/why-us"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/why-us"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-why-us.jpg`,
          width: 1200,
          height: 630,
          alt: "Why Choose Mandira Foods - Premium Quality Dehydrated Fruits Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-why-us.jpg`],
    },
  };
}

/**
 * Generate metadata for nutrition page
 */
export function generateNutritionMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.nutrition;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/nutrition"),
    },
    openGraph: {
      type: "article",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/nutrition"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-nutrition.jpg`,
          width: 1200,
          height: 630,
          alt: "Nutritional Benefits of Dehydrated Fruits - Mandira Foods Nepal",
        },
      ],
      authors: [BRAND_CONFIG.name],
      publishedTime: "2024-01-01T00:00:00+05:45",
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-nutrition.jpg`],
    },
  };
}

/**
 * Generate metadata for FAQ page
 */
export function generateFAQMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.faq;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/faq"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/faq"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-faq.jpg`,
          width: 1200,
          height: 630,
          alt: "FAQ - Dehydrated Fruits Questions Answered - Mandira Foods Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-faq.jpg`],
    },
  };
}

/**
 * Generate metadata for contact page
 */
export function generateContactMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.contact;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/contact"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/contact"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-contact.jpg`,
          width: 1200,
          height: 630,
          alt: "Contact Mandira Foods - Premium Dehydrated Fruits Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-contact.jpg`],
    },
  };
}

/**
 * Generate metadata for retailer page
 */
export function generateRetailerMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.retailer;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/retailer"),
    },
    openGraph: {
      type: "website",
      locale: GEO_TARGETING.language,
      url: generateCanonicalUrl("/retailer"),
      siteName: BRAND_CONFIG.fullName,
      title: config.title,
      description: config.description,
      images: [
        {
          url: `${BRAND_CONFIG.url}/og-image-retailer.jpg`,
          width: 1200,
          height: 630,
          alt: "Become a Retailer - Partner with Mandira Foods Nepal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [`${BRAND_CONFIG.url}/og-image-retailer.jpg`],
    },
  };
}

/**
 * Generate metadata for checkout page (noindex)
 */
export function generateCheckoutMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.checkout;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    alternates: {
      canonical: generateCanonicalUrl("/checkout"),
    },
  };
}

/**
 * Generate metadata for privacy policy page
 */
export function generatePrivacyMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.privacy;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/privacy-policy"),
    },
  };
}

/**
 * Generate metadata for terms page
 */
export function generateTermsMetadata(): Metadata {
  const config = PAGE_SEO_CONFIG.terms;

  return {
    ...generateBaseMetadata(),
    title: config.title,
    description: generateMetaDescription(config.description),
    keywords: config.keywords,
    alternates: {
      canonical: generateCanonicalUrl("/terms-and-conditions"),
    },
  };
}

// ============================================
// DYNAMIC META BASED ON SEARCH INTENT
// ============================================

/**
 * Generate metadata based on search query intent
 */
export function generateIntentBasedMetadata(
  query: string,
  baseMetadata: Metadata,
): Metadata {
  const normalizedQuery = query.toLowerCase();

  // Transactional intent - emphasize buying
  if (
    normalizedQuery.includes("buy") ||
    normalizedQuery.includes("order") ||
    normalizedQuery.includes("shop") ||
    normalizedQuery.includes("price")
  ) {
    return {
      ...baseMetadata,
      title: `${baseMetadata.title} | Buy Now with Free Delivery`.slice(0, 60),
      description: `Shop now and get free delivery across Nepal. ${baseMetadata.description}`,
    };
  }

  // Informational intent - emphasize education
  if (
    normalizedQuery.includes("what") ||
    normalizedQuery.includes("how") ||
    normalizedQuery.includes("benefits") ||
    normalizedQuery.includes("nutrition")
  ) {
    return {
      ...baseMetadata,
      title: `${baseMetadata.title} | Complete Guide`.slice(0, 60),
      description: `Learn everything about ${baseMetadata.description}`,
    };
  }

  // Local intent - emphasize location
  if (
    normalizedQuery.includes("kathmandu") ||
    normalizedQuery.includes("nepal") ||
    normalizedQuery.includes("near me") ||
    normalizedQuery.includes("local")
  ) {
    return {
      ...baseMetadata,
      title:
        `${baseMetadata.title} | Available in Kathmandu & Nationwide`.slice(
          0,
          60,
        ),
      description: `Proudly made in Nepal. ${baseMetadata.description} Fast delivery across Kathmandu and all major cities.`,
    };
  }

  return baseMetadata;
}

// ============================================
// META PREVIEW GENERATOR (for testing)
// ============================================

export interface MetaPreview {
  title: string;
  description: string;
  url: string;
  ogImage?: string;
  twitterCard?: string;
}

/**
 * Generate preview of how page will appear in search/social
 */
export function generateMetaPreview(metadata: Metadata): MetaPreview {
  const images = metadata.openGraph?.images;
  const ogImage = Array.isArray(images)
    ? images[0]?.toString()
    : images?.toString();

  return {
    title:
      typeof metadata.title === "string"
        ? metadata.title
        : metadata.title?.toString() || "",
    description: metadata.description || "",
    url: metadata.alternates?.canonical?.toString() || "",
    ogImage,
    twitterCard: metadata.twitter?.toString(),
  };
}
