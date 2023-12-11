import {useEffect, useState} from "react";
import {Staker, StakingStatusFilters} from "@src/components-v2/feature/brand/tabs/staking/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {stakers} from "@src/components-v2/feature/brand/tabs/staking/config";
import {ciIncludes} from "@src/utils";
import {useUser} from "@src/components-v2/useUser";

const queryKey = 'BrandStakingTabNfts';

export const useStaker = (slug: string) => {
    const [staker, setStaker] = useState<Staker>();
    const queryClient = useQueryClient();
    const user = useUser();

    useEffect(() => {
        setStaker(stakers[slug]);
    }, [slug]);

    const stakeMutation = useMutation({
        mutationFn: async ({nftAddress, nftId, statusFilter}: {nftAddress: string, nftId: string, statusFilter: StakingStatusFilters}) => {
            if (!staker || !user.wallet.isConnected) throw 'Undefined staker or provider';

            const tx = await staker.stake(
                {nftAddress, nftId},
                user.provider.getSigner()!
            );
            await tx.wait();
            return { nftAddress, nftId, statusFilter };
        },
        onSuccess: data => {
            queryClient.setQueryData([queryKey, user.address, data.nftAddress.toLowerCase(), data.statusFilter], (old: any) => {
                const index = old.findIndex((nft: any) => nft.nftId === data.nftId);
                old[index].isStaked = true;
                return old;
            })
        }
    });

    const unstakeMutation = useMutation({
        mutationFn: async ({nftAddress, nftId, statusFilter}: {nftAddress: string, nftId: string, statusFilter: StakingStatusFilters}) => {
            if (!staker || !user.wallet.isConnected) throw 'Undefined staker or provider';

            const tx = await staker.unstake(
                {nftAddress, nftId},
                user.provider.getSigner()!
            );
            await tx.wait();
            return { nftAddress, nftId, statusFilter };
        },
        onSuccess: data => {
            queryClient.setQueryData([queryKey, user.address, data.nftAddress.toLowerCase(), data.statusFilter], (old: any) => {
                const index = old.findIndex((nft: any) => nft.nftId === data.nftId);
                old[index].isStaked = false;
                return old;
            })
        }
    });

    const boostMutation = useMutation({
        mutationFn: async ({nftAddress, nftId, slot, statusFilter}: {nftAddress: string, nftId: string, slot: number, statusFilter: StakingStatusFilters}) => {
            if (!staker?.booster || !user.wallet.isConnected) throw 'Undefined booster or provider';

            const tx = await staker.booster.stake(
                {nftAddress, nftId, slot},
                user.provider.getSigner()!
            );
            await tx.wait();
            return { nftAddress, nftId, statusFilter };
        },
        onSuccess: data => {
            queryClient.setQueryData([queryKey, user.address, data.nftAddress.toLowerCase(), data.statusFilter], (old: any) => {
                const index = old.findIndex((nft: any) => nft.nftId === data.nftId);
                old[index].isStaked = true;
                return old;
            })
        }
    });

    const unboostMutation = useMutation({
        mutationFn: async ({nftAddress, nftId, slot, statusFilter}: {nftAddress: string, nftId: string, slot: number, statusFilter: StakingStatusFilters}) => {
            if (!staker?.booster || !user.wallet.isConnected) throw 'Undefined booster or provider';

            const tx = await staker.booster.unstake(
                {nftAddress, nftId, slot},
                user.provider.getSigner()!
            );
            await tx.wait();
            return { nftAddress, nftId, statusFilter };
        },
        onSuccess: data => {
            queryClient.setQueryData([queryKey, user.address, data.nftAddress.toLowerCase(), data.statusFilter], (old: any) => {
                const index = old.findIndex((nft: any) => nft.nftId === data.nftId);
                old[index].isStaked = false;
                return old;
            })
        }
    });

    const isBoosterCollection = (address: string)  => {
        return staker?.booster && ciIncludes(staker.booster.collections, address)
    }

    return { staker, stakeMutation, unstakeMutation, boostMutation, unboostMutation, isBoosterCollection };
}
