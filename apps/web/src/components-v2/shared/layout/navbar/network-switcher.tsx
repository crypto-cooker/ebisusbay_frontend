import {ChainId} from '@pancakeswap/chains'
import {NATIVE} from '@pancakeswap/sdk'
import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import React, {useEffect, useMemo} from 'react'
import {useAccount} from 'wagmi'
import {useActiveChainId, useLocalNetworkChain} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {chains} from "@src/wagmi";
import {ArrowDownIcon, InfoIcon} from "@chakra-ui/icons";
import {useUserShowTestnet} from "@eb-pancakeswap-web/state/user/hooks/useUserShowTestnet";
import {ChainLogo} from "@dex/components/logo";
import {useSessionChainId} from "@eb-pancakeswap-web/hooks/useSessionChainId";
import {toast} from "react-toastify";
import {useUser} from "@src/components-v2/useUser";
import {chainNameConverter} from "@eb-pancakeswap-web/utils/chainNameConverter";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useNetworkConnectorUpdater} from "@eb-pancakeswap-web/hooks/useActiveWeb3React";

interface NetworkSelectProps {
  switchNetwork: (chainId: ChainId) => void;
  chainId: ChainId;
  isWrongNetwork: boolean;
}

const NetworkSelect = ({ switchNetwork, chainId, isWrongNetwork }: NetworkSelectProps) => {
  const [showTestnet] = useUserShowTestnet()

  return (
    <MenuList>
      <Box px="16px" pb="8px">
        <Text color="textSubtle">Select a Network</Text>
      </Box>
      <Box mb={2}>
        <hr />
      </Box>
      {chains
        .filter((chain) => {
          if (chain.id === chainId) return true
          if ('testnet' in chain && chain.testnet) {
            return showTestnet
          }
          return true
        })
        .map((chain) => (
          <MenuItem
            key={chain.id}
            onClick={() => (chain.id !== chainId || isWrongNetwork) && switchNetwork(chain.id)}
          >
            <HStack>
              <ChainLogo chainId={chain.id} />
              <Text
                color={chain.id === chainId && !isWrongNetwork ? 'secondary' : 'text'}
                fontWeight={chain.id === chainId && !isWrongNetwork ? 'bold' : 'auto'}
                pl="12px"
              >
                {chainNameConverter(chain.name)}
              </Text>
            </HStack>
          </MenuItem>
        ))}
    </MenuList>
  )
}

interface WrongNetworkSelectProps {
  switchNetwork: (chainId: ChainId) => void;
  chainId: ChainId;
}

const WrongNetworkSelect = ({ switchNetwork, chainId }: WrongNetworkSelectProps) => {
  const { chain } = useAccount()
  const localChainId = useLocalNetworkChain() || ChainId.CRONOS
  const [, setSessionChainId] = useSessionChainId()

  const localChainName = chains.find((c) => c.id === localChainId)?.name ?? 'CRO'

  return (
    <MenuList>
      <Flex alignItems="center" px={4} pb={2} pt={1}>
        <Popover placement='auto-start'>
          <PopoverTrigger>
            <HStack>
              <InfoIcon />
              <Text color="textSubtle" pl="6px">
                Please switch network
              </Text>
            </HStack>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>The URL you are accessing (Chain id: {chainId}) belongs to {chains.find((c) => c.id === chainId)?.name ?? 'Unknown network'}; mismatching your wallet’s network. Please switch the network to continue.</PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Box mb={2}>
        <hr />
      </Box>
      {chain && (
        <MenuItem onClick={() => setSessionChainId(chain.id)} style={{ justifyContent: 'flex-start' }}>
          <ChainLogo chainId={chain.id} />
          <Text color="secondary" fontWeight='bold' pl="12px">
            {chainNameConverter(chain.name)}
          </Text>
        </MenuItem>
      )}
      <Box px={4} py={2}>
        <ArrowDownIcon color="text" />
      </Box>
      <MenuItem onClick={() => switchNetwork(localChainId)} style={{ justifyContent: 'flex-start' }}>
        <ChainLogo chainId={localChainId} />
        <Text pl="12px">{chainNameConverter(localChainName)}</Text>
      </MenuItem>
      <PrimaryButton mx={4} my={2} size="sm" onClick={() => switchNetwork(localChainId)}>
        Switch network in wallet
      </PrimaryButton>
    </MenuList>
  )
}

const SHORT_SYMBOL = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.CRONOS]: 'CRO',
  [ChainId.CRONOS_TESTNET]: 'tCRO',
  [ChainId.CRONOS_ZKEVM_TESTNET]: 'zkTCRO',
  [ChainId.BSC]: 'BNB',
  [ChainId.BSC_TESTNET]: 'tBNB',
  [ChainId.GOERLI]: 'GOR',
  [ChainId.ARBITRUM_ONE]: 'ARB',
  [ChainId.ARBITRUM_GOERLI]: 'tARB',
  [ChainId.POLYGON_ZKEVM]: 'Polygon zkEVM',
  [ChainId.POLYGON_ZKEVM_TESTNET]: 'tZkEVM',
  [ChainId.ZKSYNC]: 'zkSync',
  [ChainId.ZKSYNC_TESTNET]: 'tZkSync',
  [ChainId.LINEA]: 'Linea',
  [ChainId.LINEA_TESTNET]: 'tLinea',
  [ChainId.OPBNB]: 'opBNB',
  [ChainId.OPBNB_TESTNET]: 'tOpBNB',
  [ChainId.BASE]: 'Base',
  [ChainId.BASE_TESTNET]: 'tBase',
  [ChainId.SCROLL_SEPOLIA]: 'tScroll',
  [ChainId.SEPOLIA]: 'sepolia',
  [ChainId.BASE_SEPOLIA]: 'Base Sepolia',
  [ChainId.ARBITRUM_SEPOLIA]: 'Arb Sepolia',
} as const satisfies Record<ChainId, string>

export const NetworkSwitcher = () => {
  const { theme } = useUser();
  const { chainId, isWrongNetwork, isNotMatched } = useActiveChainId()
  const { isLoading, canSwitch, switchNetworkAsync } = useSwitchNetwork()
  const router = useRouter()
  const {isOpen, onOpen, onClose} = useDisclosure();

  // useNetworkConnectorUpdater()

  const foundChain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])
  const symbol =
    (foundChain?.id ? SHORT_SYMBOL[foundChain.id as ChainId] ?? NATIVE[foundChain.id as ChainId]?.symbol : undefined) ??
    foundChain?.nativeCurrency?.symbol

  const cannotChangeNetwork = !canSwitch

  if (!chainId || !router.pathname.includes('/dex/')) {
    return null
  }

  useEffect(() => {
    if (cannotChangeNetwork) {
      toast.error('Unable to switch network. Please try it on your wallet')
    }
  }, []);

  return (
    <Box height="100%">
      <Menu>
        <MenuButton
          as={Flex}
          w='38px'
          h='38px'
          bg='white'
          alignItems='center'
          justifyContent='center'
          rounded='full'
          mx={1}
          cursor='pointer'
          sx={{
            '& > span': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }
          }}
        >
          <ChainLogo chainId={foundChain?.id} width={30} height={30} />
        </MenuButton>

        {isNotMatched ? (
            <WrongNetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId}/>
          ) : (
            <NetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} isWrongNetwork={isWrongNetwork}/>
          )
        }
      </Menu>
    </Box>
  )
}
