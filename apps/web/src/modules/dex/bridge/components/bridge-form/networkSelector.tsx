import { chains } from "@src/wagmi";
import { Box, Button } from "@chakra-ui/react";
import { useNetworkSelectorModal } from "@dex/bridge/state/hooks";

export const NetworkSelector = () => {
    const { openModal } = useNetworkSelectorModal()
    return (
        <>
            <Box>
                <Button onClick={openModal}>Select Network</Button>
            </Box>
        </>
    )
}