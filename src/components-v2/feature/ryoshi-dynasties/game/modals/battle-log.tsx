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
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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
import RdInlineModal from "../../components/rd-inline-modal";

import localFont from 'next/font/local';
const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })

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
  const [pageToLoad, setPageToLoad] = useState(1);
  const [battleLog, setBattleLog] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState("desc" as "asc" | "desc");
  const [moreToLoad, setMoreToLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
        const data = await getBattleLog(
          user.address!.toLowerCase(), 
          signatureInStorage,
          rdGameContext?.game.id, 
          5, 
          pageToLoad,
          sortOrder
          );
        if(data.length < 5) setMoreToLoad(false);
        if(data.length == 0) return; //prevents run away loop

        //add the data to the battleLog array
        setBattleLog([...battleLog, ...data]);
      } catch (error:any) {
        console.log(error)
        toast.error(parseErrorMessage(error));
      }
    }
    setIsLoading(false)
  }

  const LoadAdditionalBattleLog = () => {
    setIsLoading(true);
    setMoreToLoad(true);
    setPageToLoad(pageToLoad+1);
  }

  const ReloadBattleLog = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    setPageToLoad(1);
    setBattleLog([]);
  }

  const ParseTimestamp = (timestamp: number) => {
    const milliseconds = timestamp * 1000 
    const dateObject = new Date(milliseconds)
    return dateObject.toLocaleString()
  }

  useEffect(() => {
    if(pageToLoad==1) return;
    GetBattleLog();
  }, [pageToLoad])
  
  useEffect(() => {
    if(!rdGameContext) return;
    if(!user.address) return;

    GetBattleLog();
  }, [rdGameContext, user.address])

  useEffect(() => {
    if(!battleLog) return;
    if(battleLog.length != 0) return;

    GetBattleLog();
  }, [battleLog])

  return (
    <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>GameLog</DrawerHeader>

      <DrawerBody>
      <Box position='absolute'>

      <Button w={100} marginTop={-24} marginLeft={150} onClick={() => ReloadBattleLog()} >
          <Text fontSize={12}> {sortOrder === "asc" ? "Oldest" : "Most Recent"} </Text>
      </Button>
      
      </Box>

      <Box mx={1} pb={4} mt={25} maxW="500px">
        
        <Divider orientation='vertical' position='absolute' height='100%' marginLeft='4' borderWidth='2px'/>

        {!!user.address ? (
          <>
          <SimpleGrid columns={1} gap={55} padding={2} my={4} paddingLeft='10'>
              {battleLog.map((logEntry, index) => (
                <Box bg='#272523' borderRadius='md' p={2}
                  box-shadow= "5px 10px 18px red"
                  style={{boxShadow: "0 10px 20px rgba(0, 0, 0, 0.7)"}}
                  border="1px solid #F48F0C"
                  >
                  <Text fontSize={14} marginTop={-8} marginBottom={2}>{ParseTimestamp(logEntry.date)}</Text>

                  {logEntry.event === "ATTACK" ? (
                    <AttackLog battleLog={logEntry} key={index}/>
                    ) : 
                  logEntry.event === "DEFEND" ? (
                    <DefendLog battleLog={logEntry} key={index}/>
                    ) : 
                  logEntry.event === "DEPLOY" ? (
                    <DeployLog battleLog={logEntry} key={index}/>
                    ) : 
                  logEntry.event === "DELEGATE" ? (
                    <DelegateLog battleLog={logEntry} key={index}/>
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

            {moreToLoad ? (
            <Box textAlign='center' mt={4}>
              <RdButton 
                onClick={() => LoadAdditionalBattleLog()}>
                  {isLoading ? "Loading..." : "Load More"}
                </RdButton>
            </Box>
            ) : 
              (<>
            <Box textAlign='center' mt={4}>
              <Text as={"i"} color='lightgray' textAlign='center' mt={4}>No more logs to load</Text>
            </Box>
              </>)}
          </>
        ) : (
          <Box textAlign='center' mt={4}>
            <RdButton onClick={connectWalletPressed}>Connect Wallet</RdButton>
          </Box>
        )}


      </Box>
    </DrawerBody>
        </DrawerContent>
      </Drawer>
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
        // position='absolute'
        boxSize='20px'
        marginTop={-6}
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
        <Text as='b' fontSize={16} className={gothamBook.className}>Lost {battleLog.pastTroops-battleLog.currentTroops} {pluralize(battleLog.pastTroops-battleLog.currentTroops, 'troop')}</Text>
         <VStack justifyContent="center" spacing='0'>
          <Text fontSize={10}>({battleLog.controlPoint})</Text>
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
        // position='absolute'
        boxSize='20px'
        marginTop={-6}
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
        <Text as='b' fontSize={16}>Lost {battleLog.pastTroops-battleLog.currentTroops} {pluralize(battleLog.pastTroops-battleLog.currentTroops, 'troop')}</Text>
         <VStack justifyContent="center" spacing='0'>
          <Text fontSize={10}>({battleLog.controlPoint})</Text>
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
        // position='absolute'
        boxSize='20px'
        marginTop={-6}
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
        <Text as='b' fontSize={16}>Deployed {battleLog.currentTroops-battleLog.pastTroops} {pluralize(battleLog.currentTroops -battleLog.pastTroops, 'troop')}</Text>
         <VStack justifyContent="center" spacing='0'>
          <Text fontSize={10}>({battleLog.controlPoint})</Text>
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
const DelegateLog = ({battleLog}: LogProps) => {
  return (
    <>
      <Box
        // position='absolute'
        boxSize='20px'
        marginTop={-6}
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
        <Text as='b' fontSize={16}>Delegated {battleLog.currentTroops-battleLog.pastTroops} {pluralize(battleLog.currentTroops -battleLog.pastTroops, 'troop')}</Text>
         <VStack justifyContent="center" spacing='0'>
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
          <Text marginBottom={-2}>DELEGATE</Text>
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