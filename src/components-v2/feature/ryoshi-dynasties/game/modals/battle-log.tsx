import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {ApiService} from "@src/core/services/api-service";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import React, {useContext, useEffect, useState} from "react";
import ImageService from "@src/core/services/image";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {ArrowForwardIcon, MinusIcon} from "@chakra-ui/icons";
import {isAddress, pluralize, shortAddress} from "@src/utils";

import localFont from 'next/font/local';
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";

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
  const { game: rdGameContext} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const user = useUser();
  const [sortOrder, setSortOrder] = useState("desc" as "asc" | "desc");
  const {signature, isSignedIn, requestSignature} = useEnforceSignature();

  const connectWalletPressed = async () => {
    user.connect();
  };

  const GetBattleLog = async ({ pageParam = 1 }) => {
    return await ApiService.withoutKey().ryoshiDynasties.getBattleLog({
      address: user.address!,
      signature: signature!,
      gameId: rdGameContext!.game.id,
      page: pageParam,
      pageSize: 10,
      orderBy: sortOrder
    })
  }

  const {data, error, fetchNextPage, hasNextPage, status} = useInfiniteQuery({
    queryKey: ['BattleLog', user.address, rdGameContext?.game.id, sortOrder],
    queryFn: GetBattleLog,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: isOpen && !!user.address && !!rdGameContext?.game.id && !!signature,
  });

  const ReloadBattleLog = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }

  const ParseTimestamp = (timestamp: number) => {
    const milliseconds = timestamp * 1000 
    const dateObject = new Date(milliseconds)
    return dateObject.toLocaleString()
  }

  useEffect(() => {
    if (!isOpen) return;

    if (!isSignedIn) {
      requestSignature();
    }
  }, [isOpen, isSignedIn]);

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
              <InfiniteScroll
                dataLength={data?.pages ? data.pages.flat().length : 0}
                next={fetchNextPage}
                hasMore={hasNextPage ?? false}
                style={{ overflow: 'hidden' }}
                loader={
                  <Center>
                    <Spinner />
                  </Center>
                }
              >
                {status === 'pending' ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : status === "error" ? (
                  <Box textAlign='center'>Error: {(error as any).message}</Box>
                ) : data?.pages.map((page) => page).flat().length > 0 ? (
                  <SimpleGrid columns={1} gap={55} padding={2} my={4} paddingLeft='10'>
                    {data.pages.map((items, pageIndex) => (
                      <React.Fragment key={pageIndex}>
                        {items.data.map((logEntry, itemIndex) => (
                          <Box bg='#272523' borderRadius='md' p={2}
                               box-shadow= "5px 10px 18px red"
                               style={{boxShadow: "0 10px 20px rgba(0, 0, 0, 0.7)"}}
                               border="1px solid #F48F0C"
                          >
                            <Text fontSize={14} marginTop={-8} marginBottom={2}>{ParseTimestamp(logEntry.date)}</Text>
                            {logEntry.event === "ATTACK" ? (
                              <AttackLog battleLog={logEntry} key={itemIndex}/>
                            ) : logEntry.event === "DEFEND" ? (
                              <DefendLog battleLog={logEntry} key={itemIndex}/>
                            ) : logEntry.event === "DEPLOY" ? (
                              <DeployLog battleLog={logEntry} key={itemIndex}/>
                            ) : logEntry.event === "RELOCATE" ? (
                              <RelocateLog battleLog={logEntry} key={itemIndex}/>
                            ) : logEntry.event === "DELEGATE" ? (
                              <DelegateLog battleLog={logEntry} key={itemIndex}/>
                            ) : logEntry.event === "ADJUSTMENT" ? (
                              <AdjustmentLog battleLog={logEntry} key={itemIndex}/>
                            ) :
                            logEntry.event === "UNDELEGATE" && (
                              <UndelegateLog battleLog={logEntry} key={itemIndex}/>
                              // ) :
                              // logEntry.event === "SEND" ? (
                              //   <SendLog2 spoofTroopLog={logEntry} key={index}/>
                            )}
                          </Box>
                        ))}
                      </React.Fragment>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign='center' mt={8}>
                    <Text>No logs available</Text>
                  </Box>
                )}
              </InfiniteScroll>
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
          <Text>{isAddress(battleLog.entity1.name) ? shortAddress(battleLog.entity1.name) : battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>ATTACK</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{isAddress(battleLog.entity2.name) ? shortAddress(battleLog.entity2.name) : battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).fixedWidth(64, 64)} size='lg' />
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
          <Text>{isAddress(battleLog.entity1.name) ? shortAddress(battleLog.entity1.name) : battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>DEFEND</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{isAddress(battleLog.entity2.name) ? shortAddress(battleLog.entity2.name) : battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).fixedWidth(64, 64)} size='lg' />
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
          <Text>{isAddress(battleLog.entity1.name) ? shortAddress(battleLog.entity1.name) : battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>DEPLOY</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{isAddress(battleLog.entity2.name) ? shortAddress(battleLog.entity2.name) : battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).fixedWidth(64, 64)} size='lg' />
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
          <Text>{isAddress(battleLog.entity1.name) ? shortAddress(battleLog.entity1.name) : battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>DELEGATE</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{isAddress(battleLog.entity2.name) ? shortAddress(battleLog.entity2.name) : battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
      </Grid>
    </>
  )
}
const UndelegateLog = ({battleLog}: LogProps) => {
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
          <Text>{isAddress(battleLog.entity1.name) ? shortAddress(battleLog.entity1.name) : battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>UNDELEGATE</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{isAddress(battleLog.entity2.name) ? shortAddress(battleLog.entity2.name) : battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
      </Grid>
    </>
  )
}
const AdjustmentLog = ({battleLog}: LogProps) => {
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
        <Text as='b' fontSize={16}>Adjusted {battleLog.currentTroops-battleLog.pastTroops} {pluralize(battleLog.currentTroops -battleLog.pastTroops, 'troop')}</Text>
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
          <Text>{isAddress(battleLog.entity1.name) ? shortAddress(battleLog.entity1.name) : battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
        
        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>ADJUSTMENT</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{isAddress(battleLog.entity2.name) ? shortAddress(battleLog.entity2.name) : battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).fixedWidth(64, 64)} size='lg' />
        </VStack>
      </Grid>
    </>
  )
}

const RelocateLog = ({battleLog}: LogProps) => {
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
        <Text as='b' fontSize={16}>Relocated {battleLog.currentTroops-battleLog.pastTroops} {pluralize(battleLog.currentTroops -battleLog.pastTroops, 'troop')}</Text>
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
          <Text>{isAddress(battleLog.entity1.name) ? shortAddress(battleLog.entity1.name) : battleLog.entity1.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity1.image).fixedWidth(64, 64)} size='lg' />
        </VStack>

        <VStack justifySelf='center' justifyContent="center">
          <Text marginBottom={-2}>DEPLOY</Text>
          <ArrowForwardIcon/>
        </VStack>

        <VStack justifySelf='center' spacing='0'>
          <Text>{isAddress(battleLog.entity2.name) ? shortAddress(battleLog.entity2.name) : battleLog.entity2.name}</Text>
          <Avatar src={ImageService.translate(battleLog.entity2.image).fixedWidth(64, 64)} size='lg' />
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