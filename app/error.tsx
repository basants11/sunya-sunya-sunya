"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    console.error("Global error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#FF6900",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
