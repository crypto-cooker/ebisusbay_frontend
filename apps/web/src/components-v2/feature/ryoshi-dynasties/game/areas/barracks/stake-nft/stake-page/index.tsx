import { useUser } from '@src/components-v2/useUser';
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_CHAIN_ID, SUPPORTED_RD_CHAIN_CONFIGS } from '@src/config/chains';
import { NextSlot, PendingNft } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types';
import { StakedToken } from '@src/core/services/api-service/graph/types';
import { ApiService } from '@src/core/services/api-service';
import { StakedTokenType } from '@src/core/services/api-service/types';
import {
  queryKeys
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/stake-page/constants';
import { getNft } from '@src/core/api/endpoints/nft';
import { ciEquals } from '@market/helpers/utils';
import { BarracksStakeNftContext, PendingItems, StakedItems } from '../context';
import { RdModalBox } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';
import { Box, Flex, Select, Stack } from '@chakra-ui/react';
import StakingBlock
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/stake-page/staking-block';
import UnstakedNfts
  from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/stake-page/unstaked-nfts';
import RdTabButton from '@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button';
import {
  useMitMatcher
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/stake-page/hooks';

const StakePage = () => {
  const user = useUser();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const queryClient = useQueryClient();

  const [selectedChainId, setSelectedChainId] = useState(DEFAULT_CHAIN_ID);
  const [originalPendingNfts, setOriginalPendingNfts] = useState<PendingNft[]>([]);
  const [nextSlot, setNextSlot] = useState<NextSlot>();

  const [stakedItems, setStakedItems] = useState<StakedItems>({ all: [], common: [] });
  const [pendingItems, setPendingItems] = useState<PendingItems>({ all: [], common: [] });
  const { isMitNft } = useMitMatcher();

  const handleSetPendingItems = (items: PendingNft[]) => {
    setPendingItems({
      all: items,
      common: items.filter((item) => !isMitNft(item.nft)),
      mit: items.find((item) => isMitNft(item.nft))
    })
  }

  const uniqueCollections = useMemo(() => {
    return Array.from(
      new Map(
        rdContext.config.barracks.staking.nft.collections
          .map((collection) => ({
            address: collection.address,
            slug: collection.slug,
            name: collection.name,
            chainId: collection.chainId
          }))
          .map((collection) => [collection.slug, collection])
      ).values()
    );
  }, [rdContext.config.barracks.staking.nft.collections]);
  const initialCollection = uniqueCollections.find((c) => c.chainId === selectedChainId);
  const [currentCollection, setCurrentCollection] = useState(initialCollection);

  const fetchBarracksStakedNfts = async (address: string) => {
    return ApiService.withoutKey().ryoshiDynasties.getStakedTokens(address, StakedTokenType.BARRACKS);
  };

  const {data: stakeInfo, refetch} = useQuery({
    queryKey: queryKeys.barracksStakedNfts(user.address!),
    queryFn: () => fetchBarracksStakedNfts(user.address!),
    enabled: !!user.address,
  });

  const mapStakedTokensToPending = async (stakedTokens: StakedToken[]) => {
    const nfts: PendingNft[] = [];
    for (const token of stakedTokens) {
      const nft = await getNft(token.contractAddress, token.tokenId, token.chainId);

      if (nft) {
        const stakeConfigs = rdContext.config.barracks.staking.nft.collections.filter((c) => ciEquals(c.address, nft.collection.address));
        const stakeConfig = stakeConfigs.length < 2
          ? stakeConfigs[0]
          : stakeConfigs.find(c => c.minId <= Number(nft.nft.nftId) && c.maxId >= Number(nft.nft.nftId));

        const maxSupply = stakeConfig!.maxId - stakeConfig!.minId + 1;
        const percentile = (nft.nft.rank / maxSupply) * 100;
        const multiplier = stakeConfig!.multipliers
          .sort((a: any, b: any) => a.percentile - b.percentile)
          .find((m: any) => percentile <= m.percentile)?.value || 0;
        const idBonus = stakeConfig!.ids.find((i) => i.id.toString() === nft.nft.nftId)?.bonus || 0;

        const bonusTroops = nft.nft.attributes?.reduce((acc: number, attr: any) => {
          const traitType = attr.trait_type.toLowerCase();
          const value = attr.value.toString().toLowerCase();

          let sum = 0;
          for (let bonusRule of stakeConfig!.bonus) {
            for (let traitRule of bonusRule.traits) {
              if (traitRule.inclusion === 'include' && traitRule.type === traitType && traitRule.values.includes(value)) {
                sum += bonusRule.value;
              }
            }
          }
          return sum + acc;
        }, 0);

        for (let i = 0; i < Number(token.amount); i++) {
          nfts.push({
            nft: nft.nft,
            stake: {
              multiplier: multiplier + idBonus,
              bonusTroops,
              isAlreadyStaked: true,
              isActive: stakeConfig!.active,
              refBalance: 0,
            },
            chainId: nft.nft.chain
          })
        }
      }
    }

    return nfts;
  }

  const handleCollectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const collection = uniqueCollections.find((c) => c.chainId === selectedChainId && c.slug === e.target.value);
    setCurrentCollection(collection);
  };

  const handleChainChange = (chainId: number) => {
    setSelectedChainId(chainId);

    const collection = uniqueCollections.find((c) => c.chainId === chainId);
    setCurrentCollection(collection);

    setPendingItems({
      all: originalPendingNfts,
      common: originalPendingNfts.filter(item => !isMitNft(item.nft)),
      mit: originalPendingNfts.find((item) => isMitNft(item.nft))
    });
  }

  const handleNftsStaked = async (newStakedNfts: PendingNft[]) => {
    queryClient.setQueryData(queryKeys.barracksUnstakedNfts(user.address!, currentCollection!.address), (old: any) => {
      if (!old) return [];
      old.pages = old.pages.map((page:  any) => {
        page.data = page.data.filter((nft: any) => !newStakedNfts.some((pNft) => pNft.nft.nftId === nft.nftId && ciEquals(pNft.nft.nftAddress, nft.nftAddress)));
        return page;
      });
      return old;
    });
    await refetch();
  }

  useEffect(() => {
    if (!stakeInfo) return;

    (async () => {
      const nfts = await mapStakedTokensToPending(stakeInfo.staked);
      setOriginalPendingNfts(nfts);
      setNextSlot(stakeInfo.nextSlot);

      setStakedItems({
        all: stakeInfo.staked,
        common: stakeInfo.staked.filter(item => !isMitNft(item)),
        mit: stakeInfo.staked.find(isMitNft)
      })
      setPendingItems({
        all: nfts,
        common: nfts.filter(item => !isMitNft(item.nft)),
        mit: nfts.find((item) => isMitNft(item.nft))
      })
    })();
  }, [stakeInfo]);

  return (
    <BarracksStakeNftContext.Provider
      value={{
        nextSlot,
        selectedChainId,
        collections: uniqueCollections,
        onNftsStaked: handleNftsStaked,
        stakedItems,
        pendingItems,
        setPendingItems: handleSetPendingItems
      }}
    >
      <RdModalBox mx={1} textAlign='center'>
        Ryoshi Tales NFTs can be staked to earn extra battle units per slot. Some NFTs may require a weapon trait. Staked NFTs remain staked for the duration of the game while troops have been deployed or delegated.
      </RdModalBox>
      <Box px={1} mt={2}>
        <Flex direction='row' justify='center' mb={2}>
          {SUPPORTED_RD_CHAIN_CONFIGS.map(({name, chain}) => (
            <RdTabButton
              isActive={selectedChainId === chain.id}
              onClick={() => handleChainChange(chain.id)}
            >
              {name}
            </RdTabButton>
          ))}
        </Flex>
      </Box>
      <StakingBlock refetchSlotUnlockContext={refetch} />
      <Box p={4}>
        <Stack direction='row' justify='space-between' mb={2}>
          <Select onChange={handleCollectionChange} maxW='250px' value={currentCollection?.slug}>
            {uniqueCollections.filter((c) => c.chainId === selectedChainId).map((collection) => (
              <option key={collection.slug} value={collection.slug}>{collection.name}</option>
            ))}
          </Select>
        </Stack>
        <Box>
          {currentCollection && (
            <UnstakedNfts
              isReady={true}
              collection={currentCollection?.address}
              address={user.address ?? undefined}
            />
          )}
        </Box>
      </Box>
    </BarracksStakeNftContext.Provider>
  )
}

export default StakePage;