import { parseUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import { fetchPrice } from "@/utils/fetch-price";
import { ZeroExPriceResponse } from "@/types/zero-ex-api";

interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
}

interface UseSwapPriceArgs {
  taker?: string;
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
}: UseSwapPriceArgs) {
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
      return await fetchPrice({
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
