"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleGoHome = () => {
    // Force a full page reload when navigating home
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Something went wrong
        </h2>
        <div className="mb-4 p-3 border border-red-500 text-red-500 rounded">
          <span className="font-semibold">Error</span>: {error.message}
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleGoHome}
          >
            🏠 Go Home
          </button>
          <button
            className="w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
