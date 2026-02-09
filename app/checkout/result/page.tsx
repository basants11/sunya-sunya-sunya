import { Suspense } from "react";
import ResultClient from "./ResultClient";

// Force dynamic rendering to avoid workUnitAsyncStorage error during prerender
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResultClient />
    </Suspense>
  );
}
