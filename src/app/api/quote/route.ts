import { NextResponse } from "next/server";

const ZERO_EX_API_KEY = process.env.ZERO_EX_API_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);

  const slippageBps = url.searchParams.get("slippageBps");
  const sellAmount = url.searchParams.get("sellAmount");
  const sellToken = url.searchParams.get("sellToken");
  const buyToken = url.searchParams.get("buyToken");
  const chainId = url.searchParams.get("chainId");
  const taker = url.searchParams.get("taker");

  if (!ZERO_EX_API_KEY) {
    throw new Error("ZERO_EX_API_KEY is not set");
  }

  if (!chainId || !sellToken || !buyToken || !sellAmount || !taker) {
    return NextResponse.json(
      { message: "Missing required query parameters" },
      { status: 400 }
    );
  }

  try {
    const zeroExUrl = new URL("https://api.0x.org/swap/allowance-holder/quote");

    zeroExUrl.searchParams.set("chainId", chainId);
    zeroExUrl.searchParams.set("sellToken", sellToken);
    zeroExUrl.searchParams.set("buyToken", buyToken);
    zeroExUrl.searchParams.set("sellAmount", sellAmount);
    zeroExUrl.searchParams.set("taker", taker);

    if (slippageBps) {
      zeroExUrl.searchParams.set("slippageBps", slippageBps);
    }

    const response = await fetch(zeroExUrl.toString(), {
      headers: {
        "0x-api-key": ZERO_EX_API_KEY,
        "0x-version": "v2",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    console.error("Error fetching from 0x API:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
