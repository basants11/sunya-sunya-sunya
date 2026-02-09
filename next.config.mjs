/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript errors to catch issues during build
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Use minimal static generation to avoid workUnitAsyncStorage issues
  // Force dynamic rendering for all pages
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
