import { Pair, Percent, TokenAmount } from '@pancakeswap/sdk';
import React, { useMemo, useState } from 'react';
import {unwrappedToken} from "@pancakeswap/tokens";
import useActiveWeb3React from "@eb-pancakeswap-web/hooks/useActiveWeb3React";
import useTotalSupply from "@eb-pancakeswap-web/hooks/useTotalSupply";
import {useTokenBalance} from "@eb-pancakeswap-web/state/wallet/hooks";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import {CurrencyLogo, DoubleCurrencyLogo} from "@dex/components/logo";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import NextLink from "next/link";
import {BIG_INT_ZERO} from "@dex/swap/constants/exchange";
import currencyId from "@eb-pancakeswap-web/utils/currencyId"
import {useAccount} from "wagmi";
import { Card } from '@src/components-v2/foundation/card';

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: TokenAmount; // optional balance to indicate that liquidity is deposited in mining pool
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
  const { account } = useActiveWeb3React();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance;

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && totalPoolTokens.subtract(userPoolBalance).quotient > 0
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    totalPoolTokens.subtract(userPoolBalance).quotient > 0
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined];

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              <HStack gap="8px">
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {!currency0 || !currency1 ? <Spinner size='sm' /> : `${currency0.symbol}/${currency1.symbol}`}
                </Text>
              </HStack>
            </Box>
            <HStack>
              {/*<>Manage</>*/}
              <AccordionIcon />
            </HStack>
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Flex justify='space-between'>
            <Text fontSize={16} fontWeight={500}>
              Your total pool tokens:
            </Text>
            <Text fontSize={16} fontWeight={500}>
              {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
            </Text>
          </Flex>
          {stakedBalance && (
            <Flex justify='space-between'>
              <Text fontSize={16} fontWeight={500}>
                Pool tokens in rewards pool:
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {stakedBalance?.toSignificant(4)}
              </Text>
            </Flex>
          )}
          {!!currency0 && (
            <Flex justify='space-between'>
              <Text fontSize={16} fontWeight={500}>
                Pooled {currency0.symbol}:
              </Text>
              {token0Deposited ? (
                <HStack ms={2}>
                  <Text fontSize={16} fontWeight={500}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" currency={currency0} />
                </HStack>
              ) : (
                '-'
              )}
            </Flex>
          )}
          {!!currency1 && (
            <Flex justify='space-between'>
              <Text fontSize={16} fontWeight={500}>
                Pooled {currency1.symbol}:
              </Text>
              {token1Deposited ? (
                <HStack ms={2}>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" currency={currency1} />
                </HStack>
              ) : (
                '-'
              )}
            </Flex>
          )}
          <Flex justify='space-between'>
            <Text fontSize={16} fontWeight={500}>
              Your pool share:
            </Text>
            <Text fontSize={16} fontWeight={500}>
              {poolTokenPercentage
                ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                : '-'}
            </Text>
          </Flex>
          <HStack maxW='400px' mx='auto' my={4}>
            {userDefaultPoolBalance && userDefaultPoolBalance.quotient > BIG_INT_ZERO && (
              <>
                <Box w='full'>
                  <NextLink href={`/dex/add/v2/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <PrimaryButton w='full'>
                      Add
                    </PrimaryButton>
                  </NextLink>
                </Box>
                <Box w='full'>
                  <NextLink href={`/dex/remove/v2/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <PrimaryButton w='full'>
                      Remove
                    </PrimaryButton>
                  </NextLink>
                </Box>
              </>
            )}
            {stakedBalance && stakedBalance.quotient > BIG_INT_ZERO && (
              <NextLink href={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}>
                <PrimaryButton>
                  Manage Liquidity in Rewards Pool
                </PrimaryButton>
              </NextLink>
            )}
          </HStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}


export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && totalPoolTokens.subtract(userPoolBalance).quotient > 0
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    totalPoolTokens.subtract(userPoolBalance).quotient > 0
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance && userPoolBalance.quotient > BIG_INT_ZERO ? (
        <Card>
          <VStack spacing={3} align='stretch' w='full'>
            <Box>Your position</Box>
            <Flex justify='space-between'>
              <HStack ms={2}>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
                <Text fontSize='lg' fontWeight='semibold'>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </HStack>
              <Text fontSize='lg' fontWeight='semibold'>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </Flex>
            <Flex justify='space-between'>
              <Text fontSize={16} fontWeight='semibold'>
                Your pool share:
              </Text>
              <Text fontSize={16} fontWeight='semibold'>
                {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
              </Text>
            </Flex>
            <Flex justify='space-between'>
              <Text fontSize={16} fontWeight='semibold'>
                {currency0.symbol}:
              </Text>
              {token0Deposited ? (
                <Text fontSize={16} fontWeight='semibold'>
                  {token0Deposited?.toSignificant(6)}
                </Text>
              ) : (
                '-'
              )}
            </Flex>
            <Flex justify='space-between'>
              <Text fontSize={16} fontWeight='semibold'>
                {currency1.symbol}:
              </Text>
              {token1Deposited ? (
                <Text fontSize={16} fontWeight='semibold'>
                  {token1Deposited?.toSignificant(6)}
                </Text>
              ) : (
                '-'
              )}
            </Flex>
          </VStack>
        </Card>
      ) : (
        <Box>
          None found
        </Box>
      )}
    </>
  );
}
