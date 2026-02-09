/**
 * SEO Configuration for Mandira Foods - Premium Dehydrated Fruits Nepal
 * Backend-only SEO implementation - Zero frontend changes
 * @module lib/seo/config
 */

// ============================================
// BRAND & BUSINESS CONFIGURATION
// ============================================

export const BRAND_CONFIG = {
  name: "Mandira Foods",
  shortName: "Mandira",
  fullName: "Mandira Foods Premium Dehydrated Fruits",
  tagline: "Hand-Selected, Slow-Dehydrated, Export-Grade Quality",
  description:
    "Mandira Foods offers premium dehydrated fruits from Nepal with zero sugar, zero preservatives. Hand-selected, slow-dehydrated for maximum nutrition and flavor.",
  url: "https://mandirafoods.com.np",
  logo: "https://mandirafoods.com.np/logo.png",
  founded: "2023",
  location: {
    country: "Nepal",
    city: "Kathmandu",
    address: "Kathmandu, Nepal",
    geo: {
      latitude: 27.7172,
      longitude: 85.324,
    },
  },
  contact: {
    whatsapp: "+977-9800000000",
    email: "hello@mandirafoods.com.np",
  },
  social: {
    facebook: "https://facebook.com/mandirafoods",
    instagram: "https://instagram.com/mandirafoods",
    twitter: "https://twitter.com/mandirafoods",
  },
  currency: "NPR",
  language: "en-NP",
  alternateLanguage: "ne-NP",
} as const;

// ============================================
// PRIMARY SEO KEYWORDS (NEPAL-FOCUSED)
// ============================================

export const SEO_KEYWORDS = {
  // Core commercial keywords
  primary: [
    "dehydrated fruits Nepal",
    "dried fruits Nepal",
    "premium dehydrated fruits",
    "healthy snacks Nepal",
    "no added sugar dried fruits",
    "luxury dried fruit brand Nepal",
    "buy dehydrated fruits online Nepal",
  ],

  // Secondary long-tail keywords
  secondary: [
    "organic dehydrated fruits Kathmandu",
    "natural dried fruits Nepal",
    "export quality dried fruits",
    "sugar free dried fruits Nepal",
    "preservative free dried fruits",
    "handmade dried fruits Nepal",
    "artisan dehydrated fruits",
    "gourmet dried fruits Nepal",
    "bulk dried fruits Nepal",
    "wholesale dehydrated fruits",
    "dried fruit gift boxes Nepal",
    "corporate gifting dried fruits",
    "healthy office snacks Nepal",
    "nutrient rich dried fruits",
    "slow dehydrated fruits Nepal",
  ],

  // Product-specific keywords
  product: [
    "dried kiwi Nepal",
    "dried mango Nepal",
    "dried strawberry Nepal",
    "dried pineapple Nepal",
    "dried papaya Nepal",
    "dried blueberry Nepal",
    "dried apple Nepal",
    "dried banana Nepal",
    "dragon fruit chips Nepal",
  ],

  // Brand keywords (natural mentions)
  brand: [
    "Mandira Foods dehydrated fruits",
    "Mandira Foods Nepal",
    "Mandira premium dried fruits",
    "Mandira healthy snacks",
  ],
} as const;

// ============================================
// SEARCH INTENT MAPPING
// ============================================

export type SearchIntent =
  | "informational"
  | "transactional"
  | "navigational"
  | "commercial";

export interface IntentMapping {
  intent: SearchIntent;
  keywords: string[];
  contentType: string;
  priority: number;
}

export const SEARCH_INTENT_MAP: Record<string, IntentMapping> = {
  // Informational queries
  "what are dehydrated fruits": {
    intent: "informational",
    keywords: [
      "dehydrated fruits benefits",
      "how are fruits dehydrated",
      "dehydrated vs dried fruits",
    ],
    contentType: "educational",
    priority: 1,
  },
  "health benefits dried fruits": {
    intent: "informational",
    keywords: [
      "nutritional value dried fruits",
      "are dried fruits healthy",
      "dried fruits nutrients",
    ],
    contentType: "educational",
    priority: 1,
  },

  // Transactional queries
  "buy dehydrated fruits": {
    intent: "transactional",
    keywords: [
      "buy dried fruits online",
      "order dehydrated fruits",
      "purchase dried fruits Nepal",
    ],
    contentType: "product",
    priority: 10,
  },
  "dehydrated fruits price": {
    intent: "transactional",
    keywords: [
      "dried fruits price Nepal",
      "dehydrated fruits cost",
      "premium dried fruits price",
    ],
    contentType: "product",
    priority: 9,
  },

  // Commercial investigation
  "best dehydrated fruits Nepal": {
    intent: "commercial",
    keywords: [
      "top dried fruits brand Nepal",
      "premium dried fruits",
      "quality dehydrated fruits",
    ],
    contentType: "comparison",
    priority: 8,
  },
  "dehydrated fruits vs fresh": {
    intent: "commercial",
    keywords: [
      "dried fruits nutrition comparison",
      "dehydrated fruits benefits",
    ],
    contentType: "comparison",
    priority: 7,
  },

  // Local queries
  "dehydrated fruits Kathmandu": {
    intent: "transactional",
    keywords: [
      "dried fruits store Kathmandu",
      "buy dried fruits Kathmandu",
      "dehydrated fruits near me",
    ],
    contentType: "local",
    priority: 9,
  },
};

// ============================================
// PAGE-SPECIFIC SEO CONFIGURATIONS
// ============================================

export interface PageSEOConfig {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  schemaType: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export const PAGE_SEO_CONFIG: Record<string, PageSEOConfig> = {
  home: {
    path: "/",
    title:
      "Mandira Foods | Premium Dehydrated Fruits Nepal - Hand-Selected, Zero Sugar",
    description:
      "Nepal's finest dehydrated fruits. Hand-selected, slow-dehydrated with zero sugar & preservatives. Export-grade quality dried kiwi, mango, strawberry. Healthy snacks delivered nationwide.",
    keywords: [
      "dehydrated fruits Nepal",
      "premium dried fruits",
      "healthy snacks Nepal",
      "no added sugar dried fruits",
      "luxury dried fruit brand Nepal",
      "buy dehydrated fruits online Nepal",
      "Mandira Foods Nepal",
      "Mandira premium dried fruits",
    ],
    schemaType: "WebSite",
    priority: 1.0,
    changeFrequency: "daily",
  },

  products: {
    path: "/products",
    title: "Premium Dehydrated Fruits Collection | Mandira Foods Nepal",
    description:
      "Explore Mandira Foods' curated collection of premium dehydrated fruits. Dried kiwi, mango, strawberry, pineapple & more. Zero additives, export-quality. Shop healthy snacks online in Nepal.",
    keywords: [
      "dehydrated fruits Nepal",
      "dried fruits collection",
      "premium dehydrated fruits",
      "buy dried fruits online Nepal",
      "healthy snacks Nepal",
      "natural dried fruits",
      "Mandira Foods dehydrated fruits",
    ],
    schemaType: "CollectionPage",
    priority: 0.9,
    changeFrequency: "daily",
  },

  about: {
    path: "/about",
    title: "About Mandira Foods | Premium Dehydrated Fruits Brand Nepal",
    description:
      "Discover Mandira Foods' story. Nepal's premier dehydrated fruits brand committed to quality, sustainability, and healthy living. Hand-selected fruits, slow-dehydrated for maximum nutrition.",
    keywords: [
      "Mandira Foods Nepal",
      "dehydrated fruits brand Nepal",
      "about Mandira Foods",
      "premium dried fruits company",
      "healthy snacks brand Nepal",
    ],
    schemaType: "AboutPage",
    priority: 0.7,
    changeFrequency: "monthly",
  },

  gifting: {
    path: "/gifting",
    title:
      "Luxury Dried Fruit Gift Boxes | Premium Gifting Nepal - Mandira Foods",
    description:
      "Elevate your gifting with Mandira Foods' luxury dehydrated fruit boxes. Premium dried fruits in elegant packaging. Perfect for corporate gifts, festivals & special occasions in Nepal.",
    keywords: [
      "dried fruit gift boxes Nepal",
      "luxury gifting Nepal",
      "premium fruit gifts",
      "corporate gifting dried fruits",
      "healthy gift hampers Nepal",
      "Mandira Foods gifting",
    ],
    schemaType: "CollectionPage",
    priority: 0.8,
    changeFrequency: "weekly",
  },

  subscription: {
    path: "/subscription",
    title:
      "Monthly Dried Fruit Subscription | Healthy Snacks Delivered - Mandira Foods",
    description:
      "Subscribe to Mandira Foods' monthly dehydrated fruit delivery. Fresh, premium dried fruits delivered to your door. Flexible plans, free delivery across Nepal. Healthy snacking made easy.",
    keywords: [
      "dried fruit subscription Nepal",
      "monthly healthy snacks",
      "dehydrated fruits delivery",
      "healthy snack subscription",
      "premium fruits monthly box",
    ],
    schemaType: "Service",
    priority: 0.8,
    changeFrequency: "weekly",
  },

  vip: {
    path: "/vip",
    title:
      "VIP Membership | Exclusive Benefits - Mandira Foods Premium Fruits Nepal",
    description:
      "Join Mandira Foods VIP for exclusive benefits. Early access to limited batches, special discounts, priority delivery & personalized service. Nepal's premium dehydrated fruit experience.",
    keywords: [
      "Mandira Foods VIP membership",
      "premium fruits membership Nepal",
      "exclusive dried fruits",
      "VIP healthy snacks",
      "luxury fruit membership",
    ],
    schemaType: "Service",
    priority: 0.6,
    changeFrequency: "monthly",
  },

  whyUs: {
    path: "/why-us",
    title: "Why Choose Mandira Foods | Premium Quality Dehydrated Fruits Nepal",
    description:
      "Learn why Mandira Foods is Nepal's trusted choice for premium dehydrated fruits. Zero sugar, zero preservatives, export-grade quality. Hand-selected & slow-dehydrated for maximum nutrition.",
    keywords: [
      "why Mandira Foods dehydrated fruits",
      "premium quality dried fruits Nepal",
      "best dehydrated fruits brand",
      "no sugar no preservative fruits",
      "export quality dried fruits",
    ],
    schemaType: "AboutPage",
    priority: 0.7,
    changeFrequency: "monthly",
  },

  nutrition: {
    path: "/nutrition",
    title:
      "Nutritional Benefits | Dehydrated Fruits Nutrition Facts - Mandira Foods",
    description:
      "Explore the nutritional benefits of Mandira Foods' dehydrated fruits. Rich in vitamins, minerals & antioxidants. Zero additives, maximum nutrition. Healthy snacking made delicious.",
    keywords: [
      "dehydrated fruits nutrition",
      "dried fruits health benefits",
      "nutritional value dried fruits",
      "healthy snacks nutrition Nepal",
      "vitamins in dried fruits",
    ],
    schemaType: "Article",
    priority: 0.7,
    changeFrequency: "monthly",
  },

  faq: {
    path: "/faq",
    title: "FAQ | Dehydrated Fruits Questions Answered - Mandira Foods Nepal",
    description:
      "Find answers to frequently asked questions about Mandira Foods' dehydrated fruits. Storage, shelf life, nutrition, ordering & delivery information for Nepal customers.",
    keywords: [
      "dehydrated fruits FAQ",
      "dried fruits questions",
      "how to store dried fruits",
      "dehydrated fruits shelf life",
      "Mandira Foods FAQ Nepal",
    ],
    schemaType: "FAQPage",
    priority: 0.6,
    changeFrequency: "monthly",
  },

  contact: {
    path: "/contact",
    title:
      "Contact Mandira Foods | Get in Touch - Premium Dehydrated Fruits Nepal",
    description:
      "Contact Mandira Foods for inquiries, bulk orders, or partnerships. Premium dehydrated fruits from Nepal. WhatsApp, email & phone support available.",
    keywords: [
      "contact Mandira Foods Nepal",
      "dehydrated fruits inquiry",
      "bulk order dried fruits",
      "Mandira Foods customer service",
      "premium fruits contact",
    ],
    schemaType: "ContactPage",
    priority: 0.6,
    changeFrequency: "yearly",
  },

  retailer: {
    path: "/retailer",
    title: "Become a Retailer | Partner with Mandira Foods Nepal",
    description:
      "Partner with Mandira Foods to retail premium dehydrated fruits. Wholesale pricing, marketing support & exclusive territories. Join Nepal's fastest-growing healthy snack brand.",
    keywords: [
      "dehydrated fruits wholesale Nepal",
      "become a retailer Mandira Foods",
      "dried fruits distributorship",
      "bulk dried fruits supplier",
      "healthy snacks wholesale",
    ],
    schemaType: "Service",
    priority: 0.6,
    changeFrequency: "monthly",
  },

  checkout: {
    path: "/checkout",
    title: "Checkout | Secure Order - Mandira Foods Premium Dehydrated Fruits",
    description:
      "Complete your order for premium dehydrated fruits. Secure checkout, multiple payment options. Fast delivery across Nepal.",
    keywords: [
      "order dehydrated fruits",
      "buy dried fruits Nepal",
      "Mandira Foods checkout",
      "secure order dried fruits",
    ],
    schemaType: "CheckoutPage",
    priority: 0.5,
    changeFrequency: "always",
  },

  privacy: {
    path: "/privacy-policy",
    title: "Privacy Policy | Mandira Foods Nepal",
    description:
      "Mandira Foods' privacy policy. Learn how we protect your personal information and data.",
    keywords: ["Mandira Foods privacy policy", "data protection Nepal"],
    schemaType: "WebPage",
    priority: 0.3,
    changeFrequency: "yearly",
  },

  terms: {
    path: "/terms-and-conditions",
    title: "Terms & Conditions | Mandira Foods Nepal",
    description:
      "Mandira Foods' terms and conditions. Please read carefully before placing an order.",
    keywords: ["Mandira Foods terms", "conditions Nepal"],
    schemaType: "WebPage",
    priority: 0.3,
    changeFrequency: "yearly",
  },
};

// ============================================
// PRODUCT-SPECIFIC SEO TEMPLATES
// ============================================

export interface ProductSEOTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  keywords: string[];
}

export const PRODUCT_SEO_TEMPLATES: Record<string, ProductSEOTemplate> = {
  default: {
    titleTemplate:
      "{productName} | Premium Dehydrated {fruitType} - Mandira Foods Nepal",
    descriptionTemplate:
      "Buy premium dehydrated {fruitType} from Mandira Foods Nepal. {benefits}. Zero sugar, zero preservatives, export-grade quality. Order now for nationwide delivery.",
    keywords: [
      "dehydrated {fruitType} Nepal",
      "dried {fruitType} Nepal",
      "premium dried {fruitType}",
      "buy dried {fruitType} online",
      "healthy {fruitType} snacks",
      "Mandira Foods {fruitType}",
    ],
  },

  "Dried Kiwi": {
    titleTemplate:
      "Premium Dried Kiwi | Vitamin C Rich Dehydrated Fruit - Mandira Foods Nepal",
    descriptionTemplate:
      "Buy premium dried kiwi from Mandira Foods Nepal. Rich in Vitamin C, tart & vibrant flavor. Hand-selected slices, zero additives. Export-grade quality. Order now for healthy snacking.",
    keywords: [
      "dried kiwi Nepal",
      "dehydrated kiwi slices",
      "vitamin C rich dried fruits",
      "premium dried kiwi",
      "buy dried kiwi online Nepal",
      "healthy kiwi snacks",
      "Mandira Foods kiwi",
    ],
  },

  "Dried Mango": {
    titleTemplate:
      "Golden Dried Mango | Beta-Carotene Rich - Mandira Foods Nepal",
    descriptionTemplate:
      "Indulge in Mandira Foods' premium dried mango. Golden slices rich in beta-carotene & Vitamin A. Sweet, chewy, zero additives. Nepal's finest dehydrated mango. Order today.",
    keywords: [
      "dried mango Nepal",
      "premium dried mango",
      "beta carotene dried fruits",
      "dehydrated mango slices",
      "buy dried mango online",
      "vitamin A rich snacks",
      "Mandira Foods mango",
    ],
  },

  "Dried Strawberry": {
    titleTemplate:
      "Antioxidant-Rich Dried Strawberry | Superfruit - Mandira Foods Nepal",
    descriptionTemplate:
      "Experience Mandira Foods' antioxidant-packed dried strawberries. Cellular health support, immunity boost. Premium dehydrated slices, zero sugar added. Order now in Nepal.",
    keywords: [
      "dried strawberry Nepal",
      "antioxidant dried fruits",
      "premium dried strawberry",
      "dehydrated strawberry slices",
      "superfruit snacks Nepal",
      "immunity boosting dried fruits",
      "Mandira Foods strawberry",
    ],
  },

  "Dried Blueberry": {
    titleTemplate:
      "Brain-Boosting Dried Blueberry | 5x Antioxidants - Mandira Foods Nepal",
    descriptionTemplate:
      "Enhance brain health with Mandira Foods' dried blueberries. 5x more antioxidants than fresh. Premium dehydrated, zero additives. Nepal's finest blueberry snacks. Shop now.",
    keywords: [
      "dried blueberry Nepal",
      "brain health snacks",
      "antioxidant rich blueberries",
      "premium dried blueberry",
      "dehydrated blueberries Nepal",
      "memory boosting foods",
      "Mandira Foods blueberry",
    ],
  },

  "Dried Pineapple": {
    titleTemplate:
      "Digestive Health Dried Pineapple | Bromelain Rich - Mandira Foods Nepal",
    descriptionTemplate:
      "Enjoy Mandira Foods' bromelain-rich dried pineapple. Natural digestive aid, vitamin C packed. Sweet tropical flavor, zero preservatives. Premium dehydrated. Order in Nepal.",
    keywords: [
      "dried pineapple Nepal",
      "bromelain rich fruits",
      "digestive health snacks",
      "premium dried pineapple",
      "dehydrated pineapple rings",
      "tropical dried fruits",
      "Mandira Foods pineapple",
    ],
  },

  "Dried Papaya": {
    titleTemplate:
      "Immunity-Boosting Dried Papaya | Enzyme Rich - Mandira Foods Nepal",
    descriptionTemplate:
      "Boost immunity with Mandira Foods' enzyme-rich dried papaya. Natural digestive support, vitamin packed. Premium dehydrated slices. Export-grade quality from Nepal. Buy now.",
    keywords: [
      "dried papaya Nepal",
      "immunity boosting fruits",
      "enzyme rich dried fruits",
      "premium dried papaya",
      "dehydrated papaya slices",
      "digestive health snacks",
      "Mandira Foods papaya",
    ],
  },

  "Dried Apple": {
    titleTemplate:
      "Heart-Healthy Dried Apple | Fiber Rich - Mandira Foods Nepal",
    descriptionTemplate:
      "Nourish your heart with Mandira Foods' fiber-rich dried apple rings. Energy-boosting, naturally sweet. Premium dehydrated, zero additives. Healthy snacking from Nepal. Order today.",
    keywords: [
      "dried apple Nepal",
      "heart healthy snacks",
      "fiber rich dried fruits",
      "premium dried apple",
      "dehydrated apple rings",
      "energy boosting fruits",
      "Mandira Foods apple",
    ],
  },

  "Dried Banana": {
    titleTemplate:
      "Energy-Packed Dried Banana | Potassium Rich - Mandira Foods Nepal",
    descriptionTemplate:
      "Fuel your day with Mandira Foods' potassium-rich dried banana. Natural energy booster, magnesium packed. Premium dehydrated chips. Perfect pre-workout snack. Buy in Nepal.",
    keywords: [
      "dried banana Nepal",
      "energy boosting snacks",
      "potassium rich fruits",
      "premium dried banana",
      "dehydrated banana chips",
      "pre workout snacks Nepal",
      "Mandira Foods banana",
    ],
  },
};

// ============================================
// GEO-TARGETING CONFIGURATION FOR NEPAL
// ============================================

export const GEO_TARGETING = {
  country: "NP",
  countryName: "Nepal",
  currency: "NPR",
  currencyName: "Nepalese Rupee",
  language: "en-NP",
  alternateLanguage: "ne-NP",
  region: "Asia/Kathmandu",
  timezone: "UTC+5:45",

  // Local business signals
  localBusiness: {
    priceRange: "$$$",
    paymentAccepted: [
      "Cash",
      "Credit Card",
      "Bank Transfer",
      "eSewa",
      "Khalti",
    ],
    currenciesAccepted: "NPR",
    openingHours: "Mo-Sa 09:00-18:00",
    areaServed: {
      type: "Country",
      name: "Nepal",
    },
    hasMap: "https://maps.google.com/?q=Kathmandu,Nepal",
  },

  // Shipping information
  shipping: {
    shipsTo: ["Nepal", "International"],
    deliveryTime: "1-3 days (Kathmandu), 3-7 days (Nationwide)",
    freeShippingThreshold: 2500,
  },
} as const;

// ============================================
// TECHNICAL SEO CONFIGURATION
// ============================================

export const TECHNICAL_SEO = {
  // Robots.txt configuration
  robots: {
    userAgent: "*",
    allow: [
      "/",
      "/products",
      "/about",
      "/gifting",
      "/nutrition",
      "/faq",
      "/contact",
    ],
    disallow: ["/api/", "/checkout", "/admin/", "/_next/", "/*.json$"],
    crawlDelay: 1,
    sitemap: "https://mandirafoods.com.np/sitemap.xml",
  },

  // Sitemap configuration
  sitemap: {
    defaultPriority: 0.5,
    defaultChangefreq: "weekly",
    maxUrlsPerSitemap: 50000,
    imageSitemap: true,
    videoSitemap: false,
    newsSitemap: false,
  },

  // Performance optimization
  performance: {
    enableCompression: true,
    enableCaching: true,
    cacheMaxAge: 31536000, // 1 year for static assets
    staleWhileRevalidate: 86400, // 1 day
    imageOptimization: true,
    lazyLoading: true,
    preloadCritical: true,
  },

  // Security headers for SEO
  securityHeaders: {
    contentSecurityPolicy:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://www.google-analytics.com;",
    strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",
    xContentTypeOptions: "nosniff",
    xFrameOptions: "DENY",
    referrerPolicy: "strict-origin-when-cross-origin",
  },
} as const;

// ============================================
// CONTENT GENERATION HELPERS
// ============================================

/**
 * Generate meta title with brand suffix
 */
export function generateMetaTitle(title: string, includeBrand = true): string {
  const brand = includeBrand ? " | Mandira Foods Nepal" : "";
  const fullTitle = `${title}${brand}`;
  // Keep under 60 characters for optimal display
  return fullTitle.length > 60
    ? title.slice(0, 57 - brand.length) + "..." + brand
    : fullTitle;
}

/**
 * Generate meta description with call-to-action
 */
export function generateMetaDescription(description: string): string {
  // Keep under 160 characters
  if (description.length > 160) {
    return description.slice(0, 157) + "...";
  }
  return description;
}

/**
 * Generate keywords string from array
 */
export function generateKeywords(keywords: string[]): string {
  return keywords.join(", ");
}

/**
 * Get search intent for a given query
 */
export function getSearchIntent(query: string): SearchIntent {
  const normalizedQuery = query.toLowerCase().trim();

  for (const [key, mapping] of Object.entries(SEARCH_INTENT_MAP)) {
    if (
      normalizedQuery.includes(key) ||
      mapping.keywords.some((kw) => normalizedQuery.includes(kw))
    ) {
      return mapping.intent;
    }
  }

  // Default intent detection
  if (
    normalizedQuery.includes("buy") ||
    normalizedQuery.includes("order") ||
    normalizedQuery.includes("price") ||
    normalizedQuery.includes("shop")
  ) {
    return "transactional";
  }
  if (
    normalizedQuery.includes("what") ||
    normalizedQuery.includes("how") ||
    normalizedQuery.includes("benefits") ||
    normalizedQuery.includes("nutrition")
  ) {
    return "informational";
  }
  if (
    normalizedQuery.includes("best") ||
    normalizedQuery.includes("top") ||
    normalizedQuery.includes("vs") ||
    normalizedQuery.includes("compare")
  ) {
    return "commercial";
  }

  return "informational";
}

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Get product SEO configuration
 */
export function getProductSEO(productName: string): ProductSEOTemplate {
  return PRODUCT_SEO_TEMPLATES[productName] || PRODUCT_SEO_TEMPLATES.default;
}

/**
 * Format price with NPR currency
 */
export function formatPriceNPR(price: number): string {
  return `NPR ${price.toLocaleString("en-NP")}`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BRAND_CONFIG.url}${cleanPath}`;
}
