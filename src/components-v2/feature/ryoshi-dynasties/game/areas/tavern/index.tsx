import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {AspectRatio, Box, Button, Flex, Image, Text, useDisclosure, VStack} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {ArrowBackIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import localFont from 'next/font/local';
import ImageService from "@src/core/services/image";
import MintHeroes from "@src/components-v2/feature/ryoshi-dynasties/game/areas/tavern/mint-heroes";

const gothamBook = localFont({
  src: '../../../../../../fonts/Gotham-Book.woff2',
  fallback: ['Roboto', 'system-ui', 'arial'],
})

interface TavernProps {
  onBack: () => void;
}

const Tavern = ({onBack}: TavernProps) => {
  const { isOpen: isOpenHeroes, onOpen: onOpenHeroes, onClose: onCloseHeroes} = useDisclosure();
  const [handleAuthedNavigation] = useAuthedFunction();
  const motionDivVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
      transition: {
      }
    }
  }

  return (
    <Box
      position='relative'
      h='calc(100vh - 74px)'
      overflow='hidden'
    >
      <motion.div
        variants={motionDivVariant}
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
                <Text textColor='#ffffffeb' fontSize={{ base: '28px', md: '32px' }} fontWeight='bold'>Tavern</Text>
                <Text textColor='#ffffffeb' fontSize='sm' fontStyle='italic'>
                  A hub of tales, ale, and fellowship
                </Text>
              </Box>
            </Flex>
            <Flex align={'center'} minH={'calc(100vh - 175px)'} justifyContent={'center'}>
              <MintHeroes isOpen={isOpenHeroes} onClose={onCloseHeroes} />
              <VStack spacing={4} align='stretch'>
                <RdButton onClick={() => handleAuthedNavigation(onOpenHeroes)}>Mint Heroes</RdButton>
              </VStack>
            </Flex>
          </Flex>
        </Box>
        <AspectRatio ratio={1920/1080} overflow='visible' >
          <Image
            position={'absolute'}
            opacity={0.2}
            zIndex={0}
            src={ImageService.translate('/img/ryoshi-dynasties/village/background-tavern.webp').convert()}
            minH='calc(100vh - 74px)'
          />
        </AspectRatio>
      </motion.div>
    </Box>
  )
}

export default Tavern;