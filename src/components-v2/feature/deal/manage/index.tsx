import {
  Accordion,
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Slide,
  Spacer,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake, faLink, faPlus} from "@fortawesome/free-solid-svg-icons";
import React, {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import useGetProfilePreview from "@src/hooks/useGetUsername";
import {Card} from "@src/components-v2/foundation/card";
import {GetDealItemPreview} from "@src/components-v2/feature/deal/preview-item";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {appUrl, ciEquals, getLengthOfTime, round} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {OrderState} from "@src/core/services/api-service/types";
import ApprovalsView from "@src/components-v2/feature/deal/manage/approvals";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Deal} from "@src/core/services/api-service/mapi/types";
import {ArrowBackIcon, CheckCircleIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";
import {faFacebook, faTelegram, faTwitter} from "@fortawesome/free-brands-svg-icons";
import CronosIcon from "@src/components-v2/shared/icons/cronos";
import {ContractReceipt, ethers} from "ethers";
import {appConfig} from "@src/Config";
import NextLink from "next/link";
import {commify} from "ethers/lib/utils";
import {ItemType} from "@src/hooks/use-create-order-signer";

const config = appConfig();

interface ManageDealProps {
  deal: Deal;
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
  const { isOpen: isCompleteDialogOpen, onOpen: onOpenCompleteDialog, onClose: onCloseCompleteDialog } = useDisclosure();
  const [tx, setTx] = useState<ContractReceipt>();

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

  const handleDealAccepted = (tx?: ContractReceipt) => {
    setTx(tx);
    onOpenCompleteDialog();
  }

  const handleDealRejected = () => {
    toast.success(`Deal has been rejected!`);
  }

  const handleDealCancelled = () => {
    toast.success(`Deal has been cancelled!`);
  }

  const isMaker = !!user.address && ciEquals(user.address, deal.maker);
  const isTaker = !!user.address && ciEquals(user.address, deal.taker);
  const hasUnknownTokens = useMemo(() => {
    function hasUnknownToken(item: any) {
      const knownTokens = Object.values(config.tokens) as Array<{address: string}>;
      return item.item_type === ItemType.ERC20 && !knownTokens.find((knownToken: any) => ciEquals(knownToken.address, item.token));
    }
    const unknownMakerTokens = deal.maker_items.some((item) => hasUnknownToken(item));
    const unknownTakerTokens = deal.taker_items.some((item) => hasUnknownToken(item));
    return unknownMakerTokens || unknownTakerTokens;
  }, [deal]);

  useEffect(() => {
    if (deal) {
      setExpiryDate(`${new Date(deal.end_at * 1000).toDateString()}, ${new Date(deal.end_at * 1000).toTimeString()}`);
      setCreationDate(`${new Date(deal.start_at * 1000).toDateString()}, ${new Date(deal.start_at * 1000).toTimeString()}`);
    }
  }, []);

  return (
    <Container maxW='container.xl'>
      <Box mb={2}>
        <NextLink href='/deal'>
          <Button
            variant='ghost'
            leftIcon={<ArrowBackIcon />}
          >
            Deals
          </Button>
        </NextLink>
      </Box>
      <Card>
        <SimpleGrid columns={2}>
          <Box>Status</Box>
          <Box textAlign='end'>
            {deal.state === OrderState.ACTIVE ? (
              <Badge colorScheme='blue' color='white' fontSize='lg'>Open</Badge>
            ) : deal.state === OrderState.CANCELLED ? (
              <Badge fontSize='lg'>Cancelled</Badge>
            ) : deal.state === OrderState.REJECTED ? (
              <Badge colorScheme='red' fontSize='lg'>Rejected</Badge>
            ) : deal.state === OrderState.COMPLETED ? (
              <Badge colorScheme='green' fontSize='lg'>COMPLETE</Badge>
            ) : deal.state === OrderState.EXPIRED ? (
              <Badge fontSize='lg'>Expired</Badge>
            ) : (
              <Badge fontSize='lg'>N/A</Badge>
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
        columns={{base: 1, md: 3}}
        templateColumns={{base: undefined, md: '1fr 30px 1fr'}}
        templateRows={{base: '1fr 30px 1fr', md: 'auto'}}
        gap={4}
        mt={2}
      >
        <Card bodyPadding={0}>
          <Stack direction='row' justify='space-between' mb={2} px={5} pt={5}>
            <Box fontSize='lg' fontWeight='bold'>
              <NextLink href={`/account/${deal.maker}`}>
                {makerUsername} {isMaker && <>(You)</>}
              </NextLink>
            </Box>
            <Box>
              {deal.state === OrderState.ACTIVE ? (
                <Popover>
                  <PopoverTrigger>
                    {deal.estimated_maker_value > 0 ? (
                      <Tag colorScheme='blue'>
                        Est. Value: ~ ${round(deal.estimated_maker_value, 2)}
                      </Tag>
                    ) : (
                      <Tag>Est. Value: N/A</Tag>
                    )}
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      Estimated value of all NFTs and tokens on this side of the deal
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : !isMaker && (
                <Link href={`/deal/create/${deal.maker}`}>
                  <PrimaryButton size='xs' leftIcon={<Icon as={FontAwesomeIcon} icon={faPlus} />}>
                    Make Deal
                  </PrimaryButton>
                </Link>
              )}
            </Box>
          </Stack>
          <Box>
            <Accordion w='full' allowMultiple>
              {deal.maker_items.map((item: any, index: number) => (
                <GetDealItemPreview
                  key={index}
                  item={item}
                />
              ))}
            </Accordion>
          </Box>
        </Card>
        <Box my='auto' mx='auto'>
          <Icon as={FontAwesomeIcon} icon={faHandshake} boxSize={8} />
        </Box>
        <Card bodyPadding={0}>
          <Stack direction='row' justify='space-between' mb={2} px={5} pt={5}>
            <Box fontSize='lg' fontWeight='bold'>
              <NextLink href={`/account/${deal.taker}`}>
                {takerUsername} {isTaker && <>(You)</>}
              </NextLink>
            </Box>
            <Box>
              {deal.state === OrderState.ACTIVE ? (
                <Popover>
                  <PopoverTrigger>
                    {deal.estimated_taker_value > 0 ? (
                      <Tag colorScheme='blue'>
                        Est. Value: ~ ${round(deal.estimated_taker_value, 2)}
                      </Tag>
                    ) : (
                      <Tag>Est. Value: N/A</Tag>
                    )}
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      Estimated value of all NFTs and tokens on this side of the deal
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : !isTaker && (
                <Link href={`/deal/create/${deal.taker}`}>
                  <PrimaryButton size='xs' leftIcon={<Icon as={FontAwesomeIcon} icon={faPlus} />}>
                    Make Deal
                  </PrimaryButton>
                </Link>
              )}
            </Box>
          </Stack>
          <Box>
            <Accordion w='full' allowMultiple>
              {deal.taker_items.map((item: any, index: number) => (
                <GetDealItemPreview
                  key={index}
                  item={item}
                />
              ))}
            </Accordion>
          </Box>
        </Card>
      </SimpleGrid>

      {deal.state === OrderState.ACTIVE && (
        <ApprovalsView deal={deal} />
      )}

      {(isMaker || isTaker) && deal.state === OrderState.ACTIVE && (
        <ConditionalActionBar condition={isMobile ?? false}>
          {!!deal.invalid && (
            <Alert status='warning' mb={4}>
              <AlertIcon />
              <AlertDescription>
                This deal has been marked as invalid and may not complete. Please check both sides have the correct items and quantities in their respective inventories.
              </AlertDescription>
            </Alert>
          )}
          {hasUnknownTokens && (
            <Alert status='warning' mb={4}>
              <AlertIcon />
              <AlertDescription>
                This deal contains tokens that have not been whitelisted by Ebisu's Bay. Please double check the token addresses and ensure they are legitimate. Trade these are your own risk.
              </AlertDescription>
            </Alert>
          )}
          {isTaker ? (
            <Flex>
              <RejectButtonView deal={deal} onSuccess={handleDealRejected}/>
              <Spacer />
              <ButtonGroup>
                <CounterOfferButtonView deal={deal} />
                <AcceptButtonView
                  deal={deal}
                  onSuccess={handleDealAccepted}
                  onProgress={(isExecuting: boolean) => console.log('TODO', isExecuting)}
                />
              </ButtonGroup>
            </Flex>
          ) : isMaker && (
            <Flex justify='end'>
              <CancelButtonView deal={deal} onSuccess={handleDealCancelled} />
            </Flex>
          )}
        </ConditionalActionBar>
      )}
      {isTaker && deal.state === OrderState.ACTIVE && (
        <Box fontSize='sm' textAlign='center' mt={2}>
          Users with {commify(2000)} or more Mitama can accept deals at no extra cost. Otherwise, a flat 20 CRO fee is applied upon acceptance of the deal. Earn Mitama by staking FRTN in the <NextLink href='/ryoshi' className='color fw-bold'>Ryoshi Dynasties Bank</NextLink>
        </Box>
      )}
      <SuccessModal
        isOpen={isCompleteDialogOpen}
        onClose={onCloseCompleteDialog}
        dealId={deal.id}
        tx={tx}
      />
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
  ) : (
    <Card mt={2}>
      {children}
    </Card>
  );
}

const AcceptButtonView = ({deal, onProgress, onSuccess}: {deal: Deal, onProgress: (isExecuting: boolean) => void, onSuccess: () => void}) => {
  const user = useUser();
  const queryClient = useQueryClient();
  const { requestSignature } = useEnforceSignature();
  const contractService = useContractService();

  const { mutate: acceptDeal, isPending: isExecuting } = useMutation({
    mutationFn: async () => {
      if (!user.address) throw new Error('User address not found.');

      if (deal.state !== OrderState.ACTIVE) {
        throw new Error('Deal is not active');
      }

      if (!ciEquals(user.address, deal.taker)) {
        throw new Error('You are not the taker of this deal');
      }
      onProgress(true);

      const croItem = deal.taker_items.find((item) => ciEquals(item.token, ethers.constants.AddressZero));
      const croTotal = croItem ? croItem.end_amount : '0';
      const price = ethers.utils.parseEther(`${croTotal}`);

      const walletSignature = await requestSignature();
      const { data: authorization } = await ApiService.withoutKey().requestAcceptDealAuthorization(deal.id, user.address, walletSignature);

      const { signature, orderData, ...sigData } = authorization;
      const total = price.add(sigData.feeAmount);
      const tx = await contractService!.ship.fillOrders(orderData, sigData, signature, { value: total });
      return await tx.wait();
    },
    onSuccess: (data: ContractReceipt) => {
      queryClient.setQueryData(
        ['deal', deal.id],
        {
          ...deal,
          state: OrderState.COMPLETED,
        }
      );
      onSuccess();
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    },
    onSettled: () => {
      onProgress(false);
    }
  });

  const handleAcceptDeal = () => {
    acceptDeal();
  }

  return (
    <PrimaryButton
      onClick={handleAcceptDeal}
      isLoading={isExecuting}
      isDisabled={isExecuting}
    >
      Accept
    </PrimaryButton>
  )
}

const CounterOfferButtonView = ({deal}: { deal: Deal }) => {
  const router = useRouter();
  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleConfirmAction = () => {
    setHasConfirmed(false);
    onOpenConfirmation();
  }

  const handleExecuteAction = async () => {
    setHasConfirmed(true);
    onCloseConfirmation();
    await router.push(`/deal/create/${deal.maker}?parent=${deal.id}`)
  }

  return (
    <>
      <SecondaryButton onClick={handleConfirmAction}>
        Counter Offer
      </SecondaryButton>
      <ConfirmationModal
        isOpen={!hasConfirmed && isConfirmationOpen}
        onConfirm={handleExecuteAction}
        onClose={onCloseConfirmation}
        title='Create Counter Offer'
        text='Proceeding will initiate a new deal with this user. This current deal will be rejected upon creation of the new deal. Continue?'
      />
    </>
  )
}

const RejectButtonView = ({deal, onSuccess}: {deal: Deal, onSuccess: () => void}) => {
  const user = useUser();
  const { requestSignature } = useEnforceSignature();
  const queryClient = useQueryClient();
  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const [hasConfirmed, setHasConfirmed] = useState(false);

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
      //
    }
  });

  const handleConfirmAction = () => {
    setHasConfirmed(false);
    onOpenConfirmation();
  }

  const handleExecuteAction = async () => {
    setHasConfirmed(true);
    onCloseConfirmation();
    rejectDeal();
  }

  return (
    <>
      <Button
        variant='link'
        size='sm'
        onClick={handleConfirmAction}
        isLoading={isExecuting}
        isDisabled={isExecuting}
        loadingText='Reject'
      >
        Reject
      </Button>
      <ConfirmationModal
        isOpen={!hasConfirmed && isConfirmationOpen}
        onConfirm={handleExecuteAction}
        onClose={onCloseConfirmation}
        title='Confirm Reject'
        text='Proceeding will immediately reject this deal. Any further action will require a new deal to be made. Alternatively, consider the "Counter Offer" option to offer an alternate deal to this user.'
      />
    </>
  )
}

const CancelButtonView = ({deal, onSuccess}: {deal: Deal, onSuccess: () => void}) => {
  const user = useUser();
  const { requestSignature } = useEnforceSignature();
  const queryClient = useQueryClient();
  const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const [hasConfirmed, setHasConfirmed] = useState(false);

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
      onSuccess();
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    },
    onSettled: () => {
      //
    }
  });

  const handleConfirmAction = () => {
    setHasConfirmed(false);
    onOpenConfirmation();
  }

  const handleExecuteAction = async () => {
    setHasConfirmed(true);
    onCloseConfirmation();
    cancelDeal();
  }

  return (
    <>
      <PrimaryButton
        onClick={handleConfirmAction}
        isLoading={isExecuting}
        isDisabled={isExecuting}
        loadingText='Cancel'
      >
        Cancel
      </PrimaryButton>
      <ConfirmationModal
        isOpen={!hasConfirmed && isConfirmationOpen}
        onConfirm={handleExecuteAction}
        onClose={onCloseConfirmation}
        title='Confirm Cancellation'
        text='Proceeding will immediately cancel this deal. Any further action will require a new deal to be made. Continue?'
      />
    </>
  )
}

export default ManageDeal;

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  text: string;
}

const ConfirmationModal = ({isOpen, onConfirm, onClose, title, text}: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <Text>{title}</Text>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {text}
        </ModalBody>

        <ModalFooter alignContent="center">
          <VStack w="full">
            <Flex justify="center">
              <ButtonGroup>
                <SecondaryButton onClick={onClose}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={onConfirm}>
                  Continue
                </PrimaryButton>
              </ButtonGroup>
            </Flex>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
  tx?: ContractReceipt
}

const SuccessModal = ({isOpen, onClose, dealId, tx}: SuccessModalProps) => {
  const { onCopy, setValue } = useClipboard(appUrl(`/deal/${dealId}`).toString());

  const handleCopy = useCallback(() => {
    onCopy();
    toast.success('Link copied!');
  }, [onCopy]);

  const shareOptions = [
    {
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      label: 'Share on Facebook',
      icon: faFacebook
    },
    {
      url: 'https://twitter.com/intent/tweet?text=',
      label: 'Share on Twitter',
      icon: faTwitter
    },
    {
      url: 'https://telegram.me/share/?url=',
      label: 'Share on Telegram',
      icon: faTelegram
    },
    {
      label: 'Share on Telegram',
      icon: faLink,
      handleClick: handleCopy
    }
  ];

  useEffect(() => {
    if (dealId) {
      setValue(appUrl(`/deal/${dealId}`).toString());
    }
  }, [dealId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <HStack>
              <CheckCircleIcon color="green" bg="white" rounded="full" border="1px solid white"/>
              <Text>Deal Complete!</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Text textAlign="center" mb={2}>Congratulations! This deal is now complete. Check your inventory for your newly claimed items.</Text>
            {tx && (
              <Link href={`${config.urls.explorer}tx/${tx.transactionHash}`} isExternal>
                <HStack>
                  <CronosIcon boxSize={6}/>
                  <Text>View on Cronoscan</Text>
                </HStack>
              </Link>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter alignContent="center">
          <VStack w="full">
            <Text>Share</Text>
            <Flex justify="center">
              <ButtonGroup>
                {shareOptions.map((shareOption) => (
                  <IconButton
                    key={shareOption.label}
                    icon={<FontAwesomeIcon icon={shareOption.icon} />}
                    aria-label={shareOption.label}
                    onClick={() => shareOption.handleClick ? shareOption.handleClick() : window.open(`${shareOption.url}${window.location}`, '_blank')}
                  />
                ))}
              </ButtonGroup>
            </Flex>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}