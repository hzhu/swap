"use client";

import { useConnectWallet } from "@privy-io/react-auth";

export function ConnectButton() {
  const { connectWallet } = useConnectWallet();
  const handleConnect = () => {
    connectWallet();
  };

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      Connect
    </button>
  );
}
