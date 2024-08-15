import { Currency, CurrencyAmount, Fraction, Percent, Token } from '@pancakeswap/sdk'
import {Field} from "@eb-pancakeswap-web/state/mint/actions";
import {Box, Flex, HStack, Text, Tooltip, VStack} from "@chakra-ui/react";
import {Card} from "@src/components-v2/foundation/card";
import {DoubleCurrencyLogo} from "@dex/components/logo";
import {getLPSymbol} from "@eb-pancakeswap-web/utils/getLpSymbol";

interface AddLiquidityModalHeaderProps {
  currencies: { [field in Field]?: Currency }
  poolTokenPercentage?: Percent
  liquidityMinted?: CurrencyAmount<Token>
  price?: Fraction | null
  allowedSlippage: number
  // children: React.ReactNode
  noLiquidity?: boolean
}

export const AddLiquidityModalHeader = ({
  currencies,
  poolTokenPercentage,
  liquidityMinted,
  price,
  allowedSlippage,
  noLiquidity,
  // children,
}: AddLiquidityModalHeaderProps) => {
  const slippagePct = allowedSlippage / 100;

  return (
    <VStack spacing={6} align='stretch'>
      <VStack spacing={2} align='stretch'>
        <Text fontSize='sm' fontWeight='semibold'>You will receive</Text>
        <Card>
          <Flex justify='space-between'>
            <HStack gap="4px">
              <DoubleCurrencyLogo
                currency0={currencies[Field.CURRENCY_A]}
                currency1={currencies[Field.CURRENCY_B]}
                size={24}
              />
              <Text color="textSubtle">
                {currencies[Field.CURRENCY_A]?.symbol &&
                  currencies[Field.CURRENCY_B]?.symbol &&
                  getLPSymbol(
                    currencies[Field.CURRENCY_A]?.symbol,
                    currencies[Field.CURRENCY_B]?.symbol,
                    currencies[Field.CURRENCY_A]?.chainId,
                  )}
              </Text>
            </HStack>
            <Text ml="8px">{liquidityMinted?.toSignificant(6)}</Text>
          </Flex>
        </Card>
      </VStack>
      <Flex justify='space-between'>
        <Text fontSize='sm' fontWeight='semibold'>Your share in the pair</Text>
        <Text>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
      </Flex>
      {!!price && (
        <Box>
          <Flex justify='space-between'>
            <Text fontSize='sm' fontWeight='semibold'>Rates</Text>
            <Text>
              {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
                currencies[Field.CURRENCY_B]?.symbol
              }`}
            </Text>
          </Flex>
          <Flex justify='flex-end'>
            <Text>
              {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert()?.toSignificant(4)} ${
                currencies[Field.CURRENCY_A]?.symbol
              }`}
            </Text>
          </Flex>
        </Box>
      )}
      {!noLiquidity && (
        <Flex justify='space-between'>
          <Text fontSize='sm' fontWeight='semibold'>Slippage Tolerance</Text>
          <Tooltip label={`Output is estimated. If the price changes by more than ${slippagePct}% your transaction will revert.`} aria-label='Slippage info'>
            <>{slippagePct}%</>
          </Tooltip>
        </Flex>
      )}
    </VStack>
  )
}