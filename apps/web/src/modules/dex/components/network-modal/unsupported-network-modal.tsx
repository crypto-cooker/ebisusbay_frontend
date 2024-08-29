import Image from 'next/image'
import {useRouter} from 'next/router'
import {useAccount} from 'wagmi'
import React, {useMemo} from 'react'
import {ChainId} from '@pancakeswap/chains'
import {useSwitchNetwork, useSwitchNetworkLocal} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useLocalNetworkChain} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {
  Box,
  Button,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import {useUser, useUserTheme} from "@src/components-v2/useUser";
import {viemClients} from "@eb-pancakeswap-web/utils/viem";
import {DEFAULT_CHAIN_ID} from "@src/config/chains";
import ImageService from "@src/core/services/image";

// Where chain is not supported or page not supported
export function UnsupportedNetworkModal({ pageSupportedChains }: { pageSupportedChains: number[] }) {
  const theme = useUserTheme()
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const switchNetworkLocal = useSwitchNetworkLocal()
  const chainId = useLocalNetworkChain() || ChainId.CRONOS
  const { isConnected } = useAccount()
  const { disconnect: logout } = useUser()
  // const { pathname } = useRouter()

  // const supportedMainnetChains = useMemo(
  //   () =>
  //     Object.values(viemClients)
  //       .map((client) => client.chain)
  //       .filter((chain) => chain && !chain.testnet && pageSupportedChains?.includes(chain.id)),
  //   [pageSupportedChains],
  // )

  const supportedChains = useMemo(
    () =>
      Object.values(viemClients)
        .map((client) => client.chain)
        .filter((chain) => chain && pageSupportedChains?.includes(chain.id)),
    [pageSupportedChains],
  )

  return (
    <ModalContent>

      <ModalHeader>
        <Flex justify='space-between' w='full'>
          <Box>Check your network</Box>
          <ModalCloseButton color={theme.colors.textColor4} />
        </Flex>
      </ModalHeader>
      <ModalBody>
        <VStack spacing={4} pb={4}>
          <Text>
            Currently this page only supported in{' '}
            {supportedChains?.map((c) => c?.name).join(', ')}
          </Text>
          <Box>
            <Image
              layout="fixed"
              width={175}
              height={175}
              src={ImageService.translate('/img/check-your-network.webp').convert()}
              alt="check your network"
            />
          </Box>
          <Text>
            Please switch your network to continue
          </Text>
          {canSwitch ? (
            <Button
              w='full'
              isLoading={isLoading}
              onClick={() => {
                if (supportedChains.map((c) => c?.id).includes(chainId)) {
                  switchNetworkAsync(chainId)
                } else {
                  switchNetworkAsync(DEFAULT_CHAIN_ID)
                }
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isConnected ? (
                'Switch network in wallet'
              ) : (
                'Switch network'
              )}
            </Button>
          ) : (
            <Text>
              Unable to switch network. Please try it on your wallet
            </Text>
          )}
          {isConnected && (
            <Button
              variant="secondary"
              onClick={() => {
                logout()
                switchNetworkLocal(ChainId.CRONOS)
              }}
            >
              Disconnect Wallet
            </Button>
          )}
        </VStack>
      </ModalBody>
    </ModalContent>
  )
}
