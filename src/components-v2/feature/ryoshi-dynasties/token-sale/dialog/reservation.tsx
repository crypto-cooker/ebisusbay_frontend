import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useNumberInput,
  VStack
} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import React, {ChangeEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {BigNumber, Contract, ethers} from "ethers";
import {ERC20} from "@src/global/contracts/Abis";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, round, timeSince} from "@market/helpers/utils";
import {appConfig} from "@src/Config";
import FortunePresale from "@src/global/contracts/FortunePresale.json";
import LiquidityBoost from "@src/global/contracts/LiquidityBoost.json";
import {commify} from "ethers/lib/utils";
import {TokenSaleContext, TokenSaleContextProps} from "@src/components-v2/feature/ryoshi-dynasties/token-sale/context";
import {useQueryClient} from "@tanstack/react-query";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {useWindowSize} from "@market/hooks/useWindowSize";
import ImageService from "@src/core/services/image";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import {useContractService, useUser} from "@src/components-v2/useUser";

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
        className='rd-bank-modal-masktop-outer'
      >
        <Box
          color='#FFF'
          textAlign='center'
          verticalAlign='middle'
          className='rd-bank-modal-masktop-inner'
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
          {config.tokenSale.vipStart < Date.now() && (
            <FortunePurchaseProgress />
          )}
        </Box>
      </Box>
    </>
  )
}


export default FortuneReservationPage;

const FortunePurchaseForm = () => {
  const [runAuthedFunction] = useAuthedFunction();
  const contractService = useContractService();
  const tokenSaleContext = useContext(TokenSaleContext) as TokenSaleContextProps;
  const queryClient = useQueryClient();
  const [croToCommit, setCroToCommit] = useState('5000');
  const [fortunePrice, setFortunePrice] = useState(6);
  const fullText = useBreakpointValue<boolean>(
    {base: false, sm: true},
    {fallback: 'sm'},
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('Purchasing');
  const user = useUser();
  const [tosCheck, setTosCheck] = useState(false);

  const [error, setError] = useState('');
  const [inputError, setInputError] = useState('');
  const [tosError, setTosError] = useState('');

  const validateInput = async () => {
    if (!croToCommit || Number(croToCommit) <= 0) {
      setInputError('Please enter a value');
      return false;
    }
    console.log('validateInput', croToCommit);
    setInputError('');

    // if (!tosCheck) {
    //   setTosError('Please accept the TOS');
    //   return false;
    // }
    // setTosError('');

    // const memberCollections = config.tokenSale.memberCollections.map((c: any) => c.toLowerCase());
    // const walletCollections = await getWalletOverview(user.address);
    // const isMember = walletCollections.data.filter((col: any) => {
    //   return memberCollections.includes(col.nftAddress.toLowerCase());
    // }).length > 0;

    // Still always check VIP because wallet doesn't detect staked Ryoshis
    // const isVip = await contractService!.market.isVIP(user.address);

    // if (Date.now() > config.tokenSale.publicStart) {
    //   if (!isMember && !isVip) {
    //     setError('Must have a VIP, Founding Member, or any Ebisu brand NFT to participate');
    //     return false;
    //   }
    // } else if (Date.now() > config.tokenSale.vipStart) {
    //   if (!isVip) {
    //     setError('Must have a Ryoshi VIP to participate');
    //     return false;
    //   }
    // }
    // setError('');

    return true;
  }

  const handleTosCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTosCheck(e.target.checked);
  }, []);

  const handleBuyUsdc = () => {
    const url = new URL(config.vendors.transak.url)
    url.searchParams.append('cryptoCurrencyCode', 'USDC');
    if (!!user.address) {
      url.searchParams.append('walletAddress', user.address);
    }

    window.open(url, '_blank');
  }

  const attemptPurchase = async () => {
    // const usdcAddress = config.contracts.usdc;

    try {
      setExecutingLabel('Validating');
      setIsExecuting(true);

      // Convert the desired amount of $Fortune to $USDC
      const desiredCroToCommit = ethers.utils.parseEther(croToCommit);//BigNumber.from(croToCommit);
      // const usdcCost = desiredCroToCommit.mul(30000).div(1000000);

      // Instantiate USDC contract
      // const usdcContract = new Contract(usdcAddress, ERC20, user.provider.getSigner());

      // Allow tx to continue in case there were issues retrieving USDC
      // const usdcBalance = await usdcContract.balanceOf(user.address);
      // if (usdcCost.mul(1000000).gt(usdcBalance)) {
      //   setInputError('Amount might exceed USDC balance');
      // }

      // Check how much USDC the user has already approved
      // const allowance = await usdcContract.allowance(user.address, config.contracts.purchaseFortune);

      // If the user has not approved the token sale contract to spend enough of their USDC, approve it
      // const approvalAmount = ethers.utils.parseEther(usdcCost.toString()); // or constants.MaxUint256 is there are issues
      // if (allowance.lt(approvalAmount)) {
      //   setExecutingLabel('Approving');
      //   await usdcContract.approve(config.contracts.purchaseFortune, approvalAmount);
      // }

      setExecutingLabel('Committing');
      const purchaseFortuneContract = new Contract(config.contracts.purchaseFortune, LiquidityBoost, user.provider.getSigner());
      const tx = await purchaseFortuneContract.contribute({ value: desiredCroToCommit });
      const receipt = await tx.wait();

      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      await queryClient.invalidateQueries({ queryKey: ['TokenSale'] });
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

  const handlePurchase = async () => {
    runAuthedFunction(async() => {
      if (!await validateInput()){
        console.log('validation failed');
        return;
      } 
      await attemptPurchase();
    });
  }

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1000,
      defaultValue: croToCommit, // MIN_PURCHASE
      min: 1000, // MIN_PURCHASE
      max: 4000000, // MAX_PURCHASE
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setCroToCommit(valueAsString);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <Box pb={2}>
      <Flex justify='space-between' mb={4} bg='#272523' p={2} mx={1} roundedBottom='xl'>
        {user.address ? (
          <>
            <Box>
              {/* <HStack>
                <Image src={ImageService.translate('/img/battle-bay/bankinterior/usdc.svg').convert()} alt="walletIcon" boxSize={6}/>
                <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>{fullText ? 'USDC ' : ''}${user.balances.cro}</Text>
              </HStack>
              <Button fontSize={{base: 'xs', md: 'sm'}} variant='unstyled' fontWeight='normal' textDecoration='underline' onClick={handleBuyUsdc}>Purchase USDC <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} ml={1} /></Button> */}
            </Box>
            <HStack align='start'>
              <CronosIconBlue boxSize={6} />
              <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>{fullText ? '$Contributed ' : ''}{commify(ethers.utils.formatEther(tokenSaleContext.userCroContributed ?? "0"))}</Text>
            </HStack>
          </>
        ) : (
          <Box fontSize='sm' textAlign='center' w='full'>Connect wallet to purchase</Box>
        )}
      </Flex>
      {config.tokenSale.vipStart < Date.now() ? (
        <>
          <VStack mx={2}>
            <FormControl isInvalid={!!inputError}>
              <Flex justify='space-between' align='center' direction={{base: 'column', md: 'row'}}>
                <FormLabel>Amount of $CRO to contribute</FormLabel>
                <Box>
                  <Stack direction={{base:'column', lg:'row'}} spacing={2}>
                    <HStack>
                      <Button {...dec}>-</Button>
                      <Input w='150px' {...input} />
                      <Button {...inc}>+</Button>
                    </HStack>
                  </Stack>
                  <FormErrorMessage>{inputError}</FormErrorMessage>
                </Box>
              </Flex>
            </FormControl>
            <Flex justify='space-between' w='full'>
              <Text>$FRTN per $CRO</Text>
              <Text fontWeight='bold'>{fortunePrice}</Text>
            </Flex>
            <Flex justify='space-between' w='full'>
              <Text>Your total $FRTN</Text>
              <Text fontWeight='bold'>{commify(fortunePrice * Number(croToCommit))}</Text>
            </Flex>
          </VStack>
          <Box textAlign='center' mt={8} mb={2} mx={2}>
            {/* <Box mb={3}>
              <FormControl isInvalid={!!tosError}>
                <VStack spacing={0}>
                  <Checkbox colorScheme='blue' size='lg' onChange={handleTosCheck}>
                    <Text fontSize='xs'>
                      I agree to the <Link href={ImageService.staticAsset('terms-of-service.html').convert()} textDecoration='underline' isExternal>terms of service
                      <Icon as={FontAwesomeIcon} icon={faExternalLinkAlt} ml={1} /></Link>
                    </Text>
                  </Checkbox>
                  <Center>
                    <FormErrorMessage w='full'>{tosError}</FormErrorMessage>
                  </Center>
                </VStack>
              </FormControl>
            </Box> */}
            <Box
              ps='20px'>
              <RdButton
                w='250px'
                fontSize={{base: 'xl', sm: '2xl'}}
                stickyIcon={true}
                onClick={handlePurchase}
                isLoading={isExecuting}
                disabled={isExecuting}
              >
                {user.address ? (
                  <>{isExecuting ? executingLabel : 'Buy $Fortune'}</>
                ) : (
                  <>Connect</>
                )}
              </RdButton>
            </Box>
            {!!error && (
              <Box color='red.300' mt={2}>{error}</Box>
            )}
          </Box>
        </>
      ) : (
        <Center my={8}>Token sale will start in {timeSince(config.tokenSale.vipStart)} (8pm UTC)</Center>
      )}
    </Box>
  )
}

const FortunePurchaseProgress = () => {
  const tokenSaleContext = useContext(TokenSaleContext) as TokenSaleContextProps;
  const [progressValue, setProgressValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const [barSpot, setBarSpot] = useState(0);
  const windowSize = useWindowSize();

  const getProgress = async () => {
    console.log('getProgress', ethers.utils.formatEther(tokenSaleContext.totalCroContributed), ethers.utils.formatEther(tokenSaleContext.maxAllocation));
    const value = (tokenSaleContext.totalCroContributed / tokenSaleContext.maxAllocation) * 100;
    console.log('value', value);
    setProgressValue(value);
    const offsetWidth = progressRef.current?.offsetWidth ?? 0;
    setBarSpot((((value > 0 ? value : 1) / 100) * offsetWidth) - 5);
  }
 
  useEffect(() => {
    async function func() {
      await getProgress();
    }
    func();
  }, [tokenSaleContext.totalCroContributed, windowSize.width]);

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
        <Image position='absolute' src={ImageService.translate('/img/battle-bay/bankinterior/progress_bar_spark.png').convert()}
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
              key={i}
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
        <Box>{progressValue ? round(progressValue, 1) : ''}% of $FRTN reserved</Box>
      </Box>
    </>
  )
}