import { describe, expect, it } from "vitest"
import { searchProducts } from "@/lib/search/products-search"

const products = [
  {
    id: 1,
    name: "Dried Kiwi",
    nrsPrice: 2499,
    description: "Tart kiwi slices",
    features: ["Export-grade"],
    image: "/kiwi.jpg",
    badge: "Limited",
  },
  {
    id: 2,
    name: "Dried Blueberry",
    nrsPrice: 2899,
    description: "Antioxidant rich",
    features: ["Vitamin C"],
    image: "/blueberry.jpg",
    badge: "Premium",
  },
] as any

describe("search.products-search", () => {
  it("empty query returns all products", () => {
    const r = searchProducts(products, "")
    expect(r.results).toHaveLength(2)
    expect(r.appliedQuery).toBe("")
  })

  it("exact/partial match works", () => {
    const r = searchProducts(products, "blue")
    expect(r.results.map((p) => p.id)).toEqual([2])
    expect(r.correction).toBeUndefined()
  })

  it("typo gets corrected when no base results", () => {
    const r = searchProducts(products, "bluberry")
    expect(r.results.map((p) => p.id)).toEqual([2])
    expect(r.correction?.to).toContain("blueberry")
  })

  it("does not apply correction if it still yields no results", () => {
    const r = searchProducts(products, "zzzzzz")
    expect(r.results).toHaveLength(0)
  })
})

