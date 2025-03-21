import { type Address, parseUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import { fetchSwap } from "@/utils/fetch-price";
import type { Token } from "@/types/tokens";
import type { ZeroExPriceResponse } from "@/types/zeroex-api";

export interface UseSwapParams {
  taker?: Address;
  chainId: number;
  buyToken: Token;
  sellToken: Token;
  sellAmount: string;
  slippageBps?: number;
}

export function useSwapPrice({
  taker,
  chainId,
  buyToken,
  sellToken,
  sellAmount,
  slippageBps,
}: UseSwapParams) {
  return useQuery<ZeroExPriceResponse>({
    enabled: Boolean(sellAmount),
    queryKey: [
      taker,
      chainId,
      sellAmount,
      slippageBps,
      buyToken.address,
      sellToken.address,
    ],
    queryFn: async () => {
      return await fetchSwap({
        endpoint: "/api/price",
        taker,
        chainId,
        slippageBps,
        buyToken: buyToken.address,
        sellToken: sellToken.address,
        sellAmount: parseUnits(sellAmount, sellToken.decimals).toString(),
      });
    },
  });
}
