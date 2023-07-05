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
import {getBattleLog} from "@src/core/api/RyoshiDynastiesAPICalls";
import {toast} from "react-toastify";
import {pluralize} from "@src/utils";

interface BattleLogProps {
  isOpen: boolean;
  onClose: () => void;
}
interface battleLog {
  eventTimestamp?: string;
  event: string;
  pastTroops: number;
  currentTroops: number;
  controlPoint: string;
  entity1: {
      image: string;
      name: string;
      troops: number;
      type: string;
  };
  entity2: {
    image: string;
    name: string;
    troops: number;
    type: string;
  };
  // locationId: number;
}[];

const BattleLog = ({isOpen, onClose}: BattleLogProps) => {
  const dispatch = useDispatch();
  const { config: rdConfig, game: rdGameContext, user: rdUser} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useAppSelector(state => state.user);
  const [_, getSigner] = useCreateSigner();
  const [amountLoaded, setAmountLoaded] = useState(0);
  const [pagesToLoad, setPagesToLoad] = useState(2);
  const [battleLog, setBattleLog] = useState<any[]>([]);

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
  const GetBattleLog = async () => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const data = await getBattleLog(user.address!.toLowerCase(), signatureInStorage,
          rdGameContext?.game.id, pagesToLoad, 1);
        setBattleLog(data);
       
      } catch (error:any) {
        console.log(error)
        toast.error(parseErrorMessage(error));
      }
    }
  }

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
  
  // const spoofedTroops: Array<battleLog> = [
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"attack",currentTroops:-2,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":12}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:0},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"add",currentTroops:2,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":220}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:1},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"send",currentTroops:-3,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":440}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:0},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"send",currentTroops:-10,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":30}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:0},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"send",currentTroops:-10,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":20}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:1},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"send",currentTroops:-10,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":20}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:0},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"send",currentTroops:-10,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":10}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:1},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"send",currentTroops:-10,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":10}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:0},
  //   {eventTimestamp:"2021-09-30T18:00:00.000Z", event:"send",currentTroops:-10,entity1:[{"id":1,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/1.png","name":"FactionA","troops":20}],entity2:[{"id":2,"image":"https://ryoshis-portal.s3.amazonaws.com/factions/2.png","name":"FactionB","troops":0}],locationId:0},
  // ];

  useEffect(() => {
    if(!rdGameContext) return;

    GetBattleLog();
  }, [rdGameContext])

  useEffect(() => {
    if(!battleLog) return;
    console.log(battleLog);
  }, [battleLog])

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Battle Log'
    >
      <Box mx={1} pb={4} mt={25}>
        {/* <Text align='center'> Add Filter Here </Text> */}
        <Divider orientation='vertical' position='absolute' height='100%' marginLeft='4' borderWidth='2px'/>

        {!!user.address ? (
          <>
          <SimpleGrid columns={1} gap={35} padding={2} my={4} paddingLeft='10'>
              {battleLog.map((logEntry, index) => (
                <Box bg='gray.700' borderRadius='md' p={2}>
                  {/* <Text fontSize={14} marginTop={-7} marginBottom={2}>{ParseTimestamp(logEntry.eventTimestamp)}</Text> */}

                  {logEntry.event === "ATTACK" ? (
                    <AttackLog battleLog={logEntry} key={index}/>
                    ) : 
                  logEntry.event === "DEFEND" ? (
                    <DefendLog battleLog={logEntry} key={index}/>
                    ) : 
                  logEntry.event === "DEPLOY" ? (
                    <DeployLog battleLog={logEntry} key={index}/>
                  // ) : 
                  // logEntry.event === "ADD" ? (
                  //   <AddLog2 spoofTroopLog={logEntry} key={index}/>
                  // ) :
                  // logEntry.event === "SEND" ? (
                  //   <SendLog2 spoofTroopLog={logEntry} key={index}/>
                  ) : (<></> )}

                </Box>
              ))}
            </SimpleGrid>

            {/* <SimpleGrid columns={1} gap={35} padding={2} my={4} paddingLeft='10'>
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
            </SimpleGrid> */}
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
  battleLog: battleLog;
  // locationName?: string;
}

const AttackLog = ({battleLog}: LogProps) => {
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
        <Text as='b' fontSize={26}>Lost {battleLog.pastTroops-battleLog.currentTroops} {pluralize(battleLog.pastTroops-battleLog.currentTroops, 'troop')}</Text>
         <VStack justifyContent="center" spacing='0'>
          <Text fontSize={14}>({battleLog.controlPoint})</Text>
           <HStack justifyContent={"space-between"}>
             <Text>{battleLog.pastTroops}</Text>
             <ArrowForwardIcon/>
             <Text as='b'>{battleLog.currentTroops}</Text>
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
          <Text>{battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).avatar()} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>ATTACK</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).avatar()} size='lg' />
        </VStack>
      </Grid>
    </>
  )
}
const DefendLog = ({battleLog}: LogProps) => {
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
        <Text as='b' fontSize={26}>Lost {battleLog.pastTroops-battleLog.currentTroops} {pluralize(battleLog.pastTroops-battleLog.currentTroops, 'troop')}</Text>
         <VStack justifyContent="center" spacing='0'>
          <Text fontSize={14}>({battleLog.controlPoint})</Text>
           <HStack justifyContent={"space-between"}>
             <Text>{battleLog.pastTroops}</Text>
             <ArrowForwardIcon/>
             <Text as='b'>{battleLog.currentTroops}</Text>
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
          <Text>{battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).avatar()} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>DEFEND</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).avatar()} size='lg' />
        </VStack>
      </Grid>
    </>
  )
}
const DeployLog = ({battleLog}: LogProps) => {
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
          <ArrowForwardIcon />
        </Button>
      </Box>


      <HStack justifyContent={"space-between"}>
        <Text as='b' fontSize={26}>Deployed {battleLog.currentTroops-battleLog.pastTroops} {pluralize(battleLog.currentTroops -battleLog.pastTroops, 'troop')}</Text>
         <VStack justifyContent="center" spacing='0'>
          <Text fontSize={14}>({battleLog.controlPoint})</Text>
           <HStack justifyContent={"space-between"}>
             <Text>{battleLog.pastTroops}</Text>
             <ArrowForwardIcon/>
             <Text as='b'>{battleLog.currentTroops}</Text>
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
          <Text>{battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).avatar()} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>DEPLOY</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).avatar()} size='lg' />
        </VStack>
      </Grid>
    </>
  )
}
// const AddLog = ({spoofTroopLog}: LogProps) => {
//   return (
//     <>
//     <Box
//         position='absolute'
//         boxSize='20px'
//         marginTop={-10}
//         marginLeft={-12}
//         rounded='full'
//         zIndex={1}
//         _groupHover={{
//           cursor: 'pointer'
//         }}
//         data-group
//       >
//         <Button
//           bg='#C17109'
//           rounded='full'
//           border='4px solid #F48F0C'
//           w={8}
//           h={10}
//           _groupHover={{
//             bg: '#de8b08',
//             borderColor: '#f9a50b',
//           }}
//         >
//           <AddIcon />
//         </Button>
//       </Box>

//       <HStack spacing={2}>
//         <Text as='b' fontSize={26}>Recieved {spoofTroopLog.currentTroops} troops</Text>
//       </HStack>
//       </>
//   )
// }
// const SendLog = ({spoofTroopLog, locationName}: LogProps) => {
//   return (
//     <>
//     <Box
//         position='absolute'
//         boxSize='20px'
//         marginTop={-10}
//         marginLeft={-12}
//         rounded='full'
//         zIndex={1}
//         _groupHover={{
//           cursor: 'pointer'
//         }}
//         data-group
//       >
//         <Button
//           bg='#C17109'
//           rounded='full'
//           border='4px solid #F48F0C'
//           w={8}
//           h={10}
//           _groupHover={{
//             bg: '#de8b08',
//             borderColor: '#f9a50b',
//           }}
//         >
//           <MinusIcon />
//         </Button>
//       </Box>

//       <HStack justifyContent={"space-between"}>
//         <Text as='b' fontSize={26}>Sent {-spoofTroopLog.currentTroops} troops</Text>
//         <VStack justifyContent="center" spacing='0'>
//           <Text fontSize={14}>({locationName})</Text>
//           <HStack justifyContent={"space-between"}>
//             <Text>{spoofTroopLog.entity1[0].troops}</Text>
//             <ArrowForwardIcon/>
//             <Text as='b'>{spoofTroopLog.entity1[0].troops + spoofTroopLog.currentTroops}</Text>
//           </HStack>
//         </VStack>
//       </HStack>

//       <Grid
//         marginTop={4}
//         marginBottom={4}
//         h='100px'
//         templateRows='repeat(1, 1fr)'
//         templateColumns='repeat(3, 1fr)'
//         gap={4}
//       >
//         <VStack justifySelf='center' spacing='0'>
//           <Text>{spoofTroopLog.entity1[0].name}</Text>
//           <Avatar src={ImageService.translate(spoofTroopLog.entity1[0].image).avatar()} size='lg' />
//           <Text>{spoofTroopLog.entity1[0].troops}</Text>
//         </VStack>
        
//         <VStack justifySelf='center' justifyContent="center">
//           <Text marginBottom={-2}>SEND</Text>
//           <ArrowForwardIcon/>
//         </VStack>

//         <VStack justifySelf='center' spacing='0'>
//           <Text>{spoofTroopLog.entity2[0].name}</Text>
//           <Avatar src={ImageService.translate(spoofTroopLog.entity2[0].image).avatar()} size='lg' />
//           <Text>{spoofTroopLog.entity2[0].troops}</Text>
//         </VStack>
//       </Grid>
//     </>
//   )
// }