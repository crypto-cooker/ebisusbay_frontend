import {useReadContract} from "wagmi";
import {useMemo} from "react";
import {CurrencyAmount} from "@pancakeswap/swap-sdk-core";
import {useTokenContract} from "@src/global/hooks/contracts";
import useTotalSupply from "@eb-pancakeswap-web/hooks/useTotalSupply";
import {ERC20Token, Pair, pancakePairV2ABI} from '@pancakeswap/sdk';
import {Address} from "viem";
import {useTokenByChainId} from "@eb-pancakeswap-web/hooks/tokens";
import {useAppChainConfig} from "@src/config/hooks";
import {ciEquals} from "@market/helpers/utils";

const useFrtnStakingPair = ({ pairAddress, chainId }: {pairAddress: Address, chainId: number}) => {
  const { config: chainConfig } = useAppChainConfig(chainId);
  const lpConfig = chainConfig.lpVaults.find((v) => ciEquals(v.pair, pairAddress));

  const frtnCurrency = useTokenByChainId(lpConfig?.address1, chainId) as ERC20Token;
  const otherCurrency = useTokenByChainId(lpConfig?.address2, chainId) as ERC20Token;

  const { data: pairData } = useReadContract({
    address: pairAddress,
    abi: pancakePairV2ABI,
    functionName: 'getReserves',
    chainId
  });

  const pair = useMemo(() => {
    if (!pairData || !frtnCurrency || !otherCurrency) return;

    const [reserve0, reserve1] = pairData

    return new Pair(
      CurrencyAmount.fromRawAmount(frtnCurrency, reserve0.toString()),
      CurrencyAmount.fromRawAmount(otherCurrency, reserve1.toString()),
    )
  }, [frtnCurrency, otherCurrency, pairData]);

  const liquidityToken = pair?.liquidityToken;
  const tokenContract = useTokenContract(liquidityToken?.address, chainId);
  const totalSupply = useTotalSupply(liquidityToken, chainId);
  const frtnContract = useTokenContract(frtnCurrency?.address, chainId);
  const otherContract = useTokenContract(otherCurrency?.address, chainId);

  return useMemo(() => {
    const frtnReserve = pair?.reserve0;
    const derivedFrtn = frtnReserve ? Number(frtnReserve.toExact()) : 0;

    return {
      pair,
      tokenContract,
      totalSupply,
      frtnReserve,
      derivedFrtn,
      frtnCurrency,
      otherCurrency,
      frtnContract,
      otherContract,
    }
  }, [pair, chainId, liquidityToken, tokenContract, totalSupply, frtnCurrency, otherCurrency, frtnContract, otherContract]);
}

export default useFrtnStakingPair;