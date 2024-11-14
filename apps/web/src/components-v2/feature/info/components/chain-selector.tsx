import { useCallback } from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import ChainSelectModal from './chain-select-modal';
import { ChainLogo } from '@dex/components/logo';
import { chains } from '@src/wagmi';
import chainConfigs from '@src/config/chains';
import { useRouter } from 'next/navigation';
import { useChainIdByQuery } from '../hooks/chain';
import { chainPaths } from '../state/constants';

const ChainSelector = (props: any) => {
  const {activeIndex} = props
  const chainId = useChainIdByQuery();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const foundChain = chainConfigs[chainId as keyof typeof chainConfigs];
  const router = useRouter();

  const switchNetwork = useCallback(
    (chianId: any) => {
      const chainPath:string = chainPaths[chianId];
      if (activeIndex === 0) router.push(`/info${chainPath}`);
      if (activeIndex === 1) router.push(`/info${chainPath}/pairs`);
      if (activeIndex === 2) router.push(`/info${chainPath}/tokens`);
    },
    [router, activeIndex],
  );
  return (
    <>
      <Box w="full">
        <Button w="full" onClick={onModalOpen}>
          <HStack>
            <ChainLogo chainId={chainId} width={30} height={30} />
            <Box display={{ base: 'none', sm: 'none', md: 'block' }}>{foundChain?.name}</Box>
          </HStack>
        </Button>
      </Box>
      {isModalOpen && <ChainSelectModal isOpen={isModalOpen} onClose={onModalClose} onSelectChain={switchNetwork} />}
    </>
  );
};

export default ChainSelector;
