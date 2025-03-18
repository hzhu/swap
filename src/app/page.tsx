import Link from "next/link";
import { SwapForm, ServerError, ConnectButton } from "@/components";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { sellToken, buyToken, sellAmount, chainId } = await searchParams;

  if (
    Array.isArray(sellToken) ||
    Array.isArray(buyToken) ||
    Array.isArray(sellAmount) ||
    Array.isArray(chainId)
  ) {
    return <ServerError message="Invalid query parameters." />;
  }

  return (
    <main className="flex flex-col min-h-screen">
      <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            🪙
          </Link>
          <ConnectButton />
        </div>
      </header>
      <section className="px-4 mt-8 md:mt-0 md:grow md:flex md:items-center md:justify-center">
        <div className="w-full max-w-md">
          <h1 className="sr-only">Swap Tokens</h1>
          <SwapForm
            chainId={chainId}
            buyToken={buyToken}
            sellToken={sellToken}
            sellAmount={sellAmount}
          />
        </div>
      </section>
    </main>
  );
}
