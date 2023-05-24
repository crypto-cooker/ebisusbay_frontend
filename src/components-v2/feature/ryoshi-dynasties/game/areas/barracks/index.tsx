import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  ListItem,
  Spacer,
  StackDivider,
  Text,
  UnorderedList,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import StakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft";
import {useCallback} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useAppSelector} from "@src/Store/hooks";
import {useDispatch} from "react-redux";
import ReturnToVillageButton from "@src/components-v2/feature/ryoshi-dynasties/components/return-button";

interface BarracksProps {
  onBack: () => void;
}

const Barracks = ({onBack}: BarracksProps) => {
  const dispatch = useDispatch();
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const user = useAppSelector((state) => state.user);

  const handleAuthedNavigation = useCallback((fn: () => void) => {
    if (!!user.address) {
      fn();
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }, [user.address]);

  return (
    <Box position='relative' h='calc(100vh - 74px)'>
      <ReturnToVillageButton onBack={onBack} />
      <StakeNfts isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
      <Container>
      <Box  >
        <Center>
        <Image marginTop={20} src='img/battle-bay/barracks_day.png'/>
        </Center>
      </Box>
      <Heading className="title text-center">Barracks</Heading>
      <VStack
        spacing={4}
        align='stretch'
      >
        <Text textAlign={'center'}>Stake Ryoshi Tales NFTs to receive bonus battle units</Text>
        <RdButton onClick={() => handleAuthedNavigation(onOpenStakeNFTs)}>Stake NFTs</RdButton>
      </VStack>
      </Container>
    </Box>
  )
};


export default Barracks;