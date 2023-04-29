import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Progress,
  SimpleGrid,
  Text, useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/battle-bay/components/rd-button";
import React, {useState, useRef, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";

interface FortuneReservationPageProps {
  onFaq: () => void;
  onClose: () => void;
}

const FortuneReservationPage = ({onFaq, onClose}: FortuneReservationPageProps) => {
  return (
    <>
      <Box
        position='absolute'
        left={2}
        top={2}
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
          fontSize='28px'
          onClick={onFaq}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          ?
        </Button>
      </Box>
      <Box
        position='absolute'
        right={2}
        top={2}
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
          onClick={onClose}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          <CloseIcon />
        </Button>
      </Box>
      <Box
        bg='#564D4A'
        h='full'
        m={6}
        roundedBottom='3xl'
        className='rd-bank-modal-mask1'
      >
        <Box
          color='#FFF'
          textAlign='center'
          verticalAlign='middle'
          className='rd-bank-modal-mask2'
          p={1}
        >
          <Flex
            bg='#272523'
            h='55px'
            px={12}
            fontSize={{base: 'lg', sm: '2xl', md: '3xl'}}
            my='auto'
            justify='center'
            direction='column'
          >
            <>Fortune Reservation Menu</>
          </Flex>
        </Box>
        <FortunePurchaseForm />
        <Box
          bg='#272523'
          w='full'
          roundedBottom='3xl'
          p={4}
          fontSize='sm'
        >
          <FortunePurchaseProgress />
        </Box>
      </Box>
    </>
  )
}


export default FortuneReservationPage;

const FortunePurchaseForm = () => {
  const [reserveAmount, setReserveAmount] = useState('');
  const [fortunePrice, setFortunePrice] = useState(0.03);
  const fullText = useBreakpointValue<boolean>(
    {base: false, sm: true},
    {fallback: 'sm'},
  )

  return (
    <Box pb={2}>
      <Flex justify='space-between' mb={4} bg='#272523' p={2} mx={1}>
        <Box>
          <HStack>
            <Image src='/img/battle-bay/bankinterior/usdc.svg' alt="walletIcon" boxSize={6}/>
            <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>{fullText ? 'USDC ' : ''}$0.00</Text>
          </HStack>
          <Link href='#' fontSize={{base: 'xs', md: 'sm'}} textDecoration='underline' isExternal>Purchase USDC <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} ml={1} /></Link>
        </Box>
        <HStack align='start'>
          <Image src='/img/battle-bay/bankinterior/fortune_token.svg' alt="walletIcon" boxSize={6}/>
          <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>{fullText ? '$Fortune ' : ''}$0.00</Text>
        </HStack>
      </Flex>
      <VStack mx={2}>
        <FormControl>
          <Flex justify='space-between' align='center' direction={{base: 'column', md: 'row'}}>
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

  const [progressValue, setProgressValue] = useState(0);
  const progressRef = useRef();
  const [barSpot, setBarSpot] = useState(0);

  const GetProgress = async () => {
    const random = Math.floor(Math.random() * 100);
    setProgressValue(random);
    setBarSpot(((random   / 100) * progressRef.current.offsetWidth) - 5);  
  }
 
  useEffect(() => {
    GetProgress();
  }, [progressRef]);
   
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
        <Progress
          ref={progressRef}
          value={progressValue}
          bg='#272523'
          h='30px'
          sx={{
            '& > div': {
              background: 'linear-gradient(to left, #2ec2e5, #0087d3)',
              boxShadow: '12px 0 15px -4px rgba(31, 73, 125, 0.8), -12px 0 8px -4px rgba(31, 73, 125, 0.8)'
            },
          }}
        />
        <Image position='absolute' src='/img/battle-bay/bankinterior/progress_bar_spark.png'
        top={0}
        h='30px'
        left={barSpot}
        zIndex={0}
         />

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