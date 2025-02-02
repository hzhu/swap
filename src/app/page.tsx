import Link from "next/link";
import { SwapForm } from "@/components/swap-form";
import { ServerError } from "@/components/server-error";
import { ConnectButton } from "@/components/connect-button";

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
    <>
      <header className="fixed top-0 left-0 right-0 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            🪙
          </Link>
          <ConnectButton />
        </div>
      </header>
      <section className="min-h-screen flex items-center justify-center p-4">
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
    </>
  );
}
