import {useReadContract} from "wagmi";
import {useMemo} from "react";
import {CurrencyAmount} from "@pancakeswap/swap-sdk-core";
import {useTokenContract} from "@src/global/hooks/contracts";
import useTotalSupply from "@eb-pancakeswap-web/hooks/useTotalSupply";
import {Pair, pancakePairV2ABI} from '@pancakeswap/sdk';
import {Address} from "viem";

// const useStakingPair = ({ pairAddress }: {pairAddress: Address}) => {
//   const { data: pairData } = useReadContract({
//     address: pairAddress,
//     abi: pancakePairV2ABI,
//     functionName: 'getReserves',
//   });
//
//   const pair = useMemo(() => {
//     if (!pairData) return;
//
//     const [reserve0, reserve1] = pairData
//
//     return new Pair(
//       CurrencyAmount.fromRawAmount(frtnCurrency, reserve0.toString()),
//       CurrencyAmount.fromRawAmount(otherCurrency, reserve1.toString()),
//     )
//   }, [frtnCurrency, otherCurrency, pairData]);
//
//   const liquidityToken = pair?.liquidityToken;
//   const tokenContract = useTokenContract(liquidityToken?.address, bankChainId);
//   const totalSupply = useTotalSupply(liquidityToken);
//   const frtnReserve = pair?.reserve0;
//
//   return useMemo(() => {
//
//   }, [pair]);
// }