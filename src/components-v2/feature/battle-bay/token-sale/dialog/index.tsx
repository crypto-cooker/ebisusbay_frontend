import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Progress,
  SimpleGrid,
  Text,
  VStack
} from "@chakra-ui/react";
import RdButton from "@src/components-v2/feature/battle-bay/components/rd-button";
import React, {useCallback, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import FortuneReservationPage from "@src/components-v2/feature/battle-bay/token-sale/dialog/reservation";
import FortuneFaqPage from "@src/components-v2/feature/battle-bay/token-sale/dialog/faq";

interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FortunePurchaseDialog = ({isOpen, onClose}: PurchaseDialogProps) => {
  const [page, setPage] = useState('main');

  const handleClose = useCallback(() => {
    setPage('main');
    onClose();
  }, []);

  return (
    <>
      <Modal
        onClose={() => {}}
        isOpen={isOpen}
        size='2xl'
        scrollBehavior='inside'
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          borderWidth='1px'
          borderStyle='solid'
          borderLeftColor='#45433C'
          borderRightColor='#684918'
          borderTopColor='#625C4D'
          borderBottomColor='#181514'
          rounded='3xl'
          bg='linear-gradient(#1C1917, #272624, #000000)'
          className='gotham_book'
        >
          <ModalBody p={2}>
            {page === 'faq' ? (
              <FortuneFaqPage onBack={() => setPage('main')} onClose={handleClose} />
            ) : (
              <FortuneReservationPage onFaq={() => setPage('faq')} onClose={handleClose} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}


export default FortunePurchaseDialog;

const FortunePurchaseForm = () => {
  const [reserveAmount, setReserveAmount] = useState('');
  const [fortunePrice, setFortunePrice] = useState(0.03);

  return (
    <Box pb={2}>
      <Flex justify='space-between' mb={4} bg='#272523' p={2} mx={1}>
        <Box>
          <HStack>
            <Image src='/img/battle-bay/bankinterior/usdc.svg' alt="walletIcon" boxSize={6}/>
            <Text fontWeight='bold'>USDC $0.00</Text>
          </HStack>
          <Link href='#' fontSize='sm' textDecoration='underline' isExternal>Purchase additional USDC <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} ml={1} /></Link>
        </Box>
        <HStack align='start'>
          <Image src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" boxSize={6}/>
          <Text fontWeight='bold'>$Fortune  $0.00</Text>
        </HStack>
      </Flex>
      <VStack mx={2}>
        <FormControl>
          <Flex justify='space-between' align={{base: 'start', md: 'center'}} direction={{base: 'column', md: 'row'}}>
            <FormLabel>Amount of $Fortune to reserve</FormLabel>
            <Input
              type='number'
              w='200px'
              value={reserveAmount}
              onChange={(e: any) => setReserveAmount(e.target.value)}
            />
          </Flex>
        </FormControl>
        <Flex justify='space-between' w='full'>
          <Text>Current $Fortune price</Text>
          <Text fontWeight='bold'>${fortunePrice}</Text>
        </Flex>
        <Flex justify='space-between' w='full'>
          <Text>Your total cost</Text>
          <Text fontWeight='bold'>${fortunePrice * Number(reserveAmount)}</Text>
        </Flex>
      </VStack>
      <Box textAlign='center' mt={8} mb={2} mx={2}>
        <Box
          ps='20px'>
          <RdButton
            w='250px'
            fontSize={{base: 'xl', sm: '2xl'}}
            stickyIcon={true}
            onClick={() => {}}
          >
            Buy $Fortune
          </RdButton>
        </Box>
        <Text fontSize='xs' mt={2}>
          By completing this purchase you agree to our <Link href='#' textDecoration='underline' isExternal>terms of service
          <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} ml={1} /></Link>
        </Text>
      </Box>
    </Box>
  )
}

const FortunePurchaseProgress = () => {
  return (
    <>
      <Flex justify='space-between'>
        <Box>0</Box>
        <Box>100%</Box>
      </Flex>
      <Box
        // bg='linear-gradient(to left, #FDAB1A, #FD8800)'
        // p={1}
        h='30px'
        position='relative'
      >
        <Progress value={80} bg='#272523' h='30px'/>
        <SimpleGrid
          columns={8}
          position='absolute'
          top={0}
          left={0}
          h='full'
          w='full'
        >
          <Box
            borderColor='#FDAB1A'
            borderStyle='solid'
            borderTopWidth='4px'
            borderEndWidth='1px'
            borderBottomWidth='4px'
            borderStartWidth='4px'
          />
          {[...Array(6).fill(0)].map((_, i) => (
            <Box
              borderColor='#FDAB1A'
              borderStyle='solid'
              borderTopWidth='4px'
              borderEndWidth='1px'
              borderBottomWidth='4px'
              borderStartWidth='1px'
            />
          ))}
          <Box
            borderColor='#FDAB1A'
            borderStyle='solid'
            borderTopWidth='4px'
            borderEndWidth='4px'
            borderBottomWidth='4px'
            borderStartWidth='1px'
          />
        </SimpleGrid>
      </Box>
      <Box textAlign='center' mt={1}>
        <Box>% of $Fortune purchased by all users</Box>
      </Box>
    </>
  )
}