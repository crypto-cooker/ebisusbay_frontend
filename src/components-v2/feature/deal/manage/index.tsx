import {
  Accordion,
  Badge,
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
  VStack
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
import {ciEquals, getLengthOfTime} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {OrderState} from "@src/core/services/api-service/types";
import ApprovalsView from "@src/components-v2/feature/deal/manage/approvals";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Link from "next/link";

interface ManageDealProps {
  deal: any;
}

const ManageDeal = ({deal: defaultDeal}: ManageDealProps) => {
  const user = useUser();
  const {username: makerUsername, avatar: makerAvatar} = useGetProfilePreview(defaultDeal.maker);
  const {username: takerUsername, avatar: takerAvatar} = useGetProfilePreview(defaultDeal.taker);
  const initialFocusRef = useRef(null);
  const isMobile = useBreakpointValue({base: true, sm: false}, {fallback: 'sm'});
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>();
  const [creationDate, setCreationDate] = useState<string>();

  const {data: deal} = useQuery({
    queryKey: ['deal', defaultDeal.id],
    queryFn: async () => ApiService.withoutKey().getDeal(defaultDeal.id),
    initialData: defaultDeal,
  });

  const handleOpenPopover = (index: number, side: string) => {
    setOpenPopoverId(`${index}${side}`);
  };

  const matchesPopoverId = (index: number, side: string) => {
    return openPopoverId === `${index}${side}`;
  }


  const handleCounterOffer = () => {

  }

  const handleReject = () => {

  }

  const handleCancel = () => {

  }

  const handleDealAccepted = () => {
    toast.success(`Deal has been finalized!`);
  }

  const handleDealRejected = () => {
    toast.success(`Deal has been rejected!`);
  }

  const handleDealCancelled = () => {
    toast.success(`Deal has been cancelled!`);
  }

  const isMaker = !!user.address && ciEquals(user.address, deal.maker);
  const isTaker = !!user.address && ciEquals(user.address, deal.taker);

  useEffect(() => {
    if (deal) {
      setExpiryDate(`${new Date(deal.end_at * 1000).toDateString()}, ${new Date(deal.end_at * 1000).toTimeString()}`);
      setCreationDate(`${new Date(deal.start_at * 1000).toDateString()}, ${new Date(deal.start_at * 1000).toTimeString()}`);
    }
  }, []);

  return (
    <Container maxW='container.xl'>
      <Card>
        <SimpleGrid columns={2}>
          <Box>Status</Box>
          <Box textAlign='end'>
            {deal.state === OrderState.ACTIVE ? (
              <Badge colorScheme='blue' color='white'>Open</Badge>
            ) : deal.state === OrderState.CANCELLED ? (
              <Badge>Cancelled</Badge>
            ) : deal.state === OrderState.REJECTED ? (
              <Badge colorScheme='red'>Rejected</Badge>
            ) : deal.state === OrderState.COMPLETED ? (
              <Badge colorScheme='green'>Sold</Badge>
            ) : deal.state === OrderState.EXPIRED ? (
              <Badge>Expired</Badge>
            ) : (
              <Badge>N/A</Badge>
            )}
          </Box>
          <Box>Created</Box>
          <VStack align='end' spacing={0}>
            <Box>{getLengthOfTime(Math.floor(Date.now() / 1000) - deal.start_at)} ago</Box>
            <Box textAlign='end' fontSize='sm'>
              {creationDate}
            </Box>
          </VStack>
          {deal.state === OrderState.ACTIVE && (
            <>
              <Box>Expires</Box>
              <VStack align='end' spacing={0}>
                <Box>{getLengthOfTime(deal.end_at - Math.floor(Date.now() / 1000))}</Box>
                <Box textAlign='end' fontSize='sm'>
                  {expiryDate}
                </Box>
              </VStack>
            </>
          )}
        </SimpleGrid>
      </Card>
      <SimpleGrid
        columns={{base: 1, sm: 3}}
        templateColumns={{base: undefined, sm: '1fr 30px 1fr'}}
        templateRows={{base: '1fr 30px 1fr', sm: 'auto'}}
        gap={4}
        mt={2}
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

      {deal.state === OrderState.ACTIVE && (
        <ApprovalsView deal={deal} />
      )}

      {(isMaker || isTaker) && deal.state === OrderState.ACTIVE && (
        <ConditionalActionBar condition={isMobile ?? false}>
          {isTaker ? (
            <Flex>
              <RejectButtonView deal={deal} onSuccess={handleDealRejected}/>
              <Spacer />
              <ButtonGroup>
                <Link href={`/deal/create/${deal.maker}?parent=${deal.id}`}>
                  <SecondaryButton>
                    Counter Offer
                  </SecondaryButton>
                </Link>
                <AcceptButtonView
                  deal={deal}
                  onSuccess={handleDealAccepted}
                  onProgress={(isExecuting: boolean) => console.log('TODO', isExecuting)}
                />
              </ButtonGroup>
            </Flex>
          ) : isMaker && (
            <Flex>
              <CancelButtonView deal={deal} onSuccess={handleDealCancelled} />
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
  ) : <Box mt={4}>{children}</Box>;
}

const AcceptButtonView = ({deal, onProgress, onSuccess}: {deal: any, onProgress: (isExecuting: boolean) => void, onSuccess: () => void}) => {
  const user = useUser();
  const { requestSignature } = useEnforceSignature();
  const contractService = useContractService();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAccept = async () => {
    if (!user.address) return;

    if (deal.state !== OrderState.ACTIVE) {
      toast.error('Deal is not active');
      return;
    }

    if (!ciEquals(user.address, deal.taker)) {
      toast.error('You are not the taker of this deal');
      return;
    }

    try {
      setIsExecuting(true);
      onProgress(true);
      const walletSignature = await requestSignature();
      const { data: authorization } = await ApiService.withoutKey().requestAcceptDealAuthorization(deal.id, user.address, walletSignature);

      const { signature, orderData, ...sigData } = authorization;
      const total = sigData.feeAmount;
      const tx = await contractService!.ship.fillOrders(orderData, sigData, signature, { value: total });
      const receipt = await tx.wait()
      onSuccess();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecuting(false);
      onProgress(false);
    }

  }

  return (
    <PrimaryButton
      onClick={handleAccept}
      isLoading={isExecuting}
      isDisabled={isExecuting}
    >
      Accept
    </PrimaryButton>
  )
}

const RejectButtonView = ({deal, onSuccess}: {deal: any, onSuccess: () => void}) => {
  const user = useUser();
  const { requestSignature } = useEnforceSignature();
  // const contractService = useContractService();
  // const [isExecuting, setIsExecuting] = useState(false);
  const queryClient = useQueryClient();

  // Define the cancel mutation using useMutation
  const { mutate: rejectDeal, isPending: isExecuting } = useMutation({
    mutationFn: async () => {
      if (!user.address) throw new Error('User address not found.');

      if (deal.state !== OrderState.ACTIVE) {
        throw new Error('Deal is not active');
      }

      if (!ciEquals(user.address, deal.taker)) {
        throw new Error('You are not the taker of this deal');
      }

      const walletSignature = await requestSignature();
      return await ApiService.withoutKey().rejectDeal(deal.id, user.address, walletSignature);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['deal', deal.id],
        {
          ...deal,
          state: OrderState.REJECTED,
        }
      );
      onSuccess();
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    },
    onSettled: () => {
      // setIsExecuting(false); // Update the executing state when the mutation is either successful or encounters an error
    }
  });

  const handleReject = async () => {
    // setIsExecuting(true);
    rejectDeal();
  }

  return (
    <Button
      variant='link'
      size='sm'
      onClick={handleReject}
      isLoading={isExecuting}
      isDisabled={isExecuting}
    >
      Reject
    </Button>
  )
}

const CancelButtonView = ({deal, onSuccess}: {deal: any, onSuccess: () => void}) => {
  const user = useUser();
  const { requestSignature } = useEnforceSignature();
  // const contractService = useContractService();
  // const [isExecuting, setIsExecuting] = useState(false);
  const queryClient = useQueryClient();


  // Define the cancel mutation using useMutation
  const { mutate: cancelDeal, isPending: isExecuting } = useMutation({
    mutationFn: async () => {
      if (!user.address) throw new Error('User address not found.');

      if (deal.state !== OrderState.ACTIVE) {
        throw new Error('Deal is not active');
      }

      if (!ciEquals(user.address, deal.maker)) {
        throw new Error('You are not the maker of this deal');
      }

      const walletSignature = await requestSignature();
      return await ApiService.withoutKey().cancelDeal(deal.id, user.address, walletSignature);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['deal', deal.id],
        {
          ...deal,
          state: OrderState.CANCELLED,
        }
      );
      onSuccess(); // Assuming onSuccess does something like query refetching or state updates
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(parseErrorMessage(error)); // Assuming parseErrorMessage parses and returns a readable error message
    },
    onSettled: () => {
      // setIsExecuting(false); // Update the executing state when the mutation is either successful or encounters an error
    }
  });

  const handleCancel = async () => {
    // setIsExecuting(true);
    cancelDeal();
  }

  return (
    <Button
      variant='link'
      size='sm'
      onClick={handleCancel}
      isLoading={isExecuting}
      isDisabled={isExecuting}
    >
      Cancel
    </Button>
  )
}

export default ManageDeal;