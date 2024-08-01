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
import useV2PairsByAccount from "@eb-pancakeswap-web/hooks/useV2Pairs";
import {useUser} from "@src/components-v2/useUser";

export default function LiquidityPage() {
  const { address: account } = useUser();

  const { data: allV2PairsWithLiquidity, loading: v2IsLoading} = useV2PairsByAccount(account);

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