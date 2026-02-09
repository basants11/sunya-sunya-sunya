/**
 * Structured Data Component
 * Injects Schema.org JSON-LD into page head
 * Backend-only SEO - No visible UI elements
 * @component StructuredData
 */

"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  schemas: object[];
}

/**
 * Structured Data Component
 * Renders JSON-LD scripts in the document head
 */
export function StructuredData({ schemas }: StructuredDataProps) {
  useEffect(() => {
    // Remove any existing structured data scripts from this component
    const existingScripts = document.querySelectorAll(
      'script[data-structured-data="true"]',
    );
    existingScripts.forEach((script) => script.remove());

    // Add new structured data scripts
    schemas.forEach((schema, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-structured-data", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      const scripts = document.querySelectorAll(
        'script[data-structured-data="true"]',
      );
      scripts.forEach((script) => script.remove());
    };
  }, [schemas]);

  // This component renders nothing visible
  return null;
}

/**
 * Pre-rendered Structured Data for Server Components
 * Use this in server components for better SEO
 */
export function StructuredDataScripts({ schemas }: StructuredDataProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
