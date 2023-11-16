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
    AspectRatio,
    Image,
  } from '@chakra-ui/react';
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import StakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft";
import {useCallback} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useAppSelector} from "@src/Store/hooks";
import {useDispatch} from "react-redux";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {motion} from "framer-motion";
import ImageService from "@src/core/services/image";
  
import localFont from 'next/font/local';
const gothamBook = localFont({ src: '../../../../../../fonts/Gotham-Book.woff2' })
  
  interface PortalProps {
    onBack: () => void;
  }
  
  const PortalModal = ({onBack}: PortalProps) => {
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.user);

    const item = {
      hidden: { opacity: 0 },
      show: { opacity: 1,
        transition: {
        }
       }
    }
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
      <Box
      position='relative'
      h='calc(100vh - 74px)'
      overflow='hidden'
    >
     <motion.div
        variants={item}
        initial="hidden"
        animate="show"
      >
        <Box 
            position='absolute'
            top={0}
            left={0}
            zIndex={1}
            w='100%'
            h='100%'
            // bg={'#000000'}
            overflow='hidden'
          >

      <Flex
      flexDirection='column'
      textAlign='center'
      justifyContent='space-around'
      padding={4}
      minW={{base: '100%', xl: '450px' }}
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
            color='white'
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

      <Flex align={'center'} minH={'calc(100vh - 175px)'} justifyContent={'center'}>
        <VStack spacing={4} align='stretch' >
        <RdButton onClick={(e) => {
            window.open('https://seashrine.ebisusbay.com/','_blank');
            }}
            >Visit Seashrine</RdButton>
        <RdButton onClick={(e) => {
          window.open('https://seashrine.ebisusbay.com/portal?tab=cronos','_blank');
            }}
            >Bridge VIPs</RdButton>
        </VStack>
      </Flex>

      </Flex>
    </Box>

    <AspectRatio ratio={1920/1080} overflow='visible' >
      <Image
        position={'absolute'}
        opacity={0.2}
        zIndex={0}
        src={ImageService.translate('/img/ryoshi-dynasties/village/background-portal.webp').convert()}
        minH='calc(100vh - 74px)'
      />
    </AspectRatio>

    </motion.div>
  </Box>
    )
  };
  
  
  export default PortalModal;