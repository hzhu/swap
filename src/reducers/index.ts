import type { Token } from "@/types/tokens";

type State = {
  inputAmount: string;
  shouldDebounce: boolean;
  sellToken: Token;
  buyToken: Token;
};

type Action =
  | { type: "type sell amount"; payload: string }
  | { type: "toggle direction"; payload: string }
  | { type: "select sell token"; payload: Token }
  | { type: "select buy token"; payload: Token };

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
    default:
      return state;
  }
}
