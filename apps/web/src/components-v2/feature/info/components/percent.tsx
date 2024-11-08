import { Text, TextProps } from '@chakra-ui/react'
import { useUserTheme } from '@src/components-v2/useUser'

export interface PercentProps extends TextProps {
  value: number | undefined
}

const Percent: React.FC<React.PropsWithChildren<PercentProps>> = ({ value, ...rest }) => {
  if (!value || Number.isNaN(value)) {
    return <Text {...rest}>-</Text>
  }
  const theme = useUserTheme()

  const isNegative = value < 0

  return (
    <Text {...rest} color={isNegative ? theme.colors.failure : theme.colors.success}>
      {isNegative ? '↓' : '↑'}
      {Math.abs(value).toFixed(2)}%
    </Text>
  )
}

export default Percent
