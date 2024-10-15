import { Box, Button, HStack } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import ChainSelectModal from "./chain-select-modal";
import { ChainLogo } from "@dex/components/logo";
import { chains } from "@src/wagmi";


export const ToChainSelector = (props: any) => {
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { onSelectChain, chainId, field } = props;
    const chain = chains.filter((chain) => chain.id == chainId)[0];
    return (
        <>
            <Box w="full">
                <Button w="full" onClick={onModalOpen}>
                    <HStack>
                        <ChainLogo chainId={chainId} width={30} height={30}/>
                        <Box>{chain?.name}</Box>
                    </HStack>
                </Button>
            </Box>
            {isModalOpen &&
                <ChainSelectModal isOpen={isModalOpen} onClose={onModalClose} onSelectChain={onSelectChain} field={field}/>
            }
        </>
    )
}