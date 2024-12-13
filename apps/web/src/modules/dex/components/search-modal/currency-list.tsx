import {Box, Flex, HStack, Spinner, Text, useColorModeValue, VStack} from "@chakra-ui/react";
import React, {CSSProperties, RefObject, useCallback, useMemo} from "react";
import {Currency, CurrencyAmount, Token} from "@pancakeswap/sdk";
import {CurrencyLogo} from "@dex/components/logo";
import {ArrowForwardIcon} from "@chakra-ui/icons";
import {formatAmount} from "@pancakeswap/utils/formatFractions";
import {useCurrencyBalance} from "@eb-pancakeswap-web/state/wallet/hooks";
import {useAccount} from "wagmi";
import {useCombinedActiveList} from "@eb-pancakeswap-web/state/lists/hooks";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
// import { FixedSizeList } from 'react-window'
import {isTokenOnList} from '@eb-pancakeswap-web/utils'
import {useIsUserAddedToken} from '@eb-pancakeswap-web/hooks/tokens'
import {Virtuoso, VirtuosoHandle} from "react-virtuoso";
import {wrappedCurrency} from '@eb-pancakeswap-web/utils/wrappedCurrency'
import ImportRow from "@dex/components/search-modal/import-row";

function currencyKey(currency: Currency): string {
  return currency?.isToken ? currency.address : currency?.isNative ? currency.symbol : ''
}

export default function CurrencyList({
  height,
  currencies,
  inactiveCurrencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showNative,
  showImportView,
  setImportToken,
  breakIndex,
}: {
  height: number | string
  currencies: Currency[]
  inactiveCurrencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: RefObject<VirtuosoHandle>
  showNative: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
  breakIndex: number | undefined
}) {
  const native = useNativeCurrency()

  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showNative
      ? [native, ...currencies, ...inactiveCurrencies]
      : [...currencies, ...inactiveCurrencies]
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }
    return formatted
  }, [breakIndex, currencies, inactiveCurrencies, showNative, native])

  const { chainId } = useActiveChainId()

  const Row = useCallback((index: number, currency: any, style: any) => {
      // const currency: any = data[index]

      const isSelected = Boolean(selectedCurrency && currency && selectedCurrency.equals(currency))
      const otherSelected = Boolean(otherCurrency && currency && otherCurrency.equals(currency))

      const handleSelect = () => onCurrencySelect(currency)
      const token = wrappedCurrency(currency, chainId)
      const showImport = index > currencies.length

      if (index === breakIndex || !currency) {
        return (
          <Flex style={style}>
            <Box bgColor='grey.400' padding="8px 12px" borderRadius="8px">
              <HStack>
                <Text fontSize='xs'>Expanded results from inactive Token Lists</Text>
                <QuestionHelper
                  text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists."
                  ml="4px"
                />
              </HStack>
            </Box>
          </Flex>
        )
      }

      if (showImport && token) {
        return (
          <ImportRow
            onCurrencySelect={handleSelect}
            style={style}
            token={token}
            showImportView={showImportView}
            setImportToken={setImportToken}
            dim
          />
        )
      }
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [
      selectedCurrency,
      otherCurrency,
      chainId,
      currencies.length,
      breakIndex,
      onCurrencySelect,
      showImportView,
      setImportToken,
    ],
  )

  const itemKey = useCallback((index: number, data: any) => `${currencyKey(data[index])}-${index}`, [])

  return (
    <Box px={6}>
      <Virtuoso
        ref={fixedListRef}
        style={{ height: height }}
        data={itemData}
        itemContent={Row}
        totalCount={itemData.length}
      />
    </Box>
  )
}

function CurrencyRow({
   currency,
   onSelect,
   isSelected,
   otherSelected,
   style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { address: account } = useAccount()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)

  const balance = useCurrencyBalance(account ?? undefined, currency)

  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const hoverColor = useColorModeValue('black', 'white');

  // only show add or remove buttons if not on selected list
  return (
    <Flex
      justify='space-between'
      px={4}
      pe={0}
      py={2}
      cursor='pointer'
      _hover={{
        bg: hoverBackground
      }}
      onClick={onSelect}
    >
      <HStack>
        <CurrencyLogo currency={currency} size="24px" />
        <VStack align='start' spacing={0}>
          <Text fontWeight='bold'>{currency?.symbol}</Text>
          <Text className='text-muted' fontSize='sm' maxWidth="200px">
            {!isOnSelectedList && customAdded && `${'Added by user'} •`} {currency?.name}
          </Text>
        </VStack>
      </HStack>
      <Flex justify='end' me={1}>
        {balance ? <Balance balance={balance} /> : account ? <Spinner size='xs' /> : <ArrowForwardIcon />}
      </Flex>
    </Flex>
  )
}

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return <Text title={balance.toExact()}>{formatAmount(balance, 4)}</Text>
}