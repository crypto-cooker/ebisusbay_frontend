import {useEffect, useState} from "react";
import {Staker, StakingStatusFilters} from "@src/components-v2/feature/brand/tabs/staking/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAppSelector} from "@src/Store/hooks";
import {ethers} from "ethers";
import {JsonRpcProvider} from "@ethersproject/providers";
import {stakers} from "@src/components-v2/feature/brand/tabs/staking/config";

const queryKey = 'BrandStakingTabNfts';

export const useStaker = (slug: string) => {
    const [staker, setStaker] = useState<Staker>();
    const queryClient = useQueryClient();
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        setStaker(stakers[slug]);
    }, [slug]);

    const stakeMutation = useMutation({
        mutationFn: async ({nftAddress, nftId, statusFilter}: {nftAddress: string, nftId: string, statusFilter: StakingStatusFilters}) => {
            if (!staker || !user.provider) throw 'Undefined staker or provider';

            const tx = await staker.stake(
                {nftAddress, nftId},
                (user.provider! as JsonRpcProvider).getSigner() as ethers.Signer
            );
            await tx.wait();
            return { nftAddress, nftId, statusFilter };
        },
        onSuccess: data => {
            queryClient.setQueryData([queryKey, user.address, data.nftAddress, data.statusFilter], (old: any) => {
                const index = old.findIndex((nft: any) => nft.nftId === data.nftId);
                old[index].isStaked = true;
                return old;
            })
        }
    });

    const unstakeMutation = useMutation({
        mutationFn: async ({nftAddress, nftId, statusFilter}: {nftAddress: string, nftId: string, statusFilter: StakingStatusFilters}) => {
            if (!staker || !user.provider) throw 'Undefined staker or provider';

            const tx = await staker.unstake(
                {nftAddress, nftId},
                (user.provider! as JsonRpcProvider).getSigner() as ethers.Signer
            );
            await tx.wait();
            return { nftAddress, nftId, statusFilter };
        },
        onSuccess: data => {
            queryClient.setQueryData([queryKey, user.address, data.nftAddress, data.statusFilter], (old: any) => {
                const index = old.findIndex((nft: any) => nft.nftId === data.nftId);
                old[index].isStaked = false;
                return old;
            })
        }
    });

    return { staker, stakeMutation, unstakeMutation, };
}
