import {Card} from "@src/components-v2/foundation/card";
import {
  Alert,
  AlertIcon,
  Button,
  Box,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
  VStack,
  Center
} from "@chakra-ui/react";
import NextLink from "next/link";
import {AddIcon, ArrowBackIcon, ChevronDownIcon} from "@chakra-ui/icons";
import React, {useCallback, useEffect, useMemo, useState} from "react";
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
import {CurrencySearchModal} from "@dex/components/search-modal";
import {MinimalPositionCard} from '@dex/liquidity/components/position-card';
import { PrimaryButton, SecondaryButton } from '@src/components-v2/foundation/button';
import CurrencyInputPanel from "@dex/components/currency-input-panel";
import {Field} from "@eb-pancakeswap-web/state/mint/actions";
import {useAddLiquidityV2FormState} from "@eb-pancakeswap-web/state/mint/reducer";
import {useDerivedMintInfo, useMintActionHandlers} from "@eb-pancakeswap-web/state/mint/hooks";
import {useRouter} from "next/router";
import {useCurrency} from "@eb-pancakeswap-web/hooks/tokens";
import useAccountActiveChain from "@eb-pancakeswap-web/hooks/useAccountActiveChain";
import { maxAmountSpend } from '@eb-pancakeswap-web/utils/maxAmountSpend'
import { CommonBasesType } from '@dex/components/search-modal/types'
import {CurrencyAmount, NATIVE, Token, WNATIVE} from "@pancakeswap/sdk";
import { safeGetAddress } from "@dex/swap/imported/pancakeswap/web/utils";
import { PoolPriceBar } from "./pool-price-bar";
import { ApprovalState, useApproveCallback } from '@eb-pancakeswap-web/hooks/useApproveCallback'
import {V2_ROUTER_ADDRESS} from "@dex/swap/constants/exchange";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {pluralize} from "@market/helpers/utils";
import MintBox from "@src/components-v2/feature/drop/types/dutch/mint-box";
import RefundBox from "@src/components-v2/feature/drop/types/dutch/refund-box";
import { useIsExpertMode } from '@pancakeswap/utils/user/expertMode';
import {useRouterContract} from "@eb-pancakeswap-web/utils/exchange";
import { useWalletClient } from 'wagmi'
import {useTransactionDeadline} from "@eb-pancakeswap-web/hooks/useTransactionDeadline";
import { useUserSlippage } from '@pancakeswap/utils/user';
import {calculateSlippageAmount} from '@eb-pancakeswap-web/utils/exchange';
import {isUserRejected, logError} from '@eb-pancakeswap-web/utils/sentry';
import {transactionErrorToUserReadableMessage} from '@src/helpers/validator';
import { calculateGasMargin } from '@eb-pancakeswap-web/utils';
import {useGasPrice} from "wagmi";
import {CommitButton} from "@dex/swap/components/tabs/swap/commit-button";

interface AddLiquidityProps {
  currencyIdA?: string
  currencyIdB?: string
}

export default function AddLiquidity({currencyIdA, currencyIdB}: AddLiquidityProps) {
  const router = useRouter();
  const { account, chainId } = useAccountActiveChain();
  const { data: walletClient } = useWalletClient()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const expertMode = useIsExpertMode();

  const gasPrice = useGasPrice();

  // mint state
  const { independentField, typedValue, otherTypedValue } = useAddLiquidityV2FormState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
    isOneWeiAttack,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const isValid = !error && !addError
  const errorText = error ?? addError

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, noLiquidity, otherTypedValue, parsedAmounts, typedValue],
  )

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const [deadline] = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippage() // custom from users

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      }
      // prevent wnative + native
      const isNATIVEOrWNATIVENew =
        currencyNew?.isNative || (chainId !== undefined && currencyIdNew === WNATIVE[chainId]?.address)
      const isNATIVEOrWNATIVEOther =
        currencyIdOther !== undefined &&
        ((chainId && currencyIdOther === NATIVE[chainId]?.symbol) ||
          (chainId !== undefined && safeGetAddress(currencyIdOther) === WNATIVE[chainId]?.address))

      if (isNATIVEOrWNATIVENew && isNATIVEOrWNATIVEOther) {
        return [currencyIdNew, undefined]
      }

      return [currencyIdNew, currencyIdOther]
    },
    [chainId],
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      const newPathname = router.pathname//.replace('/v2', '').replace('/stable', '')
      if (idB === undefined) {
        router.replace(
          {
            pathname: newPathname,
            query: {
              ...router.query,
              currency: [idA!],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: newPathname,
            query: {
              ...router.query,
              currency: [idA!, idB!],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdB, router],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      const newPathname = router.pathname//.replace('/v2', '').replace('/stable', '')
      if (idA === undefined) {
        router.replace(
          {
            pathname: newPathname,
            query: {
              ...router.query,
              currency: [idB!],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: newPathname,
            query: {
              ...router.query,
              currency: [idA!, idB!],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdA, router],
  )

  const {
    approvalState: approvalA,
    approveCallback: approveACallback,
    revokeCallback: revokeACallback,
    currentAllowance: currentAllowanceA,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_A], chainId ? V2_ROUTER_ADDRESS[chainId] : undefined)
  const {
    approvalState: approvalB,
    approveCallback: approveBCallback,
    revokeCallback: revokeBCallback,
    currentAllowance: currentAllowanceB,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_B], chainId && V2_ROUTER_ADDRESS[chainId])

  const buttonDisabled = !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED

  const showFieldAApproval = approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING
  const showFieldBApproval = approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  const routerContract = useRouterContract()

  async function onAdd() {
    if (!chainId || !account || !routerContract || !walletClient) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    // eslint-disable-next-line
    let estimate: any
    // eslint-disable-next-line
    let method: any
    // eslint-disable-next-line
    let args: Array<string | string[] | number | bigint>
    let value: bigint | null
    if (currencyA?.isNative || currencyB?.isNative) {
      const tokenBIsNative = currencyB?.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.write.addLiquidityETH
      args = [
        (tokenBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsNative ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline,
      ]
      value = (tokenBIsNative ? parsedAmountB : parsedAmountA).quotient
      console.log('debugline1--addLiquidityETH');
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.write.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline,
      ]
      value = null
      console.log('debugline1--addLiquidity');
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    console.log('debugline1--contract', routerContract)
    console.log('debugline1--args', args)
    console.log('debugline1--value', value
      ? { value, account: routerContract.account, chain: routerContract.chain }
      : { account: routerContract.account, chain: routerContract.chain })
    await estimate(
      args,
      value
        ? { value, account: routerContract.account, chain: routerContract.chain }
        : { account: routerContract.account, chain: routerContract.chain },
    )
      .then((estimatedGasLimit: any) => {
        console.log('debugline2', method)
        return method(args, {
          ...(value ? {value} : {}),
          // gas: calculateGasMargin(estimatedGasLimit),
          // gasPrice,
        }).then((response: Hash) => {
          console.log('debugline3')
          setLiquidityState({attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response})

          const symbolA = currencies[Field.CURRENCY_A]?.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const symbolB = currencies[Field.CURRENCY_B]?.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
          // addTransaction(
          //   {hash: response},
          //   {
          //     summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
          //     translatableSummary: {
          //       text: 'Add %amountA% %symbolA% and %amountB% %symbolB%',
          //       data: {amountA, symbolA, amountB, symbolB},
          //     },
          //     type: 'add-liquidity',
          //   },
          // )

          if (pair) {
            addPair(pair)
          }
        })
      } )
      ?.catch((err: any) => {
        console.log('debugline-e', err)
        if (err && !isUserRejected(err)) {
          logError(err)
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && !isUserRejected(err)
              ? `Add liquidity failed: ${transactionErrorToUserReadableMessage(err)}`
              : undefined,
          txHash: undefined,
        })
      })
  }

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
            <Box>Add Liquidity</Box>
          </HStack>
        </Heading>
        <Box>
          <VStack w='full' align='stretch' spacing={4}>
            <Alert status='info'>
              <AlertIcon />
              <Box fontSize='sm'>
                <strong>Tip:</strong> When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
              </Box>
            </Alert>

            <CurrencyInputPanel
              currency={currencies[Field.CURRENCY_A]}
              value={formattedAmounts[Field.CURRENCY_A]}
              onCurrencySelect={handleCurrencyASelect}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '');
              }}
              showMaxButton
              id="add-liquidity-input-tokena"
              showCommonBases={true}
            />
            <Box className='text-muted' mx='auto'>
              <AddIcon />
            </Box>

            <CurrencyInputPanel
              currency={currencies[Field.CURRENCY_B]}
              value={formattedAmounts[Field.CURRENCY_B]}
              onCurrencySelect={handleCurrencyBSelect}
              onUserInput={onFieldBInput}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '');
              }}
              showMaxButton
              id="add-liquidity-input-tokenb"
              showCommonBases={true}
            />

            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                <Card bodyPadding="0px" borderRadius={'20px'}>
                  <Box padding="1rem">
                    <Text fontWeight={500} fontSize={14}>
                      {noLiquidity ? 'Initial prices' : 'Prices'} and pool share
                    </Text>
                  </Box>{' '}
                  <Card padding="1rem" borderRadius={'20px'}>
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={poolTokenPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </Card>
                </Card>
              </>
            )}

            <AuthenticationGuard>
              {({isConnected, connect}) => (
                <>
                  {isConnected ? (
                    <VStack align='stretch'>
                      {(approvalA === ApprovalState.NOT_APPROVED ||
                          approvalA === ApprovalState.PENDING ||
                          approvalB === ApprovalState.NOT_APPROVED ||
                          approvalB === ApprovalState.PENDING) &&
                        isValid && (
                          <Stack direction={{base: 'column', sm: 'row'}} align='stretch'>
                            {approvalA !== ApprovalState.APPROVED && (
                              <PrimaryButton
                                onClick={approveACallback}
                                isDisabled={approvalA === ApprovalState.PENDING}
                                w='full'
                                loadingText={`Approving ${currencies[Field.CURRENCY_A]?.symbol}`}
                                isLoading={approvalA === ApprovalState.PENDING}
                              >
                                Approve {currencies[Field.CURRENCY_A]?.symbol}
                              </PrimaryButton>
                            )}
                            {approvalB !== ApprovalState.APPROVED && (
                              <PrimaryButton
                                onClick={approveBCallback}
                                isDisabled={approvalB === ApprovalState.PENDING}
                                w='full'
                                loadingText={`Approving ${currencies[Field.CURRENCY_B]?.symbol}`}
                                isLoading={approvalB === ApprovalState.PENDING}
                              >
                                Approve {currencies[Field.CURRENCY_B]?.symbol}
                              </PrimaryButton>
                            )}
                          </Stack>
                        )}
                      {/*<PrimaryButton*/}
                      {/*  onClick={() => {*/}
                      {/*    expertMode ? onAdd() : setShowConfirm(true);*/}
                      {/*  }}*/}
                      {/*  isDisabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}*/}
                      {/*  isError={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}*/}
                      {/*>*/}
                      {/*  <Text fontSize={20} fontWeight={500}>*/}
                      {/*    {error ?? 'Supply'}*/}
                      {/*  </Text>*/}
                      {/*</PrimaryButton>*/}
                      {/*<PrimaryButton*/}
                      {/*  onClick={() => {*/}
                      {/*    expertMode ? onAdd() : setShowConfirm(true);*/}
                      {/*  }}*/}
                      {/*>*/}
                      {/*  <Text fontSize={20} fontWeight={500}>*/}
                      {/*    Supply*/}
                      {/*  </Text>*/}
                      {/*</PrimaryButton>*/}
                      <CommitButton
                        variant={buttonDisabled ? 'danger' : 'primary'}
                        onClick={() => {
                          // eslint-disable-next-line no-unused-expressions
                          expertMode ? onAdd() : onPresentAddLiquidityModal()
                        }}
                        isDisabled={buttonDisabled}
                      >
                        {errorText || t('Add')}
                      </CommitButton>
                    </VStack>
                  ) : (
                    <PrimaryButton onClick={connect}>Connect Wallet</PrimaryButton>
                  )}
                </>
              )}
            </AuthenticationGuard>
          </VStack>
        </Box>
      </Card>
    </>
  )
}
