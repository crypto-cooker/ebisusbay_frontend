// Custom hook for userExpertMode
import {useAtom} from "jotai";
import {dexUserStateAtom} from "@dex/state/user/atom";

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

  const setUserSlippageTolerance = (newTolerance: number) => {
    setState({
      ...state,
      userSlippageTolerance: newTolerance
    });
  };

  return [state.userSlippageTolerance, setUserSlippageTolerance] as const;
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