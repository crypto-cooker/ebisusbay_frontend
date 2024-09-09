import { ChainId } from '@pancakeswap/chains'
import { atom, useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import useActiveWeb3React from "@eb-pancakeswap-web/hooks/useActiveWeb3React";
import {viemClients} from "@eb-pancakeswap-web/utils/viem";
import {CHAIN_IDS} from "@src/wagmi";
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import {Modal, ModalBody, ModalContent, ModalOverlay} from "@chakra-ui/react";
import {UnsupportedNetworkModal} from "@dex/components/network-modal/unsupported-network-modal";
import {PageNetworkSupportModal} from "@dex/components/network-modal/page-network-support-modal";
import {useAccount} from "wagmi";

export const hideWrongNetworkModalAtom = atom(false)

// const PageNetworkSupportModal = dynamic(
//   () => import('./page-network-support-modal').then((mod) => mod.PageNetworkSupportModal),
//   { ssr: false },
// )
const WrongNetworkModal = dynamic(() => import('./wrong-network-modal').then((mod) => mod.WrongNetworkModal), {
  ssr: false,
})
// const UnsupportedNetworkModal = dynamic(
//   () => import('./unsupported-network-modal').then((mod) => mod.UnsupportedNetworkModal),
//   { ssr: false },
// )

export const NetworkModal = ({ pageSupportedChains = [ChainId.CRONOS] }: { pageSupportedChains?: number[] }) => {
  const { chainId, chain, isWrongNetwork } = useActiveWeb3React()
  const { chainId: walletChainId } = useAccount()
  const [dismissWrongNetwork, setDismissWrongNetwork] = useAtom(hideWrongNetworkModalAtom)

  const isCronosOnlyPage = useMemo(() => {
    return pageSupportedChains?.length === 1 && pageSupportedChains[0] === ChainId.CRONOS
  }, [pageSupportedChains])

  const isPageNotSupported = useMemo(
    () => Boolean(pageSupportedChains.length) && chainId && !pageSupportedChains.includes(chainId),
    [chainId, pageSupportedChains],
  )
  const handleDismiss = useCallback(() => setDismissWrongNetwork(true), [setDismissWrongNetwork])

  if (pageSupportedChains?.length === 0) return null // open to all chains

  if (isPageNotSupported && isCronosOnlyPage) {
    return (
      <Modal isOpen closeOnOverlayClick={false} onClose={() => {}}>
        <PageNetworkSupportModal />
      </Modal>
    )
  }

  if ((chain?.unsupported ?? false) || isPageNotSupported || (walletChainId && !CHAIN_IDS.includes(walletChainId))) {
    return (
      <Modal isOpen onClose={() => {}} closeOnOverlayClick={false}>
        <ModalOverlay />
        <UnsupportedNetworkModal pageSupportedChains={pageSupportedChains?.length ? pageSupportedChains : CHAIN_IDS} />
      </Modal>
    )
  }

  if (isWrongNetwork && !dismissWrongNetwork && !isPageNotSupported) {
    const currentChain = Object.values(viemClients)
      .map((client) => client.chain)
      .find((c) => c?.id === chainId)
    if (!currentChain) return null
    return (
      <Modal isOpen={isWrongNetwork} closeOnOverlayClick={false} onClose={handleDismiss}>
        <ModalOverlay />
        <WrongNetworkModal currentChain={currentChain} onDismiss={handleDismiss} />
      </Modal>
    )
  }

  return null
}
