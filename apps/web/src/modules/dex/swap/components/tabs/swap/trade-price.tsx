import { Currency, Price } from '@pancakeswap/swap-sdk-core';
import { formatPrice } from '@pancakeswap/utils/formatFractions';
import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Flex, Icon, IconButton } from '@chakra-ui/react';
import { faArrowRightArrowLeft, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useChainId } from 'wagmi';
import { useExchangeRate } from '@market/hooks/useGlobalPrices';
import { Field } from '@dex/swap/constants';
import { useTokenDataQuery } from '@src/components-v2/feature/info/hooks/useTokenDataQuery';
import DecimalAbbreviatedNumber from '@src/components-v2/shared/decimal-abbreviated-number';

interface TradePriceProps {
  price?: Price<Currency, Currency>;
  loading?: boolean;
}

export function TradePrice({ price, loading }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const chainId = useChainId();

  const formattedPrice = showInverted ? formatPrice(price, 6) : formatPrice(price?.invert(), 6);
  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  const usdPrice = useTokenDataQuery(
    (showInverted
      ? (price?.baseCurrency.wrapped.address ?? '')
      : (price?.quoteCurrency.wrapped.address ?? '')
    ).toLowerCase(),
  )?.priceUSD;

  return (
    <Flex align="center" fontSize="sm" style={{ opacity: loading ? 0.6 : 1 }}>
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
          <Icon
            as={FontAwesomeIcon}
            icon={faArrowRightArrowLeft}
            width="14px"
            height="14px"
            color="textSubtle"
            ml="4px"
            mr="4px"
          />
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
          <Box fontWeight="bold" fontSize="sm" ml={4}>
            <DecimalAbbreviatedNumber value={usdPrice ?? 0} leftText='$' />
          </Box>
          {loading ? (
            <Box>loading...</Box>
          ) : (
            <IconButton
              role="button"
              icon={<Icon as={FontAwesomeIcon} icon={faRefresh} boxSize={3} />}
              onClick={() => setShowInverted(!showInverted)}
              aria-label="Refresh price"
              variant="unstyled"
            />
          )}
        </>
      ) : (
        '-'
      )}
    </Flex>
  );
}
