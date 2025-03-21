"use client";

import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectWallet, useWallets } from "@privy-io/react-auth";
import { Button } from "./ui/button";

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
      <Button
        variant="outline"
        onClick={() => {
          alert("Disconnect from Phantom wallet in Phantom extension");
        }}
        className="px-4 py-2"
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
      </Button>
    );
  }

  return ready ? (
    <Button variant="outline" onClick={handleConnect} className="px-4 py-2">
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
    </Button>
  ) : null;
}
