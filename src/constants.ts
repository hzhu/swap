import { arbitrum, base } from "viem/chains";
import { Token } from "./types/tokens";

export const BASE_TOKENS: Token[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/base/assets/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913/logo.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: "0x4200000000000000000000000000000000000006",
    logo: "https://token-registry.s3.amazonaws.com/icons/tokens/base/128/0x4200000000000000000000000000000000000006.png",
  },
  {
    symbol: "DEGEN",
    name: "DEGEN",
    decimals: 18,
    address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
    logo: "https://token-registry.s3.amazonaws.com/icons/tokens/base/128/0x4ed4e862860bed51a9570b96d89af5e1b0efefed.png",
  },
];

export const BASE_TOKENS_BY_ADDRESS: Record<string, Token> = BASE_TOKENS.reduce(
  (baseTokensByAddress, token) => ({
    ...baseTokensByAddress,
    [token.address]: token,
  }),
  {}
);

export const ARBITRUM_TOKENS: Token[] = [
  {
    symbol: "ARB",
    name: "Arbitrum",
    decimals: 18,
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    logo: "https://token-registry.s3.amazonaws.com/icons/tokens/arbitrum/128/0x82af49447d8a07e3bd95bd0d56f35241523fbab1.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/arbitrum/assets/0xaf88d065e77c8cC2239327C5EDb3A432268e5831/logo.png",
  },
];

export const ARBITRUM_TOKENS_BY_ADDRESS: Record<string, Token> =
  ARBITRUM_TOKENS.reduce(
    (arbitrumTokensByAddress, token) => ({
      ...arbitrumTokensByAddress,
      [token.address]: token,
    }),
    {}
  );

export const TOKENS_BY_CHAIN_ID: Record<string, Token[]> = {
  [base.id]: BASE_TOKENS,
  [arbitrum.id]: ARBITRUM_TOKENS,
};

export const TOKEN_MAPS_BY_CHAIN_ID: Record<string, Record<string, Token>> = {
  [base.id]: BASE_TOKENS_BY_ADDRESS,
  [arbitrum.id]: ARBITRUM_TOKENS_BY_ADDRESS,
};

export const INITIAL_SELL_TOKEN =
  BASE_TOKENS_BY_ADDRESS["0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"];

export const INITIAL_BUY_TOKEN =
  BASE_TOKENS_BY_ADDRESS["0x4200000000000000000000000000000000000006"];

export const CHAIN_NAMES_BY_ID: Record<number, string> = {
  [base.id]: "Base",
  [arbitrum.id]: "Arbitrum",
};
