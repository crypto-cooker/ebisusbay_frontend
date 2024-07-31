import {Box, Center, Heading, HStack, Spinner, Text, Stack, VStack} from "@chakra-ui/react";
import {Card} from "@src/components-v2/foundation/card";
import React, {useMemo} from "react";
import NextLink from "next/link";
import {AddIcon, DownloadIcon} from "@chakra-ui/icons";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {toV2LiquidityToken, useTrackedTokenPairs} from "@dex/swap/state/user/hooks";
import {useTokenBalancesWithLoadingIndicator} from "@eb-pancakeswap-web/state/wallet/hooks";
import useActiveWeb3React from "@eb-pancakeswap-web/hooks/useActiveWeb3React";
import {useV2Pairs} from "@eb-pancakeswap-web/hooks/usePairs";
import {Pair} from "@pancakeswap/sdk";
import FullPositionCard from "@dex/liquidity/components/position-card";

export default function LiquidityPage() {
  const { account } = useActiveWeb3React();

  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  );

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );

  console.log('v2IsLoading1', liquidityTokensWithBalances);
  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens));
  console.log('v2IsLoading2', v2Pairs);
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);
  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));
  console.log('v2IsLoading3', allV2PairsWithLiquidity?.length > 0);
  // console.log('v2IsLoading', !account, v2IsLoading, v2Pairs.length, v2Pairs, allV2PairsWithLiquidity?.length > 0, !account || v2IsLoading || allV2PairsWithLiquidity?.length > 0);

  return (
    <Box>
      <Stack direction={{base: 'column', sm: 'row'}} align='center' w='full' justify='space-between'>
        <Heading size='md' fontWeight='semibold'>Your Liquidity</Heading>
        <HStack>
          <NextLink href='/dex/find'>
            <PrimaryButton size='sm' leftIcon={<DownloadIcon />}>
              Import pool
            </PrimaryButton>
          </NextLink>
          <NextLink href='/dex/add/v2'>
            <PrimaryButton size='sm' leftIcon={<AddIcon />}>
              Add liquidity
            </PrimaryButton>
          </NextLink>
        </HStack>
      </Stack>
      <Card mt={4}>
        <VStack w='full' align='stretch'>
          {!account ? (
            <Text textAlign='center' p={8}>
              Connect to a wallet to view your liquidity.
            </Text>
          ) : v2IsLoading ? (
            <Center p={8}>
              <Spinner />
            </Center>
          ) : allV2PairsWithLiquidity?.length > 0 ? (
            <>
              {allV2PairsWithLiquidity.map((v2Pair) => (
                <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
              ))}
            </>
          ) : (
            <Text textAlign='center' p={8}>
              No Liquidity found
            </Text>
          )}
          <Box textAlign='center' mt={6} mb={2}>
            Don't see a pair you joined? Import a pool above
          </Box>
        </VStack>
      </Card>
    </Box>
  )
}