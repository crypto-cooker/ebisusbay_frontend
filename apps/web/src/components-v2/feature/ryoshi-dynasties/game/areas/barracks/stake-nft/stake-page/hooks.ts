import { useCallback, useContext } from 'react';
import WalletNft from '@src/core/models/wallet-nft';
import { ciEquals } from '@market/helpers/utils';
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context';
import {
  BarracksStakeNftContext,
  BarracksStakeNftContextProps
} from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context';
import { useAppConfig } from '@src/config/hooks';
import { toast } from 'react-toastify';

export const useBarracksNftStakingHandlers = () => {
  const { pendingItems, setPendingItems, stakedItems, nextSlot, collections } = useContext(BarracksStakeNftContext) as BarracksStakeNftContextProps;
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { isMitNft } = useMitMatcher();

  const addNft = useCallback((nft: WalletNft) => {
    const pendingCount = pendingItems.common.filter((sNft) => sNft.nft.nftId === nft.nftId && ciEquals(sNft.nft.nftAddress, nft.nftAddress)).length;
    let withinUnlockedRange = !!nextSlot && pendingItems.common.length <= nextSlot.index;
    let withinMaxSlotRange = pendingItems.common.length < rdContext.config.barracks.staking.nft.slots.max;
    const stakedCount = stakedItems.all.reduce((acc, sNft) => {
      if (sNft.tokenId === nft.nftId && ciEquals(sNft.contractAddress, nft.nftAddress)) {
        return acc + parseInt(sNft.amount);
      }
      return acc;
    }, 0);
    let hasRemainingBalance = (nft.balance ?? 1) - (pendingCount - stakedCount) > 0;

    // MIT only has one fixed slot, so validate it separately
    if (isMitNft(nft)) {
      withinUnlockedRange = true;
      withinMaxSlotRange = !pendingItems.mit;
      hasRemainingBalance = (nft.balance ?? 0) > 0;
      if (pendingItems.mit) {
        toast.error('Only one MIT can be staked at a time');
        return;
      }
    }

    if (hasRemainingBalance && withinUnlockedRange && withinMaxSlotRange) {
      const collectionSlug = collections.find((c: any) => ciEquals(c.address, nft.nftAddress))?.slug;
      const stakeConfigs = rdContext.config.barracks.staking.nft.collections.filter((c) => c.slug === collectionSlug);
      const stakeConfig = stakeConfigs.length < 2
        ? stakeConfigs[0]
        : stakeConfigs.find(c =>  c.minId <= Number(nft.nftId) && c.maxId >= Number(nft.nftId));

      const maxSupply = stakeConfig!.maxId - stakeConfig!.minId + 1;
      const percentile = (nft.rank / maxSupply) * 100;
      const multiplier = stakeConfig!.multipliers
        .sort((a: any, b: any) => a.percentile - b.percentile)
        .find((m: any) => percentile <= m.percentile)?.value || 0;
      const idBonus = stakeConfig!.ids.find((i) => i.id.toString() === nft.nftId)?.bonus || 0;

      const bonusTroops = nft.attributes?.reduce((acc: number, attr: any) => {
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

      setPendingItems([...pendingItems.all, {
        nft,
        stake: {
          multiplier: multiplier + idBonus,
          bonusTroops,
          isAlreadyStaked: stakedCount > pendingCount,
          isActive: stakeConfig!.active,
          refBalance: nft.balance ?? 1,
        },
        chainId: nft.chain
      }]);
    }
  }, [pendingItems]);

  const removeNft = useCallback((nftAddress: string, nftId: string) => {
    let arrCopy = [...pendingItems.all]; // Copy the original array

    let indexToRemove = arrCopy.slice().reverse().findIndex(nft => nft.nft.nftId == nftId && ciEquals(nft.nft.nftAddress, nftAddress));
    if (indexToRemove !== -1) {
      arrCopy.splice(arrCopy.length - 1 - indexToRemove, 1);
    }
    setPendingItems(arrCopy);
  }, [pendingItems]);

  return {
    addNft,
    removeNft
  }
}

export const useMitMatcher = () => {
  const { config: appConfig } = useAppConfig();

  const isMitNft = (nft: any) => {
    const nftAddress = nft.contractAddress ?? nft.nftAddress;
    const chainId = nft.chain ?? nft.chainId;
    return ciEquals(nftAddress, appConfig.mit.address) && chainId === appConfig.mit.chainId;
  }

  return {
    isMitNft
  }
}