import {atom, PrimitiveAtom} from 'jotai';
import {DexToken, DexTokenBalance} from "@dex/types";
import {formatUnits, parseUnits} from 'viem'
import {ciEquals} from "@market/helpers/utils";
import {Trade} from "@uniswap/v3-sdk";

export interface SwapBoxToken {
  key: 'tokenA' | 'tokenB';
  token: DexToken | null;
  amountEth: string;
  amountWei: bigint;
}

export const tokenAAtom = atom<SwapBoxToken>({
  key: 'tokenA',
  token: null,
  amountEth: '',
  amountWei: BigInt(0)
});
export const tokenBAtom = atom<SwapBoxToken>({
  key: 'tokenB',
  token: null,
  amountEth: '',
  amountWei: BigInt(0)
});
export const userTokenBalancesAtom = atom<DexTokenBalance[]>([]);

export const setTokenAmountFromEth = atom(
  null,
  (get, set, atom: PrimitiveAtom<SwapBoxToken>, amount: string) => {
    const currentState = get(atom);
    if (currentState.token) {
      set(atom, {
        ...currentState,
        amountEth: amount,
        amountWei: parseUnits(amount, currentState.token.decimals)
      });
    }
  }
);

export const setTokenAmountFromWei = atom(
  null,
  (get, set, atom: PrimitiveAtom<SwapBoxToken>, amount: bigint) => {
    const currentState = get(atom);
    if (currentState.token) {
      set(atom, {
        ...currentState,
        amountWei: amount,
        amountEth: formatUnits(amount, currentState.token.decimals)
      });
    }
  }
);

export const setTokenAtom = atom(
  null,
  (get, set, type: 'tokenA' | 'tokenB', token: DexToken) => {
    const atom = type === 'tokenA' ? tokenAAtom : tokenBAtom;
    const otherAtom = type === 'tokenA' ? tokenBAtom : tokenAAtom;

    const tokenState = get(atom);
    const otherTokenState = get(otherAtom);

    const isTokenSwitch = ciEquals(otherTokenState.token?.address, token.address);

    const targetTokenStake = isTokenSwitch ? otherTokenState : tokenState;
    const targetOtherTokenStake = isTokenSwitch ? tokenState : otherTokenState;

    set(atom, {
      ...tokenState,
      token,
      amountEth: targetTokenStake.amountEth,
      amountWei: parseUnits(targetTokenStake.amountEth, token.decimals)
    });

    if (isTokenSwitch) {
      set(otherAtom, {
        ...otherTokenState,
        token: targetOtherTokenStake.token,
        amountEth: targetOtherTokenStake.amountEth,
        amountWei: parseUnits(targetOtherTokenStake.amountEth, token.decimals)
      });
    }
  }
);

export const switchTokensAtom = atom(
  null,
  (get, set) => {
    const tokenAState = get(tokenAAtom);
    const tokenBState = get(tokenBAtom);

    // const targetTokenStake = isTokenSwitch ? tokenBState : tokenAState;
    // const targetOtherTokenStake = isTokenSwitch ? tokenAState : tokenBState;
    //
    // set(tokenAAtom, {
    //   ...tokenAState,
    //   token: tokenBState.token,
    //   amountEth: tokenBState.amountEth,
    //   amountWei: parseUnits(targetTokenStake.amountEth, token.decimals)
    // });
    //
    // set(tokenBAtom, {
    //   ...tokenAState,
    //   token: targetOtherTokenStake.token,
    //   amountEth: targetOtherTokenStake.amountEth,
    //   amountWei: parseUnits(targetOtherTokenStake.amountEth, token.decimals)
    // });
  }
);