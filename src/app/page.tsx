import Link from "next/link";
import { SwapForm, ServerError, ConnectButton } from "@/components";
import { ModeToggle } from "@/components/mode-toggle";

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
    <div className="flex flex-col min-h-screen">
      <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            🪙
          </Link>
          <div className="flex">
            <ModeToggle />
            &nbsp;&nbsp;
            <ConnectButton />
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center relative bottom-12">
        <h1 className="sr-only">Swap Tokens</h1>
        <SwapForm
          chainId={chainId}
          buyToken={buyToken}
          sellToken={sellToken}
          sellAmount={sellAmount}
        />
      </main>
    </div>
  );
}
