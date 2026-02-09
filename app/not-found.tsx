// Force dynamic rendering to avoid workUnitAsyncStorage error during prerender
export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <Link
          href="/"
          className="px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#FF6900]/90 inline-block"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
