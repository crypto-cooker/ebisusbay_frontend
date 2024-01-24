import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalBody, RdModalBox, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {
  Box,
  BoxProps,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  IconButton,
  Image,
  Select,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import React, {ChangeEvent, ReactNode, useMemo, useState} from "react";
import {CloseIcon} from "@chakra-ui/icons";
import {useIsTouchDevice} from "@src/hooks/use-is-touch-device";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import {createSuccessfulTransactionToastContent, round, siPrefixedNumber} from "@src/utils";
import {useUser} from "@src/components-v2/useUser";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {MerchantItem, MerchantItemPack} from "@src/core/services/api-service/cms/response-types";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {constants, Contract} from "ethers";
import Resources from "@src/Contracts/Resources.json";
import {appConfig} from "@src/Config";
import Fortune from "@src/Contracts/Fortune.json";

const config = appConfig();

interface VillageMerchantProps {
  isOpen: boolean;
  onClose: () => void;
  forceRefresh: () => void;
}

export const VillageMerchant = ({isOpen, onClose, forceRefresh}: VillageMerchantProps) => {
  const user = useUser();
  const {requestSignature} = useEnforceSigner();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<MerchantItem>();
  const [selectedPack, setSelectedPack] = useState<MerchantItemPack>();
  const [isExecuting, setIsExecuting] = useState(false);

  const { data: merchantItems} = useQuery({
    queryKey: ['VillageMerchant'],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getMerchantItems(),
    enabled: isOpen,
    refetchOnWindowFocus: false,
  });

  const hasAnythingAvailable = useMemo(() => {
    return !!merchantItems?.find((item: any) => item.remaining > 0);
  }, [merchantItems]);

  const resetForm = () => {
    setSelectedItem(undefined);
    setSelectedPack(undefined);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleSelectItem = (item: MerchantItem, selected: boolean) => {
    setSelectedItem(selected ? item : undefined);
    setSelectedPack(item.packs[0]);
  }

  const handleSelectPack = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPack(selectedItem?.packs.find((pack) => pack.id === e.target.value));
  }

  const handlePurchase = async () => {
    if (!user.address) return;
    if (!selectedItem) {
      toast.error('Please select an item');
      return;
    }
    if (selectedItem.packs.length < 1) {
      toast.error('No packs available');
      return;
    }
    if (!selectedPack) {
      toast.error('Please select a pack');
      return;
    }

    mutation.mutate()
  }

  const purchase = async () => {
    if (!user.address || !selectedItem || !selectedPack) return;

    try {
      setIsExecuting(true);
      const signature = await requestSignature();
      const cmsResponse = await ApiService.withoutKey().ryoshiDynasties.requestMerchantPurchaseAuthorization({
        tokenAddress: selectedItem.tokenAddress,
        tokenId: selectedItem.tokenId,
        packId: selectedPack.id,
        quantity: 1,
      }, user.address, signature);

      const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
      const allowance = await fortuneContract.allowance(user.address, config.contracts.resources);
      if (allowance.sub(cmsResponse.request.fortuneRequired) < 0) {
        const approvalTx = await fortuneContract.approve(config.contracts.resources, constants.MaxUint256);
        await approvalTx.wait();
      }

      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.signer);
      const tx = await resourcesContract.craftWithLimits(cmsResponse.request, cmsResponse.signature);
      return await tx.wait();
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const mutation = useMutation({
    mutationFn: purchase,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['VillageMerchant'], (old: any) => {
          if (!data) return old;
          const item = old.find((a: any) => a.tokenId === selectedItem?.tokenId);
          if (item && selectedPack) {
            item.remaining -= selectedPack?.itemsPerPack;
            item.packs = item.packs.map((pack: any) => {
              if (pack.id === selectedPack.id) {
                pack.available -= 1;
              }
              return pack;
            });
            if (item.remaining < 1) {
              item.remaining = 0;
              resetForm();
            }
          }
        });
      } catch (e) {
        console.log(e);
      } finally {
        toast.success(createSuccessfulTransactionToastContent(data.transactionHash));
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  });

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Merchant'
      isCentered={false}
    >
      <RdModalBody>
        <RdModalBox>
          <AuthenticationGuard>
            {({isConnected, connect}) => (
              <>
                {isConnected ? (
                  <Flex justify='center'>
                    <HStack>
                      <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>Your</Text>
                      <FortuneIcon boxSize={6} />
                      <Text fontWeight='bold' fontSize={{base: 'sm', sm: 'md'}}>
                        $FRTN: {commify(round(user.balances.frtn, 2))}
                      </Text>
                    </HStack>
                  </Flex>
                ) : (
                  <Flex justify='space-between' align='center'>
                    <Box>
                      Connect wallet to view FRTN balance
                    </Box>
                    <RdButton
                      size='sm'
                      onClick={connect}
                    >
                      Connect
                    </RdButton>
                  </Flex>
                )}
              </>
            )}
          </AuthenticationGuard>
        </RdModalBox>

        <RdModalBox mt={2}>
          <Stack direction='row'>
            {hasAnythingAvailable ? (
              <Image src={ImageService.translate(`/img/ryoshi-dynasties/village/buildings/merchant-opened.png`).convert()} />
            ) : (
              <Image src={ImageService.translate(`/img/ryoshi-dynasties/village/buildings/merchant-closed.png`).convert()} />
            )}
            <Box textAlign='center'>
              {hasAnythingAvailable ? (
                <Box>
                  <Text>Greetings traveler do you need something? Rio has got you covered.</Text>
                  <Text mt={2}>Select any available item below to view details.</Text>
                </Box>
              ) : (
                <Text>Greetings traveler, Rio is all out of wares. Check back next week.</Text>
              )}
            </Box>
          </Stack>
          {!!merchantItems && (
            <SimpleGrid columns={{base: 2, sm: 3, md: 4}} gap={2} mt={4} justifyItems='center'>
              {merchantItems.map((item) => (
                <SelectableImageComponent2
                  image={ImageService.translate(item.image).fixedWidth(100, 100)}
                  label={item.remaining > 0 ? `${siPrefixedNumber(item.total - item.remaining)} / ${siPrefixedNumber(item.total)}` : 'Sold Out'}
                  isAvailable={item.remaining > 0}
                  isDisabled={false}
                  isSelected={selectedItem?.tokenId === item.tokenId}
                  onSelected={(selected) => handleSelectItem(item, selected)}
                />
              ))}
              <SelectableImageComponent2
                image={ImageService.translate(`/img/ryoshi-dynasties/village/merchant/battle-supplies-uncommon.png`).fixedWidth(100, 100)}
                label='Unavailable'
                isAvailable={false}
                isDisabled={true}
                isSelected={false}
                onSelected={(selected) => {}}
              />
              <SelectableImageComponent2
                image={ImageService.translate(`/img/ryoshi-dynasties/village/merchant/mushroom-uncommon.png`).fixedWidth(100, 100)}
                label='Unavailable'
                isAvailable={false}
                isDisabled={true}
                isSelected={false}
                onSelected={(selected) => {}}
              />
              <SelectableImageComponent2
                image={ImageService.translate(`/img/ryoshi-dynasties/village/merchant/potion-uncommon.png`).fixedWidth(100, 100)}
                label='Unavailable'
                isAvailable={false}
                isDisabled={true}
                isSelected={false}
                onSelected={(selected) => {}}
              />
            </SimpleGrid>
          )}
        </RdModalBox>
        {!!selectedItem && (
          <SimpleGrid columns={{base: 1, md: 2}} gap={2} mt={2}>
            <RdModalBox>
              <FormControl>
                <FormLabel fontWeight='bold'>
                  Available {selectedItem.name} Packs
                </FormLabel>

                <Box>
                  {selectedItem.packs.length > 0 ? (
                    <Select
                      onChange={handleSelectPack}
                      value={selectedPack?.id}
                    >
                      {selectedItem.packs.filter((pack) => pack.available > 0).map((pack) => (
                        <option value={pack.id}>{commify(pack.itemsPerPack)} ({commify(pack.price)} FRTN)</option>
                      ))}
                    </Select>
                  ) : (
                    <Text>No packs currently available</Text>
                  )}
                </Box>
              </FormControl>
            </RdModalBox>
            <RdModalBox>
              <Flex justify='end' h='full' align='end'>
                <SimpleGrid columns={2} gridTemplateColumns="100px 1fr">
                  <GridItem ><Box textAlign={{base: 'start', sm: 'end'}}>FRTN Price:</Box></GridItem>
                  <GridItem>
                    <Box textAlign='end'>
                      {!!selectedPack && (
                        <HStack justify='end' spacing={1} ps={2}>
                          <FortuneIcon boxSize={5} />
                          <Text fontWeight='bold'>{commify(selectedPack.price)}</Text>
                        </HStack>
                      )}
                    </Box>
                  </GridItem>
                  <GridItem alignSelf='end'><Box textAlign={{base: 'start', sm: 'end'}} fontSize='xl'>Receive:</Box></GridItem>
                  <GridItem alignSelf='end'>
                    {!!selectedPack && (
                      <HStack justify='end' fontSize='2xl' fontWeight='bold' spacing={1} ps={2}>
                        <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                        <Text fontWeight='bold'>{commify(selectedPack.itemsPerPack)}</Text>
                      </HStack>
                    )}
                  </GridItem>
                </SimpleGrid>
              </Flex>
            </RdModalBox>
          </SimpleGrid>
        )}
        {hasAnythingAvailable && (
          <AuthenticationRdButton
            connectText='Connect wallet to purchase'
            requireSignin={false}
          >
            <RdModalFooter>
              <Box textAlign='center' mx={2} ps='20px'>
                <RdButton
                  stickyIcon={true}
                  onClick={handlePurchase}
                  fontSize={{base: 'xl', sm: '2xl'}}
                  isLoading={isExecuting}
                  isDisabled={isExecuting}
                >
                  Purchase
                </RdButton>
              </Box>
            </RdModalFooter>
          </AuthenticationRdButton>
        )}
      </RdModalBody>
    </RdModal>
  )
}


interface SelectableComponentProps extends BoxProps {
  isSelected: boolean;
  children: ReactNode;
  onSelected: (selected: boolean) => void;
}

const SelectableComponent = ({isSelected, onSelected, children, ...props}: SelectableComponentProps) => {
  const isTouchDevice = useIsTouchDevice();

  const hoverStyle = useMemo(() => ({
    borderStyle: isTouchDevice || (!isTouchDevice && isSelected) ? 'solid' : 'dashed',
    borderColor: isTouchDevice ? undefined : '#F48F0C'
  }), [isTouchDevice, isSelected]);

  return (
    <Box position='relative' w='fit-content'>
      <Box
        rounded='lg'
        cursor='pointer'
        border={`2px solid ${isSelected ? '#F48F0C' : 'transparent'}`}
        _hover={hoverStyle}
        _active={{
          borderStyle: 'solid',
          bg: isSelected ? '#376dcfcc' : undefined
        }}
        onClick={() => onSelected(!isSelected)}
        {...props}
      >
        {children}
      </Box>

      {isSelected && (
        <Box
          position='absolute'
          top={'-12px'}
          // top='-12px'
          right='-10px'
          pe='3px'
        >
          <IconButton
            icon={<CloseIcon boxSize={2} />}
            aria-label='Remove'
            bg='gray.800'
            _hover={{ bg: 'gray.600' }}
            size='xs'
            rounded='full'
            color='white'
            onClick={(e) => {
              e.stopPropagation(); // prevent popover
              onSelected(false);
            }}
          />
        </Box>
      )}
    </Box>
  )
}

interface SelectableImageComponentProps extends SelectableComponentProps {
  image: string;
}

const SelectableImageComponent = ({isSelected, onSelected, image, children, ...props}: SelectableImageComponentProps) => {
  return (
    <SelectableComponent
      isSelected={isSelected}
      onSelected={onSelected}
      {...props}
    >
      <Image
        src={ImageService.translate(image).fixedWidth(100, 100)}
      />
    </SelectableComponent>

  )
}

interface SelectableComponentProps2 extends BoxProps {
  isAvailable: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  children?: ReactNode;
  onSelected: (selected: boolean) => void;
}

const SelectableComponent2 = ({isAvailable, isDisabled, isSelected, onSelected, children, ...props}: SelectableComponentProps2) => {
  const isTouchDevice = useIsTouchDevice();
  const isSelectable = isAvailable && !isDisabled;

  const hoverStyle = useMemo(() => ({
    borderStyle: isTouchDevice || (!isTouchDevice && isSelected) ? 'solid' : 'dashed',
    borderColor: isTouchDevice ? undefined : '#F48F0C'
  }), [isTouchDevice, isSelected]);

  const handleSelect = (state: boolean) => {
    if (isSelectable) {
      onSelected(state);
    }
  }

  return (
    <Box position='relative' w='fit-content'>
      <Box
        rounded='lg'
        cursor={isSelectable ? 'pointer' : undefined}
        p={2}
        bg={isAvailable ? '#376dcf' : '#716A67'}
        border={`2px solid ${isSelected ? '#F48F0C' : 'transparent'}`}
        _hover={isSelectable ? hoverStyle : undefined}
        _active={{
          borderStyle: 'solid',
          bg: isSelected ? '#376dcfcc' : undefined
        }}
        onClick={() => handleSelect(!isSelected)}
        filter={isDisabled ? 'grayscale(80%)' : 'auto'}
        opacity={isDisabled ? 0.5 : 'auto'}
        {...props}
      >
        {children}
      </Box>

      {isSelected && (
        <Box
          position='absolute'
          top={0}
          right={0}
          pe='3px'
        >
          <IconButton
            icon={<CloseIcon boxSize={2} />}
            aria-label='Remove'
            bg='gray.800'
            _hover={{ bg: 'gray.600' }}
            size='xs'
            rounded='full'
            color='white'
            onClick={(e) => {
              e.stopPropagation(); // prevent popover
              handleSelect(false);
            }}
          />
        </Box>
      )}
    </Box>
  )
}


interface SelectableImageComponentProps2 extends SelectableComponentProps2 {
  image: string;
  label?: string;
}

const SelectableImageComponent2 = ({isAvailable, isSelected, onSelected, image, label, children, ...props}: SelectableImageComponentProps2) => {
  return (
    <SelectableComponent2
      isAvailable={isAvailable}
      isSelected={isSelected}
      onSelected={onSelected}
      {...props}
    >
      <Image
        src={ImageService.translate(image).fixedWidth(100, 100)}
      />
      <Box fontSize='xs' ms={1} mt={1} textAlign='end' h='21px'>
        {label}
      </Box>
    </SelectableComponent2>

  )
}