export async function fetchPrice({
  taker,
  chainId,
  buyToken,
  sellToken,
  sellAmount,
  slippageBps,
}: {
  chainId: number;
  taker?: string;
  buyToken: string;
  sellToken: string;
  sellAmount: string;
  slippageBps?: number;
}) {
  const url = new URL("/api/price", window.location.origin);

  url.searchParams.set("chainId", chainId.toString());
  url.searchParams.set("sellToken", sellToken);
  url.searchParams.set("buyToken", buyToken);
  url.searchParams.set("sellAmount", sellAmount);

  if (typeof slippageBps !== "undefined") {
    url.searchParams.set("slippageBps", String(slippageBps));
  }

  if (taker) {
    url.searchParams.set("taker", taker);
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
