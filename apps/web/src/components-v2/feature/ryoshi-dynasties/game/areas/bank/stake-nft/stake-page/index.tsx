import {Box, Flex, Select, Stack, Text} from "@chakra-ui/react";
import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {DEFAULT_CHAIN_ID, SUPPORTED_RD_CHAIN_CONFIGS} from "@src/config/chains";
import {BankStakeNftContext} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";
import {StakedTokenType} from "@src/core/services/api-service/types";
import {ApiService} from "@src/core/services/api-service";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useUser} from "@src/components-v2/useUser";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {useAppConfig} from "@src/config/hooks";
import {ciEquals} from "@market/helpers/utils";
import {getNft} from "@src/core/api/endpoints/nft";
import {NextSlot, PendingNft,} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import StakingBlock
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/staking-block";
import {queryKeys} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/constants";
import UnstakedNfts
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/unstaked-nfts";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";


const StakePage = () => {
  const user = useUser();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { config: appConfig } = useAppConfig();
  const queryClient = useQueryClient();

  const [selectedChainId, setSelectedChainId] = useState(DEFAULT_CHAIN_ID);
  const [pendingNfts, setPendingNfts] = useState<PendingNft[]>([]);
  const [originalPendingNfts, setOriginalPendingNfts] = useState<PendingNft[]>([]);
  const [stakedNfts, setStakedNfts] = useState<StakedToken[]>([]);
  const [nextSlot, setNextSlot] = useState<NextSlot>();

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
  const initialCollection = uniqueCollections.find((c) => c.chainId === selectedChainId);
  const [currentCollection, setCurrentCollection] = useState(initialCollection);

  const fetchBankStakedNfts = async (address: string) => {
    return ApiService.withoutKey().ryoshiDynasties.getStakedTokens(address, StakedTokenType.BANK);
  };

  const { data: stakeInfo, refetch } = useQuery({
    queryKey: queryKeys.bankStakedNfts(user.address!),
    queryFn: () => fetchBankStakedNfts(user.address!),
    enabled: !!user.address,
  });

  const mapStakedTokensToPending = async (stakedTokens: StakedToken[]) => {
    const nfts: PendingNft[] = [];

    for (const token of stakedTokens) {
      const nft = await getNft(token.contractAddress, token.tokenId, token.chainId);

      if (nft) {
        const stakeConfigs = rdContext.config.bank.staking.nft.collections.filter((c) =>
          ciEquals(c.address, nft.collection.address)
        );
        const stakeConfig = stakeConfigs.length < 2
          ? stakeConfigs[0]
          : stakeConfigs.find((c) => c.minId <= Number(nft.nft.nftId) && c.maxId >= Number(nft.nft.nftId));

        if (!stakeConfig) continue;

        const maxSupply = stakeConfig.maxId - stakeConfig.minId + 1;
        const percentile = (nft.nft.rank / maxSupply) * 100;

        const multiplier = stakeConfig.apr.multipliers
          .sort((a: any, b: any) => a.percentile - b.percentile)
          .find((m: any) => percentile <= m.percentile)?.value || 0;

        const adder = stakeConfig.apr.adders
          .sort((a: any, b: any) => a.percentile - b.percentile)
          .find((m: any) => percentile <= m.percentile)?.value || 0;

        const idBonus = stakeConfig.apr.ids.find((i) => i.id.toString() === nft.nft.nftId)?.bonus || 0;

        let troops = 0;
        const troopsConfig = stakeConfig.troops;
        if (troopsConfig) {
          troops = troopsConfig.values
            .sort((a: any, b: any) => a.percentile - b.percentile)
            .find((m: any) => percentile <= m.percentile)?.value || 0;

          const hasBonusTrait = nft.nft.attributes?.some((attr: any) => {
            const traitType = attr.trait_type.toLowerCase();
            const value = attr.value.toString().toLowerCase();

            return troopsConfig.bonus.traits.some((traitRule: any) =>
              traitRule.inclusion === 'include' &&
              traitRule.type === traitType &&
              traitRule.values.includes(value)
            );
          });

          if (hasBonusTrait) troops += troopsConfig.bonus.value;
        }

        for (let i = 0; i < Number(token.amount); i++) {
          nfts.push({
            nft: nft.nft,
            stake: {
              multiplier: multiplier > 0 ? multiplier + 1 : 0,
              adder: adder + idBonus,
              troops,
              isAlreadyStaked: true,
              isActive: stakeConfig.active,
              refBalance: 0,
            },
            chainId: nft.nft.chain
          });
        }
      }
    }

    return nfts;
  };

  const handleCollectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const collection = uniqueCollections.find((c) => c.chainId === selectedChainId && c.slug === e.target.value);
    setCurrentCollection(collection);
  };

  const handleChainChange = (chainId: number) => {
    setSelectedChainId(chainId);

    const collection = uniqueCollections.find((c) => c.chainId === chainId);
    setCurrentCollection(collection);

    setPendingNfts(originalPendingNfts);
  }

  const handleNftsStaked = async (newStakedNfts: PendingNft[]) => {
    queryClient.setQueryData(queryKeys.bankUnstakedNfts(user.address!, currentCollection!.address), (old: any) => {
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
      setStakedNfts(stakeInfo.staked);
      const nfts = await mapStakedTokensToPending(stakeInfo.staked);
      setPendingNfts(nfts);
      setOriginalPendingNfts(nfts);
      setNextSlot(stakeInfo.nextSlot);
    })();
  }, [stakeInfo]);

  return (
    <BankStakeNftContext.Provider
      value={{
        stakedNfts,
        pendingNfts,
        setPendingNfts,
        nextSlot,
        selectedChainId,
        collections: uniqueCollections,
        onNftsStaked: handleNftsStaked
      }}
    >
      <RdModalBox mx={1} textAlign='center'>
        Ryoshi Tales NFTs can be staked to boost rewards for staked $FRTN. Receive larger boosts by staking higher ranked NFTs. Staked NFTs remain staked for the duration of the game once they start receiving staking rewards.
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
    </BankStakeNftContext.Provider>
  )
}

export default StakePage;