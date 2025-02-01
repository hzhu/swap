import type { Address } from "viem";

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: Address;
  logo: string;
}
