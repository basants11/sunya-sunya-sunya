// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { ProductsClient } from "@/app/products/products-client"

function mockSearchParams(q: string) {
  vi.mocked(useSearchParams).mockReturnValue({
    get: (key: string) => (key === "q" ? q : null),
  } as any)
}

// Mock next/navigation search params hook
import { useSearchParams } from "next/navigation"
vi.mock("next/navigation", async () => {
  const actual: any = await vi.importActual("next/navigation")
  return {
    ...actual,
    useSearchParams: vi.fn(),
  }
})

// Next/link is used by layout/header etc, but not required here; keep safe.
vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...rest }: any) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  }
})

describe("ProductsClient search integration", () => {
  it("shows corrected query when typo yields results", () => {
    mockSearchParams("bluberry")
    render(<ProductsClient />)

    // Correction banner should show applied query
    expect(screen.getByText(/showing results for/i)).toBeInTheDocument()
    expect(screen.getByText(/“blueberry”/i)).toBeInTheDocument()
    // Should render the blueberry product
    expect(screen.getByText(/dried blueberry/i)).toBeInTheDocument()
  })

  it("keeps exact/partial behavior when base match exists", () => {
    mockSearchParams("blue")
    render(<ProductsClient />)
    // Should not show corrected query (no correction object)
    expect(screen.getByText(/“blue”/i)).toBeInTheDocument()
    expect(screen.getByText(/dried blueberry/i)).toBeInTheDocument()
  })
})

