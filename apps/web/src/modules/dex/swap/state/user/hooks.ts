// Custom hook for userExpertMode
import {useAtom} from "jotai";
import {dexUserStateAtom} from "@dex/swap/state/user/atom";
import {SlippageTolerance} from "@dex/swap/state/user/types";
import {ERC20Token, Pair, Percent} from "@pancakeswap/sdk";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useMemo} from "react";
import {BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS} from "@dex/swap/constants/exchange";
import flatMap from "lodash/flatMap";
import {safeGetAddress} from "@eb-pancakeswap-web/utils";
import { useAllTokens } from '@eb-pancakeswap-web/hooks/tokens';
import {useSelector} from "react-redux";
import {deserializeToken} from "@pancakeswap/token-lists";
import {RootState} from "@market/state/redux/store";

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
/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [ERC20Token, ERC20Token]): ERC20Token {
  return new ERC20Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'Ryoshi-LP', 'Ryoshi LPs')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [ERC20Token, ERC20Token][] {
  const { chainId } = useActiveChainId()
  const tokens = useAllTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [ERC20Token, ERC20Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
          const token = tokens[tokenAddress]
          // for each token on the current chain,
          return (
            // loop through all bases on the current chain
            (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
              // to construct pairs of the given token with each base
              .map((base: any) => {
                const baseAddress = safeGetAddress(base.address)

                if (baseAddress && baseAddress === tokenAddress) {
                  return null
                }
                return [base, token]
              })
              .filter((p: any): p is [ERC20Token, ERC20Token] => p !== null)
          )
        })
        : [],
    [tokens, chainId],
  )

  // pairs saved by users
  const savedSerializedPairs = useSelector<RootState, RootState['pancakeUser']['pairs']>(({ pancakeUser: { pairs } }) => pairs)

  const userPairs: [ERC20Token, ERC20Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{
      [key: string]: [ERC20Token, ERC20Token]
    }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted
        ? `${safeGetAddress(tokenA.address)}:${safeGetAddress(tokenB.address)}`
        : `${safeGetAddress(tokenB.address)}:${safeGetAddress(tokenA.address)}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}