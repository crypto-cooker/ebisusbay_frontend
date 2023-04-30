import {
  Box,
  Button, Center, Checkbox,
  Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Progress, ProgressProps,
  SimpleGrid, Slide,
  Text, useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/battle-bay/components/rd-button";
import React, {useState, useRef, useEffect, useCallback, ChangeEvent} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import {constants, Contract} from "ethers";
import {ERC20} from "@src/Contracts/Abis";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {appConfig} from "@src/Config";
import {useSelector} from "react-redux";
import {useAppSelector} from "@src/Store/hooks";
import FortunePresale from "@src/Contracts/FortunePresale.json";

const config = appConfig();

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
  const [fortuneToPurchase, setFortuneToPurchase] = useState('');
  const [fortunePrice, setFortunePrice] = useState(0.03);
  const fullText = useBreakpointValue<boolean>(
    {base: false, sm: true},
    {fallback: 'sm'},
  )
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Purchasing');
  const user = useAppSelector((state) => state.user);
  const [tosCheck, setTosCheck] = useState(false);

  const [error, setError] = useState('');
  const [inputError, setInputError] = useState('');
  const [tosError, setTosError] = useState('');

  const validateInput = () => {
    if (!fortuneToPurchase || Number(fortuneToPurchase) <= 0) {
      setInputError('Please enter a value');
      return false;
    }

    if (!tosCheck) {
      setTosError('Please accept the TOS');
      return false;
    }

    setError('');
    setInputError('');
    setTosError('');

    return true;
  }

  const handleTosCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTosCheck(e.target.checked);
  }, []);

  const attemptPurchase = async () => {
    // console.log(fortuneToPurchase)
    const usdcAddress = config.contracts.usdc;

    try {
      setExecutingLabel('Validating');
      setIsExecuting(true);

      if (!validateInput()) return;

      // Convert the desired amount of $Fortune to $USDC
      let desiredAmount = Number(fortuneToPurchase) * fortunePrice;
      console.log('desiredAmount', desiredAmount);

      // Instantiate USDC contract and check how much USDC the user has already approved
      const usdcContract = new Contract(usdcAddress, ERC20, user.provider.getSigner());
      const allowance = await usdcContract.allowance(user.address, config.contracts.purchaseFortune);

      // If the user has not approved the token sale contract to spend enough of their USDC, approve it
      if (Number(allowance) - desiredAmount < 0) {
        console.log('Approving')
        setExecutingLabel('Approving');
        await usdcContract.approve(config.contracts.purchaseFortune, constants.MaxUint256);
      }

      setExecutingLabel('Purchasing');
      //seems to fail here with an error if approval given in previous step
      const purchaseFortuneContract = new Contract(config.contracts.purchaseFortune, FortunePresale, user.provider.getSigner());
      const tx = await purchaseFortuneContract.purchase(fortuneToPurchase)
      const receipt = await tx.wait();

      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      console.log('Purchased $Fortune!')
    } catch (error: any) {
      console.log(error);
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <Box pb={2}>
      <Flex justify='space-between' mb={4} bg='#272523' p={2} mx={1} roundedBottom='xl'>
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
        <FormControl isInvalid={!!inputError}>
          <Flex justify='space-between' align='center' direction={{base: 'column', md: 'row'}}>
            <FormLabel>Amount of $Fortune to reserve</FormLabel>
            <Box>
              <Input
                type='number'
                w='200px'
                value={fortuneToPurchase}
                onChange={(e: any) => setFortuneToPurchase(e.target.value)}
              />
              <FormErrorMessage>{inputError}</FormErrorMessage>
            </Box>
          </Flex>
        </FormControl>
        <Flex justify='space-between' w='full'>
          <Text>Current $Fortune price</Text>
          <Text fontWeight='bold'>${fortunePrice}</Text>
        </Flex>
        <Flex justify='space-between' w='full'>
          <Text>Your total cost</Text>
          <Text fontWeight='bold'>${fortunePrice * Number(fortuneToPurchase)}</Text>
        </Flex>
      </VStack>
      <Box textAlign='center' mt={8} mb={2} mx={2}>
        <Box mb={2}>
          <FormControl isInvalid={!!tosError}>
            <VStack spacing={0}>
              <Checkbox colorScheme='blue' size='lg' onChange={handleTosCheck} defaultChecked>
                <Text fontSize='xs'>
                  I agree to the Ebisu's Bay <Link href='https://cdn.ebisusbay.com/terms-of-service.html' textDecoration='underline' isExternal>terms of service
                  <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} ml={1} /></Link>
                </Text>
              </Checkbox>
              <Center>
                <FormErrorMessage w='full'>{tosError}</FormErrorMessage>
              </Center>
            </VStack>
          </FormControl>
        </Box>
        <Box
          ps='20px'>
          <RdButton
            w='250px'
            fontSize={{base: 'xl', sm: '2xl'}}
            stickyIcon={true}
            onClick={attemptPurchase}
            isLoading={isExecuting}
          >
            {isExecuting ? executingLabel : 'Buy $Fortune'}
          </RdButton>
        </Box>
      </Box>
    </Box>
  )
}

const FortunePurchaseProgress = () => {

  const [progressValue, setProgressValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const [barSpot, setBarSpot] = useState(0);

  const getProgress = async () => {
    const random = Math.floor(Math.random() * 100);
    setProgressValue(random);
    const offsetWidth = progressRef.current?.offsetWidth ?? 0;
    setBarSpot(((random   / 100) * offsetWidth) - 5);
  }
 
  useEffect(() => {
    async function func() {
      await getProgress();
    }
    func();
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