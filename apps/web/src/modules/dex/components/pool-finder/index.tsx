import {Card} from "@src/components-v2/foundation/card";
import {Alert, AlertIcon, Button, Box, Heading, HStack, IconButton, Spinner, Stack, Text, VStack} from "@chakra-ui/react";
import NextLink from "next/link";
import {AddIcon, ArrowBackIcon, ChevronDownIcon} from "@chakra-ui/icons";
import React, {useCallback, useEffect, useState} from "react";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";
import {useV2Pair, PairState} from "@eb-pancakeswap-web/hooks/usePairs";
import {ChainLogo, CurrencyLogo} from "@dex/components/logo";
import {Currency} from "@pancakeswap/sdk";
import {FRTN, STABLE_COIN, USDC, USDT} from '@pancakeswap/tokens'
import {ChainId} from "@pancakeswap/chains";
import {useUser} from "@src/components-v2/useUser";
import {BIG_INT_ZERO} from "@dex/swap/constants/exchange";
import {useTokenBalance} from "@eb-pancakeswap-web/state/wallet/hooks";
import currencyId from "@eb-pancakeswap-web/utils/currencyId"

enum Fields {
  TOKEN0,
  TOKEN1
}

export default function PoolFinder() {
  const { address: account } = useUser();

  const native = useNativeCurrency()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);
  const [currency0, setCurrency0] = useState<Currency | null>(native);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined)

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
      pair &&
      pair.reserve0.quotient === BIG_INT_ZERO &&
      pair.reserve1.quotient === BIG_INT_ZERO,
    )

  const position = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && position.quotient > BIG_INT_ZERO)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  return (
    <Card>
      <Heading size='md' mb={2}>
        <HStack justify=''>
          <NextLink href='/dex/liquidity'>
            <IconButton
              aria-label='Back'
              icon={<ArrowBackIcon />}
              variant='unstyled'
            />
          </NextLink>
          <Box>Import V2 Pool</Box>
        </HStack>
      </Heading>
      <Box>
        <Alert status='info'>
          <AlertIcon />
          Use this tool to find pairs that don't automatically appear in the interface.
        </Alert>
        <VStack mt={4} spacing={4} align='stretch'>
          <Button
            rightIcon={<ChevronDownIcon />}
            variant='outline'
            size='lg'
          >
            <HStack>
              {!!currency0 ? (
                <>
                  <CurrencyLogo currency={currency0} />
                  <Box>
                    {currency0.symbol}
                  </Box>
                </>
              ) : (
                <span>Select a token</span>
              )}
            </HStack>
          </Button>
          <Box className='text-muted' mx='auto'>
            <AddIcon />
          </Box>
          <Button
            rightIcon={<ChevronDownIcon />}
            variant='outline'
            size='lg'
          >
            <HStack>
              {!!currency1 ? (
                <>
                  <CurrencyLogo currency={currency1} />
                  <Box>
                    {currency1.symbol}
                  </Box>
                </>
              ) : (
                <span>Select a token</span>
              )}
            </HStack>
          </Button>

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <>
                  <MinimalPositionCard pair={pair} />
                  <Button
                    as={NextLinkFromReactRouter}
                    to={`/v2/pair/${pair.token0.address}/${pair.token1.address}`}
                    variant="secondary"
                    width="100%"
                  >
                    Manage this pair
                  </Button>
                </>
              ) : (
                <Card padding="45px 10px">
                  <Stack gap="sm" justify="center">
                    <Text textAlign="center">You don’t have liquidity in this pair yet.</Text>
                    <NextLink href={`/v2/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      <Button>
                        Add Liquidity
                      </Button>
                    </NextLink>
                  </Stack>
                </Card>
              )
            ) : validPairNoLiquidity ? (
              <Card padding="45px 10px">
                <Stack gap="sm" justify="center">
                  <Text textAlign="center">No pair found.</Text>
                  <NextLink href={`/v2/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <Button>
                      Create pair
                    </Button>
                  </NextLink>
                </Stack>
              </Card>
            ) : pairState === PairState.INVALID ? (
              <Card padding="45px 10px">
                <Stack gap="sm" justify="center">
                  <Text textAlign="center" fontWeight={500}>
                    Invalid pair
                  </Text>
                </Stack>
              </Card>
            ) : pairState === PairState.LOADING ? (
              <Card padding="45px 10px">
                <Stack gap="sm" justify="center">
                  <Text textAlign="center">
                    <Spinner size='sm' />
                  </Text>
                </Stack>
              </Card>
            ) : null
          ) : (
            <Card padding="45px 10px">
              <Text textAlign="center">
                {!account ? 'Connect to a wallet to find pools' : 'Select a token to find your liquidity.'}
              </Text>
            </Card>
          )}
        </VStack>

      </Box>
    </Card>
  )
}
