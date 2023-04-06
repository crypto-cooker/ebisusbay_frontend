import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Heading,
  Box,
  UnorderedList,
  ListItem,
  Flex,
  Spacer,
  Center,
  Image,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  StackDivider,
  Grid,
  GridItem,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  ButtonGroup,
  IconButton,

} from '@chakra-ui/react';

import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {useSelector} from "react-redux";
import { getAuthSignerInStorage } from '@src/helpers/storage';

const Barracks = ({onBack}) => {
  const [isLoading, getSigner] = useCreateSigner();
  const [daysStaked, setDaysStaked] = useState(90)
  const handleChangeDays = (value) => setAttackerTroops(value)
  const user = useSelector((state) => state.user);
  const [cards, setCards] = useState([])

  const StakeRyoshi = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    // console.log(signatureInStorage)
    // console.log(user.address.toLowerCase())
    // if (signatureInStorage) {
    //   try {
    //     const res = await getProfile(signatureInStorage, user.address.toLowerCase())
    //     console.log(res)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }
  const DisplayRyoshis = async () => {
    let stakedRyoshis = ['', '', '', '', '']
    setCards  ( stakedRyoshis.map((ryoshi, i) => 
        (<Card   border={'1px solid white'} borderRadius={'10px'}>
        <CardHeader>
          <Heading size='md'>{ryoshi.name}</Heading>
        </CardHeader>
        <CardBody>
          <Text></Text>
        </CardBody>
        <CardFooter>
        <Button type="legacy"
              onClick={() => {StakeRyoshi()}}
              className="flex-fill">
              Stake New Ryoshi
            </Button>
        </CardFooter>
      </Card>
        )))
  }
  useEffect(() => {
    StakeRyoshi()
    DisplayRyoshis()
  }, [])

  return (
    <Flex>
    <Button margin={'36px'} position={'absolute'} onClick={onBack}>Back to Village Map</Button>
      <Container>
      <Box >
        <Center>
        <Image src='img/battle-bay/barracks_day.png'/>
        </Center>
      </Box>
      <Heading className="title text-center">Barracks</Heading>
      <VStack
      divider={<StackDivider borderColor='gray.200' />}
      spacing={4}
      align='stretch'
      // marginTop={'36px'}
      // padding={'24px'}
      >
      <Heading size='m' textAlign={'center'}>Stake Ryoshi Tales NFTs to receive a bonus APR Multiplier</Heading>
      <Flex>
    <Box w='200px'>
        <UnorderedList>
        <Heading size='sm' textAlign={'center'}>VIP</Heading>
          <ListItem>Top 5% rarity .5x</ListItem>
          <ListItem>Top 10% .3x</ListItem>
          <ListItem>Top 20% .2x</ListItem>
          <ListItem>remaining .1</ListItem>
        </UnorderedList>
      </Box>
      <Spacer />
      <Box w='200px'>
        <UnorderedList>
        <Heading size='sm' textAlign={'center'}>Holiday</Heading>
          <ListItem>Top 5% rarity .4x</ListItem>
          <ListItem>Top 10% .2x</ListItem>
          <ListItem>Top 20% .1x</ListItem>
          <ListItem>remaining .05</ListItem>
        </UnorderedList>
      </Box>
      </Flex>
    </VStack>

      <SimpleGrid marginTop={'16px'} spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {cards} <Box>
          <FormControl>
            <FormLabel>Duration (Days):</FormLabel>
            <NumberInput defaultValue={90} min={90} max={1080} name="quantity" 
              onChange={handleChangeDays}
              value={daysStaked} type ='number'>
             <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <p> Min: 90 days (1 season)</p>
          <p> Max: 1080 days (12 seasons)</p>
        </Box>
      </SimpleGrid>

     <Flex>

      <Spacer />
        
      </Flex>
      <Flex>
        <Box marginTop={'12px'}>
      0 out of a Maximum of 5 staked. 
      <p>Each Ryoshi Staked gives 2 troops</p>
        </Box>
        </Flex>
      </Container>
      </Flex>
  )
};


export default Barracks;