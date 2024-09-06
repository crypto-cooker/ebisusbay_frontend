import React, {useCallback, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {useConfig} from 'wagmi'

import {SmartRouterTrade} from '@pancakeswap/smart-router'
import {TradeType} from '@pancakeswap/swap-sdk-core'
import {watchAccount} from '@wagmi/core'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Tooltip,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {ChevronDownIcon, WarningIcon} from "@chakra-ui/icons";
import {TradeEssentialForPriceBreakdown} from "@eb-pancakeswap-web/views/Swap/V3Swap/utils/exchange";
import {DEFAULT_PAYMASTER_TOKEN, paymasterInfo, SupportedPaymasterChain} from '@src/config/paymaster'
import {CurrencyLogo} from "@dex/components/logo";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
import {useGasTokenByChain} from "@eb-pancakeswap-web/hooks/use-gas-token";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import GasTokenSelectorDialog from "@dex/swap/components/tabs/swap/paymaster/gas-token-selector-dialog";

// Selector Styles
const GasTokenSelectButton = styled(Button).attrs({ variant: 'text', scale: 'xs' })`
  padding: 18px 0 18px 6px;
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

  const { chainId } = useActiveChainId()
  const supportedChainId = chainId as SupportedPaymasterChain;
  const supportedPaymasterInfo = paymasterInfo[supportedChainId] ?? {}

  const config = useConfig()

  const [gasToken, setGasToken] = useGasTokenByChain(supportedChainId);
  const gasTokenInfo = gasToken?.isToken ? supportedPaymasterInfo[gasToken.wrapped.address] : undefined;

  // Input Token Address from Swap
  const inputCurrency = useMemo(() => trade && trade.inputAmount.currency, [trade])

  const onSelectorButtonClick = useCallback(() => {
    onOpen()
  }, [])

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

  const gasTokenBadge = gasTokenInfo?.discount &&
    (gasTokenInfo.discount === 'FREE'
      ? 'Gas fees is fully sponsored'
      : `${gasTokenInfo.discount} discount on this gas fee token`)

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
                <VStack fontWeight='normal' fontSize='md' align='start'>
                  <Text fontWeight='bold'>
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
            <ChevronDownIcon marginLeft={1} />
          </Flex>
        </GasTokenSelectButton>
      </Flex>

      {showSameTokenWarning && (
        <Alert status='warning' mb={1}>
          <AlertIcon />
          <AlertDescription fontSize='sm'>
            Please ensure you leave enough tokens for gas fees when selecting the same token for gas as the input token
          </AlertDescription>
        </Alert>
      )}

      <GasTokenSelectorDialog
        isOpen={isOpen}
        onClose={onClose}
        chainId={chainId}
      />
    </>
  )
}
