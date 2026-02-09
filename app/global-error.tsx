"use client";

/**
 * Global error boundary for Next.js App Router
 * This file must be at app/global-error.tsx
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Simple HTML error page without React hooks
export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - Sunya</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f9fafb; }
            .content { text-align: center; padding: 2rem; }
            h1 { font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 1rem; }
            p { color: #6b7280; margin-bottom: 1.5rem; }
            button { padding: 0.75rem 1.5rem; background: #FF6900; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; }
            button:hover { background: #e55e00; }
          `,
          }}
        />
      </head>
      <body>
        <div className="container">
          <div className="content">
            <h1>Something went wrong</h1>
            <p>We encountered an unexpected error. Please try again.</p>
            <button onClick={reset}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
