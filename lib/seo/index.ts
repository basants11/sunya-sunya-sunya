/**
 * SEO Module - Main Export File
 * Backend-only SEO implementation for Mandira Foods Nepal
 * @module lib/seo
 */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

export {
  BRAND_CONFIG,
  GEO_TARGETING,
  PAGE_SEO_CONFIG,
  PRODUCT_SEO_TEMPLATES,
  SEARCH_INTENT_MAP,
  SEO_KEYWORDS,
  TECHNICAL_SEO,
  formatPriceNPR,
  generateCanonicalUrl,
  generateKeywords,
  generateMetaDescription,
  generateMetaTitle,
  generateSlug,
  getProductSEO,
  getSearchIntent,
} from "./config";
export type {
  IntentMapping,
  PageSEOConfig,
  ProductSEOTemplate,
  SearchIntent,
} from "./config";
// ============================================
// INTERNAL LINKING
// ============================================
export {
  calculateLinkPriority,
  generateBreadcrumbHTML,
  generateBreadcrumbSchema as generateBreadcrumbSchemaFromLinks,
  generateBreadcrumbs,
  generateCategoryBreadcrumbs,
  generateInternalLinkHTML,
  generateProductBreadcrumbs,
  getContextualLinks,
  getFooterLinks,
  getRecommendedLinks,
  getRelatedProducts,
  optimizeAnchorText,
} from "./internal-links";
export type {
  BreadcrumbItem,
  InternalLink,
  RelatedProduct,
} from "./internal-links";
// ============================================
// META TAGS GENERATION
// ============================================
export {
  generateAboutMetadata,
  generateBaseMetadata,
  generateCheckoutMetadata,
  generateContactMetadata,
  generateFAQMetadata,
  generateGiftingMetadata,
  generateHomeMetadata,
  generateIntentBasedMetadata,
  generateMetaPreview,
  generateNutritionMetadata,
  generatePrivacyMetadata,
  generateProductMetadata,
  generateProductsMetadata,
  generateRetailerMetadata,
  generateSubscriptionMetadata,
  generateTermsMetadata,
  generateVIPMetadata,
  generateWhyUsMetadata,
} from "./meta";
export type { MetaPreview } from "./meta";
// ============================================
// SCHEMA.ORG STRUCTURED DATA
// ============================================
export {
  DEFAULT_FAQS,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateFAQPageSchemas,
  generateFAQSchema,
  generateHomePageSchemas,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generatePageBreadcrumb,
  generateProductPageSchemas,
  generateProductSchema,
  generateProductsPageSchemas,
  generateWebSiteSchema,
  schemaToJSONLD,
} from "./schema";
export type {
  SchemaBreadcrumbItem,
  SchemaBreadcrumbList,
  SchemaCollectionPage,
  SchemaFAQPage,
  SchemaLocalBusiness,
  SchemaOrganization,
  SchemaProduct,
  SchemaQuestion,
  SchemaReview,
  SchemaWebSite,
} from "./schema";
// ============================================
// SITEMAP & ROBOTS
// ============================================
export {
  generateCacheHeaders,
  generateRSSFeed,
  generateRobotsTxt,
  generateSecurityHeaders,
  generateSitemapUrls,
  generateSitemapXML,
} from "./sitemap";
export type { RSSItem, SitemapImage, SitemapUrl } from "./sitemap";
