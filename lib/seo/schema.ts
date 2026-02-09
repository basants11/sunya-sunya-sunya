/**
 * Schema.org Structured Data Generators
 * Backend-only JSON-LD injection for SEO
 * @module lib/seo/schema
 */

import { products as allProducts } from "@/lib/products";
import { BRAND_CONFIG, GEO_TARGETING } from "./config";

// ============================================
// SCHEMA TYPES
// ============================================

export interface SchemaOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  description: string;
  foundingDate?: string;
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality: string;
    addressRegion?: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    contactType: string;
    telephone?: string;
    email?: string;
    availableLanguage: string[];
  };
  sameAs: string[];
  areaServed: {
    "@type": string;
    name: string;
  };
  priceRange: string;
  currenciesAccepted: string;
  paymentAccepted: string;
}

export interface SchemaLocalBusiness {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  image: string;
  url: string;
  telephone?: string;
  email?: string;
  address: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
  priceRange: string;
  currenciesAccepted: string;
  paymentAccepted: string;
  areaServed: {
    "@type": string;
    name: string;
  };
  hasMap?: string;
}

export interface SchemaProduct {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  image: string[];
  description: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  offers: {
    "@type": "Offer";
    url: string;
    priceCurrency: string;
    price: string;
    priceValidUntil?: string;
    availability: string;
    itemCondition: string;
    seller: {
      "@type": "Organization";
      name: string;
    };
    shippingDetails?: {
      "@type": "OfferShippingDetails";
      shippingRate: {
        "@type": "MonetaryAmount";
        value: string;
        currency: string;
      };
      shippingDestination: {
        "@type": "DefinedRegion";
        addressCountry: string;
      };
      deliveryTime?: {
        "@type": "ShippingDeliveryTime";
        handlingTime: {
          "@type": "QuantitativeValue";
          minValue: number;
          maxValue: number;
          unitCode: string;
        };
        transitTime: {
          "@type": "QuantitativeValue";
          minValue: number;
          maxValue: number;
          unitCode: string;
        };
      };
    };
    hasMerchantReturnPolicy?: {
      "@type": "MerchantReturnPolicy";
      returnPolicyCategory: string;
      merchantReturnDays: number;
      returnMethod: string;
      returnFees: string;
    };
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
  };
  review?: SchemaReview[];
  category?: string;
  material?: string;
  productionDate?: string;
  expirationDate?: string;
  weight?: {
    "@type": "QuantitativeValue";
    value: number;
    unitCode: string;
  };
  nutrition?: {
    "@type": "NutritionInformation";
    calories?: string;
    fatContent?: string;
    carbohydrateContent?: string;
    proteinContent?: string;
    fiberContent?: string;
    sugarContent?: string;
  };
  keywords?: string;
  countryOfOrigin?: {
    "@type": "Country";
    name: string;
  };
}

export interface SchemaReview {
  "@type": "Review";
  reviewRating: {
    "@type": "Rating";
    ratingValue: string;
    bestRating: string;
  };
  author: {
    "@type": "Person";
    name: string;
  };
  reviewBody: string;
  datePublished: string;
}

export interface SchemaFAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: SchemaQuestion[];
}

export interface SchemaQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: SchemaBreadcrumbItem[];
}

export interface SchemaBreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface SchemaWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
  inLanguage: string;
  publisher: {
    "@type": "Organization";
    name: string;
    logo: string;
  };
}

export interface SchemaCollectionPage {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  url: string;
  description: string;
  mainEntity: {
    "@type": "ItemList";
    itemListElement: SchemaProduct[];
  };
}

// ============================================
// SCHEMA GENERATORS
// ============================================

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(): SchemaOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_CONFIG.name,
    alternateName: BRAND_CONFIG.fullName,
    url: BRAND_CONFIG.url,
    logo: BRAND_CONFIG.logo,
    description: BRAND_CONFIG.description,
    foundingDate: BRAND_CONFIG.founded,
    address: {
      "@type": "PostalAddress",
      addressCountry: GEO_TARGETING.countryName,
      addressLocality: BRAND_CONFIG.location.city,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: BRAND_CONFIG.contact.whatsapp,
      email: BRAND_CONFIG.contact.email,
      availableLanguage: ["English", "Nepali"],
    },
    sameAs: [
      BRAND_CONFIG.social.facebook,
      BRAND_CONFIG.social.instagram,
      BRAND_CONFIG.social.twitter,
    ],
    areaServed: {
      "@type": "Country",
      name: GEO_TARGETING.countryName,
    },
    priceRange: GEO_TARGETING.localBusiness.priceRange,
    currenciesAccepted: GEO_TARGETING.currency,
    paymentAccepted: GEO_TARGETING.localBusiness.paymentAccepted.join(", "),
  };
}

/**
 * Generate LocalBusiness Schema
 */
export function generateLocalBusinessSchema(): SchemaLocalBusiness {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND_CONFIG.fullName,
    image: BRAND_CONFIG.logo,
    url: BRAND_CONFIG.url,
    telephone: BRAND_CONFIG.contact.whatsapp,
    email: BRAND_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND_CONFIG.location.city,
      addressCountry: GEO_TARGETING.countryName,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BRAND_CONFIG.location.geo.latitude,
      longitude: BRAND_CONFIG.location.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: GEO_TARGETING.localBusiness.priceRange,
    currenciesAccepted: GEO_TARGETING.currency,
    paymentAccepted: GEO_TARGETING.localBusiness.paymentAccepted.join(", "),
    areaServed: {
      "@type": "Country",
      name: GEO_TARGETING.countryName,
    },
    hasMap: GEO_TARGETING.localBusiness.hasMap,
  };
}

/**
 * Generate Product Schema
 */
export function generateProductSchema(
  product: (typeof allProducts)[0],
  options?: {
    rating?: number;
    reviewCount?: number;
    reviews?: SchemaReview[];
    inStock?: boolean;
  },
): SchemaProduct {
  const basePrice = product.gramPricing?.[0]?.price || product.nrsPrice;
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${BRAND_CONFIG.url}${product.image}`;

  // Calculate expiration date (1 year from now)
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [imageUrl],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: BRAND_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      url: `${BRAND_CONFIG.url}/products`,
      priceCurrency: GEO_TARGETING.currency,
      price: basePrice.toString(),
      priceValidUntil: expirationDate.toISOString().split("T")[0],
      availability:
        options?.inStock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: BRAND_CONFIG.name,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: GEO_TARGETING.currency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: GEO_TARGETING.country,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    ...(options?.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: options.rating.toString(),
        reviewCount: (options.reviewCount || 0).toString(),
        bestRating: "5",
      },
    }),
    ...(options?.reviews &&
      options.reviews.length > 0 && {
        review: options.reviews,
      }),
    category: "Dehydrated Fruits",
    material: "100% Natural Fruit",
    weight: {
      "@type": "QuantitativeValue",
      value: 500,
      unitCode: "GRM",
    },
    nutrition: {
      "@type": "NutritionInformation",
      calories: "Varies by fruit",
      sugarContent: "0g added sugar",
    },
    keywords: product.features.join(", "),
    countryOfOrigin: {
      "@type": "Country",
      name: "Nepal",
    },
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(
  questions: Array<{ question: string; answer: string }>,
): SchemaFAQPage {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): SchemaBreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${BRAND_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Generate WebSite Schema with Search
 */
export function generateWebSiteSchema(): SchemaWebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_CONFIG.fullName,
    url: BRAND_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BRAND_CONFIG.url}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: GEO_TARGETING.language,
    publisher: {
      "@type": "Organization",
      name: BRAND_CONFIG.name,
      logo: BRAND_CONFIG.logo,
    },
  };
}

/**
 * Generate Collection Page Schema
 */
export function generateCollectionPageSchema(
  name: string,
  description: string,
  products: typeof allProducts,
): SchemaCollectionPage {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${BRAND_CONFIG.url}/products`,
    description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product) =>
        generateProductSchema(product),
      ),
    },
  };
}

// ============================================
// PRE-DEFINED FAQ DATA
// ============================================

export const DEFAULT_FAQS = [
  {
    question:
      "What makes Mandira Foods dehydrated fruits different from regular dried fruits?",
    answer:
      "Mandira Foods fruits are hand-selected and slow-dehydrated at low temperatures to preserve maximum nutrition and flavor. Unlike mass-produced dried fruits, we use zero added sugar, zero preservatives, and zero artificial additives. Our small-batch production ensures export-grade quality in every pack.",
  },
  {
    question: "How long do Mandira Foods dehydrated fruits last?",
    answer:
      "Our dehydrated fruits have a shelf life of 12 months when stored in a cool, dry place away from direct sunlight. Once opened, we recommend consuming within 30 days for the best taste and texture. No refrigeration is required.",
  },
  {
    question: "Do you offer delivery across Nepal?",
    answer:
      "Yes, we deliver nationwide across Nepal. Delivery within Kathmandu Valley takes 1-2 business days, while delivery to other cities and regions typically takes 3-7 business days. We offer free delivery on orders above NPR 2,500.",
  },
  {
    question: "Are Mandira Foods fruits suitable for diabetics?",
    answer:
      "Our dehydrated fruits contain no added sugar - only the natural sugars present in fresh fruit. However, we recommend consulting with your healthcare provider before consumption, as dehydrated fruits are more concentrated in natural sugars than fresh fruit.",
  },
  {
    question: "Can I order in bulk for events or corporate gifting?",
    answer:
      "Absolutely! We offer special bulk pricing for events, corporate gifting, and wholesale orders. Contact us via WhatsApp or email for custom quotes and packaging options. We can create personalized gift boxes with your branding.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept multiple payment methods including Cash on Delivery (COD), Bank Transfer, eSewa, Khalti, and major credit/debit cards. All online payments are processed through secure payment gateways.",
  },
  {
    question: "Are your fruits organic?",
    answer:
      "While not certified organic, our fruits are sourced from trusted farms that follow sustainable agricultural practices. We prioritize quality and ensure our fruits are free from harmful pesticides and chemicals. Our dehydration process preserves all natural nutrients without any additives.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we primarily serve customers within Nepal. For international orders or bulk exports, please contact us directly to discuss shipping options and customs requirements.",
  },
];

// ============================================
// SCHEMA INJECTION HELPERS
// ============================================

/**
 * Convert schema object to JSON-LD script tag content
 */
export function schemaToJSONLD(schema: unknown): string {
  return JSON.stringify(schema, null, 0);
}

/**
 * Generate all schemas for homepage
 */
export function generateHomePageSchemas(): string[] {
  return [
    schemaToJSONLD(generateWebSiteSchema()),
    schemaToJSONLD(generateOrganizationSchema()),
    schemaToJSONLD(generateLocalBusinessSchema()),
  ];
}

/**
 * Generate all schemas for product page
 */
export function generateProductPageSchemas(
  product: (typeof allProducts)[0],
): string[] {
  return [
    schemaToJSONLD(
      generateProductSchema(product, {
        rating: 4.8,
        reviewCount: 127,
        inStock: true,
      }),
    ),
    schemaToJSONLD(
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Products", url: "/products" },
        { name: product.name, url: `/products` },
      ]),
    ),
  ];
}

/**
 * Generate all schemas for products listing page
 */
export function generateProductsPageSchemas(): string[] {
  return [
    schemaToJSONLD(
      generateCollectionPageSchema(
        "Premium Dehydrated Fruits Collection",
        "Explore Mandira Foods' curated collection of premium dehydrated fruits from Nepal",
        allProducts,
      ),
    ),
    schemaToJSONLD(
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Products", url: "/products" },
      ]),
    ),
  ];
}

/**
 * Generate all schemas for FAQ page
 */
export function generateFAQPageSchemas(): string[] {
  return [
    schemaToJSONLD(generateFAQSchema(DEFAULT_FAQS)),
    schemaToJSONLD(
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" },
      ]),
    ),
  ];
}

/**
 * Generate breadcrumb schema for any page
 */
export function generatePageBreadcrumb(
  pageName: string,
  pagePath: string,
  parentPages?: Array<{ name: string; url: string }>,
): string {
  const items = [{ name: "Home", url: "/" }];

  if (parentPages) {
    items.push(...parentPages);
  }

  items.push({ name: pageName, url: pagePath });

  return schemaToJSONLD(generateBreadcrumbSchema(items));
}
