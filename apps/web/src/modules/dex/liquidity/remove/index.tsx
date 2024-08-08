import {
  Alert,
  AlertIcon,
  Box, Button,
  Flex,
  Heading,
  HStack, Icon,
  IconButton, Link, Slider,
  SliderFilledTrack, SliderThumb, SliderTrack, Stack,
  Text, useDisclosure,
  VStack, Wrap
} from "@chakra-ui/react";
import NextLink from "next/link";
import {AddIcon, ArrowBackIcon, ArrowDownIcon} from "@chakra-ui/icons";
import React, {useCallback, useMemo, useState} from "react";
import { Card } from "@src/components-v2/foundation/card";
import {Currency, Percent, WNATIVE} from "@pancakeswap/sdk";
import {useBurnActionHandlers, useDerivedBurnInfo} from "@eb-pancakeswap-web/state/burn/hooks";
import {Field} from "@eb-pancakeswap-web/state/burn/actions";
import {useTransactionDeadline} from "@eb-pancakeswap-web/hooks/useTransactionDeadline";
import {useUserSlippage} from "@pancakeswap/utils/user";
import {useRemoveLiquidityV2FormState} from "@eb-pancakeswap-web/state/burn/reducer";
import {ApprovalState, useApproveCallback} from "@eb-pancakeswap-web/hooks/useApproveCallback";
import {formattedCurrencyAmount} from "@dex/components/formatted-currency-amount";
import useActiveWeb3React from "@eb-pancakeswap-web/hooks/useActiveWeb3React";
import { V2_ROUTER_ADDRESS } from "@dex/swap/constants/exchange";
import useDebouncedChangeHandler from "@eb-pancakeswap-web/hooks/useDebouncedChangeHandler";
import {CurrencyLogo} from "@dex/components/logo";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import Settings from "@dex/components/swap/settings";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {CommitButton} from "@dex/swap/components/tabs/swap/commit-button";
import {useUser} from "@src/components-v2/useUser";

interface RemoveLiquidityProps {
  currencyA?: Currency;
  currencyB?: Currency;
  currencyIdA: string;
  currencyIdB: string;
}

export default function RemoveLiquidity({ currencyA, currencyB, currencyIdA, currencyIdB }: RemoveLiquidityProps) {
  const native = useNativeCurrency()
  const {connect} = useUser();
  const { account, chainId, isWrongNetwork } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])
  const { isOpen: isOpenSettings, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();
  const { isOpen: isOpenConfirmRemove, onOpen: onOpenConfirmRemove, onClose: onCloseConfirmRemove } = useDisclosure();

  //  burn state
  const { independentField, typedValue } = useRemoveLiquidityV2FormState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const [deadline] = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippage()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
        ? '<1'
        : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY
        ? typedValue
        : formattedCurrencyAmount({ currencyAmount: parsedAmounts[Field.LIQUIDITY] }),
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : formattedCurrencyAmount({ currencyAmount: parsedAmounts[Field.CURRENCY_A] }),
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : formattedCurrencyAmount({ currencyAmount: parsedAmounts[Field.CURRENCY_B] }),
  }

  // pair contract
  // const pairContractRead = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const { approvalState, approveCallback } = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    chainId ? V2_ROUTER_ADDRESS[chainId] : undefined,
  )

  const assetA = currencyA?.symbol ?? '';
  const assetB = currencyB?.symbol ?? '';

  async function onAttemptToApprove() {
    if (!pairContractRead || !pair || !signTypedDataAsync || !deadline || !account)
      throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    return approveCallback()
  }

  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const oneCurrencyIsNative = currencyA?.isNative || currencyB?.isNative
  const oneCurrencyIsWNative = Boolean(
    chainId &&
    ((currencyA && WNATIVE[chainId]?.equals(currencyA)) || (currencyB && WNATIVE[chainId]?.equals(currencyB))),
  )

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  const handleChangePercent = useCallback(
    (value: any) => setInnerLiquidityPercentage(Math.ceil(value)),
    [setInnerLiquidityPercentage],
  )

  return (
    <>
      <Card>
        <Heading size='md' mb={2}>
          <HStack>
            <NextLink href='/dex/liquidity'>
              <IconButton
                aria-label='Back'
                icon={<ArrowBackIcon />}
                variant='unstyled'
              />
            </NextLink>
            <VStack align='start'>
              <Box>Remove {assetA}-{assetB} Liquidity</Box>
              <Box fontSize='sm' className='text-muted'>To receive {assetA} and {assetB}</Box>
            </VStack>
          </HStack>
        </Heading>
        <Box>
          <VStack align='stretch'>
            <Alert status='info'>
              <AlertIcon />
              <Box fontSize='sm'>
                <strong>Tip:</strong> Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.
              </Box>
            </Alert>
            <Card>
              <Flex justify='space-between'>
                <Text fontWeight='semibold'>Amount</Text>
              </Flex>
              <Text fontSize={40} fontWeight='bold'>
                {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
              </Text>
              <Slider
                aria-label='amount-slider'
                min={0}
                max={100}
                value={innerLiquidityPercentage}
                onChange={handleChangePercent}
                mb={4}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Wrap justify='center'>
                <Button onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}>25%</Button>
                <Button onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}>50%</Button>
                <Button onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}>75%</Button>
                <Button onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}>MAX</Button>
              </Wrap>
            </Card>
          </VStack>
          {!showDetailed && (
            <>
              <Box className='text-muted' textAlign='center' my={4}>
                <ArrowDownIcon boxSize={6} />
              </Box>
              <VStack align='stretch'>
                <Text fontSize='sm' fontWeight='semibold'>Receive</Text>
                <Card>
                  <VStack align='stretch' spacing={1}>
                    <Flex justify='space-between'>
                      <HStack>
                        <CurrencyLogo currency={currencyA} size='24px' />
                        <Text fontSize='sm' color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                          {currencyA?.symbol}
                        </Text>
                      </HStack>
                      <Flex align='center'>
                        <Text fontSize='sm' fontWeight='bold'>
                          {formattedAmounts[Field.CURRENCY_A] || '0'}
                        </Text>
                        <Text fontSize='sm' ml="4px">
                          (50%)
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex justify='space-between'>
                      <HStack>
                        <CurrencyLogo currency={currencyB} size='24px' />
                        <Text fontSize='sm' color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                          {currencyB?.symbol}
                        </Text>
                      </HStack>
                      <Flex align='center'>
                        <Text fontWeight='bold' fontSize='sm'>
                          {formattedAmounts[Field.CURRENCY_B] || '0'}
                        </Text>
                        <Text fontSize='sm' ml="4px">
                          (50%)
                        </Text>
                      </Flex>
                    </Flex>

                    {chainId && (oneCurrencyIsWNative || oneCurrencyIsNative) ? (
                      <Flex justify='end'>
                        {oneCurrencyIsNative ? (
                          <Link
                            as={NextLink}
                            href={`/dex/v2/remove/${currencyA?.isNative ? WNATIVE[chainId]?.address : currencyIdA}/${
                              currencyB?.isNative ? WNATIVE[chainId]?.address : currencyIdB
                            }`}
                            className='color'
                            color='auto'
                            fontWeight='semibold'
                          >
                            Receive {WNATIVE[chainId]?.symbol}
                          </Link>
                        ) : oneCurrencyIsWNative ? (
                            <Link
                              as={NextLink}
                              href={`/dex/v2/remove/${
                                currencyA && currencyA.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdA
                              }/${currencyB && currencyB.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdB}`}
                              className='color'
                              color='auto'
                              fontWeight='semibold'
                            >
                              Receive {native?.symbol}
                            </Link>
                        ) : null}
                      </Flex>
                    ) : null}
                  </VStack>
                </Card>

                <Flex align='center' justify='space-between' fontSize='sm' fontWeight='bold'>
                  <HStack align='center'>
                    <Text>Slippage Tolerance</Text>
                    <IconButton
                      variant='unstyled'
                      onClick={onOpenSettings}
                      aria-label="Swap slippage button"
                      icon={<Icon as={FontAwesomeIcon} icon={faPencil} boxSize={3} />}
                    />
                  </HStack>
                  <Text fontWeight='bold' color="primary">
                    {allowedSlippage / 100}%
                  </Text>
                </Flex>
              </VStack>
            </>
          )}


          {pair && (
            <VStack align='stretch' mt={4}>
              <Text fontSize='sm' fontWeight='semibold'>
                Prices
              </Text>
              <Card>
                <VStack align='stretch'>
                  <Flex justifyContent="space-between">
                    <Text fontSize='sm' color="textSubtle">
                      1 {currencyA?.symbol} =
                    </Text>
                    <Text fontSize='sm'>
                      {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text fontSize='sm' color="textSubtle">
                      1 {currencyB?.symbol} =
                    </Text>
                    <Text fontSize='sm'>
                      {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                    </Text>
                  </Flex>
                </VStack>
              </Card>
            </VStack>
          )}
        </Box>

        {!account ? (
          <PrimaryButton onClick={connect}>Connect Wallet</PrimaryButton>
        ) : isWrongNetwork ? (
          <CommitButton width="100%" />
        ) : (
          <Stack direction={{base: 'column', sm: 'row'}} align='stretch' mt={4}>
            <Button
              variant={approvalState === ApprovalState.APPROVED || signatureData !== null ? 'success' : 'primary'}
              onClick={onAttemptToApprove}
              disabled={approvalState !== ApprovalState.NOT_APPROVED || signatureData !== null}
              width="100%"
              mr="0.5rem"
              isLoading={approvalState === ApprovalState.PENDING}
              loadingText='Enabling'
            >
              {approvalState === ApprovalState.APPROVED || signatureData !== null ? (
                'Enabled'
              ) : (
                'Enable'
              )}
            </Button>
            <Button
              variant={
                !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                  ? 'danger'
                  : 'primary'
              }
              onClick={() => {
                setLiquidityState({
                  attemptingTxn: false,
                  liquidityErrorMessage: undefined,
                  txHash: undefined,
                })
                onOpenConfirmRemove()
              }}
              width="100%"
              disabled={!isValid || (signatureData === null && approvalState !== ApprovalState.APPROVED)}
            >
              {error || 'Remove'}
            </Button>
          </Stack>
        )}
      </Card>

      {/*{pair ? (*/}
      {/*  <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>*/}
      {/*    <MinimalPositionCard showUnwrapped={oneCurrencyIsWNative} pair={pair} />*/}
      {/*  </AutoColumn>*/}
      {/*) : null}*/}

      <Settings
        isOpen={isOpenSettings}
        onClose={onCloseSettings}
      />
      {/*<ConfirmRemoveLiquidityModal*/}
      {/*  title={t('You will receive')}*/}
      {/*  customOnDismiss={handleDismissConfirmation}*/}
      {/*  attemptingTxn={attemptingTxn}*/}
      {/*  hash={txHash || ''}*/}
      {/*  allowedSlippage={allowedSlippage}*/}
      {/*  onRemove={onRemove}*/}
      {/*  pendingText={pendingText}*/}
      {/*  approval={approvalState}*/}
      {/*  signatureData={signatureData}*/}
      {/*  tokenA={tokenA}*/}
      {/*  tokenB={tokenB}*/}
      {/*  liquidityErrorMessage={liquidityErrorMessage}*/}
      {/*  parsedAmounts={parsedAmounts}*/}
      {/*  currencyA={currencyA}*/}
      {/*  currencyB={currencyB}*/}
      {/*/>*/}
    </>
  )
}