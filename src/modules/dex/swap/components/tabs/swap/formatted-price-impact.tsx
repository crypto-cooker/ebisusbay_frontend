import { Percent } from '@pancakeswap/sdk'
import {warningSeverity} from "@eb-pancakeswap-web/utils/exchange";
import {ONE_BIPS} from "@dex/swap/constants/exchange";
import styled from "styled-components";
import {Text, useTheme} from "@chakra-ui/react";

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
  severity === 3 || severity === 4
    ? theme.colors.failure
    : severity === 2
      ? theme.colors.warning
      : severity === 1
        ? theme.colors.text
        : theme.colors.success};
`

const colors = {
  0: 'auto',
  1: 'auto',
  2: 'auto',
  3: 'yellow.400',
  4: 'red.500',
}

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  const theme = useTheme();

  return (
    <Text fontSize='sm' fontWeight='bold' color={colors[warningSeverity(priceImpact)]}>
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </Text>
  )
}
