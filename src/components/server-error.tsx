import Link from "next/link";

export function ServerError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold mb-4 text-center">
          Something went wrong
        </h2>
        <div className="mb-4 p-3 border border-red-500 text-red-500 rounded">
          <span className="font-semibold">Error: </span>
          <span>{message}</span>
        </div>
        <div className="flex flex-col space-y-2">
          <Link href="/">
            <button className="w-full py-2 bg-slate-200 text-black rounded hover:bg-slate-300 transition-all">
              🏠 Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
