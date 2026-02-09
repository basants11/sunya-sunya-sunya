"use client";

import dynamic from "next/dynamic";
import ContactPageClient from "./contact-page-client";

const DynamicContactPageClient = dynamic(
  () => Promise.resolve(ContactPageClient),
  { ssr: false },
);

export default function ContactPageWrapper() {
  return <DynamicContactPageClient />;
}
