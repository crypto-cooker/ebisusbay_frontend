import { Box, Button, HStack } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import ChainSelectModal from './chain-select-modal';
import { ChainLogo } from '@dex/components/logo';
import { chains } from '@src/wagmi';

const ChainSelector = (props: any) => {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { onSelectChain, chainId, field } = props;
  const chain = chains.filter((chain) => chain.id == chainId)[0];

  const handleSelectChain = (chainId: number) => {
    onSelectChain(field, chainId);
  };
  return (
    <>
      <Box w="full">
        <Button w="full" onClick={onModalOpen}>
          <HStack>
            <ChainLogo chainId={chainId} width={30} height={30} />
            <Box display={{ base: 'none', sm: 'none', md: 'block' }}>{chain?.name}</Box>
          </HStack>
        </Button>
      </Box>
      {isModalOpen && (
        <ChainSelectModal isOpen={isModalOpen} onClose={onModalClose} onSelectChain={handleSelectChain} field={field} />
      )}
    </>
  );
};

export default ChainSelector;
