// Force dynamic rendering to avoid workUnitAsyncStorage error during prerender
export const dynamic = "force-dynamic";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
