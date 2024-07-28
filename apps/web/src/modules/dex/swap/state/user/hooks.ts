// Custom hook for userExpertMode
import {useAtom} from "jotai";
import {dexUserStateAtom} from "@dex/swap/state/user/atom";
import {SlippageTolerance} from "@dex/swap/state/user/types";
import {Percent} from "@pancakeswap/sdk";

export function useUserExpertMode() {
  const [state, setState] = useAtom(dexUserStateAtom);

  const setUserExpertMode = (newMode: boolean) => {
    setState({
      ...state,
      userExpertMode: newMode
    });
  };

  return [state.userExpertMode, setUserExpertMode] as const;
}

export function useUserSlippageTolerance() {
  const [state, setState] = useAtom(dexUserStateAtom);

  const userSlippageTolerance = state.userSlippageTolerance === SlippageTolerance.Auto
    ? SlippageTolerance.Auto
    : new Percent(state.userSlippageTolerance, 10_000);

  const setUserSlippageTolerance = (newTolerance: Percent | SlippageTolerance.Auto) => {
    let value: SlippageTolerance.Auto | number
    try {
      value =
        newTolerance === SlippageTolerance.Auto
          ? SlippageTolerance.Auto
          : Number(newTolerance.multiply(10_000).quotient)
    } catch (error) {
      value = SlippageTolerance.Auto
    }

    setState({
      ...state,
      userSlippageTolerance: value
    });
  };

  return [userSlippageTolerance, setUserSlippageTolerance] as const;
}

/**
 *Returns user slippage tolerance, replacing the auto with a default value
 * @param defaultSlippageTolerance the value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const [allowedSlippage] = useUserSlippageTolerance()
  return allowedSlippage === SlippageTolerance.Auto ? defaultSlippageTolerance : allowedSlippage
}


export function useUserSingleHopOnly() {
  const [state, setState] = useAtom(dexUserStateAtom);

  const setUserSingleHopOnly = (newSingleHop: boolean) => {
    setState({
      ...state,
      userSingleHopOnly: newSingleHop
    });
  };

  return [state.userSingleHopOnly, setUserSingleHopOnly] as const;
}

// export function useRouterPreference(): [RouterPreference, (routerPreference: RouterPreference) => void] {
//   const [state, setState] = useAtom(dexUserStateAtom);
//
//   const setRouterPreference = (routerPreference: RouterPreference) => {
//     setState({
//       ...state,
//       routerPreference: routerPreference
//     });
//   };
//
//   return [state.routerPreference, setRouterPreference]
// }