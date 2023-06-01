import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import StakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft";
import ClaimRewards from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/claim-rewards';
import {useCallback} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useAppSelector} from "@src/Store/hooks";
import {useDispatch} from "react-redux";

import localFont from 'next/font/local';
const gothamBook = localFont({ src: '../../../../../../fonts/Gotham-Book.woff2' })

interface BarracksProps {
  onBack: () => void;
  battleRewards: any;
}

const Barracks = ({onBack, battleRewards}: BarracksProps) => {
  const dispatch = useDispatch();
  const { isOpen: isOpenStakeNFTs, onOpen: onOpenStakeNFTs, onClose: onCloseStakeNFTs} = useDisclosure();
  const { isOpen: isOpenClaimRewards, onOpen: onOpenClaimRewards, onClose: onCloseClaimRewards} = useDisclosure();
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
    <Flex 
        backgroundColor='#292626' 
        flexDirection='column' 
        textAlign='center' 
        borderRadius={'10px'} 
        justifyContent='space-around'
        padding='10px'
        paddingBottom='20px'
        paddingTop='5px'
        maxWidth='100%'
        >
    <VStack>
      <Box
        position='absolute'
        left={6}
        top={6}
        rounded='full'
        zIndex={1}
        _groupHover={{
          cursor: 'pointer'
        }}
        data-group
      >
        <Button
          bg='#C17109'
          rounded='full'
          border='8px solid #F48F0C'
          w={2}
          h={12}
          fontSize='22px'
          onClick={onBack}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          x
        </Button>
      </Box>

      <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} className={gothamBook.className} textAlign='center'>Barracks</Text>
      <Text textColor='#ffffffeb' className={gothamBook.className} textAlign='center'>Stake Ryoshi Tales NFTs to receive bonus battle units</Text>
      
      <Spacer h='4'/>

        <div style={{ margin: '8px 24px' }}>
        <Center>
        <StakeNfts isOpen={isOpenStakeNFTs} onClose={onCloseStakeNFTs} />
        <ClaimRewards isOpen={isOpenClaimRewards} onClose={onCloseClaimRewards} battleRewards={battleRewards}/>
      <Container>

      <VStack
        spacing={4}
        align='stretch'
      >
        <RdButton onClick={() => handleAuthedNavigation(onOpenStakeNFTs)}>Stake NFTs</RdButton>
        <RdButton onClick={() => handleAuthedNavigation(onOpenClaimRewards)}>Claim Rewards</RdButton>
      </VStack>
      </Container>
        </Center>
        </div>
      <Spacer h='4'/>
    </VStack>
    </Flex>
  )
};


export default Barracks;