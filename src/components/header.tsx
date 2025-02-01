"use client";

import Link from "next/link";
import { useConnectWallet } from "@privy-io/react-auth";

export function Header() {
  const { connectWallet } = useConnectWallet();

  const handleConnect = () => {
    connectWallet();
  };

  return (
    <header className="fixed top-0 left-0 right-0 p-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          🪙
        </Link>
        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Connect
        </button>
      </div>
    </header>
  );
}
