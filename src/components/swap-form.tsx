"use client";

import Image from "next/image";
import { useReducer } from "react";
import { formatUnits } from "viem";
import { base } from "viem/chains";
import { swapReducer } from "@/reducers";
import { useSearchParams } from "next/navigation";
import { DirectionButton } from "./direction-button";
import { isChainIdSupported } from "@/utils/validation";
import { useDebounce, useSwapPrice, useSyncSwapParams } from "@/hooks";
import {
  SUPPORTED_CHAINS,
  CHAIN_NAMES_BY_ID,
  INITIAL_BUY_TOKEN,
  INITIAL_SELL_TOKEN,
  TOKENS_BY_CHAIN_ID,
  TOKEN_MAPS_BY_CHAIN_ID,
} from "@/constants";
import type { SwapFormProps } from "@/types";

export function SwapForm({
  chainId,
  buyToken,
  sellToken,
  sellAmount,
}: SwapFormProps) {
  if (chainId && !isChainIdSupported(Number(chainId))) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const initialState = {
    sellToken:
      chainId && sellToken
        ? TOKEN_MAPS_BY_CHAIN_ID[chainId][sellToken]
        : INITIAL_SELL_TOKEN,
    buyToken:
      chainId && buyToken
        ? TOKEN_MAPS_BY_CHAIN_ID[chainId][buyToken]
        : INITIAL_BUY_TOKEN,
    inputAmount: sellAmount ? sellAmount : "",
    chainId: chainId ? Number(chainId) : base.id,
    shouldDebounce: true,
  };

  const [state, dispatch] = useReducer(swapReducer, initialState);

  const searchParams = useSearchParams();

  useSyncSwapParams({ state, searchParams });

  const debouncedInputAmount = useDebounce({
    value: state.inputAmount,
    enabled: state.shouldDebounce,
  });

  const { data, error, isFetching } = useSwapPrice({
    sellAmount: state.shouldDebounce ? debouncedInputAmount : state.inputAmount,
    sellToken: state.sellToken,
    buyToken: state.buyToken,
    chainId: state.chainId,
    slippageBps: 50,
  });

  const outputAmount = data?.buyAmount
    ? formatUnits(BigInt(data.buyAmount), state.buyToken.decimals)
    : "";

  const tokenMapsByChainId = TOKEN_MAPS_BY_CHAIN_ID[state.chainId];

  return (
    <form>
      <div className="flex mb-2 justify-end">
        <div className="flex">
          <Image
            width={28}
            height={28}
            src={`${CHAIN_NAMES_BY_ID[state.chainId].toLowerCase()}.svg`}
            alt={`${CHAIN_NAMES_BY_ID[state.chainId].toLowerCase()} logo`}
          />
          <label htmlFor="chain-selector" className="sr-only">
            select a chain
          </label>
          <select
            id="chain-selector"
            value={state.chainId}
            className="py-1 px-2 ml-2 rounded-md"
            onChange={(e) => {
              dispatch({
                type: "select chain",
                payload: Number(e.target.value),
              });
            }}
          >
            {SUPPORTED_CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <label
          htmlFor="input-amount"
          className="font-semibold flex items-center"
        >
          <span className="text-2xl mr-2">Sell</span>
          <Image
            priority
            width={25}
            height={25}
            src={state.sellToken.logo}
            className="inline-block mr-2"
            alt={`${state.sellToken.symbol} logo`}
          />
        </label>
        <div>
          <label
            htmlFor="sell-token"
            className="block mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            select a sell token
          </label>
          <select
            id="sell-token"
            value={state.sellToken.address}
            className="py-1 px-2 rounded-md"
            onChange={(e) => {
              dispatch({
                type: "select sell token",
                payload: tokenMapsByChainId[e.target.value],
              });
            }}
          >
            {TOKENS_BY_CHAIN_ID[state.chainId].map((option) => (
              <option key={option.address} value={option.address}>
                {option.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        type="text"
        id="input-amount"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        inputMode="decimal"
        value={state.inputAmount}
        placeholder="Enter amount"
        pattern="^[0-9]*[.,]?[0-9]*$"
        className="text-lg w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onChange={(e) => {
          if (e.target.validity.valid) {
            dispatch({
              type: "type sell amount",
              payload: e.target.value,
            });
          }
        }}
      />
      <div aria-live="polite" className="h-6 mt-2 text-sm text-gray-300">
        {error ? (
          <p className="text-red-500">{error.message}</p>
        ) : isFetching ? (
          "Finding best price…"
        ) : null}
      </div>
      <div className="flex justify-center">
        <DirectionButton
          type="button"
          className="mb-8"
          onClick={() => {
            dispatch({ type: "toggle direction", payload: outputAmount });
          }}
        />
      </div>
      <div className="flex items-center">
        <label
          htmlFor="sell-amount"
          className="font-semibold flex items-center"
        >
          <span className="text-2xl mr-2">Buy</span>
          <Image
            priority
            width={25}
            height={25}
            src={state.buyToken.logo}
            className="inline-block mr-2"
            alt={`${state.buyToken.symbol} logo`}
          />
        </label>
        <div>
          <label
            htmlFor="buy-token"
            className="block mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            select a buy token
          </label>
          <select
            id="buy-token"
            value={state.buyToken.address}
            className="py-1 px-2 rounded-md"
            onChange={(e) => {
              dispatch({
                type: "select buy token",
                payload: tokenMapsByChainId[e.target.value],
              });
            }}
          >
            {TOKENS_BY_CHAIN_ID[state.chainId].map((option) => (
              <option key={option.address} value={option.address}>
                {option.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        disabled
        id="sell-amount"
        value={outputAmount}
        className="mt-2 mb-6 text-lg w-full p-3 rounded-xl cursor-not-allowed border-none disabled:bg-gray-700 disabled:cursor-not-allowed"
      />
      <button
        disabled
        type="button"
        onClick={() => {
          dispatch({ type: "toggle direction", payload: outputAmount });
        }}
        className="px-3 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-300 w-full select-none"
      >
        Swap (Coming Soon)
      </button>
    </form>
  );
}
