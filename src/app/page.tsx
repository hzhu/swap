"use client";

import Image from "next/image";
import { useReducer, useState } from "react";
import { formatUnits } from "viem";
import { USDC, WETH } from "@/constants";
import { swapReducer } from "@/reducers";
import { useDebounce, useSwapPrice } from "@/hooks";

export default function Home() {
  const [state, dispatch] = useReducer(swapReducer, {
    inputAmount: "",
    shouldDebounce: true,
    isDefaultDirection: true,
  });

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

  const [selectedValue, setSelectedValue] = useState("usdc");

  const options = [
    { label: "USDC", value: "usdc" },
    { label: "WETH", value: "weth" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form className="w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="input-amount"
            className="font-semibold flex items-center"
          >
            <span className="text-2xl mr-2">Sell</span>
            <Image
              priority
              width={25}
              height={25}
              alt={isDefaultDirection ? "usdc" : "weth"}
              src={isDefaultDirection ? "/usdc.webp" : "/weth.webp"}
              className="inline-block mr-1"
            />
          </label>
          <div>
            <label
              htmlFor="input-token"
              className="block mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              select a sell token
            </label>
            <select
              id="input-token"
              value={selectedValue}
              onChange={(e) => {
                console.log(e.target.value);
              }}
              className=""
            >
              <option value="" disabled>
                Choose an option
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => {
              dispatch({ type: "TOGGLE_DIRECTION", payload: outputAmount });
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-300"
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
              dispatch({ type: "SET_INPUT_AMOUNT", payload: e.target.value });
            }
          }}
        />
        <div className="h-6 mt-2 mb-6 text-sm text-gray-300">
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
          className="mt-2 text-lg w-full p-3 rounded-md text-slate-800 cursor-not-allowed border border-gray-300  disabled:bg-gray-300"
        />
      </form>
    </div>
  );
}
