import {Box, Center, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spacer, Text, Wrap, WrapItem, Stack, useDisclosure, VStack} from "@chakra-ui/react"
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import { RyoshiDynastiesContext, RyoshiDynastiesContextProps } from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {ApiService} from "@src/core/services/api-service";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import {BigNumber, Contract, ethers} from "ethers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import localFont from "next/font/local";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/meeple/faq-page";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {RdModalAlert, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const gothamBook = localFont({ src: '../../../../../../../../src/fonts/Gotham-Book.woff2' });

interface MeepleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Meeple = ({isOpen, onClose}: MeepleProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const fetcher = async () => {
    return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
  }
  const [page, setPage] = useState<string>();
  const [meepleCount, setMeepleCount] = useState<number>(0);
  const [needsToPayUpkeep, setNeedsToPayUpkeep] = useState<boolean>(true);
  const [upkeepCost, setUpkeepCost] = useState<number>(0);
  const [upkeepModifirer, setUpkeepModifirer] = useState<number>(0);

  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const { isOpen: isOpenUpkeepModal, onOpen: onOpenUpkeepModal, onClose: onCloseUpkeepModal } = useDisclosure();
  const { isOpen: isOpenTurnInCardsModal, onOpen: onOpenTurnInCardsModal, onClose: onCloseTurnInCardsModal } = useDisclosure();

  const handleClose = () => {
    onClose();
  }

  const upKeepModifier = [
    { min: 0, value: 0},
    { min: 201, value: 1},
    { min: 1000, value: 2},
    { min: 5000, value: 3},
  ]

  const PayUpkeep = () => {
    //add function to play Upkeep
  }

  const GetMeepleCount = () => {
    //add function to get Meeple Count
    setMeepleCount(3520);

  }

  const GetUpkeepCost = () => {
    //add function to get Upkeep Cost
    setUpkeepCost(50);
  }

  const GetUpkeepPaymentStatus = () => {
    //add function to get Upkeep Payment Status
    setNeedsToPayUpkeep(true);
  }
  
  const GetUpkeepModifier = () => {
    let cost = 0;
    upKeepModifier.forEach((item) => {
      if (meepleCount >= item.min) {
        cost = item.value;
      }
    })

    setUpkeepModifirer(cost);
  }

  useEffect(() => {
    GetMeepleCount();
    GetUpkeepPaymentStatus();
  }, [])

  useEffect(() => {
    GetUpkeepCost();
  }, [meepleCount])

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  return (
    <>
  <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Meeple Management'
      size='2xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <>
         <Box p={4}>
            <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
                <Box textAlign='center'>
                  Weekly Upkeep
                </Box>
                <Flex justifyContent={'space-between'}>
                  <HStack marginTop={'auto'} spacing={1} mb={4} justifyContent={'center'}>
                      <Text marginTop={'auto'} align='center' color={'#aaa'} alignContent={'auto'}p={2}> Meeple Held: </Text>
                      <Text marginTop={'auto'} align='center' as={'b'} fontSize='28' p={2}>{meepleCount}</Text>
                      <VStack marginTop={'auto'}  >
                        <Text pb={0} color={'#aaa'}>Upkeep Cost:</Text>
                        <Text pt={0} mt={0} color={'#aaa'}>{upkeepCost}Koban x {upkeepModifirer}X = {upkeepCost * upkeepModifirer}</Text>
                      </VStack>
                  </HStack>
                  <Box justifyContent='space-between' alignItems='center'>
                    {needsToPayUpkeep ? (
                      <RdButton
                          h={12}
                          onClick={() => onOpenConfirmation()}
                          size='lg'
                          >
                          Pay Upkeep
                      </RdButton> 
                    ) : (
                      <Text color={'#aaa'}>Weekly Upkeep Paid</Text>
                    )}
                  </Box>
                </Flex>
                {meepleCount > 3000 && (
            <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={4}>
            <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
            <Text
                fontSize='14'
                color='#333'
                fontWeight='bold'
            >
                Warning: Should you hold more than the current limt (3000 Meeple) at the end of the week, they will be lost. Withdraw them from the platform or to spend them in battles and resource gathering.
            </Text>
            </Stack>
            )}
              </Box>
              

              <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
                <Box textAlign='center'>
                Earn Additional Meeple
                </Box>
                <Flex justifyContent={'space-between'}>
                  <RdButton
                      h={12}
                      onClick={() => onOpenConfirmation()}
                      size='lg'
                      >
                      Turn in Cards
                  </RdButton> 
                  <RdButton
                      h={12}
                      onClick={() => onOpenConfirmation()}
                      size='lg'
                      >
                      Withdraw Meeple
                  </RdButton> 
                </Flex>
              </Box>

          <Box p={4}>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={{base: 2, sm: 4}}>
              
              </SimpleGrid>
            </Flex>
          </Box>
          
          {meepleCount > 0 ? (
                    <>
                        <RdModal
                            isOpen={isConfirmationOpen}
                            onClose={onCloseConfirmation}
                            title='Confirm'
                        >
                            <RdModalAlert>
                            <Text>Warning: Claiming from the current season is subject to % Karmic Debt <strong>burn</strong> of <strong> FRTN</strong>. At this point in the season, you will only be able to claim <Text as='span' color='#FDAB1A' fontWeight='bold'> FRTN</Text></Text>
                            </RdModalAlert>
                            <RdModalFooter>
                            <Stack justify='center' direction='row' spacing={6}>
                                <RdButton
                                onClick={onCloseConfirmation}
                                size='lg'
                                >
                                Cancel
                                </RdButton>
                                <RdButton
                                // onClick={() => handleClaim()}
                                size='lg'
                                >
                                Confirm
                                </RdButton>
                            </Stack>
                            </RdModalFooter>
                        </RdModal>
                    </>
                    ) : (
                    <Box mt={2}>
                        <Text textAlign='center' fontSize={14}>You have no rewards to withdraw at this time.</Text>
                    </Box>
                    )}
                    </Box>
        </>
      )}
    </RdModal>
    </>
  )
}

export default Meeple;