"use client";

import Image from "next/image";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { useConnectWallet, useWallets } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { ampli } from "@/ampli";

export function ConnectButton() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { wallets, ready } = useWallets();
  const wallet = wallets[0];
  const connected = isConnected || Boolean(wallet);

  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      const props = {
        "Chain ID": chainId,
        "Wallet Name": wallet.meta.name,
      };
      ampli.identify(wallet.address, props);
      ampli.walletConnected(props);
    },
  });

  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => {
        ampli.client.reset();
      },
    },
  });

  const handleConnect = () => {
    if (connected) {
      disconnect();
    } else {
      connectWallet();
    }
  };

  // Special case for Phantom wallet: Wagmi cannot programmatically disconnect it.
  // Use shim to handle
  const isPhantomConnected = wallet && wallet.meta.name === "Phantom";
  if (isPhantomConnected && wallet.meta.icon) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          alert("Disconnect from Phantom wallet in Phantom extension.");
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
      {connected && wallet.meta?.icon ? (
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
