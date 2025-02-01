import Link from "next/link";
import { SwapForm } from "@/components/swap-form";
import { ConnectButton } from "@/components/connect-button";

export default function Home() {
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
          <SwapForm />
        </div>
      </section>
    </>
  );
}
