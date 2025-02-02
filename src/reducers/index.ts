import { TOKENS_BY_CHAIN_ID } from "@/constants";
import type { Token } from "@/types/tokens";

export type State = {
  inputAmount: string;
  shouldDebounce: boolean;
  sellToken: Token;
  buyToken: Token;
  chainId: number;
};

type Action =
  | { type: "type sell amount"; payload: string }
  | { type: "toggle direction"; payload: string }
  | { type: "select sell token"; payload: Token }
  | { type: "select buy token"; payload: Token }
  | { type: "select chain"; payload: number };

export function swapReducer(state: State, action: Action): State {
  switch (action.type) {
    case "type sell amount":
      return { ...state, inputAmount: action.payload, shouldDebounce: true };
    case "toggle direction":
      return {
        ...state,
        inputAmount: action.payload,
        shouldDebounce: false,
        sellToken: state.buyToken,
        buyToken: state.sellToken,
      };
    case "select sell token":
      if (action.payload.address === state.buyToken.address) {
        return {
          ...state,
          sellToken: action.payload,
          buyToken: state.sellToken,
        };
      } else {
        return { ...state, sellToken: action.payload };
      }
    case "select buy token":
      if (action.payload.address === state.sellToken.address) {
        return {
          ...state,
          buyToken: action.payload,
          sellToken: state.buyToken,
        };
      } else {
        return { ...state, buyToken: action.payload };
      }
    case "select chain":
      const [sellToken, buyToken] = TOKENS_BY_CHAIN_ID[action.payload];
      return { ...state, chainId: action.payload, sellToken, buyToken };
    default:
      return state;
  }
}
