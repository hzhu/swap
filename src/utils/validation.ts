import { base, arbitrum } from "viem/chains";

export type SupportedChainId = typeof base.id | typeof arbitrum.id;

export function isChainIdSupported(
  chainId: number
): chainId is SupportedChainId {
  const supportedChainIds: number[] = [base.id, arbitrum.id];
  return supportedChainIds.includes(chainId);
}
