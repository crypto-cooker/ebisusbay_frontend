import { useResponsiveDialog } from '@src/components-v2/foundation/responsive-dialog';
import { Box, HStack, Image, ModalProps, VStack } from '@chakra-ui/react';
import { Card } from '@src/components-v2/foundation/card';
import { chains } from '@src/wagmi';
import { useEffect } from 'react';
import { ChainLogo } from '@dex/components/logo';
import { Field } from '@dex/bridge/state/actions';

type ChainSelectModalProps = {
  isOpen: boolean;
  field: Field;
  onClose: () => void;
  onSelectChain: (value: number) => void;
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
};

export default function ChainSelectModal({ isOpen, onClose, onSelectChain, field, modalProps }: ChainSelectModalProps) {
  const ResponsiveDialog = useResponsiveDialog();
  useEffect(() => {
    console.log({ chains });
  }, [isOpen]);

  const handleSelect = (chainId: number) => {
    console.log('chain selection');
    onSelectChain(chainId);
    onClose();
  };
  return (
    <ResponsiveDialog.DialogComponent isOpen={isOpen} onClose={onClose} modalProps={modalProps}>
      <Card>
        <Box mb={4}>Select the Chain</Box>
        <VStack justify="flex-start">
          {chains.map((chain, index) => {
            return (
              <HStack
                key={index}
                w="full"
                _hover={{ cursor: 'pointer', backgroundColor: '' }}
                onClick={() => {
                  handleSelect(chain.id);
                }}
              >
                <ChainLogo chainId={chain.id} width={40} height={40} />
                <Box>{chain?.name}</Box>
              </HStack>
            );
          })}
        </VStack>
      </Card>
    </ResponsiveDialog.DialogComponent>
  );
}
