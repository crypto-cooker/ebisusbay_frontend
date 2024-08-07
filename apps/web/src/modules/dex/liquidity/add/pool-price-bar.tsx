import { Currency, Percent, Price } from '@pancakeswap/sdk';
import React, { useContext } from 'react';
import { Text, Wrap, Flex, VStack } from '@chakra-ui/react';
import {Field} from "@eb-pancakeswap-web/state/mint/actions";
import {ONE_BIPS} from "@dex/swap/constants/exchange";

export function PoolPriceBar({
 currencies,
 noLiquidity,
 poolTokenPercentage,
 price,
}: {
  currencies: { [field in Field]?: Currency };
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  price?: Price;
}) {
  return (
    <Wrap gap="md" w='full' justify='center' align='stretch'>
      <VStack justify="center" flex={1}>
        <Text>{price?.toSignificant(6) ?? '-'}</Text>
        <Text fontWeight={500} fontSize={14} pt={1}>
          {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
        </Text>
      </VStack>
      <VStack justify="center" flex={1}>
        <Text>{price?.invert()?.toSignificant(6) ?? '-'}</Text>
        <Text fontWeight={500} fontSize={14} pt={1}>
          {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
        </Text>
      </VStack>
      <VStack justify="center" flex={1}>
        <Text>
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </Text>
        <Text fontWeight={500} fontSize={14} pt={1}>
          Share of Pool
        </Text>
      </VStack>
    </Wrap>
  );
}
