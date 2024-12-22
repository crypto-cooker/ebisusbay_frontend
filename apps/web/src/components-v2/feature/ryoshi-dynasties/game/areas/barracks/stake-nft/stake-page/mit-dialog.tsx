import React, { useContext, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { parseErrorMessage } from '@src/helpers/validator';
import {
  Alert, AlertIcon,
  Box,
  Button,
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
  Spacer,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import localFont from 'next/font/local';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Address, erc721Abi } from 'viem';
import { useAppChainConfig, useAppConfig } from '@src/config/hooks';
import { useUser } from '@src/components-v2/useUser';
import {
  BarracksStakeNftContext,
  BarracksStakeNftContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ApiService } from '@src/core/services/api-service';
import useBarracksStakeMit from '../../../../hooks/use-barracks-stake-mit';
import WalletNft from '@src/core/models/wallet-nft';
import {
  queryKeys
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/stake-page/constants';
import { useMitMatcher } from '@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-mit-matcher';
import {
  useBarracksNftStakingHandlers
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/stake-page/hooks';

const gothamBook = localFont({ src: '../../../../../../../../../src/global/assets/fonts/Gotham-Book.woff2' });

const isApprovedAtom = atom(false);
const isResetAtom = atom(false);

interface MitStakingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mitNft?: WalletNft;
  onConfirmAdd: (nft: WalletNft) => void;
  onRemoved?: () => void;
}

const MitStakingDialog = ({isOpen, onClose, mitNft, onConfirmAdd, onRemoved}: MitStakingDialogProps) => {
  const user = useUser();
  const { config: appConfig } = useAppConfig();
  const { config: mitChainConfig } = useAppChainConfig(appConfig.mit.chainId);
  const { stakedItems, pendingItems } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;
  const { isMitRequirementEnabled } = useMitMatcher();

  const _isMitRequirementEnabled = isMitRequirementEnabled('barracks');

  // Only query for a random MIT if none explicitly provided to the component
  const { data: userMits } = useQuery({
    queryKey: queryKeys.barracksUnstakedMits(user.address!),
    queryFn: () => ApiService.withoutKey().getWallet(user.address!, {
      collection: [appConfig.mit.address],
      chain: mitChainConfig.chain.id,
      wallet: user.address
    }),
    enabled: !!user.address && !mitNft
  });

  const handleConfirmAdd = () => {
    let nft = mitNft;
    if (!nft) {
      nft = userMits?.data[0];
      if (!nft) {
        toast.error('Cannot find MIT to stake');
        return;
      }
    }

    onConfirmAdd(nft);
    onClose();
  }

  const handleRemoved = () => {
    onRemoved?.();
    onClose();
  }

  const statusText = useMemo(() => {
    if (!!stakedItems.mit) return 'Staked';
    else if (pendingItems.mit) return 'Pending';
    else return 'Unstaked';
  }, [stakedItems, pendingItems]);

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
              <Text>Special Staking</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody color='white'>
          <Text fontSize='sm'>Earn additional Ryoshi troops by staking a Materialization Infusion Terminal (MIT)</Text>
          <Box
            bg='#453e3b'
            rounded='lg'
            p={4}
            mt={4}
          >
            <Stack align='stretch' justify='space-between' direction='row'>
              <Image
                src={'/img/ryoshi-dynasties/icons/mit-active.gif'}
                alt="Materialization Infusion Terminal"
              />
              <VStack align='end' gap={0}>
                <Box fontWeight='bold' textAlign='end'>Current inventory</Box>
                <Spacer />
                <Box fontSize='sm'>Required: 1</Box>
                <Box fontSize='sm'>Status: {statusText}</Box>
              </VStack>
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter bg='#292626' fontSize='sm'>
          {(!!stakedItems.mit || !!pendingItems.mit) ? (
            <VStack w='full'>
              {!_isMitRequirementEnabled && (
                <Alert status='warning'>
                  <AlertIcon />
                  MIT staking is currently not active and is not yielding rewards
                </Alert>
              )}
              <UnstakeActionBar onComplete={handleRemoved} />
            </VStack>
          ) : _isMitRequirementEnabled ? (
            <StakeActionBar onComplete={handleConfirmAdd} />
          ) : (
            <Alert status='warning'>
              <AlertIcon />
              MIT staking currently not available
            </Alert>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const StakeActionBar = ({onComplete}: {onComplete: () => void}) => {
  const { config: appConfig } = useAppConfig();
  const { config: mitChainConfig } = useAppChainConfig(appConfig.mit.chainId);

  const {chainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isWrongNetwork = chainId !== mitChainConfig.chain.id;
  const isApproved = useAtomValue(isApprovedAtom);
  const isReadyForStake = isApproved;

  const handleSyncNetwork = async () => {
    if (isWrongNetwork) {
      await switchNetworkAsync(mitChainConfig.chain.id);
    }
  }

  return (
    <>
      {(isWrongNetwork && isReadyForStake) ? (
        <Stack direction='row' align='center' justify='space-between' w='full'>
          <Text fontSize='sm'>Please switch to Cronos zkEVM</Text>
          <Button
            size='md'
            onClick={handleSyncNetwork}
            variant='ryoshiDynasties'
          >
            Switch network
          </Button>
        </Stack>
      ) : (
        <VStack align='stretch' w='full'>
          {!isReadyForStake && (
            <Text fontSize='sm'>A few things need to be taken care of first before staking your MIT</Text>
          )}
          <Stack direction='row' w='full'>
            {!isApproved && (
              <ApprovalButton />
            )}
            {isReadyForStake && (
              <Button
                w='full'
                size='md'
                onClick={onComplete}
                variant='ryoshiDynasties'
                loadingText='Staking'
              >
                Stake MIT
              </Button>
            )}
          </Stack>
        </VStack>
      )}
    </>
  )
}

const UnstakeActionBar = ({onComplete}: {onComplete: () => void}) => {
  const user = useUser();
  const { config: appConfig } = useAppConfig();
  const { config: mitChainConfig } = useAppChainConfig(appConfig.mit.chainId);
  const { stakedItems, pendingItems } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;

  const {chainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isWrongNetwork = chainId !== mitChainConfig.chain.id;
  const { unstakeMit } = useBarracksStakeMit();
  const queryClient = useQueryClient();
  const { isMitNft } = useMitMatcher();
  const { removeNft } = useBarracksNftStakingHandlers();

  const isUnstake = !!stakedItems.mit;
  const isUnapply = !stakedItems.mit && !!pendingItems.mit;

  const handleSyncNetwork = async () => {
    if (isWrongNetwork) {
      await switchNetworkAsync(mitChainConfig.chain.id);
    }
  }

  const unstake = async () => {
    if (!isUnstake && isUnapply) return;

    await handleSyncNetwork();

    if (!stakedItems.mit) {
      throw new Error ('No staked MIT found');
    }

    const chainsToUnstake = [mitChainConfig.chain.id];

    for (const stakedChainId of chainsToUnstake) {
      if (chainId !== stakedChainId) {
        await switchNetworkAsync(stakedChainId);
      }

      await unstakeMit(stakedItems.mit!, stakedChainId);
    }
  }

  const { mutate: handleStake, isPending: isExecuting } = useMutation({
    mutationFn: unstake,
    onSuccess: () => {
      if (isUnstake) {
        queryClient.setQueryData(queryKeys.barracksStakedNfts(user.address!), (oldData: any) => {
          return {
            ...oldData,
            staked: oldData.staked.filter((nft: any) => !isMitNft(nft))
          }
        });
        toast.success('MIT unstaked!');
      } else if (isUnapply) {
        removeNft(pendingItems.mit!.nft.nftAddress, pendingItems.mit!.nft.nftId);
      }

      onComplete();
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error));
    }
  })

  return (
    <>
      {(isWrongNetwork) ? (
        <Stack direction='row' align='center' justify='space-between' w='full'>
          <Text fontSize='sm'>Please switch to Cronos zkEVM</Text>
          <Button
            size='md'
            onClick={handleSyncNetwork}
            variant='ryoshiDynasties'
          >
            Switch network
          </Button>
        </Stack>
      ) : (
        <Stack direction='row' w='full' justify='space-between' align='center'>
          <Text fontSize='sm'>
            {isUnstake ? (
              <>A MIT has already been staked</>
            ) : (
              <>A MIT is queued for staking</>
            )}
          </Text>
          <Button
            size='md'
            onClick={() => handleStake()}
            variant='ryoshiDynasties'
            isLoading={isExecuting}
            isDisabled={isExecuting}
            loadingText='Unstaking'
          >
            {isUnstake ? 'Unstake' : 'Remove'} MIT
          </Button>
        </Stack>
      )}
    </>
  )
}

const ApprovalButton = () => {
  const user = useUser();
  const { config: appConfig } = useAppConfig();
  const { config: mitChainConfig } = useAppChainConfig(appConfig.mit.chainId);
  const {chainId} = useActiveChainId();
  const setApproval = useSetAtom(isApprovedAtom);

  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  const { data: isApproved } = useReadContract({
    address: appConfig.mit.address as Address,
    abi: erc721Abi,
    functionName: 'isApprovedForAll',
    chainId: mitChainConfig.chain.id,
    args: [user.address as `0x${string}`, mitChainConfig.contracts.barracks]
  });

  const handleApproval = async () => {
    try {
      if (chainId !== mitChainConfig.chain.id) {
        throw new Error(`Please switch to the ${mitChainConfig.chain.name} network.`);
      }

      await writeContractAsync({
        address: appConfig.mit.address as Address,
        abi: erc721Abi,
        functionName: 'setApprovalForAll',
        args: [mitChainConfig.contracts.barracks, true],
      });
      setApproval(true);
      toast.success('Contract approved for staking');
    } catch (err) {
      toast.error(parseErrorMessage(err));
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    setApproval(isApproved ?? false);
  }, [isApproved]);

  if (isConfirmed || isApproved) {
    return null;
  }

  return (
    <Button
      w='full'
      size='md'
      onClick={handleApproval}
      variant='ryoshiDynasties'
      isLoading={isConfirming || isPending}
      isDisabled={isConfirming || isPending}
      loadingText='Approving'
    >
      Approve Contract
    </Button>
  );
}

// const ResetStakeButton = () => {
//   const { pendingItems, stakedItems } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;
//   const [stakeNfts] = useBarracksStakeNfts();
//   const { switchNetworkAsync } = useSwitchNetwork();
//   const {chainId} = useActiveChainId();
//   const setIsReset = useSetAtom(isResetAtom);
//
//   const reset = async () => {
//     const chainsToUnstake = [...new Set(pendingItems.all.map(nft => nft.chainId))];
//
//     for (const stakedChainId of chainsToUnstake) {
//       if (chainId !== stakedChainId) {
//         await switchNetworkAsync(stakedChainId);
//       }
//
//       await stakeNfts(
//         [],
//         stakedItems.all,
//         stakedChainId
//       );
//     }
//   }
//
//
//   const { mutate: handleReset, isPending: isExecuting } = useMutation({
//     mutationFn: reset,
//     onSuccess: () => {
//       setIsReset(true);
//       toast.error('NFTs unstaked');
//     },
//     onError: (err) => {
//       toast.error(parseErrorMessage(err));
//     }
//   })
//
//   useEffect(() => {
//     setIsReset(pendingItems.all.length < 1 ?? false);
//   }, [pendingItems]);
//
//   if (pendingItems.all.length < 1) {
//     return null;
//   }
//
//   return (
//     <Button
//       w='full'
//       size='md'
//       onClick={() => handleReset()}
//       variant='ryoshiDynasties'
//       isLoading={isExecuting}
//       isDisabled={isExecuting}
//       loadingText='Resetting'
//     >
//       Reset Stake
//     </Button>
//   );
// }

export default MitStakingDialog;