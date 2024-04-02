import {
  Accordion,
  AccordionButton, AccordionIcon,
  AccordionItem, AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Icon,
  SimpleGrid,
  Slide,
  Spacer,
  useBreakpointValue,
  Wrap
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import useGetProfilePreview from "@src/hooks/useGetUsername";
import {Card, TitledCard} from "@src/components-v2/foundation/card";
import {GetDealItemPreview} from "@src/components-v2/feature/deal/preview-item";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {ciEquals} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";

interface ManageDealProps {
  deal: any;
}

const ManageDeal = ({deal}: ManageDealProps) => {
  const user = useUser();
  const {username: makerUsername, avatar: makerAvatar} = useGetProfilePreview(deal.maker);
  const {username: takerUsername, avatar: takerAvatar} = useGetProfilePreview(deal.taker);
  const initialFocusRef = useRef(null);
  const isMobile = useBreakpointValue({base: true, sm: false}, {fallback: 'sm'});
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const { requestSignature } = useEnforceSignature();
  const contractService = useContractService();

  const handleOpenPopover = (index: number, side: string) => {
    setOpenPopoverId(`${index}${side}`);
  };

  const matchesPopoverId = (index: number, side: string) => {
    return openPopoverId === `${index}${side}`;
  }

  const handleAccept = async () => {
    if (!user.address) return;

    try {
      const walletSignature = await requestSignature();
      const { data: authorization } = await ApiService.withoutKey().requestAcceptDealAuthorization(deal.id, user.address, walletSignature);

      const { signature, orderData, ...sigData } = authorization;
      const total = sigData.feeAmount;
      const tx = await contractService!.ship.fillOrders(orderData, sigData, signature, { value: total });
      const receipt = await tx.wait()
      toast.success(`Deal has been finalized!`);

    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {

    }

  }

  const handleCounterOffer = () => {

  }

  const handleReject = () => {

  }

  const handleCancel = () => {

  }

  const isMaker = !!user.address && ciEquals(user.address, deal.maker);
  const isTaker = !!user.address && ciEquals(user.address, deal.taker);

  useEffect(() => {
    console.log('SWAP', deal);
  }, []);

  return (
    <Container maxW='container.xl'>
      <SimpleGrid
        columns={{base: 1, sm: 3}}
        templateColumns={{base: undefined, sm:'1fr 30px 1fr'}}
        templateRows={{base: '1fr 30px 1fr', sm:undefined}}
        gap={4}
      >
        <TitledCard title={makerUsername ?? ''}>
          <Box>
            <Accordion w='full' allowMultiple>
              {deal.maker_items.map((item: any, index: number) => (
                <GetDealItemPreview
                  key={index}
                  item={item}
                  ref={initialFocusRef}
                  isActive={true}
                  mode='READ'
                  isOpen={matchesPopoverId(index, 'maker')}
                  onOpen={() => handleOpenPopover(index, 'maker')}
                  onClose={() => setOpenPopoverId(null)}
                />
              ))}
            </Accordion>
          </Box>
        </TitledCard>
        <Box my='auto' mx='auto'>
          <Icon as={FontAwesomeIcon} icon={faHandshake} boxSize={8} />
        </Box>
        <TitledCard title={takerUsername ?? ''}>
          <Box>
            <Accordion w='full' allowMultiple>
              {deal.taker_items.map((item: any, index: number) => (
                <GetDealItemPreview
                  key={index}
                  item={item}
                  ref={initialFocusRef}
                  isActive={true}
                  mode='READ'
                  isOpen={matchesPopoverId(index, 'taker')}
                  onOpen={() => handleOpenPopover(index, 'taker')}
                  onClose={() => setOpenPopoverId(null)}
                />
              ))}
            </Accordion>
          </Box>
        </TitledCard>
      </SimpleGrid>
      {(isMaker || isTaker) && (
        <ConditionalActionBar condition={isMobile ?? false}>
          {isTaker ? (
            <Flex>
              <Button variant='link' size='sm' onClick={handleReject}>
                Reject
              </Button>
              <Spacer />
              <ButtonGroup>
                <SecondaryButton onClick={handleCounterOffer}>
                  Counter Offer
                </SecondaryButton>
                <PrimaryButton onClick={handleAccept}>
                  Accept
                </PrimaryButton>
              </ButtonGroup>
            </Flex>
          ) : isMaker && (
            <Flex>
              <PrimaryButton onClick={handleCancel}>
                Cancel
              </PrimaryButton>
            </Flex>
          )}
        </ConditionalActionBar>
      )}
    </Container>
  )
}

const ConditionalActionBar = ({condition, children}: {condition: boolean, children: ReactNode} ) => {
  const sliderBackground = useColorModeValue('gray.50', 'gray.700');
  
  return condition ? (
    <Slide direction='bottom' in={true} style={{ zIndex: 10 }}>
      <Box textAlign='center' p={3} backgroundColor={sliderBackground} borderTop='1px solid white'>
        {children}
      </Box>
    </Slide>
  ) : children;
}

const ItemAccordionItem = ({item, index, side, isOpen, onOpen, onClose, initialFocusRef}: any) => {
  return (
    <AccordionItem key={index}>
      <AccordionButton onClick={onOpen}>
        <Box flex='1' textAlign='left'>
          {item.name}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        asdf
      </AccordionPanel>
    </AccordionItem>
  )
}

export default ManageDeal;