import { useMemo } from 'react'
import { Trade, TradeType, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import truncateHash from '@pancakeswap/utils/truncateHash'
import {Field} from "@eb-pancakeswap-web/state/swap/actions";
import {basisPointsToPercent, computeTradePriceBreakdown, warningSeverity} from "@eb-pancakeswap-web/utils/exchange";
import {Button, Center, Flex, SimpleGrid, Text, VStack, Wrap} from "@chakra-ui/react";
import {ArrowDownIcon, WarningIcon} from "@chakra-ui/icons";
import formatAmountDisplay from "@dex/swap/utils/formatAmountDisplay";
import {CurrencyLogo} from "@dex/farms/components/shared/logo";
import {SwapShowAcceptChanges, TruncatedText} from "@dex/swap/components/tabs/swap/styleds";
import {formatAmount} from "@pancakeswap/utils/formatFractions";
import {DEX_COLORS} from "@dex/swap/constants/style";

export default function SwapModalHeader({
  trade,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  allowedSlippage,
}: {
  trade: Trade<Currency, Currency, TradeType>
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  isEnoughInputBalance: boolean
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  allowedSlippage: number
}) {
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const inputTextColor =
    showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT && isEnoughInputBalance
      ? 'primary'
      : trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance
      ? 'failure'
      : 'text'

  const amount =
    trade.tradeType === TradeType.EXACT_INPUT
      ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(8)
      : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(8)
  const symbol =
    trade.tradeType === TradeType.EXACT_INPUT ? trade.outputAmount.currency.symbol : trade.inputAmount.currency.symbol

  const tradeInfoText = useMemo(() => {
    if (!amount) return null
    return trade.tradeType === TradeType.EXACT_INPUT
      ? `Output is estimated. You will receive at least ${amount} ${symbol} or the transaction will revert.`
      : `Input is estimated. You will sell at most ${amount} ${symbol} or the transaction will revert.`
  }, [trade.tradeType, amount, symbol])

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = `Output will be sent to ${truncatedRecipient}`

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <SimpleGrid gap="md">
      <Flex justify='space-between' align='center'>
        <TruncatedText fontSize='xl' fontWeight='bold' color={inputTextColor}>
          {formatAmount(trade.inputAmount, 6)}
        </TruncatedText>
        <Wrap gap={0} align='center'>
          <Text fontSize='sm' ms={4} me={2}>
            {trade.inputAmount.currency.symbol}
          </Text>
          <CurrencyLogo currency={trade.inputAmount.currency ?? trade.inputAmount.currency} size="24px" />
        </Wrap>
      </Flex>
      <Center>
        <ArrowDownIcon boxSize={6} />
      </Center>
      <Flex justify='space-between' align='center'>
        <TruncatedText
          fontSize='xl'
          fontWeight='bold'
          color={
            priceImpactSeverity > 2
              ? DEX_COLORS.failure
              : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? DEX_COLORS.primary
                : 'text'
          }
        >
          {formatAmountDisplay(trade.outputAmount)}
        </TruncatedText>
        <Wrap gap={0} align='center'>
          <Text fontSize='sm' ms={4} me={2}>
            {trade.outputAmount.currency.symbol}
          </Text>
          <CurrencyLogo currency={trade.outputAmount.currency ?? trade.outputAmount.currency} size="24px" />
        </Wrap>
      </Flex>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <Flex>
            <Wrap>
              <WarningIcon mr="8px" />
              <Text fontWeight='bold'>Price Updated</Text>
            </Wrap>
            <Button onClick={onAcceptChanges}>Accept</Button>
          </Flex>
        </SwapShowAcceptChanges>
      ) : null}
      <VStack align="start" spacing='sm' mt={6}>
        <Wrap style={{ width: '100%' }} justify='space-between'>
          <Text fontSize='xs' fontWeight='bold' textTransform='uppercase'>
            Slippage Tolerance
          </Text>
          <Text fontWeight='bold' color="primary" textAlign="end">
            {typeof allowedSlippage === 'number'
              ? `${basisPointsToPercent(allowedSlippage).toFixed(2)}%`
              : allowedSlippage}
          </Text>
        </Wrap>
        {trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance && (
          <Text fontSize='xs' color={DEX_COLORS.failure} textAlign="start" style={{ width: '100%' }}>
            Insufficient input token balance. Your transaction may fail.
          </Text>
        )}
        <Text fontSize='xs' className='text-muted' textAlign="left" style={{ maxWidth: '320px' }}>
          {tradeInfoText}
        </Text>
      </VStack>
      {recipient ? (
        <Flex justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            {recipientSentToText}
            <b title={recipient}>{truncatedRecipient}</b>
            {postSentToText}
          </Text>
        </Flex>
      ) : null}
    </SimpleGrid>
  )
}
