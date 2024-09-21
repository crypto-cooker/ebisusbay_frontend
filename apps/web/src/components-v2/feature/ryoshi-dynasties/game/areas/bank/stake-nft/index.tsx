import {
  Box,
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react"

import React, {ChangeEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import InfiniteScroll from "react-infinite-scroll-component";
import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/staking-nft-card";
import {appConfig} from "@src/config";
import {ciEquals} from "@market/helpers/utils";
import WalletNft from "@src/core/models/wallet-nft";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {ArrowBackIcon} from "@chakra-ui/icons";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {getNft} from "@src/core/api/endpoints/nft";
import {BankStakeNftContext} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";
import {StakedTokenType} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/faq-page";
import {useUser} from "@src/components-v2/useUser";
import {useAppConfig} from "@src/config/hooks";
import {NextSlot, PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types";
import StakingBlock from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/staking-block";
import UnstakedNfts from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/unstaked-nfts";
import {DEFAULT_CHAIN_ID, SUPPORTED_RD_CHAIN_CONFIGS} from "@src/config/chains";
import {ChainLogo} from "@dex/components/logo";

const config = appConfig();

const tabs = {
  ryoshiVip: 'ryoshi-tales-vip',
  ryoshiTales: 'ryoshi-tales',
  ryoshiHalloween: 'ryoshi-tales-halloween',
  ryoshiChristmas: 'ryoshi-tales-christmas',
  fortuneTellers: 'fortuneteller'
};

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const StakeNfts = ({isOpen, onClose}: StakeNftsProps) => {
  const user = useUser();
  const queryClient = useQueryClient();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { config: appConfig } = useAppConfig();

  const [currentCollectionChain, setCurrentCollectionChain] = useState(DEFAULT_CHAIN_ID);
  const [stakedNfts, setStakedNfts] = useState<StakedToken[]>([]);
  const [pendingNfts, setPendingNfts] = useState<PendingNft[]>([]);
  const [nextSlot, setNextSlot] = useState<NextSlot>();
  const [page, setPage] = useState<string>();

  const uniqueCollections = useMemo(() => {
    return Array.from(
      new Map(
        rdContext.config.bank.staking.nft.collections
          .map((collection) => ({
            address: collection.address,
            slug: collection.slug,
            name: collection.name,
            chainId: collection.chainId
          }))
          .map((collection) => [collection.slug, collection])
      ).values()
    );
  }, [rdContext.config.bank.staking.nft.collections]);
  const initialCollection = uniqueCollections.find((c) => c.chainId === currentCollectionChain);
  const [currentCollection, setCurrentCollection] = useState(initialCollection);

  const handleCollectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const collection = uniqueCollections.find((c) => c.chainId === currentCollectionChain && c.slug === e.target.value);
    setCurrentCollection(collection);
  };

  const handleChainChange = (chainId: number) => {
    setCurrentCollectionChain(chainId);

    const collection = uniqueCollections.find((c) => c.chainId === chainId);
    setCurrentCollection(collection);
  }

  const handleAddNft = useCallback((nft: WalletNft) => {
    const pendingCount = pendingNfts.filter((sNft) => sNft.nftId === nft.nftId && ciEquals(sNft.nftAddress, nft.nftAddress)).length;
    const withinUnlockedRange = nextSlot && pendingNfts.length <= nextSlot.index;
    const withinMaxSlotRange = pendingNfts.length < rdContext.config.bank.staking.nft.slots.max;
    const stakedCount = stakedNfts.reduce((acc, sNft) => {
      if (sNft.tokenId === nft.nftId && ciEquals(sNft.contractAddress, nft.nftAddress)) {
        return acc + parseInt(sNft.amount);
      }
      return acc;
    }, 0);
    const hasRemainingBalance = (nft.balance ?? 1) - (pendingCount - stakedCount) > 0;
    if (hasRemainingBalance && withinUnlockedRange && withinMaxSlotRange) {
      const collectionSlug = config.collections.find((c: any) => ciEquals(c.address, nft.nftAddress))?.slug;
      const stakeConfigs = rdContext.config.bank.staking.nft.collections.filter((c) => c.slug === collectionSlug);
      const stakeConfig = stakeConfigs.length < 2
        ? stakeConfigs[0]
        : stakeConfigs.find(c => c.minId <= Number(nft.nftId) && c.maxId >= Number(nft.nftId));

      const maxSupply = stakeConfig!.maxId - stakeConfig!.minId + 1;
      const percentile = (nft.rank / maxSupply) * 100;
      const multiplier = stakeConfig!.apr.multipliers
        .sort((a: any, b: any) => a.percentile - b.percentile)
        .find((m: any) => percentile <= m.percentile)?.value || 0;
      const adder = stakeConfig!.apr.adders
        .sort((a: any, b: any) => a.percentile - b.percentile)
        .find((m: any) => percentile <= m.percentile)?.value || 0;
      const idBonus = stakeConfig!.apr.ids.find((i) => i.id.toString() === nft.nftId)?.bonus || 0;

      let troops = 0;
      const troopsConfig = stakeConfig!.troops;
      if (!!troopsConfig)  {
        troops = percentile ? troopsConfig.values
          .sort((a: any, b: any) => a.percentile - b.percentile)
          .find((m: any) => percentile <= m.percentile)?.value || 0 : 0;

        const hasBonusTrait = nft.attributes?.some((attr: any) => {
          const traitType = attr.trait_type.toLowerCase();
          const value = attr.value.toString().toLowerCase();

          for (let traitRule of troopsConfig.bonus.traits) {
            if (traitRule.inclusion === 'include' && traitRule.type === traitType && traitRule.values.includes(value)) {
              return true;
            }
          }
        });
        if (hasBonusTrait) troops += troopsConfig.bonus.value;
      }

      setPendingNfts([...pendingNfts, {
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        image: nft.image,
        rank: nft.rank,
        multiplier: multiplier > 0 ? multiplier + 1 : 0,
        adder: adder + idBonus,
        troops,
        isAlreadyStaked: stakedCount > pendingCount,
        isActive: stakeConfig!.active,
        refBalance: nft.balance ?? 1,
        chainId: nft.chain
      }]);
    }
  }, [pendingNfts]);

  const handleRemoveNft = useCallback((nftAddress: string, nftId: string) => {
    let arrCopy = [...pendingNfts]; // Copy the original array

    let indexToRemove = arrCopy.slice().reverse().findIndex(nft => nft.nftId == nftId && ciEquals(nft.nftAddress, nftAddress));
    if (indexToRemove !== -1) {
      arrCopy.splice(arrCopy.length - 1 - indexToRemove, 1);
    }
    setPendingNfts(arrCopy);
  }, [pendingNfts]);

  const handleStakeSuccess = useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['BankStakedNfts', user.address]});
    queryClient.invalidateQueries({queryKey: ['BankUnstakedNfts', user.address, currentCollection]});
    queryClient.setQueryData(['BankUnstakedNfts', user.address, currentCollection], (old: any) => {
      if (!old) return [];
      old.pages = old.pages.map((page:  any) => {
        page.data = page.data.filter((nft: any) => !pendingNfts.some((pNft) => pNft.nftId === nft.nftId && ciEquals(pNft.nftAddress, nft.nftAddress)));
        return page;
      });
      return old;
    })
    setStakedNfts([...stakedNfts, ...pendingNfts.map((nft) => ({
      amount: '1',
      contractAddress: nft.nftAddress,
      id: '',
      tokenId: nft.nftId,
      type: StakedTokenType.BANK,
      user: user.address!
    }))]);
    setPendingNfts([...pendingNfts.map((nft) => ({...nft, isAlreadyStaked: true, isActive: true, refBalance: nft.refBalance - 1}))]);
  }, [queryClient, stakedNfts, pendingNfts, user.address]);

  const handleClose = () => {
    setPendingNfts([]);
    setStakedNfts([]);
    onClose();
  }

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  const handleRefetchSlotInfo = () => {
    queryClient.invalidateQueries({queryKey: ['BankStakedNfts', user.address]});
  }

  useEffect(() => {
    if (!isOpen || !user.address) return;

    queryClient.fetchQuery({
      queryKey: ['BankStakedNfts', user.address],
      queryFn: () => ApiService.withoutKey().ryoshiDynasties.getStakedTokens(user.address!, StakedTokenType.BANK)
    }).then(async (data) => {
      setStakedNfts(data.staked);
      setNextSlot(data.nextSlot);

      const nfts: PendingNft[] = [];
      for (const token of data.staked) {
        const nft = await getNft(token.contractAddress, token.tokenId, appConfig.defaultChainId);
        if (nft) {
          const stakeConfigs = rdContext.config.bank.staking.nft.collections.filter((c) => ciEquals(c.address, nft.collection.address));
          const stakeConfig = stakeConfigs.length < 2
            ? stakeConfigs[0]
            : stakeConfigs.find(c => c.minId <= Number(nft.nft.nftId) && c.maxId >= Number(nft.nft.nftId));

          const maxSupply = stakeConfig!.maxId - stakeConfig!.minId + 1;
          const percentile = (nft.nft.rank / maxSupply) * 100;
          const multiplier = stakeConfig!.apr.multipliers
            .sort((a: any, b: any) => a.percentile - b.percentile)
            .find((m: any) => percentile <= m.percentile)?.value || 0;
          const adder = stakeConfig!.apr.adders
            .sort((a: any, b: any) => a.percentile - b.percentile)
            .find((m: any) => percentile <= m.percentile)?.value || 0;
          const idBonus = stakeConfig!.apr.ids.find((i) => i.id.toString() === nft.nft.nftId)?.bonus || 0;

          let troops = 0;
          const troopsConfig = stakeConfig!.troops;
          if (!!troopsConfig)  {
            troops = percentile ? troopsConfig.values
              .sort((a: any, b: any) => a.percentile - b.percentile)
              .find((m: any) => percentile <= m.percentile)?.value || 0 : 0;

            const hasBonusTrait = nft.nft.attributes?.some((attr: any) => {
              const traitType = attr.trait_type.toLowerCase();
              const value = attr.value.toString().toLowerCase();

              for (let traitRule of troopsConfig.bonus.traits) {
                if (traitRule.inclusion === 'include' && traitRule.type === traitType && traitRule.values.includes(value)) {
                  return true;
                }
              }
            });
            if (hasBonusTrait) troops += troopsConfig.bonus.value;
          }

          for (let i = 0; i < Number(token.amount); i++) {
            nfts.push({
              nftAddress: token.contractAddress,
              nftId: token.tokenId,
              image: nft.nft.image,
              rank: nft.nft.rank,
              multiplier: multiplier > 0 ? multiplier + 1 : 0,
              adder: adder + idBonus,
              troops,
              isAlreadyStaked: true,
              isActive: stakeConfig!.active,
              refBalance: 0,
              chainId: nft.chain
            })
          }
        }
      }
      setPendingNfts(nfts);
    });


  }, [isOpen, user.address]);

  useEffect(() => {
    if (!user.address) {
      onClose();
    }
  }, [user.address]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Stake NFTs'
      size='5xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <BankStakeNftContext.Provider value={{pendingNfts, stakedNfts, nextSlot}}>
          <Text align='center' p={2}>Ryoshi Tales NFTs can be staked to boost rewards for staked $Fortune. Receive larger boosts by staking higher ranked NFTs. Staked NFTs remain staked for the duration of the game once they start receiving staking rewards.</Text>
          <StakingBlock
            onRemove={handleRemoveNft}
            onStaked={handleStakeSuccess}
            refetchSlotUnlockContext={handleRefetchSlotInfo}
          />
          <Box p={4}>
            <Stack direction='row' justify='space-between' mb={2}>
              <ButtonGroup isAttached variant='outline'>
                {SUPPORTED_RD_CHAIN_CONFIGS.map(({name, chain}) => (
                  <IconButton
                    key={chain.id}
                    aria-label={chain.name}
                    icon={<ChainLogo chainId={chain.id} />}
                    isActive={currentCollectionChain === chain.id}
                    onClick={() => handleChainChange(chain.id)}
                  />
                ))}
              </ButtonGroup>
              <Select onChange={handleCollectionChange} maxW='250px' value={currentCollection?.slug}>
                {uniqueCollections.filter((c) => c.chainId === currentCollectionChain).map((collection) => (
                  <option key={collection.slug} value={collection.slug}>{collection.name}</option>
                ))}
              </Select>
            </Stack>
            <Box>
              {currentCollection && (
                <UnstakedNfts
                  isReady={isOpen}
                  collection={currentCollection?.address}
                  address={user.address ?? undefined}
                  onAdd={handleAddNft}
                  onRemove={handleRemoveNft}
                />
              )}
            </Box>
          </Box>
        </BankStakeNftContext.Provider>
      )}
    </RdModal>
  )
}

export default StakeNfts;




