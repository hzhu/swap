type State = {
  inputAmount: string;
  isDefaultDirection: boolean;
  shouldDebounce: boolean;
};

type Action =
  | { type: "SET_INPUT_AMOUNT"; payload: string }
  | { type: "TOGGLE_DIRECTION"; payload: string };

export function swapReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT_AMOUNT":
      return { ...state, inputAmount: action.payload, shouldDebounce: true };
    case "TOGGLE_DIRECTION":
      return {
        ...state,
        isDefaultDirection: !state.isDefaultDirection,
        inputAmount: action.payload,
        shouldDebounce: false,
      };
    default:
      return state;
  }
}
