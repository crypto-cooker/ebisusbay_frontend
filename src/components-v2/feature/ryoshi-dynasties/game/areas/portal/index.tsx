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
import {useCallback} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useAppSelector} from "@src/Store/hooks";
import {useDispatch} from "react-redux";
import {ArrowBackIcon} from "@chakra-ui/icons";
  
import localFont from 'next/font/local';
const gothamBook = localFont({ src: '../../../../../../fonts/Gotham-Book.woff2' })
  
  interface PortalProps {
    onBack: () => void;
  }
  
  const PortalModal = ({onBack}: PortalProps) => {
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
      <Flex
      border='1px solid #FFD700'
      backgroundColor='#292626'
      flexDirection='column'
      textAlign='center'
      borderRadius={'10px'}
      justifyContent='space-around'
      padding={4}
      minW={{base: '100%', xl: '450px' }}
      boxShadow='0px 0px 10px 0px #000000'
      className={gothamBook.className}
    >
      <Flex justify='space-between'>
        <Box
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
            w={14}
            h={14}
            onClick={onBack}
            _groupHover={{
              bg: '#de8b08',
              borderColor: '#f9a50b',
            }}
          >
            <ArrowBackIcon boxSize={8} />
          </Button>
        </Box>
        <Box textAlign='end' ms={2}>
          <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} fontWeight='bold'>Moon Gate</Text>
          <Text textColor='#ffffffeb' fontSize='sm' fontStyle='italic'>Join in the quest for sea treasures on Seashrine!</Text>
        </Box>
      </Flex>
      <Box>



      <VStack>

        <Spacer h='4'/>
  
          <div style={{ margin: '8px 24px' }}>
          <Center>
        <Container>
  
        <VStack
          spacing={4}
          align='stretch'
        >
  
        <RdButton onClick={(e) => {
            e.preventDefault();
            window.location.href='https://seashrine.io/';
            }}
            >Visit Seashrine</RdButton>
        <RdButton onClick={(e) => {
            e.preventDefault();
            window.location.href='https://seashrine.io/portal?tab=cronos';
            }}
            >Bridge VIPs</RdButton>
        </VStack>
        </Container>
          </Center>
          </div>
        <Spacer h='4'/>
      </VStack>
      </Box>
      </Flex>
    )
  };
  
  
  export default PortalModal;