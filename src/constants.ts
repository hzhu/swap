import { Token } from "./types/tokens";

export const USDC: Token = {
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  logo: "https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/base/assets/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913/logo.png",
};

export const WETH: Token = {
  symbol: "WETH",
  name: "Wrapped Ether",
  decimals: 18,
  address: "0x4200000000000000000000000000000000000006",
  logo: "https://token-registry.s3.amazonaws.com/icons/tokens/base/128/0x4200000000000000000000000000000000000006.png",
};

const DEGEN: Token = {
  symbol: "DEGEN",
  name: "DEGEN",
  decimals: 18,
  address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
  logo: "https://token-registry.s3.amazonaws.com/icons/tokens/base/128/0x4ed4e862860bed51a9570b96d89af5e1b0efefed.png",
};

export const BASE_TOKENS = [USDC, WETH, DEGEN];

export const BASE_TOKENS_BY_ADDRESS: Record<string, Token> = BASE_TOKENS.reduce(
  (baseTokensByAddress, token) => ({
    ...baseTokensByAddress,
    [token.address]: token,
  }),
  {}
);
