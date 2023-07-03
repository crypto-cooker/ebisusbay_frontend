import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {
  Box, 
  GridItem,
  HStack, 
  Image, 
  SimpleGrid, 
  Text, 
  VStack,
  Avatar,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Button
} from "@chakra-ui/react";

import {useContext, useEffect, useState} from "react";
import {appConfig} from "@src/Config";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import moment from "moment";
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {parseErrorMessage} from "@src/helpers/validator";
import { AddIcon, MinusIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { getLocation } from "graphql";

interface BattleLogProps {
  isOpen: boolean;
  onClose: () => void;
}
interface spoofTroopLog {
  eventTimestamp: string;
  actionType: string;
  changeInTroops: number;
  factionA: {
      id: number;
      image: string;
      name: string;
      totalTroops: number;
  }[];
  factionB: {
    id: number;
    image: string;
    name: string;
    totalTroops: number;
  }[];
  locationId: number;
}[];

const BattleLog = ({isOpen, onClose}: BattleLogProps) => {
  const dispatch = useDispatch();
  const { config: rdConfig, game: rdGameContext, user: rdUser} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector(state => state.user);
  const [_, getSigner] = useCreateSigner();
  const [amountLoaded, setAmountLoaded] = useState(0);

  const connectWalletPressed = async () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };

  const GetControlPointName = (locationNumber: number) => {
    if(!rdGameContext) return "";

    if(locationNumber===0) return "available";

    if(locationNumber===1) return "Seashrine";
    //itterate through all control points
    // rdGameContext.game.parent.map.regions.map((region: any) =>
    //   region.controlPoints.map((controlPoint: any, i: any) => (
    //     //if controlPoint.id == id
    //     //return controlPoint.name
    //     //else continue
    //   )))
  }
  const ParseTimestamp = (timestamp: string) => {
    return moment(timestamp).format('MM/DD/YYYY h:mm:ss a');
  }
  
  const spoofedTroops: Array<spoofTroopLog> = [
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"attack",changeInTroops:-2,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":12}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:0},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"add",changeInTroops:2,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":220}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:1},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"send",changeInTroops:-3,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":440}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:0},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"send",changeInTroops:-10,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":30}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:0},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"send",changeInTroops:-10,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":20}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:1},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"send",changeInTroops:-10,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":20}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:0},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"send",changeInTroops:-10,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":10}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:1},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"send",changeInTroops:-10,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":10}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:0},
    {eventTimestamp:"2021-09-30T18:00:00.000Z", actionType:"send",changeInTroops:-10,factionA:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","totalTroops":20}],factionB:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","totalTroops":0}],locationId:0},
  ];
  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Battle Log'
    >
      <Box mx={1} pb={4}>
        <Text align='center'>
          Add Filter Here
        </Text>
        <Divider orientation='vertical' position='absolute' height='100%' marginLeft='4' borderWidth='2px'/>

        {!!user.address ? (
          <>
            <SimpleGrid columns={1} gap={35} padding={2} my={4} paddingLeft='10'>
              {spoofedTroops.map((log, index) => (
                <Box bg='gray.700' borderRadius='md' p={2}>
                  <Text fontSize={14} marginTop={-7} marginBottom={2}>{ParseTimestamp(log.eventTimestamp)}</Text>

                  {log.actionType === "attack" ? (
                    <AttackLog spoofTroopLog={log} key={index}/>
                  ) : 
                  log.actionType === "add" ? (
                    <AddLog spoofTroopLog={log} key={index}/>
                  ) :
                  log.actionType === "send" ? (
                    <SendLog spoofTroopLog={log} locationName={GetControlPointName(log.locationId)} key={index}/>
                  ) : (<></> )}

                </Box>
              ))}
            </SimpleGrid>
            <Box textAlign='center' mt={4}>
              <RdButton onClick={() => setAmountLoaded(amountLoaded+10)}>Load More</RdButton>
            </Box>
          </>
        ) : (
          <Box textAlign='center' mt={4}>
            <RdButton onClick={connectWalletPressed}>Connect Wallet</RdButton>
          </Box>
        )}
      </Box>
    </RdModal>
  )
}

export default BattleLog;

interface LogProps {
  spoofTroopLog: spoofTroopLog;
  locationName?: string;
}

const AttackLog = ({spoofTroopLog}: LogProps) => {
  return (
    <>
      <Box
        position='absolute'
        boxSize='20px'
        marginTop={-10}
        marginLeft={-12}
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
          border='4px solid #F48F0C'
          w={8}
          h={10}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          <MinusIcon />
        </Button>
      </Box>

      <Text as='b' fontSize={26}>Lost {-spoofTroopLog.changeInTroops} troops</Text>
      <Grid
        marginTop={4}
        marginBottom={4}
        h='100px'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(3, 1fr)'
        gap={4}
      >
        <Box justifySelf='center'>
          <Text>{spoofTroopLog.factionB[0].name}</Text>
          <Avatar src={ImageService.translate(spoofTroopLog.factionB[0].image).avatar()} size='lg' />
        </Box>
        
        <Box justifySelf='center'>
          <Text marginBottom={-2}>ATTACK</Text>
          <ArrowForwardIcon/>
        </Box>

        <Box justifySelf='center'>
          <Text>{spoofTroopLog.factionA[0].name}</Text>
          <Avatar src={ImageService.translate(spoofTroopLog.factionA[0].image).avatar()} size='lg' />
        </Box>
      </Grid>
    </>
  )
}
const AddLog = ({spoofTroopLog}: LogProps) => {
  return (
    <>
    <Box
        position='absolute'
        boxSize='20px'
        marginTop={-10}
        marginLeft={-12}
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
          border='4px solid #F48F0C'
          w={8}
          h={10}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          <MinusIcon />
        </Button>
      </Box>

      <HStack spacing={2}>
        <Text as='b' fontSize={26}>Recieved {spoofTroopLog.changeInTroops} troops</Text>
      </HStack>
      </>
  )
}
const SendLog = ({spoofTroopLog, locationName}: LogProps) => {
  return (
    <>
    <Box
        position='absolute'
        boxSize='20px'
        marginTop={-10}
        marginLeft={-12}
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
          border='4px solid #F48F0C'
          w={8}
          h={10}
          _groupHover={{
            bg: '#de8b08',
            borderColor: '#f9a50b',
          }}
        >
          <MinusIcon />
        </Button>
      </Box>

      <HStack justifyContent={"space-between"}>
        <Text as='b' fontSize={26}>Sent {-spoofTroopLog.changeInTroops} troops</Text>
        <VStack justifyContent="center" spacing='0'>
          <Text fontSize={14}>({locationName})</Text>
          <HStack justifyContent={"space-between"}>
            <Text>{spoofTroopLog.factionA[0].totalTroops}</Text>
            <ArrowForwardIcon/>
            <Text as='b'>{spoofTroopLog.factionA[0].totalTroops + spoofTroopLog.changeInTroops}</Text>
          </HStack>
        </VStack>
      </HStack>

      <Grid
        marginTop={4}
        marginBottom={4}
        h='100px'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(3, 1fr)'
        gap={4}
      >
        <VStack justifySelf='center' spacing='0'>
          <Text>{spoofTroopLog.factionA[0].name}</Text>
          <Avatar src={ImageService.translate(spoofTroopLog.factionA[0].image).avatar()} size='lg' />
          <Text>{spoofTroopLog.factionA[0].totalTroops}</Text>
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>SEND</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{spoofTroopLog.factionB[0].name}</Text>
          <Avatar src={ImageService.translate(spoofTroopLog.factionB[0].image).avatar()} size='lg' />
          <Text>{spoofTroopLog.factionB[0].totalTroops}</Text>
        </VStack>
      </Grid>
    </>
  )
}