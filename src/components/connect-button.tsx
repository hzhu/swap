"use client";

import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectWallet, useWallets } from "@privy-io/react-auth";

export function ConnectButton() {
  const { wallets, ready } = useWallets();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectWallet } = useConnectWallet();
  const wallet = wallets[0];

  const handleConnect = () => {
    if (wallet) {
      disconnect();
    } else {
      connectWallet();
    }
  };

  return ready ? (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all flex items-center"
    >
      {isConnected && wallet && wallet.meta?.icon ? (
        <>
          <Image
            width={20}
            height={20}
            className="mr-2"
            alt={wallet.meta.name}
            src={wallet.meta.icon.trim()}
            style={{ height: "20px", width: "20px" }}
          />
          <span>Disconnect</span>
        </>
      ) : (
        "Connect"
      )}
    </button>
  ) : null;
}
