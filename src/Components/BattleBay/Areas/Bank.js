import { useState, useRef, useEffect } from 'react';
import {
  Heading,
  
  Select,
  Button,
  Box,
  Flex,
  Text,
  Spacer,
  Container,
  List,
  ListItem,
  UnorderedList,
  Center,
  Image,
  VStack,
  StackDivider,
  useDisclosure

} from '@chakra-ui/react';
import StakeForm from './StakeForm';
import WithdrawForm from './WithdrawForm';
// note: 1 troop for 500 tokens with minimum lock period
const Bank = ({onBack}) => {

  const { isOpen: isOpenStake, onOpen: onOpenStake, onClose: onCloseStake} = useDisclosure();
  const { isOpen: isOpenWithdraw, onOpen: onOpenWithdraw, onClose: onCloseWithdraw} = useDisclosure();


  const [powerUps, setPowerUps] = useState([])

  useEffect(() => {
    setPowerUps([<Button height={'20px'}>Power Ups</Button>])
  }, [])

  return (
    <Flex>
      <StakeForm isOpen={isOpenStake} onClose={onCloseStake}/>
      <WithdrawForm isOpen={isOpenWithdraw} onClose={onCloseWithdraw}/>

      <Button margin={'36px'} position={'absolute'} onClick={onBack}>Back to Village Map</Button>
      <Container>
        <Box >
          <Center>
          <Image src="/img/battle-bay/bld0.png" alt="Barracks" />
          </Center>
        </Box>
        <Heading className="title text-center">Bank</Heading>
        <Heading size='m' textAlign={'center'}>Stake your Fortune to obtain Mitama</Heading>
        <Flex margin={'24px'} justify={'center'}>
          <Button justifyContent={'center'} w='200px' margin={2} colorScheme='white' variant='outline'
                  onClick={() => {onOpenStake()}}>Stake Fortune</Button>
          <Button justifyContent={'center'} w='200px' margin={2} colorScheme='red' variant='outline'
                  onClick={() => {onOpenWithdraw()}}>Emergency Withdraw</Button>
        </Flex>
          
        <Box textAlign={'center'} marginBottom={'36px'}>
          <p>To receive $Mitama, you must stake $Fortune for AT LEAST the duration of 1 season (90 days).
          If you stake longer than 1 season, you will receive bonus spirit multiplier for each additional season.
          APR from staking goes into the seasonal release pool for user.
          These rewards will be released linearly counting down to end of current season. 
          You can spend out of your rewards pool early to buy {powerUps} without penalty.
          </p>
        </Box>
        
        
      <Flex>
        
      </Flex>


      <Heading size='m' textAlign={'center'}>APR</Heading>
        <p>Staking will also generate a traditional APR yield with boosts per season locked.
        </p>
      <VStack
      divider={<StackDivider borderColor='gray.200' />}
      spacing={4}
      align='stretch'
      // marginTop={'36px'}
      // padding={'24px'}
      >
      
      
      <Spacer />
      <Box>
        <UnorderedList>
          <ListItem>1 season 12%</ListItem>
          <ListItem>2 17%</ListItem>
          <ListItem>3 20%</ListItem>
          <ListItem>4 30%</ListItem>
          <ListItem>8 120%</ListItem>
          <ListItem>12 200%</ListItem>
        </UnorderedList>
      </Box>

      </VStack>
    
      

      </Container>
    </Flex>
  )
};


export default Bank;