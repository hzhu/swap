"use client";

import { useEffect } from "react";

/**
 * A React error boundary component that displays an error message and provides recovery options in client components.
 * React server components will always return an obfuscated error message in production to prevent leaking sensitive
 * information. For a more user-friendly server error message, you can use `server-error.tsx`.
 *
 * @param {Object} props - The component props.
 * @param {Error & { digest?: string }} props.error - The error object, which may include an optional digest identifier.
 * @param {() => void} props.reset - A function to reset the error state.
 *
 * @returns {JSX.Element} A UI component that displays the error message and provides buttons to go home or retry.
 *
 * See: https://nextjs.org/docs/pages/building-your-application/configuring/error-handling#handling-client-errors
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold mb-4 text-center">
          Something went wrong
        </h2>
        <div className="mb-4 p-3 border border-red-500 text-red-500 rounded">
          <span className="font-semibold">Error: </span>
          {process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : error.message}
          {error.digest && (
            <p className="mt-2 text-sm">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="flex">
          <button
            onClick={handleGoHome}
            className="w-full py-2 bg-slate-800 rounded hover:bg-slate-700 transition-all mr-4"
          >
            🏠 Go Home
          </button>
          <button
            onClick={reset}
            className="w-full py-2 bg-slate-900 rounded hover:bg-slate-800 transition-all"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
