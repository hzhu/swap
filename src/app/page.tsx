"use client";

import Image from "next/image";
import { useReducer } from "react";
import { formatUnits } from "viem";
import { USDC, WETH } from "@/constants";
import { swapReducer } from "@/reducers";
import { useDebounce, useSwapPrice } from "@/hooks";
import { Header } from "@/components/header";

import { useConnectWallet } from "@privy-io/react-auth";

export default function Home() {
  const [state, dispatch] = useReducer(swapReducer, {
    inputAmount: "",
    shouldDebounce: true,
    isDefaultDirection: true,
  });

  const { connectWallet } = useConnectWallet();

  const { inputAmount, shouldDebounce, isDefaultDirection } = state;

  const debouncedInputAmount = useDebounce({
    value: inputAmount,
    enabled: shouldDebounce,
  });

  const sellAmount = shouldDebounce ? debouncedInputAmount : inputAmount;

  const { data, error, isFetching } = useSwapPrice({
    chainId: 1,
    sellAmount,
    slippageBps: 50,
    sellToken: isDefaultDirection ? USDC : WETH,
    buyToken: isDefaultDirection ? WETH : USDC,
  });

  const outputAmount = data?.buyAmount
    ? formatUnits(
        BigInt(data.buyAmount),
        isDefaultDirection ? WETH.decimals : USDC.decimals
      )
    : "";

  return (
    <>
      <Header />
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="sr-only">Swap Tokens</h1>
          <form>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="input-amount"
                className="font-semibold flex items-center"
              >
                <span className="text-2xl mr-2">Sell</span>
                <span className="flex items-center">
                  <Image
                    priority
                    width={25}
                    height={25}
                    alt={isDefaultDirection ? "usdc" : "weth"}
                    src={isDefaultDirection ? "/usdc.webp" : "/weth.webp"}
                    className="inline-block mr-1"
                  />
                  <span className="text-lg">
                    {isDefaultDirection ? USDC.symbol : WETH.symbol}
                  </span>
                </span>
              </label>
              <button
                type="button"
                disabled={isFetching}
                onClick={() => {
                  dispatch({ type: "TOGGLE_DIRECTION", payload: outputAmount });
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-300"
                aria-label="Switch trade directions"
              >
                Switch Trade Directions
              </button>
            </div>
            <input
              type="text"
              id="input-amount"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              inputMode="decimal"
              value={inputAmount}
              disabled={isFetching}
              placeholder="Enter amount"
              pattern="^[0-9]*[.,]?[0-9]*$"
              className="text-lg w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onChange={(e) => {
                if (e.target.validity.valid) {
                  dispatch({
                    type: "SET_INPUT_AMOUNT",
                    payload: e.target.value,
                  });
                }
              }}
            />
            <div
              className="h-6 mt-2 mb-6 text-sm text-gray-300"
              aria-live="polite"
            >
              {error ? (
                <p className="text-red-500">{error.message}</p>
              ) : isFetching ? (
                "Finding best price…"
              ) : null}
            </div>
            <label
              htmlFor="output-amount"
              className="font-semibold flex items-center"
            >
              <span className="text-2xl mr-2">Buy</span>
              <span className="flex items-center">
                <Image
                  priority
                  width={25}
                  height={25}
                  className="inline-block mr-1"
                  alt={isDefaultDirection ? "weth" : "usdc"}
                  src={isDefaultDirection ? "/weth.webp" : "/usdc.webp"}
                />
                <span className="text-lg">
                  {isDefaultDirection ? WETH.symbol : USDC.symbol}
                </span>
              </span>
            </label>
            <input
              disabled
              id="output-amount"
              value={outputAmount}
              className="mt-2 text-lg w-full p-3 rounded-md text-slate-800 cursor-not-allowed border border-gray-300  disabled:bg-gray-300 mb-4"
            />
          </form>
        </div>
      </section>
    </>
  );
}
