import type { Product } from "@/lib/products"
import { applyTolerantQuery, normalizeQuery, tokenize, type TolerantQueryResult } from "@/lib/search/tolerant"

export interface ProductSearchResult extends TolerantQueryResult {
  results: Product[]
}

const SYNONYMS: Record<string, string> = {
  // common fruit variants
  blueberries: "blueberry",
  blueberrie: "blueberry",
  pineaple: "pineapple",
  pinapple: "pineapple",
  bannana: "banana",
  bananna: "banana",
  appl: "apple",
  kiwis: "kiwi",
}

function buildVocabulary(products: Product[]): string[] {
  const vocab = new Set<string>()
  for (const p of products) {
    const text = `${p.name} ${p.description} ${p.features.join(" ")}`
    for (const t of tokenize(text)) {
      // keep only non-trivial tokens
      if (t.length >= 3) vocab.add(t)
    }
  }
  // Add canonical fruit tokens that should always be correctable
  ;["kiwi", "blueberry", "pineapple", "papaya", "apple", "banana"].forEach((t) => vocab.add(t))
  return Array.from(vocab)
}

function productMatchesQuery(product: Product, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true

  const haystack = normalizeQuery(`${product.name} ${product.description} ${product.features.join(" ")}`)

  // AND semantics per token, but token can match any substring of the haystack
  const qTokens = normalizedQuery.split(" ")
  for (const qt of qTokens) {
    if (!qt) continue
    if (!haystack.includes(qt)) return false
  }
  return true
}

/**
 * Search behavior:
 * 1) Exact/partial substring match (token AND) — preserves expected behavior.
 * 2) If no results, apply conservative tolerant correction (synonym/fuzzy) and re-run.
 */
export function searchProducts(products: Product[], rawQuery: string): ProductSearchResult {
  const normalized = normalizeQuery(rawQuery)

  // Empty query shows all products
  if (!normalized) {
    return { originalQuery: rawQuery, appliedQuery: "", results: products }
  }

  const baseResults = products.filter((p) => productMatchesQuery(p, normalized))
  if (baseResults.length > 0) {
    return { originalQuery: rawQuery, appliedQuery: normalized, results: baseResults }
  }

  const vocab = buildVocabulary(products)
  const tolerant = applyTolerantQuery(rawQuery, {
    vocabulary: vocab,
    synonyms: SYNONYMS,
    hasAnyExactOrPartialMatches: false,
  })

  // If tolerant did not change query, return no results
  if (tolerant.appliedQuery === normalized) {
    return { ...tolerant, results: [] }
  }

  const correctedResults = products.filter((p) => productMatchesQuery(p, tolerant.appliedQuery))
  // Safeguard: only apply correction if it actually improves results
  if (correctedResults.length === 0) {
    return { originalQuery: rawQuery, appliedQuery: normalized, results: [] }
  }

  return { ...tolerant, results: correctedResults }
}

