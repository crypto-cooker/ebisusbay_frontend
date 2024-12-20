import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { parseErrorMessage } from '@src/helpers/validator';
import {
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
import { useMutation, useQuery } from '@tanstack/react-query';
import localFont from 'next/font/local';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { ChainId } from '@pancakeswap/chains';
import { useSwitchNetwork } from '@eb-pancakeswap-web/hooks/useSwitchNetwork';
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Address, erc721Abi } from 'viem';
import { useAppChainConfig, useAppConfig } from '@src/config/hooks';
import { AppChainConfigZKEvm } from '@src/config/chains';
import { useUser } from '@src/components-v2/useUser';
import {
  BarracksStakeNftContext,
  BarracksStakeNftContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context';
import useBarracksStakeNfts from '@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-barracks-stake-nfts';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ApiService } from '@src/core/services/api-service';
import useBarracksStakeMit from '../../../../hooks/use-barracks-stake-mit';

const gothamBook = localFont({ src: '../../../../../../../../../src/global/assets/fonts/Gotham-Book.woff2' });

const isApprovedAtom = atom(false);
const isResetAtom = atom(false);

interface MitStakingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MitStakingDialog = ({isOpen, onClose}: MitStakingDialogProps) => {
  const user = useUser();
  const { config: appConfig } = useAppConfig();
  const { config: mitChainConfig } = useAppChainConfig(appConfig.mit.chainId);
  const { stakedMit } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;

  const { data: userMits } = useQuery({
    queryKey: ['UserMits', user.address],
    queryFn: () => ApiService.withoutKey().getWallet(user.address!, {
      collection: [appConfig.mit.address],
      chain: mitChainConfig.chain.id,
      wallet: user.address
    }),
    enabled: !!user.address
  });

  const addMit = async () => {
    console.log('add')
  }

  const removeMit = async () => {
    console.log('remove')
  }

  const executeMit = async () => {
    console.log('execute')
  }

  const mutation = useMutation({
    mutationFn: executeMit,
    onSuccess: (data) => {

      toast.success('MIT has been set!');
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    },
  });

  const handleApply = async () => {
    mutation.mutate();
  }

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
                <Box fontWeight='bold'>Current inventory</Box>
                <Spacer />
                <Box fontSize='sm'>Required: 1</Box>
                <Box fontSize='sm'>Quantity: {userMits?.data.length}</Box>
                <Box fontSize='sm'>Staked: {!!stakedMit ? 'Yes' : 'No'}</Box>
              </VStack>
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter bg='#292626'>
          {!!stakedMit ? (
            <UnstakeActionBar onComplete={onClose} />
          ) : (
            <StakeActionBar onComplete={onClose} />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const StakeActionBar = ({onComplete}: {onComplete: () => void}) => {
  const user = useUser();
  const { config: appConfig } = useAppConfig();
  const { config: mitChainConfig } = useAppChainConfig(appConfig.mit.chainId);

  const {chainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isWrongNetwork = chainId !== mitChainConfig.chain.id;
  const [stakeNfts] = useBarracksStakeNfts();
  const isApproved = useAtomValue(isApprovedAtom);
  const isReset = useAtomValue(isResetAtom);
  const isReadyForStake = isApproved && isReset;
  const { stakeMit } = useBarracksStakeMit();

  const handleSyncNetwork = async () => {
    if (isWrongNetwork) {
      await switchNetworkAsync(mitChainConfig.chain.id);
    }
  }

  const stake = async () => {
    await handleSyncNetwork();

    const mitNfts = await ApiService.withoutKey().getWallet(user.address!, {
      collection: [appConfig.mit.address],
      chain: mitChainConfig.chain.id,
      wallet: user.address
    });

    if (mitNfts.data.length < 1) {
      throw new Error('No MIT NFTs found');
    }

    const nft = {
      nft: mitNfts.data[0],
      amount: 1,
      chainId: mitChainConfig.chain.id,
      stake: {
        multiplier: 1,
        bonusTroops: 1,
        isAlreadyStaked: false,
        isActive: true,
        refBalance: 0
      }
    }

    await stakeMit(nft, mitChainConfig.chain.id);
  }

  const { mutate: handleStake, isPending: isExecuting } = useMutation({
    mutationFn: stake,
    onSuccess: () => {
      toast.success('MIT staked!');
      onComplete();
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error));
    }
  })

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
            {!isReset && (
              <ResetStakeButton />
            )}
            {isReadyForStake && (
              <Button
                w='full'
                size='md'
                onClick={() => handleStake()}
                variant='ryoshiDynasties'
                isLoading={isExecuting}
                isDisabled={isExecuting}
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
  const { stakedNfts, stakedMit } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;

  const {chainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isWrongNetwork = chainId !== mitChainConfig.chain.id;
  const { unstakeMit } = useBarracksStakeMit();

  const handleSyncNetwork = async () => {
    if (isWrongNetwork) {
      await switchNetworkAsync(mitChainConfig.chain.id);
    }
  }

  const unstake = async () => {
    await handleSyncNetwork();

    if (!stakedMit) {
      throw new Error ('No staked MIT found');
    }

    const chainsToUnstake = [mitChainConfig.chain.id];

    for (const stakedChainId of chainsToUnstake) {
      if (chainId !== stakedChainId) {
        await switchNetworkAsync(stakedChainId);
      }

      await unstakeMit(stakedMit!, stakedChainId);
    }
  }

  const { mutate: handleStake, isPending: isExecuting } = useMutation({
    mutationFn: unstake,
    onSuccess: () => {
      toast.success('MIT unstaked!');
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
        <VStack align='stretch' w='full'>
          <Stack direction='row' w='full'>
            <Button
              w='full'
              size='md'
              onClick={() => handleStake()}
              variant='ryoshiDynasties'
              isLoading={isExecuting}
              isDisabled={isExecuting}
              loadingText='Staking'
            >
              Unstake MIT
            </Button>
          </Stack>
        </VStack>
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

const ResetStakeButton = () => {
  const { pendingNfts, stakedNfts } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;
  const [stakeNfts] = useBarracksStakeNfts();
  const { switchNetworkAsync } = useSwitchNetwork();
  const {chainId} = useActiveChainId();
  const setIsReset = useSetAtom(isResetAtom);

  const reset = async () => {
    const chainsToUnstake = [...new Set(pendingNfts.map(nft => nft.chainId))];

    for (const stakedChainId of chainsToUnstake) {
      if (chainId !== stakedChainId) {
        await switchNetworkAsync(stakedChainId);
      }

      await stakeNfts(
        [],
        stakedNfts,
        stakedChainId
      );
    }
  }


  const { mutate: handleReset, isPending: isExecuting } = useMutation({
    mutationFn: reset,
    onSuccess: () => {
      setIsReset(true);
      toast.error('NFTs unstaked');
    },
    onError: (err) => {
      toast.error(parseErrorMessage(err));
    }
  })

  useEffect(() => {
    setIsReset(stakedNfts.length < 1 ?? false);
  }, [stakedNfts]);

  if (stakedNfts.length < 1) {
    return null;
  }

  return (
    <Button
      w='full'
      size='md'
      onClick={() => handleReset()}
      variant='ryoshiDynasties'
      isLoading={isExecuting}
      isDisabled={isExecuting}
      loadingText='Resetting'
    >
      Reset Stake
    </Button>
  );
}

const SwitchNetworkComponent = () => {

}

export default MitStakingDialog;