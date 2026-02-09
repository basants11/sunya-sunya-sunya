/**
 * Server-Side Internal Linking Logic
 * Backend-only internal linking for SEO
 * @module lib/seo/internal-links
 */

import { products as allProducts, type Product } from "@/lib/products";
import { BRAND_CONFIG } from "./config";

// ============================================
// INTERNAL LINK TYPES
// ============================================

export interface InternalLink {
  url: string;
  anchorText: string;
  title?: string;
  context?: string;
  priority: number;
}

export interface RelatedProduct {
  product: Product;
  relevanceScore: number;
  reason: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrent?: boolean;
}

// ============================================
// RELATED PRODUCTS ENGINE
// ============================================

/**
 * Calculate relevance score between two products
 */
function calculateProductRelevance(
  productA: Product,
  productB: Product,
): number {
  let score = 0;

  // Same category bonus
  if (productA.badge === productB.badge) {
    score += 20;
  }

  // Price similarity (within 30% range)
  const priceDiff = Math.abs(productA.nrsPrice - productB.nrsPrice);
  const avgPrice = (productA.nrsPrice + productB.nrsPrice) / 2;
  if (priceDiff / avgPrice < 0.3) {
    score += 15;
  }

  // Feature overlap
  const commonFeatures = productA.features.filter((f) =>
    productB.features.some(
      (bf) =>
        bf.toLowerCase().includes(f.toLowerCase()) ||
        f.toLowerCase().includes(bf.toLowerCase()),
    ),
  );
  score += commonFeatures.length * 10;

  // Complementary products (different categories but similar use case)
  const complementaryPairs = [
    ["Dried Kiwi", "Dried Strawberry"],
    ["Dried Mango", "Dried Pineapple"],
    ["Dried Apple", "Dried Banana"],
    ["Dried Blueberry", "Dried Papaya"],
  ];

  for (const [name1, name2] of complementaryPairs) {
    if (
      (productA.name === name1 && productB.name === name2) ||
      (productA.name === name2 && productB.name === name1)
    ) {
      score += 25;
    }
  }

  // Popularity bonus (based on badge)
  const popularBadges = ["Best Seller", "Limited Seasonal", "Superfood"];
  if (popularBadges.includes(productB.badge)) {
    score += 10;
  }

  return score;
}

/**
 * Get related products for a given product
 */
export function getRelatedProducts(
  product: Product,
  limit: number = 4,
): RelatedProduct[] {
  const related = allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      product: p,
      relevanceScore: calculateProductRelevance(product, p),
      reason: generateRelatedReason(product, p),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return related;
}

/**
 * Generate reason text for related product
 */
function generateRelatedReason(
  sourceProduct: Product,
  relatedProduct: Product,
): string {
  const reasons = [
    `Customers who bought ${sourceProduct.name} also enjoyed ${relatedProduct.name}`,
    `Perfect pairing with ${sourceProduct.name}`,
    `Similar nutritional profile to ${sourceProduct.name}`,
    `Complements ${sourceProduct.name} in gift boxes`,
    `Popular choice with ${sourceProduct.name}`,
  ];

  // Select reason based on relevance factors
  if (sourceProduct.badge === relatedProduct.badge) {
    return reasons[2];
  }

  const priceDiff = Math.abs(sourceProduct.nrsPrice - relatedProduct.nrsPrice);
  if (priceDiff < 500) {
    return reasons[0];
  }

  return reasons[Math.floor(Math.random() * reasons.length)];
}

// ============================================
// BREADCRUMB GENERATION
// ============================================

/**
 * Generate breadcrumb navigation for a page
 */
export function generateBreadcrumbs(
  currentPage: string,
  currentPath: string,
  parentPages?: Array<{ name: string; url: string }>,
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", url: "/" }];

  if (parentPages) {
    breadcrumbs.push(...parentPages.map((p) => ({ ...p, isCurrent: false })));
  }

  breadcrumbs.push({
    name: currentPage,
    url: currentPath,
    isCurrent: true,
  });

  return breadcrumbs;
}

/**
 * Generate product-specific breadcrumbs
 */
export function generateProductBreadcrumbs(product: Product): BreadcrumbItem[] {
  return [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    {
      name: product.name,
      url: `/products?product=${encodeURIComponent(product.name)}`,
      isCurrent: true,
    },
  ];
}

/**
 * Generate category breadcrumbs
 */
export function generateCategoryBreadcrumbs(
  categoryName: string,
  categoryPath: string,
): BreadcrumbItem[] {
  return [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: categoryName, url: categoryPath, isCurrent: true },
  ];
}

// ============================================
// CONTEXTUAL INTERNAL LINKS
// ============================================

/**
 * Get contextual internal links for a page
 */
export function getContextualLinks(pagePath: string): InternalLink[] {
  const links: Record<string, InternalLink[]> = {
    "/": [
      {
        url: "/products",
        anchorText: "premium dehydrated fruits collection",
        title: "Browse our products",
        priority: 10,
      },
      {
        url: "/gifting",
        anchorText: "luxury gift boxes",
        title: "Perfect for gifting",
        priority: 9,
      },
      {
        url: "/subscription",
        anchorText: "monthly subscription",
        title: "Subscribe and save",
        priority: 8,
      },
      {
        url: "/about",
        anchorText: "our story",
        title: "Learn about Mandira Foods",
        priority: 7,
      },
    ],

    "/products": [
      {
        url: "/gifting",
        anchorText: "create a custom gift box",
        title: "Build your gift",
        priority: 10,
      },
      {
        url: "/subscription",
        anchorText: "subscribe for regular deliveries",
        title: "Subscribe",
        priority: 9,
      },
      {
        url: "/nutrition",
        anchorText: "nutritional benefits",
        title: "Learn about nutrition",
        priority: 8,
      },
      {
        url: "/why-us",
        anchorText: "why choose Mandira Foods",
        title: "Our difference",
        priority: 7,
      },
    ],

    "/gifting": [
      {
        url: "/products",
        anchorText: "premium dehydrated fruits",
        title: "Our products",
        priority: 10,
      },
      {
        url: "/subscription",
        anchorText: "corporate gifting subscriptions",
        title: "Corporate gifts",
        priority: 9,
      },
      {
        url: "/contact",
        anchorText: "custom gift inquiries",
        title: "Contact us",
        priority: 8,
      },
    ],

    "/subscription": [
      {
        url: "/products",
        anchorText: "dehydrated fruits collection",
        title: "Our products",
        priority: 10,
      },
      {
        url: "/gifting",
        anchorText: "gift a subscription",
        title: "Gift subscriptions",
        priority: 9,
      },
      {
        url: "/vip",
        anchorText: "VIP membership benefits",
        title: "VIP program",
        priority: 8,
      },
    ],

    "/about": [
      {
        url: "/why-us",
        anchorText: "our commitment to quality",
        title: "Why Mandira Foods",
        priority: 10,
      },
      {
        url: "/products",
        anchorText: "our products",
        title: "Products",
        priority: 9,
      },
      {
        url: "/contact",
        anchorText: "get in touch",
        title: "Contact",
        priority: 8,
      },
    ],

    "/why-us": [
      {
        url: "/about",
        anchorText: "our story",
        title: "About us",
        priority: 10,
      },
      {
        url: "/nutrition",
        anchorText: "nutritional advantages",
        title: "Nutrition",
        priority: 9,
      },
      {
        url: "/products",
        anchorText: "experience the difference",
        title: "Shop now",
        priority: 8,
      },
    ],

    "/nutrition": [
      {
        url: "/products",
        anchorText: "nutrient-rich dehydrated fruits",
        title: "Our products",
        priority: 10,
      },
      {
        url: "/subscription",
        anchorText: "maintain healthy habits",
        title: "Subscribe",
        priority: 9,
      },
      {
        url: "/faq",
        anchorText: "dietary questions",
        title: "FAQ",
        priority: 8,
      },
    ],

    "/faq": [
      {
        url: "/contact",
        anchorText: "contact our support team",
        title: "Contact us",
        priority: 10,
      },
      {
        url: "/products",
        anchorText: "browse products",
        title: "Products",
        priority: 9,
      },
      {
        url: "/subscription",
        anchorText: "subscription details",
        title: "Subscriptions",
        priority: 8,
      },
    ],

    "/vip": [
      {
        url: "/subscription",
        anchorText: "monthly plans",
        title: "Subscribe",
        priority: 10,
      },
      {
        url: "/products",
        anchorText: "exclusive product access",
        title: "Products",
        priority: 9,
      },
      {
        url: "/gifting",
        anchorText: "VIP gifting options",
        title: "Gifting",
        priority: 8,
      },
    ],

    "/retailer": [
      {
        url: "/products",
        anchorText: "our product range",
        title: "Products",
        priority: 10,
      },
      {
        url: "/about",
        anchorText: "about our brand",
        title: "About",
        priority: 9,
      },
      {
        url: "/contact",
        anchorText: "partnership inquiries",
        title: "Contact",
        priority: 8,
      },
    ],
  };

  return links[pagePath] || links["/"] || [];
}

/**
 * Get footer internal links organized by category
 */
export function getFooterLinks(): Record<string, InternalLink[]> {
  return {
    products: [
      { url: "/products", anchorText: "All Products", priority: 10 },
      { url: "/products?category=berries", anchorText: "Berries", priority: 9 },
      {
        url: "/products?category=tropical",
        anchorText: "Tropical Fruits",
        priority: 9,
      },
      {
        url: "/products?category=classic",
        anchorText: "Classic Fruits",
        priority: 9,
      },
      { url: "/gifting", anchorText: "Gift Boxes", priority: 8 },
      { url: "/subscription", anchorText: "Subscriptions", priority: 8 },
    ],
    company: [
      { url: "/about", anchorText: "About Us", priority: 10 },
      { url: "/why-us", anchorText: "Why Mandira Foods", priority: 9 },
      { url: "/nutrition", anchorText: "Nutrition", priority: 8 },
      { url: "/retailer", anchorText: "Become a Retailer", priority: 7 },
      { url: "/contact", anchorText: "Contact", priority: 7 },
    ],
    support: [
      { url: "/faq", anchorText: "FAQ", priority: 10 },
      { url: "/shipping", anchorText: "Shipping Info", priority: 9 },
      { url: "/returns", anchorText: "Returns", priority: 9 },
      { url: "/privacy-policy", anchorText: "Privacy Policy", priority: 8 },
      {
        url: "/terms-and-conditions",
        anchorText: "Terms & Conditions",
        priority: 8,
      },
    ],
    account: [
      { url: "/vip", anchorText: "VIP Membership", priority: 10 },
      { url: "/subscription", anchorText: "My Subscription", priority: 9 },
      { url: "/orders", anchorText: "Order History", priority: 8 },
      { url: "/wishlist", anchorText: "Wishlist", priority: 7 },
    ],
  };
}

// ============================================
// SEO LINK OPTIMIZATION
// ============================================

/**
 * Optimize anchor text for SEO
 */
export function optimizeAnchorText(
  baseText: string,
  targetKeywords: string[],
): string {
  // If base text already contains keywords, return as-is
  const lowerBase = baseText.toLowerCase();
  for (const keyword of targetKeywords) {
    if (lowerBase.includes(keyword.toLowerCase())) {
      return baseText;
    }
  }

  // Otherwise, prepend relevant keyword
  const relevantKeyword = targetKeywords.find((kw) =>
    baseText.toLowerCase().includes(kw.split(" ")[0].toLowerCase()),
  );

  if (relevantKeyword) {
    return `${relevantKeyword} - ${baseText}`;
  }

  return baseText;
}

/**
 * Generate semantic HTML for internal links
 */
export function generateInternalLinkHTML(link: InternalLink): string {
  const titleAttr = link.title ? ` title="${link.title}"` : "";
  return `<a href="${link.url}"${titleAttr} class="internal-link">${link.anchorText}</a>`;
}

/**
 * Generate breadcrumb HTML
 */
export function generateBreadcrumbHTML(breadcrumbs: BreadcrumbItem[]): string {
  const items = breadcrumbs.map((item, index) => {
    if (item.isCurrent) {
      return `<li class="breadcrumb-item active" aria-current="page"><span>${item.name}</span></li>`;
    }
    return `<li class="breadcrumb-item"><a href="${item.url}">${item.name}</a></li>`;
  });

  return `<nav aria-label="breadcrumb"><ol class="breadcrumb">${items.join("\n")}</ol></nav>`;
}

// ============================================
// LINK JUICE DISTRIBUTION
// ============================================

/**
 * Calculate link priority based on page importance
 */
export function calculateLinkPriority(
  sourcePage: string,
  targetPage: string,
): number {
  const pageImportance: Record<string, number> = {
    "/": 1.0,
    "/products": 0.9,
    "/gifting": 0.8,
    "/subscription": 0.8,
    "/about": 0.7,
    "/why-us": 0.7,
    "/nutrition": 0.7,
    "/faq": 0.6,
    "/vip": 0.6,
    "/contact": 0.6,
    "/retailer": 0.6,
  };

  const sourceImportance = pageImportance[sourcePage] || 0.5;
  const targetImportance = pageImportance[targetPage] || 0.5;

  // Higher priority for linking to important pages from important pages
  return (sourceImportance + targetImportance) / 2;
}

/**
 * Get recommended internal linking structure
 */
export function getRecommendedLinks(): Array<{
  from: string;
  to: string;
  anchorText: string;
  reason: string;
}> {
  return [
    {
      from: "/",
      to: "/products",
      anchorText: "premium dehydrated fruits Nepal",
      reason: "Primary conversion path",
    },
    {
      from: "/",
      to: "/gifting",
      anchorText: "luxury dried fruit gift boxes",
      reason: "High-value page promotion",
    },
    {
      from: "/products",
      to: "/subscription",
      anchorText: "monthly healthy snacks subscription",
      reason: "Recurring revenue",
    },
    {
      from: "/about",
      to: "/why-us",
      anchorText: "why choose Mandira Foods dehydrated fruits",
      reason: "Trust building",
    },
    {
      from: "/nutrition",
      to: "/products",
      anchorText: "buy nutrient-rich dried fruits",
      reason: "Convert education to sales",
    },
    {
      from: "/faq",
      to: "/contact",
      anchorText: "contact Mandira Foods Nepal",
      reason: "Support escalation",
    },
    {
      from: "/gifting",
      to: "/products",
      anchorText: "customize your gift box",
      reason: "Gift customization",
    },
    {
      from: "/vip",
      to: "/subscription",
      anchorText: "VIP subscription benefits",
      reason: "Premium tier promotion",
    },
  ];
}

// ============================================
// JSON-LD BREADCRUMB SCHEMA
// ============================================

/**
 * Generate breadcrumb schema for structured data
 */
export function generateBreadcrumbSchema(
  breadcrumbs: BreadcrumbItem[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${BRAND_CONFIG.url}${item.url}`,
    })),
  };
}
