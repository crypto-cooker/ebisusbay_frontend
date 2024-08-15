import {ChainId} from '@pancakeswap/chains'
import {useRouter} from 'next/router'
import React, {useMemo} from 'react'
import {useSwitchNetwork, useSwitchNetworkLocal} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import useActiveWeb3React from "@eb-pancakeswap-web/hooks/useActiveWeb3React";
import {chains} from "@src/wagmi";
import {Alert, AlertIcon, Box, Button, Flex, Grid, ModalBody, ModalContent, ModalHeader, Text} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";

export function PageNetworkSupportModal() {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const switchNetworkLocal = useSwitchNetworkLocal()
  const { chainId, isConnected, isWrongNetwork } = useActiveWeb3React()
  const { disconnect: logout } = useUser();

  const foundChain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])

  const { pathname, push } = useRouter()

  return (
    <ModalContent>
      <ModalHeader>
        <Flex justify='space-between' w='full'>
          <Box>Check your network</Box>
          {/*<ModalCloseButton color={theme.colors.textColor4} />*/}
        </Flex>
      </ModalHeader>
      <ModalBody>
        <Grid style={{ gap: '16px' }} maxWidth="360px">
          <Text fontWeight='bold'>It’s a Cronos only feature</Text>

          {/*{image && (*/}
          {/*  <Box mx="auto" my="8px" position="relative" width="100%" minHeight="250px">*/}
          {/*    <Image src={image} alt="feature" fill style={{ objectFit: 'contain' }} unoptimized />*/}
          {/*  </Box>*/}
          {/*)}*/}
          {canSwitch ? (
            <Button
              isLoading={isLoading}
              onClick={() => (isWrongNetwork ? switchNetworkLocal(ChainId.CRONOS) : switchNetworkAsync(ChainId.CRONOS))}
            >
              Switch to Cronos Chain
            </Button>
          ) : (
            <Alert status='error'>
              <AlertIcon />
              Unable to switch network. Please try it on your wallet
            </Alert>
          )}
          {isConnected && (
            <Button
              variant="secondary"
              onClick={() => {
                logout()
                push('/')
              }}
            >
              Disconnect Wallet
            </Button>
          )}
        </Grid>
      </ModalBody>
    </ModalContent>
  )
}
