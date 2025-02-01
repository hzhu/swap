interface ZeroExFee {
  amount: string;
  token: string;
  type: string;
}

interface Fees {
  integratorFee: string | null;
  zeroExFee: ZeroExFee;
  gasFee: string | null;
}

interface BalanceIssue {
  token: string;
  actual: string;
  expected: string;
}

interface Issues {
  allowance: string | null;
  balance: BalanceIssue | null;
  simulationIncomplete: boolean;
  invalidSourcesPassed: string[];
}

interface Fill {
  from: string;
  to: string;
  source: string;
  proportionBps: string;
}

interface Token {
  address: string;
  symbol: string;
}

interface Route {
  fills: Fill[];
  tokens: Token[];
}

interface TokenTaxInfo {
  buyTaxBps: string;
  sellTaxBps: string;
}

interface TokenMetadata {
  buyToken: TokenTaxInfo;
  sellToken: TokenTaxInfo;
}

export interface ZeroExPriceResponse {
  blockNumber: string;
  buyAmount: string;
  buyToken: string;
  fees: Fees;
  gas: string;
  gasPrice: string;
  issues: Issues;
  liquidityAvailable: boolean;
  minBuyAmount: string;
  route: Route;
  sellAmount: string;
  sellToken: string;
  tokenMetadata: TokenMetadata;
  totalNetworkFee: string;
  zid: string;
}
