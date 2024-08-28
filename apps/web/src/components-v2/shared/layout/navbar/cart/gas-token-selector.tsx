import React, {useCallback, useEffect} from 'react'
import styled from 'styled-components'
import {useConfig} from 'wagmi'
import {watchAccount} from '@wagmi/core'
import {Badge, Box, Button, Flex, HStack, Text, Tooltip, useDisclosure, VStack} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {DEFAULT_PAYMASTER_TOKEN, paymasterInfo, SupportedPaymasterChain} from '@src/config/paymaster'
import {CurrencyLogo} from "@dex/components/logo";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
import {useGasTokenByChain} from "@eb-pancakeswap-web/hooks/use-gas-token";
import GasTokenSelectorDialog from "@dex/swap/components/tabs/swap/paymaster/gas-token-selector-dialog";

// Selector Styles
const GasTokenSelectButton = styled(Button).attrs({ variant: 'text', scale: 'xs' })`
  padding: 18px 0 18px 6px;
`

interface GasTokenSelectorProps {
  chainId: SupportedPaymasterChain
}

export const GasTokenSelector = ({chainId}: GasTokenSelectorProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const supportedChainId = chainId as SupportedPaymasterChain;
  const supportedPaymasterInfo = paymasterInfo[supportedChainId] ?? {}

  const config = useConfig()

  const [gasToken, setGasToken] = useGasTokenByChain(supportedChainId);
  const gasTokenInfo = gasToken?.isToken ? supportedPaymasterInfo[gasToken.wrapped.address] : undefined;

  const onSelectorButtonClick = useCallback(() => {
    onOpen()
  }, [])

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
                ️ ⛽️ {gasTokenInfo.discount}
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

      <GasTokenSelectorDialog
        isOpen={isOpen}
        onClose={onClose}
        chainId={chainId}
      />
    </>
  )
}
