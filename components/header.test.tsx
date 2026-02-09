// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { Header } from "@/components/header"

const pushMock = vi.fn()

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ push: pushMock }),
  }
})

vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...rest }: any) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  }
})

describe("Header search", () => {
  it("routes to /products with normalized q on submit", async () => {
    const user = userEvent.setup()
    pushMock.mockClear()

    render(<Header />)

    const input = screen.getByRole("searchbox", { name: /search products/i })
    await user.type(input, "  BluBerry!! ")
    await user.keyboard("{Enter}")

    // Header should only normalize formatting (case/punctuation/whitespace).
    // Tolerant correction happens on the products page when there are no base matches.
    expect(pushMock).toHaveBeenCalledWith("/products?q=bluberry")
  })

  it("routes to /products for empty/invalid input", async () => {
    const user = userEvent.setup()
    pushMock.mockClear()

    render(<Header />)

    const input = screen.getByRole("searchbox", { name: /search products/i })
    await user.type(input, "   ")
    await user.keyboard("{Enter}")

    expect(pushMock).toHaveBeenCalledWith("/products")
  })
})

