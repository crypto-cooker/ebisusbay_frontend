import {BigNumber, Contract, ethers} from "ethers";
import {useUser} from "@src/components-v2/useUser";
import {useAppChainConfig} from "@src/config/hooks";
import React, {useContext, useEffect, useState} from "react";
import {
  BankStakeNftContext,
  BankStakeNftContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import Fortune from "@src/global/contracts/Fortune.json";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {ERC1155} from "@src/global/contracts/Abis";
import Resources from "@src/global/contracts/Resources.json";
import {ApiService} from "@src/core/services/api-service";
import {queryKeys} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/constants";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack
} from "@chakra-ui/react";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import ImageService from "@src/core/services/image";
import localFont from "next/font/local";


const gothamBook = localFont({ src: '../../../../../../../../../src/global/assets/fonts/Gotham-Book.woff2' });

interface SlotUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialApprovalState: [BigNumber, boolean];
}

const SlotUnlockDialog = ({isOpen, onClose, initialApprovalState}: SlotUnlockDialogProps) => {
  const user = useUser();
  const { config: appChainConfig } = useAppChainConfig();
  const { nextSlot } = useContext(BankStakeNftContext) as BankStakeNftContextProps;
  const [executingFortuneApproval, setExecutingFortuneApproval] = useState(false);
  const [executingResourcesApproval, setExecutingResourcesApproval] = useState(false);
  const [unlockApprovalState, setUnlockApprovalState] = useState(initialApprovalState);
  const fortuneApprovalLimit = 50000;
  const {requestSignature} = useEnforceSignature();
  const queryClient = useQueryClient();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const handleEnableFortune = async () => {
    try {
      setExecutingFortuneApproval(true);
      const fortuneApprovalLimitWei = ethers.utils.parseEther(fortuneApprovalLimit.toString());
      const fortuneContract = new Contract(appChainConfig.contracts.fortune, Fortune, user.provider.getSigner());
      const tx = await fortuneContract.approve(appChainConfig.contracts.resources, fortuneApprovalLimitWei);
      await tx.wait();
      setUnlockApprovalState([fortuneApprovalLimitWei, unlockApprovalState[1]]);
      toast.success('Fortune has been enabled!');
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecutingFortuneApproval(false);
    }
  }

  const handleEnableResources = async () => {
    try {
      setExecutingResourcesApproval(true);
      const resourcesContract = new Contract(appChainConfig.contracts.resources, ERC1155, user.provider.getSigner());
      const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, appChainConfig.contracts.resources);

      if (!isResourcesApproved) {
        let tx = await resourcesContract.setApprovalForAll(appChainConfig.contracts.resources, true);
        await tx.wait();
        setUnlockApprovalState([unlockApprovalState[0], true]);
      }
      toast.success('Koban has been enabled!');
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecutingResourcesApproval(false);
    }
  }

  const unlockSlot = async () => {
    if (!nextSlot) {
      throw new Error('No available slot to unlock');
    }

    const fortuneContract = new Contract(appChainConfig.contracts.fortune, Fortune, user.provider.getSigner());
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), appChainConfig.contracts.resources);
    if (totalApproved.lt(ethers.utils.parseEther(nextSlot.cost.frtn.toString()))) {
      toast.warning('Approving more FRTN');
      await handleEnableFortune();
    }

    const resourcesContract = new Contract(appChainConfig.contracts.resources, Resources, user.provider.getSigner());
    const balance = await resourcesContract.balanceOf(user.address, 1);
    if (balance.lt(nextSlot.cost.koban)) {
      throw new Error('Not enough Koban')
    }

    const signature = await requestSignature();
    const authorization = await ApiService.withoutKey().ryoshiDynasties.requestSlotUnlockAuthorization(
      1,
      appChainConfig.chain.id,
      user.address!,
      signature
    );

    const tx = await resourcesContract.craftItems(authorization.approval, authorization.signature);
    await tx.wait();
  }

  const mutation = useMutation({
    mutationFn: unlockSlot,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.bankStakedNfts(user.address!), (oldData: any) => ({
        ...oldData,
        nextSlot: {
          index: oldData.nextSlot.index + 1,
          cost: rdContext.config.bank.staking.nft.slots.cost[oldData.nextSlot.index + 1]
        },  // Update the nextSlot after unlocking
      }));

      toast.success('Slot has been unlocked!');
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    },
    onSettled: () => {
      setExecutingFortuneApproval(false);
      setExecutingResourcesApproval(false);
    }
  });

  const handleUnlock = async () => {
    mutation.mutate();
  }

  useEffect(() => {
    setUnlockApprovalState(initialApprovalState);
  }, [initialApprovalState]);

  return (
    <Modal
      isOpen={isOpen}
      isCentered={true}
      onClose={onClose}
      size='lg'
    >
      <ModalOverlay />
      <ModalContent border='2px solid #CCC' bg='#292626' color='white' className={gothamBook.className}>
        <ModalHeader>
          <Center>
            <HStack>
              <Text>Unlock Staking Slots</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody color='white'>
          <Text>Unlock staking slots to allow additional NFTs to earn more APR in the bank.</Text>
          <Box
            bg='#453e3b'
            rounded='lg'
            p={2}
            mt={4}
          >
            <Text textAlign='center' mb={4}>Current slot cost</Text>
            <SimpleGrid columns={2}>
              <VStack spacing={0}>
                <HStack>
                  <FortuneIcon boxSize={6} />
                  <Text fontWeight='bold' fontSize='lg'>{nextSlot?.cost.frtn}</Text>
                </HStack>
                <Box fontSize='sm'>Fortune</Box>
              </VStack>
              <VStack spacing={0}>
                <HStack>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                  <Text fontWeight='bold' fontSize='lg'>{nextSlot?.cost.koban}</Text>
                </HStack>
                <Box fontSize='sm'>Koban</Box>
              </VStack>
            </SimpleGrid>
          </Box>
        </ModalBody>
        <ModalFooter>
          <VStack w='full'>
            <ButtonGroup spacing={2} width="full">
              {!!nextSlot && unlockApprovalState[0].lt(ethers.utils.parseEther(nextSlot.cost.frtn.toString())) && (
                <Button
                  size='md'
                  isLoading={executingFortuneApproval}
                  isDisabled={executingFortuneApproval || executingResourcesApproval || mutation.isPending}
                  onClick={handleEnableFortune}
                  variant='ryoshiDynasties'
                  flex={1}
                >
                  Enable FRTN
                </Button>
              )}
              {!unlockApprovalState[1] && (
                <Button
                  size='md'
                  isLoading={executingResourcesApproval}
                  isDisabled={executingFortuneApproval || executingResourcesApproval || mutation.isPending}
                  onClick={handleEnableResources}
                  variant='ryoshiDynasties'
                  flex={1}
                >
                  Enable Koban
                </Button>
              )}
            </ButtonGroup>
            <Button
              w='full'
              size='md'
              isLoading={mutation.isPending}
              isDisabled={mutation.isPending || !unlockApprovalState[0].gte(ethers.utils.parseEther(nextSlot?.cost.frtn.toString() ?? '0')) || !unlockApprovalState[1]}
              onClick={handleUnlock}
              variant='ryoshiDynasties'
            >
              Unlock
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SlotUnlockDialog;