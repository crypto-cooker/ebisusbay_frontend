import { Trade, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import {Field} from "@eb-pancakeswap-web/state/swap/actions";
import {computeTradePriceBreakdown, warningSeverity} from "@eb-pancakeswap-web/utils/exchange";
import {Badge, Box, Button, Flex, HStack, Text, Tooltip, VStack} from "@chakra-ui/react";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
import FormattedPriceImpact from "@dex/swap/components/tabs/swap/formatted-price-impact";
import {TradePrice} from "@dex/swap/components/tabs/swap/trade-price";
import {SwapCallbackError} from "@dex/swap/components/tabs/swap/swap-callback-error";
import {Card} from "@src/components-v2/foundation/card";
import {useGasTokenByChain} from "@eb-pancakeswap-web/hooks/use-gas-token";
import {usePaymaster} from "@eb-pancakeswap-web/hooks/usePaymaster";
import {paymasterInfo, SupportedPaymasterChain} from "@src/config/paymaster";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {CurrencyLogo} from "@dex/components/logo";
import {ChevronDownIcon} from "@chakra-ui/icons";

export default function SwapModalFooter({
  trade,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade<Currency, Currency, TradeType>
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  isEnoughInputBalance: boolean
  onConfirm: () => void
  swapErrorMessage?: string | undefined
  disabledConfirm: boolean
}) {
  const { chainId } = useActiveChainId()
  const supportedChainId = chainId as SupportedPaymasterChain;
  const supportedPaymasterInfo = paymasterInfo[supportedChainId] ?? {}

  const [gasToken] = useGasTokenByChain(supportedChainId)
  const { isPaymasterAvailable, isPaymasterTokenActive } = usePaymaster()
  const gasTokenInfo = supportedPaymasterInfo[gasToken.isToken ? gasToken?.wrapped.address : '']

  const gasTokenBadge = gasTokenInfo?.discount &&
    (gasTokenInfo.discount === 'FREE'
      ? 'Gas fees is fully sponsored'
      : `${gasTokenInfo.discount} discount on this gas fee token`)

  const {
    priceImpactWithoutFee,
    // realizedLPFee
  } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  // const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`
  // const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`
  // const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`
  // const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`

  return (
    <>
      <Card mt={8}>
        <Flex justify='space-between' alignItems="center">
          <Text fontSize='sm'>Price</Text>
          <TradePrice price={trade?.executionPrice} />
        </Flex>

        <Flex justify='space-between'>
          <HStack>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </Text>
            <QuestionHelper
              text='Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
              ml="4px"
              placement="top"
            />
          </HStack>
          <HStack>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="14px" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </HStack>
        </Flex>
        <Flex justify='space-between'>
          <HStack>
            <Text fontSize="14px">Price Impact</Text>
            <QuestionHelper
              text='The difference between the market price and your price due to trade size.'
              ml="4px"
              placement="top"
            />
          </HStack>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </Flex>
        {isPaymasterAvailable && isPaymasterTokenActive && (
          <Flex justify='space-between'>
            <HStack>
              <Text fontSize="14px">Gas token</Text>
              {gasTokenInfo && gasTokenInfo.discount && (
                <Tooltip label={gasTokenBadge} aria-label='Token gas info'>
                  <Badge variant='solid' colorScheme='green'>
                    ️ ⛽️ {gasTokenInfo.discountLabel ?? gasTokenInfo.discount}
                  </Badge>
                </Tooltip>
              )}
            </HStack>
            <Flex alignItems="center">
              <Box position='relative'>
                <CurrencyLogo currency={gasToken} useTrustWalletUrl={false} size="20px" />
                <Box position='absolute' bottom='-2px' right='-6px' fontSize='sm'>⛽️</Box>
              </Box>

              <Text marginLeft={2} fontSize={14} fontWeight='bold'>
                {(gasToken && gasToken.symbol && gasToken.symbol.length > 10
                  ? `${gasToken.symbol.slice(0, 4)}...${gasToken.symbol.slice(
                    gasToken.symbol.length - 5,
                    gasToken.symbol.length,
                  )}`
                  : gasToken?.symbol) || ''}
              </Text>
            </Flex>
          </Flex>
        )}
        {/* <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Liquidity Provider Fee')}</Text>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">{t('For each trade a %amount% fee is paid', { amount: totalFeePercent })}</Text>
                  <Text>- {t('%amount% to LP token holders', { amount: lpHoldersFeePercent })}</Text>
                  <Text>- {t('%amount% to the Treasury', { amount: treasuryFeePercent })}</Text>
                  <Text>- {t('%amount% towards CAKE buyback and burn', { amount: buyBackFeePercent })}</Text>
                </>
              }
              ml="4px"
            />
          </RowFixed>
          <Text fontSize="14px">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(8)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween> */}
      </Card>

      <VStack>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 || (trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance)
            ? 'Swap Anyway'
            : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </VStack>
    </>
  )
}
