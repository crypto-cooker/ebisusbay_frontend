import {ChainId} from '@pancakeswap/chains'
import {Chain} from 'viem'
import {useAccount} from 'wagmi'
import * as allChains from 'viem/chains'
import React, {useCallback} from 'react'
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useSessionChainId} from "@eb-pancakeswap-web/hooks/useSessionChainId";
import {useUser, useUserTheme} from "@src/components-v2/useUser";
import {ChainLogo} from "@dex/components/logo";
import {ArrowForwardIcon} from "@chakra-ui/icons";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";

const getChain = (chainId: number | undefined) => {
  const chain = chainId ? Object.values(allChains).find((c) => c.id === chainId) : undefined

  return chain?.name || ''
}

// Where page network is not equal to wallet network
export function WrongNetworkModal({ currentChain, onDismiss }: { currentChain: Chain; onDismiss: () => void }) {
  const theme = useUserTheme()
  const { disconnect: logout } = useUser();
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { isConnected, chain, chainId: walletChainId } = useAccount()
  const [, setSessionChainId] = useSessionChainId()
  const chainId = currentChain.id || ChainId.CRONOS

  const switchText = `Switch to ${currentChain.name}`;

  const handleSwitchNetwork = useCallback(() => {
    if (canSwitch) {
      switchNetworkAsync(chainId)
    }
  }, [canSwitch, chainId, switchNetworkAsync])

  const handleLogout = useCallback(() => {
    logout()
    setSessionChainId(chainId)
  }, [chainId, logout, setSessionChainId])

  return (
    <ModalContent>
      <ModalHeader>
        <Flex justify='space-between' w='full'>
          <Box>You are in the wrong network</Box>
          {/*<ModalCloseButton color={theme.colors.textColor4} />*/}
        </Flex>
      </ModalHeader>
      <ModalBody>
        <VStack align='stretch' spacing={4} pb={4}>
          <Text>This page is located for {currentChain.name}</Text>
          <Text>You are under {chain?.name ?? getChain(walletChainId) ?? ''} now, please switch the network to continue.
          </Text>
          {/*<div style={{ textAlign: 'center' }}>*/}
          {/*  <Image width={184} height={140} src="/images/decorations/3d-pan-bunny.png" alt="check your network" />*/}
          {/*</div>*/}
          <Alert status='warning' >
            <HStack align='center'>
              {chain?.id && <ChainLogo chainId={chain?.id}/>} <ArrowForwardIcon color="#D67E0A"/>
              <ChainLogo chainId={chainId}/>
              <span>Switch network to continue.</span>
            </HStack>
          </Alert>
          {canSwitch ? (
            <PrimaryButton isLoading={isLoading} onClick={handleSwitchNetwork}>
              {isLoading ? <Spinner /> : switchText}
            </PrimaryButton>
          ) : (
            <Alert status='error'>
              <AlertIcon />
              Unable to switch network. Please try it on your wallet
            </Alert>
          )}
          {isConnected && (
            <SecondaryButton onClick={handleLogout}>
              Disconnect Wallet
            </SecondaryButton>
          )}
        </VStack>
      </ModalBody>
    </ModalContent>
  )
}
