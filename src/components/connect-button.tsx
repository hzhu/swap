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
    if (isConnected) {
      disconnect();
    } else {
      connectWallet();
    }
  };

  const isPhantomConnected = wallet && wallet.meta.name === "Phantom";

  // Special case for Phantom wallet: Wagmi cannot programmatically disconnect it.
  if (isPhantomConnected && wallet.meta.icon) {
    return (
      <button
        onClick={() => {
          alert("Disconnect from Phantom wallet in Phantom extension");
        }}
        className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-300 transition-all flex items-center"
      >
        <Image
          width={20}
          height={20}
          className="mr-2"
          alt={wallet.meta.name}
          src={wallet.meta.icon.trim()}
          style={{ height: "20px", width: "20px" }}
        />
        Disconnect
      </button>
    );
  }

  return ready ? (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-300 transition-all flex items-center"
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
