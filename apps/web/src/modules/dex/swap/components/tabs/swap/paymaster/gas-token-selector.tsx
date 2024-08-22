import {formatAmount} from '@pancakeswap/utils/formatFractions'
import memoize from 'lodash/memoize'
import React, {useCallback, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {Address} from 'viem'
import {useAccount, useConfig} from 'wagmi'

import {SmartRouterTrade} from '@pancakeswap/smart-router'
import {Currency, TradeType} from '@pancakeswap/swap-sdk-core'
import {watchAccount} from '@wagmi/core'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {ArrowRightIcon, ChevronDownIcon, WarningIcon} from "@chakra-ui/icons";
import {TradeEssentialForPriceBreakdown} from "@eb-pancakeswap-web/views/Swap/V3Swap/utils/exchange";
import {useNativeBalances, useTokenBalancesWithLoadingIndicator} from "@eb-pancakeswap-web/state/wallet/hooks";
import {DEFAULT_PAYMASTER_TOKEN, paymasterInfo, paymasterTokens, SupportedPaymasterChain} from '@src/config/paymaster'
import {CurrencyLogo} from "@dex/components/logo";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
import {useGasTokenByChain} from "@eb-pancakeswap-web/hooks/use-gas-token";
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import {Virtuoso} from "react-virtuoso";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";

// Selector Styles
const GasTokenSelectButton = styled(Button).attrs({ variant: 'text', scale: 'xs' })`
  padding: 18px 0 18px 6px;
`

// Modal Styles
const FixedHeightRow = styled.div<{ $disabled: boolean }>`
  height: 56px;
  display: flex;
  align-items: center;

  cursor: ${({ $disabled }) => !$disabled && 'pointer'};

  &:hover {
    background-color: ${({ theme, $disabled }) => !$disabled && theme.colors.background};
  }

  ${({ $disabled }) =>
  $disabled &&
  `
    opacity: 0.5;
    user-select: none;
`}
`

const StyledBalanceText = styled(Text).attrs({ small: true })`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SameTokenWarningBox = styled(Box)`
  font-size: 13px;
  background-color: #ffb2371a;
  padding: 10px;
  margin: 5px 0 8px;
  color: ${({ theme }) => theme.colors.yellow};
  border: 1px solid ${({ theme }) => theme.colors.yellow};
  border-radius: ${({ theme }) => theme.radii['12px']};
`

const StyledWarningIcon = styled(WarningIcon)`
  fill: ${({ theme }) => theme.colors.yellow};
`

type Trade = TradeEssentialForPriceBreakdown &
  Pick<SmartRouterTrade<TradeType>, 'tradeType'> & {
  routes: RouteDisplayEssentials[]
}

interface GasTokenSelectorProps {
  trade?: Trade | null
}

export const GasTokenSelector = ({ trade }: GasTokenSelectorProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    DialogComponent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogCloseButton
  } = useResponsiveDialog();
  const { address: account } = useAccount()

  const { chainId } = useActiveChainId()
  const supportedChainId = chainId as SupportedPaymasterChain;
  const supportedPaymasterInfo = paymasterInfo[supportedChainId] ?? {}
  const supportedPaymasterTokens = paymasterTokens[supportedChainId] ?? [];

  const config = useConfig()

  const [gasToken, setGasToken] = useGasTokenByChain(supportedChainId);
  const gasTokenInfo = supportedPaymasterInfo[gasToken.isToken ? gasToken?.wrapped.address : '']

  const nativeBalances = useNativeBalances([account])

  const [balances, balancesLoading] = useTokenBalancesWithLoadingIndicator(
    account,
    supportedPaymasterTokens.filter((token) => token.isToken) as any[],
  )

  // Input Token Address from Swap
  const inputCurrency = useMemo(() => trade && trade.inputAmount.currency, [trade])

  const showSameTokenWarning = useMemo(
    () =>
      gasTokenInfo?.discount !== 'FREE' &&
      inputCurrency?.wrapped.address &&
      // Check if input token is native ETH to avoid conflicts when WETH is selected as gas token
      !inputCurrency.isNative &&
      gasToken.isToken &&
      inputCurrency.wrapped.address === gasToken.wrapped.address,
    [inputCurrency, gasToken, gasTokenInfo],
  )

  // Reset fee token if account changes, connects or disconnects
  useEffect(() => {
    return watchAccount(config, {
      onChange() {
        setGasToken(DEFAULT_PAYMASTER_TOKEN[supportedChainId])
      },
    })
  }, [config, setGasToken])

  const getTokenBalance = memoize((address: Address) => balances[address])

  const onSelectorButtonClick = useCallback(() => {
    onOpen()
  }, [])

  const onTokenSelected = useCallback(
    (token: Currency) => {
      setGasToken(token)
      onClose()
    },
    [setGasToken],
  )

  /**
   * Sort tokens based on balances
   * Keeps the Native Token in the first position
   */
  const tokenListSortComparator = (tokenA: Currency, tokenB: Currency) => {
    if (tokenA.isNative || tokenB.isNative) return 1

    const balanceA = getTokenBalance(tokenA.wrapped.address)
    const balanceB = getTokenBalance(tokenB.wrapped.address)

    if (!balanceA || !balanceB) return 0

    if (balanceA.greaterThan(balanceB)) return -1
    if (balanceA.lessThan(balanceB)) return 1

    return 0
  }

  // Item Key for FixedSizeList
  const itemKey = useCallback((index: number, data: any) => `${data[index]}-${index}`, [])

  const gasTokenBadge = gasTokenInfo?.discount &&
    (gasTokenInfo.discount === 'FREE'
      ? 'Gas fees is fully sponsored'
      : `${gasTokenInfo.discount} discount on this gas fee token`)

  const Row = (index: number, currency: any, style: any) => {
    const hoverBackground = useColorModeValue('gray.100', '#424242');

    const item = currency

    // Extra info for the token
    const itemInfo = paymasterInfo[item.isToken ? item.wrapped.address : '']

    const disabled = false
    // const disabled = useMemo(
    //   () =>
    //     account && itemInfo?.discount !== 'FREE'
    //       ? Boolean(item.isToken) &&
    //       (!getTokenBalance(item.wrapped.address) || formatAmount(getTokenBalance(item.wrapped.address)) === '0')
    //       : false,
    //   [item, itemInfo],
    // )

    const badgeLabel = itemInfo?.discount &&
      (itemInfo.discount === 'FREE'
        ? 'Gas fees is fully sponsored'
        : `${itemInfo.discount} discount on this gas fee token`)

    return (
      <FixedHeightRow style={style} onClick={() => !disabled && onTokenSelected(item)} $disabled={disabled}>
        <Flex
          justify='space-between'
          width='full'
          _hover={{
            bg: hoverBackground
          }}
        >
          <HStack alignItems="center">
            <CurrencyLogo currency={item} useTrustWalletUrl={false} />
            <VStack align='start' spacing={0}>
              <HStack fontWeight='bold'>
                <Text>{item.symbol}</Text>
                {itemInfo && itemInfo.discount && (
                  <Tooltip label={badgeLabel} aria-label='Token gas info'>
                    <Badge variant='solid' colorScheme='green'>
                      ⛽️ {itemInfo.discount}
                    </Badge>
                  </Tooltip>
                )}
              </HStack>
              <Text className='text-muted' fontSize='sm'>
                {item.name}
              </Text>
            </VStack>
          </HStack>

          {balancesLoading ? (
            <Spinner />
          ) : (account && nativeBalances[account]) || getTokenBalance(item.wrapped.address) ? (
            <StyledBalanceText>
              {
                item.isNative && account
                  ? formatAmount(nativeBalances[account])
                  : formatAmount(getTokenBalance(item.wrapped.address))
              }
            </StyledBalanceText>
          ) : (
            <ArrowRightIcon />
          )}
        </Flex>
      </FixedHeightRow>
    )
  }

  return (
    <>
      <Flex justify='space-between'>
        <HStack>
          <Text fontWeight='bold' fontSize='sm'>
            Gas Token
          </Text>
          <QuestionHelper
            text={
              <>
                <VStack fontWeight='normal' fontSize='md'>
                  <Text>
                    Gas Token
                  </Text>
                  <Text>
                    Select a token to pay gas fees.
                  </Text>
                  <Text>
                    Please refer to the transaction confirmation on your wallet for the final gas fee.
                  </Text>
                </VStack>
              </>
            }
            ml="4px"
            placement="top"
          />

          {gasTokenInfo && gasTokenInfo.discount && (
            <Tooltip label={gasTokenBadge} aria-label='Token gas info'>
              <Badge variant='solid' colorScheme='green'>
                ️ ⛽️ {gasTokenInfo.discountLabel ?? gasTokenInfo.discount}
              </Badge>
            </Tooltip>
          )}
        </HStack>

        <GasTokenSelectButton
          selected={!!gasToken}
          onClick={onSelectorButtonClick}
          data-dd-action-name="Zyfi Gas Token Select Button"
        >
          <Flex alignItems="center">
            <div style={{ position: 'relative' }}>
              <CurrencyLogo currency={gasToken} useTrustWalletUrl={false} size="20px" />
              <p style={{ position: 'absolute', bottom: '-2px', right: '-6px', fontSize: '14px' }}>⛽️</p>
            </div>

            <Text marginLeft={2} fontSize={14} fontWeight='bold'>
              {(gasToken && gasToken.symbol && gasToken.symbol.length > 10
                ? `${gasToken.symbol.slice(0, 4)}...${gasToken.symbol.slice(
                  gasToken.symbol.length - 5,
                  gasToken.symbol.length,
                )}`
                : gasToken?.symbol) || ''}
            </Text>
            <ChevronDownIcon marginLeft={1} />
          </Flex>
        </GasTokenSelectButton>
      </Flex>

      {showSameTokenWarning && (
        <SameTokenWarningBox>
          <Flex>
            <StyledWarningIcon marginRight={2} />
            <span>
              Please ensure you leave enough tokens for gas fees when selecting the same token for gas as the input token
            </span>
          </Flex>
        </SameTokenWarningBox>
      )}

      <DialogComponent onClose={onClose} isOpen={isOpen}>
        <DialogHeader>
          <Flex justify='space-between' w='full'>
            <Flex align='center'>
              <span>Select token for gas</span>
              <QuestionHelper
                text={
                  <>
                    <VStack fontWeight='normal' fontSize='md'>
                      <Text>
                        Select any ERC20 token to pay for the gas fee.
                      </Text>
                      <Text>
                        Pay for network fees with any asset from the list below.
                      </Text>
                      <Text>
                        Make sure you have at least $1 worth of the token.
                      </Text>
                    </VStack>
                  </>
                }
                ml="6px"
                mt="1px"
                placement="top"
              />
            </Flex>
          </Flex>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Virtuoso
            style={{ height: 450 }}
            data={supportedPaymasterTokens.toSorted(tokenListSortComparator)}
            itemContent={Row}
            totalCount={supportedPaymasterTokens.length}
          />
        </DialogBody>
        <DialogFooter>
          <Flex justify='center' align='center' w='full' fontWeight='bold'>
            <span>Powered by Zyfi Paymaster</span>
            <img
              src={`https://assets.pancakeswap.finance/web/paymasters/zyfi-logo.png`}
              alt="Zyfi Logo"
              width={18}
              height={18}
              style={{ marginLeft: '5px' }}
            />
          </Flex>
        </DialogFooter>
      </DialogComponent>
    </>
  )
}
