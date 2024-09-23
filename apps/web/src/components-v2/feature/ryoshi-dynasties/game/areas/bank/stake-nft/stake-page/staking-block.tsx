import {useUser} from "@src/components-v2/useUser";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {
  BankStakeNftContext,
  BankStakeNftContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";
import useBankStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-bank-stake-nfts";
import {BigNumber, Contract} from "ethers";
import {ERC1155, ERC721} from "@src/global/contracts/Abis";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import Fortune from "@src/global/contracts/Fortune.json";
import {Alert, AlertDescription, AlertIcon, Box, Flex, SimpleGrid, Stack, VStack} from "@chakra-ui/react";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useAppChainConfig} from "@src/config/hooks";
import {useJsonRpcProviderForChain} from "@src/global/hooks/use-ethers-provider-for-chain";
import {useMutation} from "@tanstack/react-query";
import {
  useBankNftStakingHandlers
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/hooks";
import StakingSlot from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/staking-slot";
import SlotUnlockDialog
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/slot-unlock-dialog";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";


interface StakingBlockProps {
  refetchSlotUnlockContext: () => void;
}

const StakingBlock = ({refetchSlotUnlockContext}: StakingBlockProps) => {
  const user = useUser();
  const { config: appChainConfig } = useAppChainConfig();
  const readProvider = useJsonRpcProviderForChain(appChainConfig.chain.id);

  const { pendingNfts, stakedNfts, nextSlot, onNftsStaked, selectedChainId } = useContext(BankStakeNftContext) as BankStakeNftContextProps;
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('');
  const [stakeNfts, response] = useBankStakeNfts();
  const [unlockApprovalState, setUnlockApprovalState] = useState<[BigNumber, boolean]>([BigNumber.from(0), false]);
  const [selectedLockedSlot, setSelectedLockedSlot] = useState<number>();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { chainId: activeChainId} = useActiveChainId();
  const needsNetworkChange = activeChainId !== selectedChainId;

  const stake = useCallback(async () => {
    if (pendingNfts.length === 0 && stakedNfts.length === 0) {
      throw new Error('No changes found');
    }
    setIsExecutingStake(true);
    setExecutingLabel('Approving');
    const approvedCollections: string[] = [];
    for (let nft of pendingNfts) {
      if (approvedCollections.includes(nft.nft.nftAddress)) continue;

      const nftContract = new Contract(nft.nft.nftAddress, ERC721, user.provider.getSigner());
      const isApproved = await nftContract.isApprovedForAll(user.address!.toLowerCase(), appChainConfig.contracts.bank);

      if (!isApproved) {
        let tx = await nftContract.setApprovalForAll(appChainConfig.contracts.bank, true);
        await tx.wait();
        approvedCollections.push(nft.nft.nftAddress);
      }
    }

    setExecutingLabel('Staking');
    await stakeNfts(
      pendingNfts.map((nft) => ({
        ...nft,
        amount: 1
      })),
      stakedNfts,
      selectedChainId
    );
  }, [pendingNfts, executingLabel, isExecutingStake, user.provider.signer]);

  const checkForApproval = async () => {
    const fortuneContract = new Contract(appChainConfig.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), appChainConfig.contracts.resources);

    const resourcesContract = new Contract(appChainConfig.contracts.resources, ERC1155, readProvider);
    const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, appChainConfig.contracts.resources);

    setUnlockApprovalState([totalApproved, isResourcesApproved]);
  }

  const mutation = useMutation({
    mutationFn: stake,
    onSuccess: (data) => {
      onNftsStaked(pendingNfts);
      toast.success('Staking successful!');
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error));
    },
    onSettled: () => {
      setIsExecutingStake(false);
      setExecutingLabel('');
    }
  });

  const handleStake = async () => {
    mutation.mutate();
  }

  // Syncs wallet network to target network
  const handleSyncNetwork = async () => {
    if (needsNetworkChange) {
      await switchNetworkAsync(selectedChainId);
    }
  }

  useEffect(() => {
    setSelectedLockedSlot(undefined);
    if (user.address) {
      checkForApproval();
    }
  }, [user.address]);

  return (
    <Box>
      <Flex justify='center'>
        <VStack my={6} px={4} spacing={8} justify='center'>
          <SimpleGrid columns={{base: 2, sm: 3, md: 5}} gap={2}>
            {[...Array(5).fill(0)].map((_, index) => (
              <StakingSlot
                key={index}
                pendingNft={pendingNfts[index]}
                isUnlocked={!!nextSlot && index <= nextSlot.index}
                onSelect={() => setSelectedLockedSlot(index)}
                isInDialog={selectedLockedSlot === index}
              />
            ))}
          </SimpleGrid>
          <Stack
            my={{base: 4, md: 'auto'}} px={4}
            direction={{base: 'column', sm: 'row'}}
            justify='center'
            w='full'
            maxW='664px'
            align='center'
          >
            <Box>
              {needsNetworkChange ? (
                <RdButton
                  stickyIcon={true}
                  onClick={handleSyncNetwork}
                  size='md'
                >
                  Switch Network
                </RdButton>
              ) : (
                <RdButton
                  minW='150px'
                  onClick={handleStake}
                  isLoading={isExecutingStake}
                  disabled={isExecutingStake}
                  stickyIcon={true}
                  loadingText={executingLabel}
                  ms={8}
                  size='md'
                >
                  Save
                </RdButton>
              )}
            </Box>
          </Stack>
        </VStack>
      </Flex>
      {selectedLockedSlot !== undefined && !!nextSlot && (
        <SlotUnlockDialog
          isOpen={true}
          onClose={() => {
            setSelectedLockedSlot(undefined);
            refetchSlotUnlockContext();
          }}
          initialApprovalState={unlockApprovalState}
        />
      )}
    </Box>
  )
}

export default StakingBlock;