// Custom hook for userExpertMode
import {useAtom} from "jotai";
import {dexUserStateAtom} from "@dex/state/user/atom";
import {SlippageTolerance} from "@dex/state/user/types";
import {Percent} from "@uniswap/sdk-core";
import JSBI from "jsbi";
import {RouterPreference} from "@dex/imported/state/routing/types";

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
          : JSBI.toNumber(newTolerance.multiply(10_000).quotient)
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


export function useUserAllowMultihop() {
  const [state, setState] = useAtom(dexUserStateAtom);

  const setUserAllowMultihops = (newMultihop: boolean) => {
    setState({
      ...state,
      userMultihop: newMultihop
    });
  };

  return [state.userMultihop, setUserAllowMultihops] as const;
}

export function useRouterPreference(): [RouterPreference, (routerPreference: RouterPreference) => void] {
  const [state, setState] = useAtom(dexUserStateAtom);

  const setRouterPreference = (routerPreference: RouterPreference) => {
    setState({
      ...state,
      routerPreference: routerPreference
    });
  };

  return [state.routerPreference, setRouterPreference]
}