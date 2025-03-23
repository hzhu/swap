"use client";

import Image from "next/image";
import { base } from "viem/chains";
import { parseSwap } from "@0x/0x-parser";
import { formatUnits, parseUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useWallets } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { useReducer, useState, useEffect, useRef } from "react";
import { Loader2, BadgeCheck, OctagonXIcon } from "lucide-react";
import {
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { swapReducer } from "@/reducers";
import { Button } from "@/components/ui/button";
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
import { fetchSwap } from "@/utils/fetch-price";
import { DirectionButton } from "@/components/direction-button";
import { ampli } from "@/ampli";

// Helper function to format numbers with appropriate precision
function formatCryptoAmount(amount: string): string {
  if (!amount || amount === "0") return "0";

  const num = Number.parseFloat(amount);

  // For very small numbers (less than 0.001), use scientific notation
  if (num < 0.001 && num > 0) {
    return num.toExponential(4);
  }

  // For numbers with many decimal places, limit to 6 decimal places
  const parts = amount.split(".");
  if (parts.length === 2 && parts[1].length > 6) {
    return `${parts[0]}.${parts[1].substring(0, 6)}`;
  }

  return amount;
}

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
  const { wallets } = useWallets();
  const [wallet] = wallets;
  const address = wallet?.address;
  const searchParams = useSearchParams();
  const [formattedOutput, setFormattedOutput] = useState("0");

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

  const [shouldFetchQuote, setShouldFetchQuote] = useState(false);

  const {
    data: quote,
    error: quoteError,
    isFetching: quoteIsFetching,
  } = useQuote({
    taker: address,
    sellAmount: state.shouldDebounce ? debouncedInputAmount : state.inputAmount,
    sellToken: state.sellToken,
    buyToken: state.buyToken,
    chainId: state.chainId,
    slippageBps: 50,
    enabled: shouldFetchQuote,
  });

  const publicClient = usePublicClient({
    chainId: state.chainId,
  });

  const { data: hash, sendTransaction } = useSendTransaction();

  const {
    data: receipt,
    error: receiptError,
    isLoading: isLoadingTxReceipt,
  } = useWaitForTransactionReceipt({ hash });

  const trackedHashRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    async function parseAndTrackSwap() {
      if (hash && hash === trackedHashRef.current) {
        console.log("Already tracked:", hash);
        return;
      }

      if (receiptError && hash) {
        ampli.tradeCompleted({
          "Slippage Bps": 50,
          "Chain ID": state.chainId,
          "Transaction Hash": hash.toString(),
          "Sell Token": state.sellToken.symbol,
          "Buy Token": state.buyToken.symbol,
          "Sell Amount": Number(state.inputAmount),
          "Buy Amount": Number(state.inputAmount),
          "Sell Amount USD": Number(state.inputAmount) * 12,
          Reverted: true,
        });
        trackedHashRef.current = hash;
        return;
      }

      if (!receipt || !publicClient) {
        console.log("No receipt or publicClient available, aborting.");
        return;
      }

      try {
        const swapDetails = await parseSwap({
          publicClient,
          transactionHash: receipt.transactionHash,
        });

        if (swapDetails && receipt.status === "success") {
          ampli.tradeCompleted({
            "Slippage Bps": 50,
            "Chain ID": receipt.chainId,
            "Transaction Hash": receipt.transactionHash,
            "Sell Token": swapDetails.tokenIn.symbol,
            "Buy Token": swapDetails.tokenOut.symbol,
            "Sell Amount": Number(swapDetails.tokenIn.amount),
            "Buy Amount": Number(swapDetails.tokenOut.amount),
            "Sell Amount USD": Number(swapDetails.tokenIn.amount) * 12,
            Reverted: false,
          });
          trackedHashRef.current = receipt.transactionHash;

          setShouldFetchQuote(false);
          dispatch({ type: "reset swap" });
        }
      } catch (error) {
        console.error(error);
      }
    }

    parseAndTrackSwap();
  }, [hash, receipt, receiptError, publicClient]);

  const outputAmount = data?.buyAmount
    ? formatUnits(BigInt(data.buyAmount), state.buyToken.decimals)
    : "";

  // Format the output amount for display
  useEffect(() => {
    if (outputAmount) {
      setFormattedOutput(formatCryptoAmount(outputAmount));
    } else {
      setFormattedOutput("0");
    }
  }, [outputAmount]);

  const tokenMapsByChainId = TOKEN_MAPS_BY_CHAIN_ID[state.chainId];

  // Calculate USD values
  const sellUsdValue = state.inputAmount
    ? `$${(Number(state.inputAmount) * 1950).toFixed(2)}`
    : "$0.00";
  const buyUsdValue = outputAmount
    ? `$${(Number(outputAmount) * 0.003).toFixed(2)}`
    : "$0.00";

  // Tooltip ref for showing full amount on hover
  const outputRef = useRef<HTMLDivElement>(null);

  // Mock balance for demonstration
  const balance = "0.017789...";

  const txStatusBorder = isLoadingTxReceipt
    ? "border-gray-500"
    : receipt?.status === "success"
    ? "border-green-500"
    : "border-red-500";

  return (
    <div className="w-full max-w-md mx-auto dark:dark bg-card text-card-foreground rounded-3xl overflow-hidden  relative bottom-12">
      <div className="flex items-center justify-between p-4">
        <Select
          value={state.chainId.toString()}
          onValueChange={(value) => {
            dispatch({
              type: "select chain",
              payload: Number(value),
            });
            ampli.chainSelected({ "Chain ID": Number(value) });
          }}
        >
          <SelectTrigger className="h-12 bg-gray-100 dark:bg-[#1e1e1e] border-0 rounded-full min-w-[140px]">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image
                  fill
                  src={`${CHAIN_NAMES_BY_ID[state.chainId].toLowerCase()}.svg`}
                  alt={`${CHAIN_NAMES_BY_ID[state.chainId].toLowerCase()} logo`}
                  className="rounded-full object-contain"
                />
              </div>
              <span className="font-medium">
                {CHAIN_NAMES_BY_ID[state.chainId]}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="dark:bg-[#252525] dark:border-[#444]">
            <SelectGroup>
              <SelectLabel className="dark:text-[#888]">Networks</SelectLabel>
              {SUPPORTED_CHAINS.map((chain) => (
                <SelectItem
                  key={chain.id}
                  value={chain.id.toString()}
                  className="dark:focus:bg-[#333] dark:focus:text-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5">
                      <Image
                        fill
                        src={`${CHAIN_NAMES_BY_ID[chain.id].toLowerCase()}.svg`}
                        alt={`${chain.name.toLowerCase()} logo`}
                        className="rounded-full object-contain"
                      />
                    </div>
                    {CHAIN_NAMES_BY_ID[chain.id]}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex gap-3">
          <button className="p-3 bg-gray-50 dark:bg-[#1e1e1e] rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"></path>
            </svg>
          </button>
          <button className="p-3 bg-gray-50 dark:bg-[#1e1e1e] rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-grow">
        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-medium">Sell</div>
            <div className="dark:text-[#888]">Balance: {balance}</div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-4 gap-2">
            <Select
              value={state.sellToken.address}
              onValueChange={(value) => {
                const sellToken = tokenMapsByChainId[value];

                dispatch({
                  type: "select sell token",
                  payload: sellToken,
                });

                ampli.sellTokenSelected({
                  Name: sellToken.name,
                  Symbol: sellToken.symbol,
                  Address: sellToken.address,
                });
              }}
            >
              <SelectTrigger className="h-12 min-w-[128px] bg-gray-200 dark:bg-[#252525] border-0 rounded-full -ml-1">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image
                      fill
                      src={state.sellToken.logo || "/placeholder.svg"}
                      alt={`${state.sellToken.symbol} logo`}
                      className="rounded-full object-contain"
                    />
                  </div>
                  <span className="font-medium">{state.sellToken.symbol}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="dark:bg-[#252525] dark:border-[#444]">
                <SelectGroup>
                  <SelectLabel className="dark:text-[#888]">Tokens</SelectLabel>
                  {TOKENS_BY_CHAIN_ID[state.chainId].map((option) => (
                    <SelectItem
                      key={option.address}
                      value={option.address}
                      className="dark:focus:bg-[#333] dark:focus:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5">
                          <Image
                            fill
                            src={option.logo || "/placeholder.svg"}
                            alt={`${option.symbol} logo`}
                            className="rounded-full object-contain"
                          />
                        </div>
                        {option.symbol}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex gap-2 flex-wrap sm:flex-nowrap justify-end">
              <button
                className="px-3 py-1 bg-gray-100 dark:bg-[#252525] rounded-full text-sm dark:text-[#888] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                onClick={() => {
                  dispatch({
                    type: "type sell amount",
                    payload: "",
                  });
                }}
              >
                Clear
              </button>
              <button
                className="px-3 py-1 bg-gray-100 dark:bg-[#252525] rounded-full text-sm dark:text-[#888] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                onClick={() => {
                  dispatch({
                    type: "type sell amount",
                    payload: (Number(maxAmount) * 0.5).toString(),
                  });
                }}
              >
                50%
              </button>
              <button
                className="px-3 py-1 bg-gray-100 dark:bg-[#252525] rounded-full text-sm dark:text-[#888] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                onClick={() => {
                  dispatch({
                    type: "type sell amount",
                    payload: maxAmount,
                  });
                }}
              >
                Max
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0"
              spellCheck="false"
              value={state.inputAmount}
              onChange={(e) => {
                if (e.target.validity.valid) {
                  dispatch({
                    type: "type sell amount",
                    payload: e.target.value,
                  });
                }
              }}
              className="text-4xl font-medium bg-transparent border-0 outline-none w-1/2 focus:outline-none"
              style={{ caretColor: "white" }}
            />
            <div className="text-xl text-[#888]">{sellUsdValue}</div>
          </div>
        </div>
        {/* Direction Button */}
        <div className="flex justify-center">
          <DirectionButton
            type="button"
            onClick={() => {
              dispatch({ type: "toggle direction", payload: outputAmount });
            }}
          />
        </div>
        {/* Buy Token Section */}
        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-medium">Buy</div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Select
              value={state.buyToken.address}
              onValueChange={(value) => {
                const buyToken = tokenMapsByChainId[value];

                dispatch({
                  type: "select buy token",
                  payload: buyToken,
                });

                ampli.buyTokenSelected({
                  Name: buyToken.name,
                  Symbol: buyToken.symbol,
                  Address: buyToken.address,
                });
              }}
            >
              <SelectTrigger className="h-12 min-w-[128px] bg-gray-200 dark:bg-[#252525] border-0 rounded-full -ml-1">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image
                      fill
                      src={state.buyToken.logo || "/placeholder.svg"}
                      alt={`${state.buyToken.symbol} logo`}
                      className="rounded-full object-contain"
                    />
                  </div>
                  <span className="font-medium">{state.buyToken.symbol}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="dark:bg-[#252525] dark:border-[#444]">
                <SelectGroup>
                  <SelectLabel className="dark:text-[#888]">Tokens</SelectLabel>
                  {TOKENS_BY_CHAIN_ID[state.chainId].map((option) => (
                    <SelectItem
                      key={option.address}
                      value={option.address}
                      className="dark:focus:bg-[#333] dark:focus:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5">
                          <Image
                            fill
                            src={option.logo || "/placeholder.svg"}
                            alt={`${option.symbol} logo`}
                            className="rounded-full object-contain"
                          />
                        </div>
                        {option.symbol}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div
              ref={outputRef}
              className="text-4xl font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
              title={outputAmount || "0"}
            >
              {formattedOutput}
            </div>
            <div className="text-xl text-[#888]">{buyUsdValue}</div>
          </div>
        </div>
        {/* Slippage Setting */}
        <div className="flex items-center dark:text-[#888] mt-2">
          <span>Slippage:</span>
          <button className="ml-2 flex items-center gap-1 dark:bg-[#252525] rounded-lg px-2 py-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span>Auto</span>
          </button>
        </div>
        {/* Submit Button */}
        <Button
          disabled={
            !state.inputAmount || isFetching || quoteIsFetching || !address
          }
          type="button"
          onClick={() => {
            console.log(quote);
            const wantToSwap = window.confirm(
              `Are you sure you want to swap? ${state.inputAmount} ${state.sellToken.symbol} for ${formattedOutput} ${state.buyToken.symbol}`
            );

            if (wantToSwap) {
              setShouldFetchQuote(true);
            }

            if (quote) {
              sendTransaction({
                to: quote.transaction.to,
                data: quote.transaction.data,
                value: quote.transaction.value,
                gas: BigInt(quote.transaction.gas),
              });
            }
          }}
          className="w-full h-16 mt-4 text-xl font-medium rounded-2xl bg-[#2a3050] hover:bg-[#2d3459] text-white border-0"
        >
          {quoteIsFetching ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading...</span>
            </div>
          ) : !address ? (
            "Connect"
          ) : quote ? (
            "Submit"
          ) : !state.inputAmount ? (
            "Enter an amount"
          ) : (
            "Review"
          )}
        </Button>

        {hash && (
          <div
            className={`mt-4 p-4 bg-[#1a1a1a] rounded-xl border ${txStatusBorder} text-sm`}
          >
            <div className="flex items-center gap-2 text-[#FFF]">
              {isLoadingTxReceipt ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : receipt?.status === "success" ? (
                <BadgeCheck className="h-5 w-5 text-green-500" />
              ) : (
                <OctagonXIcon className="h-5 w-5 text-red-500" />
              )}
              <p className="font-medium">
                Transaction{" "}
                {isLoadingTxReceipt
                  ? "Submitting…"
                  : receipt?.status === "success"
                  ? "Completed"
                  : "Reverted"}
              </p>
            </div>

            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFF] hover:text-[#FFF]/80 text-xs mt-2 block truncate"
            >
              View on block explorer:{" "}
              <span className="underline">
                {hash.slice(0, 10)}...{hash.slice(-8)}
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock max amount for demonstration
const maxAmount = "0.065";

function useQuote({
  taker,
  chainId,
  buyToken,
  sellToken,
  sellAmount,
  slippageBps,
  enabled,
}: any) {
  return useQuery({
    queryKey: ["firmQuote", enabled],
    queryFn: async () => {
      return await fetchSwap({
        endpoint: "/api/quote",
        taker,
        chainId,
        slippageBps,
        buyToken: buyToken.address,
        sellToken: sellToken.address,
        sellAmount: parseUnits(sellAmount, sellToken.decimals).toString(),
      });
    },
    enabled,
  });
}
