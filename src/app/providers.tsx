"use client";

import { base, arbitrum } from "wagmi/chains";
import { PrivyProvider } from "@privy-io/react-auth";
import { http, createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  metaMask,
  injected,
  walletConnect,
  coinbaseWallet,
} from "wagmi/connectors";
import { useEffect } from "react";
import { initAnalytics } from "@/lib/amplitude";

const queryClient = new QueryClient();

const projectId = "ecf05e6e910a7006159c69f03dafbaeb"; // free project id

export const config = createConfig({
  chains: [arbitrum, base],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet(),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(
      "https://ethereum-rpc.vercel.app/api/base" // demo key
    ),
    [arbitrum.id]: http(
      "https://ethereum-rpc.vercel.app/api/arbitrum" // demo key
    ),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId="cm1k78nl101dtqj2bcs76kzab"
          config={{
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              walletChainType: "ethereum-only",
              logo: "https://cdn.prod.website-files.com/66967cfef0a246cbbb9aee94/66967cfef0a246cbbb9aeeee_logo.svg",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
