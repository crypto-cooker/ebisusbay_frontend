import { ReactNode } from 'react';
import { Currency, Trade, TradeType } from '@pancakeswap/sdk';
import { useUserSlippage } from '@pancakeswap/utils/user';
import { Field } from '@eb-pancakeswap-web/state/swap/actions';
import { QuestionHelper } from '@dex/swap/components/tabs/swap/question-helper';
import { Box, Flex, HStack, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '@eb-pancakeswap-web/utils/exchange';
import FormattedPriceImpact from '@dex/swap/components/tabs/swap/formatted-price-impact';
import SwapRoute from '@dex/swap/components/tabs/swap/swap-details/swap-route';
import { LP_HOLDERS_FEE, TOTAL_FEE, TREASURY_FEE } from '@dex/swap/constants';
import { usePaymaster } from '@eb-pancakeswap-web/hooks/usePaymaster';
import { GasTokenSelector } from '@dex/swap/components/tabs/swap/paymaster/gas-token-selector';
import { useChainId } from 'wagmi';
import { useExchangeRate } from '@market/hooks/useGlobalPrices';

function TradeSummary({
  trade,
  allowedSlippage,
  gasTokenSelector,
}: {
  trade: Trade<Currency, Currency, TradeType>;
  allowedSlippage: number;
  gasTokenSelector: ReactNode;
}) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage);

  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`;
  const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`;
  const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(2)}%`;

  const chainId = useChainId();

  const { usdValueForToken } = useExchangeRate(chainId);

  const currencyUSDAmounts = {
    [Field.INPUT]: usdValueForToken(
      Number(slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)),
      trade.inputAmount.currency.wrapped.address,
    ),
    [Field.OUTPUT]: usdValueForToken(
      Number(slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)),
      trade.outputAmount.currency.wrapped.address,
    ),
  };
  return (
    <Box>
      {gasTokenSelector}
      <Flex justify="space-between">
        <HStack>
          <Text fontWeight="bold" fontSize="sm">
            {isExactIn ? 'Minimum received' : 'Maximum sold'}
          </Text>
          <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
        </HStack>
        <Box>
          <Text fontWeight="bold" fontSize="sm">
            {isExactIn
              ? (`${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-')
              : (`${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                '-')}
          </Text>
        </Box>
      </Flex>
      <Flex justify="space-between">
        <HStack>
          <Text fontWeight="bold" fontSize="sm">
            {'Price in USD'}
          </Text>
          <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
        </HStack>
        <Box>
          <Text fontWeight="bold" fontSize="sm">
            {isExactIn
              ? (`$${currencyUSDAmounts[Field.OUTPUT]}` ?? '-')
              : (`$${currencyUSDAmounts[Field.INPUT]}` ?? '-')}
          </Text>
        </Box>
      </Flex>
      <Flex justify="space-between">
        <HStack>
          <Text fontWeight="bold" fontSize="sm">
            Price Impact
          </Text>
          <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
        </HStack>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </Flex>

      <Flex justify="space-between">
        <HStack>
          <Text fontWeight="bold" fontSize="sm">
            Trading Fee
          </Text>
          <QuestionHelper
            text={
              <>
                <Text mb="12px">For each trade a {totalFeePercent} fee is paid</Text>
                <UnorderedList>
                  <ListItem>{lpHoldersFeePercent} to LP token holders</ListItem>
                  <ListItem>{treasuryFeePercent} to the Treasury</ListItem>
                </UnorderedList>
              </>
            }
          />
        </HStack>
        <Text fontWeight="bold" fontSize="sm">
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </Text>
      </Flex>
    </Box>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade<Currency, Currency, TradeType>;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippage();
  const { isPaymasterAvailable } = usePaymaster();

  const showRoute = Boolean(trade && trade.route.path.length > 1);

  return (
    <Box>
      {trade && (
        <>
          <TradeSummary
            trade={trade}
            allowedSlippage={allowedSlippage}
            gasTokenSelector={isPaymasterAvailable && <GasTokenSelector trade={trade} />}
          />
          {showRoute && (
            <>
              <Flex justify="space-between">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="sm" fontWeight="bold">
                    Route
                  </Text>
                  <QuestionHelper
                    text="Routing through these tokens resulted in the best price for your trade."
                    ml="4px"
                    placement="top"
                  />
                </span>
                <SwapRoute trade={trade} />
              </Flex>
            </>
          )}
        </>
      )}
    </Box>
  );
}
