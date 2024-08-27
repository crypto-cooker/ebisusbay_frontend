import {Badge, Box, Flex, HStack, Image, Spinner, Text, Tooltip, useColorModeValue, VStack} from "@chakra-ui/react";
import {QuestionHelper} from "@dex/swap/components/tabs/swap/question-helper";
import {Virtuoso} from "react-virtuoso";
import React, {useCallback, useEffect, useMemo} from "react";
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import {DEFAULT_PAYMASTER_TOKEN, paymasterInfo, paymasterTokens, SupportedPaymasterChain} from "@src/config/paymaster";
import {CurrencyLogo} from "@dex/components/logo";
import {formatAmount} from "@pancakeswap/utils/formatFractions";
import {ArrowRightIcon} from "@chakra-ui/icons";
import {Currency} from "@pancakeswap/swap-sdk-core";
import {useGasTokenByChain} from "@eb-pancakeswap-web/hooks/use-gas-token";
import {useNativeBalances, useTokenBalancesWithLoadingIndicator} from "@eb-pancakeswap-web/state/wallet/hooks";
import useAccountActiveChain from "@eb-pancakeswap-web/hooks/useAccountActiveChain";
import {useAccount, useConfig} from "wagmi";
import {watchAccount} from "@wagmi/core";
import memoize from "lodash/memoize";
import {Address} from "viem";
import styled from "styled-components";
import {ChainId} from "@pancakeswap/chains";

const FixedHeightRow = styled.div<{ $disabled: boolean }>`
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

interface GasTokenSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: ChainId;
}

export default function GasTokenSelectorDialog({isOpen, onClose, chainId}: GasTokenSelectorDialogProps) {
  const {
    DialogComponent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogCloseButton
  } = useResponsiveDialog();

  const { address: account} = useAccount();
  const supportedChainId = chainId as SupportedPaymasterChain;
  const supportedPaymasterInfo = paymasterInfo[supportedChainId] ?? {}
  const supportedPaymasterTokens = paymasterTokens[supportedChainId] ?? [];

  const config = useConfig()

  const [_, setGasToken] = useGasTokenByChain(supportedChainId);

  const nativeBalances = useNativeBalances([account])

  const [balances, balancesLoading] = useTokenBalancesWithLoadingIndicator(
    account,
    supportedPaymasterTokens.filter((token) => token.isToken) as any[],
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

  const Row = (index: number, currency: any, style: any) => {
    const hoverBackground = useColorModeValue('gray.100', '#424242');

    const item = currency

    // Extra info for the token
    const itemInfo = supportedPaymasterInfo[item.isToken ? item.wrapped.address : '']

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
          px={6}
          py={2}
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
      <DialogBody px={0}>
        <Virtuoso
          style={{ height: 450 }}
          data={supportedPaymasterTokens.toSorted(tokenListSortComparator)}
          itemContent={Row}
          totalCount={supportedPaymasterTokens.length}
        />
      </DialogBody>
      <DialogFooter>
        <Flex justify='center' align='center' w='full' fontWeight='bold'>
          <Box as='span'>Powered by Zyfi Paymaster</Box>
          <Image
            src={`https://assets.pancakeswap.finance/web/paymasters/zyfi-logo.png`}
            alt="Zyfi Logo"
            width={18}
            height={18}
            style={{ marginLeft: '5px' }}
          />
        </Flex>
      </DialogFooter>
    </DialogComponent>
  )
}