import { describe, expect, it } from "vitest"
import {
  applyTolerantQuery,
  isCodeLikeToken,
  levenshteinWithin,
  normalizeQuery,
  tokenize,
} from "@/lib/search/tolerant"

describe("search.tolerant", () => {
  it("normalizeQuery lowercases and strips punctuation", () => {
    expect(normalizeQuery("  Dried  Kiwi! ")).toBe("dried kiwi")
    expect(normalizeQuery("Kiwi’s")).toBe("kiwis")
  })

  it("tokenize splits normalized tokens", () => {
    expect(tokenize("Dried  Kiwi!  ")).toEqual(["dried", "kiwi"])
  })

  it("levenshteinWithin respects maxDistance", () => {
    expect(levenshteinWithin("kiwi", "kiwi", 1)).toBe(0)
    expect(levenshteinWithin("kiwi", "kwi", 1)).toBe(1)
    expect(levenshteinWithin("kiwi", "banana", 2)).toBe(3)
  })

  it("isCodeLikeToken guards codes/numbers", () => {
    expect(isCodeLikeToken("xg12")).toBe(true)
    expect(isCodeLikeToken("12")).toBe(true)
    expect(isCodeLikeToken("kiwi")).toBe(false)
    expect(isCodeLikeToken("ab")).toBe(true)
  })

  it("does not change empty/invalid input", () => {
    const r = applyTolerantQuery("   ", {
      vocabulary: ["kiwi"],
      hasAnyExactOrPartialMatches: false,
    })
    expect(r.appliedQuery).toBe("")
    expect(r.correction).toBeUndefined()
  })

  it("does not override when original already has matches", () => {
    const r = applyTolerantQuery("kiwi", {
      vocabulary: ["kiwi"],
      hasAnyExactOrPartialMatches: true,
    })
    expect(r.appliedQuery).toBe("kiwi")
    expect(r.correction).toBeUndefined()
  })

  it("applies synonym correction when no matches", () => {
    const r = applyTolerantQuery("blueberries", {
      vocabulary: ["blueberry"],
      synonyms: { blueberries: "blueberry" },
      hasAnyExactOrPartialMatches: false,
    })
    expect(r.appliedQuery).toBe("blueberry")
    expect(r.correction?.reason).toBe("synonym")
  })

  it("applies fuzzy correction for minor typos", () => {
    const r = applyTolerantQuery("pinapple", {
      vocabulary: ["pineapple", "papaya"],
      hasAnyExactOrPartialMatches: false,
    })
    expect(r.appliedQuery).toBe("pineapple")
    expect(r.correction?.reason).toBe("fuzzy")
  })

  it("does not correct code-like tokens", () => {
    const r = applyTolerantQuery("xg12", {
      vocabulary: ["kiwi", "pineapple"],
      hasAnyExactOrPartialMatches: false,
    })
    expect(r.appliedQuery).toBe("xg12")
    expect(r.correction).toBeUndefined()
  })
})

