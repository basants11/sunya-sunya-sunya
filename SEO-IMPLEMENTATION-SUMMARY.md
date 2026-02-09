# Mandira Foods - Backend SEO Implementation Summary

## Overview

Complete backend-only SEO implementation for Mandira Foods (previously Sunya) - a premium dehydrated fruits e-commerce brand in Nepal. All SEO elements are injected server-side with zero visible changes to the frontend UI.

## Brand Migration: Sunya → Mandira Foods

### Changes Made

- **Brand Name**: Sunya → Mandira Foods
- **Domain**: sunya.np → mandirafoods.com.np
- **Social Handles**: @sunya_np → @mandirafoods
- **Email**: hello@sunya.np → hello@mandirafoods.com.np

## SEO Implementation Files

### 1. Configuration (`lib/seo/config.ts`)

- **Brand Configuration**: Mandira Foods branding, contact info, social links
- **SEO Keywords**: Nepal-focused keywords including:
  - Primary: "dehydrated fruits Nepal", "dried fruits Nepal", "premium dehydrated fruits"
  - Brand: "Mandira Foods dehydrated fruits", "Mandira Foods Nepal", "Mandira premium dried fruits"
- **Geo-Targeting**: Nepal (NP), NPR currency, en-NP/ne-NP languages
- **Search Intent Mapping**: Informational, transactional, commercial, local queries
- **Page SEO Configs**: 15+ pages with optimized titles, descriptions, keywords
- **Product SEO Templates**: Dynamic templates for all product types

### 2. Meta Tags (`lib/seo/meta.ts`)

- **Base Metadata**: Geo-targeting, language, robots directives
- **Page-Specific Metadata Generators**:
  - `generateHomeMetadata()` - Homepage SEO
  - `generateProductsMetadata()` - Products listing
  - `generateProductMetadata()` - Individual products
  - `generateGiftingMetadata()` - Gifting page
  - `generateSubscriptionMetadata()` - Subscription page
  - `generateAboutMetadata()` - About page
  - `generateWhyUsMetadata()` - Why Us page
  - `generateNutritionMetadata()` - Nutrition page
  - `generateFAQMetadata()` - FAQ page
  - `generateContactMetadata()` - Contact page
  - `generateRetailerMetadata()` - Retailer page
  - `generateVIPMetadata()` - VIP page
  - `generateCheckoutMetadata()` - Checkout (noindex)
  - `generatePrivacyMetadata()` - Privacy policy
  - `generateTermsMetadata()` - Terms & conditions
- **Open Graph**: Dynamic OG tags for all pages
- **Twitter Cards**: Twitter meta tags
- **Intent-Based Metadata**: Dynamic meta based on search query

### 3. Schema.org Structured Data (`lib/seo/schema.ts`)

- **Organization Schema**: Mandira Foods business info
- **LocalBusiness Schema**: Kathmandu location, hours, contact
- **Product Schema**: Individual product structured data
- **FAQ Schema**: FAQPage structured data
- **Breadcrumb Schema**: Navigation breadcrumbs
- **WebSite Schema**: Site search functionality
- **CollectionPage Schema**: Products listing

### 4. Sitemap & Robots (`lib/seo/sitemap.ts`)

- **Dynamic Sitemap Generation**: XML sitemap with image support
- **Robots.txt Generation**: Crawler directives
- **RSS Feed Generation**: For blog/news content
- **Security Headers**: CSP, HSTS, etc.
- **Cache Headers**: Performance optimization

### 5. Internal Linking (`lib/seo/internal-links.ts`)

- **Related Products Engine**: AI-powered product recommendations
- **Breadcrumb Generation**: Navigation breadcrumbs
- **Contextual Links**: Page-specific internal linking
- **Footer Links**: Organized link structure
- **Link Juice Distribution**: Priority-based linking

### 6. Server-Side Middleware (`lib/seo/middleware.ts`)

- **Response Header Injection**: SEO via HTTP headers
- **Meta Tag Headers**: X-Meta-\* headers
- **Open Graph Headers**: X-OG-\* headers
- **Twitter Card Headers**: X-Twitter-\* headers
- **Structured Data Headers**: X-Structured-Data-\* headers
- **Geo-Targeting Headers**: X-Geo-\* headers

### 7. Layout Integration (`app/layout.tsx`)

- **Updated Metadata**: Mandira Foods branding
- **JSON-LD Schemas**: Organization, LocalBusiness, WebSite, Product
- **Hreflang Tags**: en-NP, ne-NP language targeting
- **Geo Meta Tags**: Nepal targeting

### 8. API Routes

- **`app/sitemap.xml/route.ts`**: Dynamic sitemap endpoint
- **`app/robots.txt/route.ts`**: Dynamic robots.txt endpoint

## Nepal Geo-Targeting Implementation

### Country Signals

- **Country Code**: NP
- **Currency**: NPR (Nepalese Rupee)
- **Language**: en-NP (primary), ne-NP (alternate)
- **Region**: Asia/Kathmandu
- **Timezone**: UTC+5:45

### Local Business Schema

- **Address**: Kathmandu, Nepal
- **Coordinates**: 27.7172, 85.324
- **Hours**: Mon-Sat 09:00-18:00
- **Payment**: Cash, Credit Card, Bank Transfer, eSewa, Khalti

## Primary SEO Keywords (Nepal-Focused)

### Commercial Keywords

- dehydrated fruits Nepal
- dried fruits Nepal
- premium dehydrated fruits
- healthy snacks Nepal
- no added sugar dried fruits
- luxury dried fruit brand Nepal
- buy dehydrated fruits online Nepal

### Brand Keywords

- Mandira Foods dehydrated fruits
- Mandira Foods Nepal
- Mandira premium dried fruits
- Mandira healthy snacks

### Product Keywords

- dried kiwi Nepal
- dried mango Nepal
- dried strawberry Nepal
- dried pineapple Nepal
- dried papaya Nepal

## Search Intent Mapping

### Informational

- "what are dehydrated fruits"
- "health benefits dried fruits"
- Content type: Educational

### Transactional

- "buy dehydrated fruits"
- "dehydrated fruits price"
- Content type: Product

### Commercial

- "best dehydrated fruits Nepal"
- "dehydrated fruits vs fresh"
- Content type: Comparison

### Local

- "dehydrated fruits Kathmandu"
- "dried fruits store Kathmandu"
- Content type: Local

## Technical SEO Features

### Performance

- Compression enabled
- Caching headers (1 year static, 1 hour dynamic)
- Image optimization
- Lazy loading

### Security Headers

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy

### Robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout
Disallow: /admin/

Sitemap: https://mandirafoods.com.np/sitemap.xml
```

## Backend-Only Implementation

### Zero Frontend Changes

- No visible SEO elements in HTML body
- All meta tags in `<head>` only
- No keyword stuffing
- Clean, simple English
- Google-compliant (E-E-A-T)

### Server-Side Injection

- Metadata via Next.js `metadata` export
- JSON-LD via `<script type="application/ld+json">`
- Headers via middleware
- Sitemap/robots via API routes

## Production Deployment Checklist

### Environment Variables

```env
GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Required OG Images

- `/og-image-home.jpg` (1200x630)
- `/og-image-products.jpg` (1200x630)
- `/og-image-gifting.jpg` (1200x630)
- `/og-image-subscription.jpg` (1200x630)
- `/og-image-about.jpg` (1200x630)
- `/og-image-vip.jpg` (1200x630)
- `/og-image-nutrition.jpg` (1200x630)
- `/og-image-faq.jpg` (1200x630)
- `/og-image-contact.jpg` (1200x630)
- `/og-image-retailer.jpg` (1200x630)

### Required Assets

- `/logo.png` - Brand logo
- `/favicon.svg` - Favicon
- `/apple-touch-icon.png` - Apple touch icon
- `/manifest.json` - Web app manifest

## Verification

### Google Search Console

1. Add property: mandirafoods.com.np
2. Verify via DNS or HTML tag
3. Submit sitemap.xml
4. Check geo-targeting settings

### Schema Validation

- Test structured data: https://search.google.com/test/rich-results
- Validate JSON-LD: https://validator.schema.org/

### Performance Testing

- PageSpeed Insights: https://pagespeed.web.dev/
- Core Web Vitals

## Summary

This implementation provides a complete backend SEO solution for Mandira Foods targeting the Nepal market. All SEO elements are generated server-side and injected into the HTML head or HTTP headers, ensuring zero impact on the frontend user experience while maximizing search engine visibility.

### Key Achievements

✅ Complete brand migration from Sunya to Mandira Foods
✅ Nepal-focused geo-targeting (NP, NPR, en-NP)
✅ 15+ pages with optimized metadata
✅ 4 types of Schema.org structured data
✅ Dynamic sitemap.xml and robots.txt
✅ Server-side internal linking logic
✅ Search intent mapping
✅ Backend-only implementation (no UI changes)
✅ Google-compliant (E-E-A-T)
✅ Production-ready deployment
