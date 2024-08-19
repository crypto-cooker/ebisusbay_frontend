import {Card} from "@src/components-v2/foundation/card";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import NextLink from "next/link";
import {AddIcon, ArrowBackIcon, ChevronDownIcon} from "@chakra-ui/icons";
import React, {useCallback, useEffect, useState} from "react";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";
import {PairState, useV2Pair} from "@eb-pancakeswap-web/hooks/usePairs";
import {CurrencyLogo} from "@dex/components/logo";
import {Currency} from "@pancakeswap/sdk";
import {useUser} from "@src/components-v2/useUser";
import {BIG_INT_ZERO} from "@dex/swap/constants/exchange";
import {useTokenBalance} from "@eb-pancakeswap-web/state/wallet/hooks";
import currencyId from "@eb-pancakeswap-web/utils/currencyId"
import {CurrencySearchModal} from "@dex/components/search-modal";
import {MinimalPositionCard} from '@dex/liquidity/components/position-card';
import {PrimaryButton, SecondaryButton} from '@src/components-v2/foundation/button';
import {usePairAdder} from "@eb-pancakeswap-web/state/user/hooks";

enum Fields {
  TOKEN0,
  TOKEN1
}

export default function PoolFinder() {
  const { address: account } = useUser();

  const native = useNativeCurrency()

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);
  const [currency0, setCurrency0] = useState<Currency | null>(native);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

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
    <>
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
              onClick={() => {
                setShowSearch(true);
                setActiveField(Fields.TOKEN0);
              }}
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
              onClick={() => {
                setShowSearch(true);
                setActiveField(Fields.TOKEN1);
              }}
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
                    <VStack>
                      <Box w='full'>
                        <NextLink href={`/dex/remove/v2/${currencyId(currency0)}/${currencyId(currency1)}`}>
                          <SecondaryButton w='full' size='md'>
                            Remove
                          </SecondaryButton>
                        </NextLink>
                      </Box>
                      <Box w='full'>
                        <NextLink href={`/dex/add/v2/${currencyId(currency0)}/${currencyId(currency1)}`}>
                          <PrimaryButton w='full' size='md'>
                            Add
                          </PrimaryButton>
                        </NextLink>
                      </Box>
                    </VStack>
                  </>
                ) : (
                  <Card padding="45px 10px">
                    <VStack gap="sm" justify="center">
                      <Text textAlign="center">You don’t have liquidity in this pair yet.</Text>
                      <NextLink href={`/dex/add/v2/${currencyId(currency0)}/${currencyId(currency1)}`}>
                        <Button variant='link' width='full'>
                          Add Liquidity
                        </Button>
                      </NextLink>
                    </VStack>
                  </Card>
                )
              ) : validPairNoLiquidity ? (
                <Card padding="45px 10px">
                  <Stack gap="sm" justify="center">
                    <Text textAlign="center">No pair found.</Text>
                    <NextLink href={`/dex/add/v2/${currencyId(currency0)}/${currencyId(currency1)}`}>
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
      {showSearch && (
        <CurrencySearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onCurrencySelect={handleCurrencySelect}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        />
      )}
    </>
  )
}
