export interface CorrectionInfo {
  from: string
  to: string
  reason: "fuzzy" | "synonym"
}

export interface TolerantQueryResult {
  /** The query that should be used to search (may be the same as input). */
  appliedQuery: string
  /** The original raw query provided by the user. */
  originalQuery: string
  /** Populated only if we changed the query. */
  correction?: CorrectionInfo
}

/**
 * Normalizes user input for matching.
 * - Lowercases
 * - Collapses whitespace
 * - Removes most punctuation (keeps letters/numbers/spaces)
 */
export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function tokenize(q: string): string[] {
  const n = normalizeQuery(q)
  if (!n) return []
  return n.split(" ").filter(Boolean)
}

/**
 * Heuristic to avoid "correcting" intentional terms (codes, model names, etc.).
 * We treat these as code-like and skip correction attempts.
 */
export function isCodeLikeToken(token: string): boolean {
  if (!token) return false
  // digits only, long numeric strings
  if (/^\d{2,}$/.test(token)) return true
  // mixed alnum without vowels often indicates codes (e.g., xg12, prd01)
  if (/^[a-z0-9]+$/.test(token) && /\d/.test(token)) return true
  // very short tokens are too ambiguous
  if (token.length <= 2) return true
  // tokens with repeated weird patterns; keep conservative
  if (token.length >= 12) return true
  return false
}

/**
 * Levenshtein edit distance with an upper bound (early exit).
 * Returns a number <= maxDistance when within threshold, otherwise returns maxDistance + 1.
 */
export function levenshteinWithin(aRaw: string, bRaw: string, maxDistance: number): number {
  const a = aRaw
  const b = bRaw
  if (a === b) return 0
  const al = a.length
  const bl = b.length
  if (Math.abs(al - bl) > maxDistance) return maxDistance + 1
  if (al === 0) return bl <= maxDistance ? bl : maxDistance + 1
  if (bl === 0) return al <= maxDistance ? al : maxDistance + 1

  // Ensure b is the shorter for memory efficiency
  if (bl > al) {
    return levenshteinWithin(b, a, maxDistance)
  }

  const prev = new Array(bl + 1)
  const curr = new Array(bl + 1)

  for (let j = 0; j <= bl; j++) prev[j] = j

  for (let i = 1; i <= al; i++) {
    curr[0] = i

    // Track best value in row for early exit
    let rowMin = curr[0]
    const ai = a.charCodeAt(i - 1)

    for (let j = 1; j <= bl; j++) {
      const cost = ai === b.charCodeAt(j - 1) ? 0 : 1
      const del = prev[j] + 1
      const ins = curr[j - 1] + 1
      const sub = prev[j - 1] + cost
      const val = Math.min(del, ins, sub)
      curr[j] = val
      if (val < rowMin) rowMin = val
    }

    if (rowMin > maxDistance) return maxDistance + 1

    for (let j = 0; j <= bl; j++) prev[j] = curr[j]
  }

  const d = prev[bl]
  return d <= maxDistance ? d : maxDistance + 1
}

export interface TolerantOptions {
  /** Candidate terms users might intend (e.g., product names/keywords). Must already be normalized tokens. */
  vocabulary: string[]
  /** Synonym map from token -> canonical token */
  synonyms?: Record<string, string>
  /** Whether the original query produced any results (used to decide whether to apply correction). */
  hasAnyExactOrPartialMatches: boolean
}

function maxDistanceForToken(t: string): number {
  if (t.length <= 4) return 1
  if (t.length <= 7) return 2
  return 2
}

function pickBestCandidate(token: string, candidates: string[]): { best?: string; bestDist: number; secondDist: number } {
  let best: string | undefined
  let bestDist = Number.POSITIVE_INFINITY
  let secondDist = Number.POSITIVE_INFINITY

  const maxD = maxDistanceForToken(token)
  for (const c of candidates) {
    // Quick length guard
    if (Math.abs(c.length - token.length) > maxD) continue
    const d = levenshteinWithin(token, c, maxD)
    if (d > maxD) continue
    if (d < bestDist) {
      secondDist = bestDist
      bestDist = d
      best = c
    } else if (d < secondDist) {
      secondDist = d
    }
  }

  return { best, bestDist, secondDist }
}

/**
 * Attempts a single-token correction (synonym or fuzzy) in a conservative way.
 * Only applies when:
 * - the token is not code-like
 * - correction is high-confidence (unique best within small edit distance)
 * - caller indicates no exact/partial matches exist for the original query
 */
export function applyTolerantQuery(rawQuery: string, opts: TolerantOptions): TolerantQueryResult {
  const originalQuery = rawQuery
  const normalized = normalizeQuery(rawQuery)

  // Preserve behavior for empty/invalid input: do nothing.
  if (!normalized) {
    return { originalQuery, appliedQuery: "" }
  }

  // If original already matches something, do not override user intent.
  if (opts.hasAnyExactOrPartialMatches) {
    return { originalQuery, appliedQuery: normalized }
  }

  const tokens = normalized.split(" ")
  const synonyms = opts.synonyms ?? {}

  // First pass: synonym normalization if it changes anything
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (isCodeLikeToken(t)) continue
    const mapped = synonyms[t]
    if (mapped && mapped !== t) {
      const appliedTokens = [...tokens]
      appliedTokens[i] = mapped
      const appliedQuery = appliedTokens.join(" ")
      return {
        originalQuery,
        appliedQuery,
        correction: { from: normalized, to: appliedQuery, reason: "synonym" },
      }
    }
  }

  // Second pass: fuzzy correction (single token only)
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (isCodeLikeToken(t)) continue
    if (t.length < 3) continue

    const { best, bestDist, secondDist } = pickBestCandidate(t, opts.vocabulary)
    if (!best) continue

    // Confidence guard: ensure the best is meaningfully better than the runner-up
    if (secondDist - bestDist < 1) continue

    const appliedTokens = [...tokens]
    appliedTokens[i] = best
    const appliedQuery = appliedTokens.join(" ")
    if (appliedQuery !== normalized) {
      return {
        originalQuery,
        appliedQuery,
        correction: { from: normalized, to: appliedQuery, reason: "fuzzy" },
      }
    }
  }

  return { originalQuery, appliedQuery: normalized }
}

