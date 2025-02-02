import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { State } from "@/reducers";

export function useSyncSwapParams({
  state,
  searchParams,
}: {
  state: State;
  searchParams: URLSearchParams;
}) {
  const router = useRouter();

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries({
      sellToken: state.sellToken.address,
      buyToken: state.buyToken.address,
      chainId: state.chainId?.toString(),
      sellAmount: state.inputAmount,
    }).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });

    router.push(`?${newParams.toString()}`, { scroll: false });
  }, [state]);
}
