import {
    Box,
    Center,
    Flex,
    Grid,
    GridItem,
    HStack,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    useBreakpointValue,
    VStack
} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import React, {useCallback, useEffect, useState} from "react";
import {caseInsensitiveCompare, round} from "@market/helpers/utils";
import {motion} from "framer-motion";
import {useQuery} from "@tanstack/react-query";
import {
    BoosterSlot,
    StakerWithRewards,
    StakingStatusFilters
} from "@src/components-v2/feature/brand/tabs/staking/types";
import StakingNftCard from "@src/components-v2/feature/brand/tabs/staking/staking-nft-card";
import {useStaker} from "@src/components-v2/feature/brand/tabs/staking/useStaker";
import Filters from "@src/components-v2/feature/brand/tabs/staking/filters";
import Button from "@src/Components/components/Button";
import Taskbar from "@src/components-v2/feature/brand/tabs/staking/taskbar";
import BoostSlotCard from "@src/components-v2/feature/brand/tabs/staking/boost-slot-card";
import {Contract, ethers} from "ethers";
import {ERC721} from "@src/global/contracts/Abis";
import {JsonRpcProvider} from "@ethersproject/providers";
import {useUser} from "@src/components-v2/useUser";

const MotionGrid = motion(Grid);

const queryKey = 'BrandStakingTabNfts';


type StakingTabProps = {
    brand: any;
    collections: any;
}

const StakingTab = ({ brand, collections }: StakingTabProps) => {
    const { staker, isBoosterCollection } = useStaker(brand.slug);
    const user = useUser();
    const useMobileViews = useBreakpointValue(
        {base: true, lg: false},
        {fallback: 'lg'},
    );
    const variants = {
        expand: { gridTemplateColumns: '275px 1fr' },
        collapse: { gridTemplateColumns: '0px 1fr' },
    }
    const [isFilterOpen, setIsFilterOpen] = useState(!useMobileViews);
    const [selectedAddress, setSelectedAddress] = useState<string>();
    const [filterType, setFilterType] = useState(StakingStatusFilters.ALL);

    const fetcher = async (address: string) => {
        let target = staker;
        if (staker && isBoosterCollection(address)) {
            target = staker.booster;
        }

        if (filterType === StakingStatusFilters.STAKED) {
            return target?.getStaked(user.address!, address);
        } else if (filterType === StakingStatusFilters.UNSTAKED) {
            return target?.getUnstaked(user.address!, address);
        }
        return target?.getAll(user.address!, address);
    }

    const { data, error, status } = useQuery({
        queryKey: [queryKey, user.address, selectedAddress?.toLowerCase(), filterType],
        queryFn: () => fetcher(selectedAddress!),
        refetchOnWindowFocus: false,
        enabled: !!user.address && !!selectedAddress
    });

    const handleConnect = () => {
        user.connect();
    };

    const handleCollectionFilter = useCallback((address: string) => {
        setSelectedAddress(address);
    }, [selectedAddress]);

    const handleStatusFilter = useCallback((status: StakingStatusFilters) => {
        setFilterType(status);
    }, [filterType]);

    function supportsRewards() {
        return staker && 'getRewards' in staker;
    }

    useEffect(() => {
        setIsFilterOpen(!useMobileViews);
    }, [useMobileViews]);

    useEffect(() => {
        if (staker && !selectedAddress) {
            setSelectedAddress(staker.collections[0]);
        }
    }, [staker]);

    if (!staker) return <></>;

    return (
        <>
            {user.address ? (
                <Flex direction='column'>
                    <Taskbar
                        staker={staker}
                        collections={collections}
                        onCollectionFilter={handleCollectionFilter}
                        onStatusFilter={handleStatusFilter}
                    />
                    {supportsRewards() && (
                        <RewardsComponent staker={staker as StakerWithRewards} />
                    )}
                    <MotionGrid
                        animate={isFilterOpen && !useMobileViews ? 'expand' : 'collapse'}
                        variants={variants}
                        gridTemplateColumns="0px 1fr"
                        mt={2}
                        gap={4}
                    >
                        <GridItem overflow='hidden'>
                            <Filters
                                collections={collections.filter((c: any) => staker?.collections.some((sc: string) => caseInsensitiveCompare(sc, c.address)))}
                                boosterCollections={!!staker?.booster ? collections.filter((c: any) => staker.booster!.collections.some((sc: string) => caseInsensitiveCompare(sc, c.address))) : []}
                                initialCollection={staker.collections[0]}
                                initialStatus={StakingStatusFilters.ALL}
                                onChangeCollection={handleCollectionFilter}
                                onChangeStatus={handleStatusFilter}
                            />
                        </GridItem>
                        <GridItem >
                            <InfiniteScroll
                                dataLength={data?.pages ? data.pages.flat().length : 0}
                                next={() => console.log('done')}
                                hasMore={false}
                                style={{ overflow: 'hidden' }}
                                loader={
                                    <Center>
                                        <Spinner />
                                    </Center>
                                }
                            >
                                {status === 'pending' ? (
                                  <Center>
                                      <Spinner />
                                  </Center>
                                ) : status === "error" ? (
                                    <p>Error: {(error as Error).message}</p>
                                ) : (
                                    <>
                                        {isBoosterCollection(selectedAddress!) ? (
                                            <BoostView
                                                slug={brand.slug}
                                                collectionAddress={selectedAddress!}
                                                filterType={filterType}
                                                nfts={data}
                                            />
                                        ) : (
                                            <StakeView
                                                slug={brand.slug}
                                                collectionAddress={selectedAddress!}
                                                filterType={filterType}
                                                nfts={data}
                                            />
                                        )}
                                    </>
                                )}
                            </InfiniteScroll>
                        </GridItem>
                    </MotionGrid>
                </Flex>
            ) : (
                <VStack>
                    <Text>Connect wallet to view staking info</Text>
                    <Button type="legacy"
                            onClick={handleConnect}
                            className="flex-fill"
                    >
                        Connect
                    </Button>
                </VStack>
            )}
        </>
    )
}

type StakeViewProps = {
    slug: string;
    collectionAddress: string;
    filterType: StakingStatusFilters;
    nfts: any;
}
const StakeView = ({slug, collectionAddress, filterType, nfts}: StakeViewProps) => {
    const user = useUser();
    const { staker, stakeMutation, unstakeMutation } = useStaker(slug);

    const handleStake = useCallback(async (nftAddress: string, nftId: string) => {
        const nftContract = new Contract(nftAddress, ERC721, user.provider.getSigner() as ethers.Signer);
        const transferEnabled = await nftContract.isApprovedForAll(user.address, staker?.address);
        if (!transferEnabled) {
            const tx = await nftContract.setApprovalForAll(staker?.address, true);
            await tx.wait();
        }

        await stakeMutation.mutateAsync({ nftAddress, nftId, statusFilter: filterType });
    }, [staker, user.wallet.isConnected, filterType]);

    const handleUnstake = useCallback(async (nftAddress: string, nftId: string) => {
        await unstakeMutation.mutateAsync({ nftAddress, nftId, statusFilter: filterType });
    }, [staker, user.wallet.isConnected, filterType]);

    return (
        <>
            {nfts.length > 0 ? (
                <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6}} gap={4}>
                    {nfts
                        .filter((nft: any) => (filterType === StakingStatusFilters.ALL) ||
                            (filterType === StakingStatusFilters.STAKED && nft.isStaked) ||
                            (filterType === StakingStatusFilters.UNSTAKED && !nft.isStaked))
                        .map((nft: any) => (
                            <StakingNftCard
                                key={`${nft.nftAddress}${nft.nftId}`}
                                nft={nft}
                                isStaked={nft.isStaked}
                                onStake={(nftId) => handleStake(collectionAddress, nftId)}
                                onUnstake={(nftId) => handleUnstake(collectionAddress, nftId)}
                            />
                        ))}
                </SimpleGrid>
            ) : (
                <Center>
                    No items found.
                </Center>
            )}
        </>
    )
}

type BoostViewProps = {
    slug: string;
    collectionAddress: string;
    filterType: StakingStatusFilters;
    nfts: any;
}
const BoostView = ({slug, collectionAddress, filterType, nfts}: BoostViewProps) => {
    const user = useUser();
    const { staker, boostMutation, unboostMutation } = useStaker(slug);
    const [selectedSlot, setSelectedSlot] = useState<BoosterSlot>();
    const [slots, setSlots] = useState<BoosterSlot[]>([]);

    const handleStake = useCallback(async (nftAddress: string, nftId: string, slot?: BoosterSlot) => {
        if (!user.wallet.isConnected) throw 'Not connected';

        let emptySlot = slot;
        if (emptySlot === undefined) {
            emptySlot = slots.find((slot: any) => !slot.nft);
            if (emptySlot) setSelectedSlot(emptySlot);
        }
        if (!emptySlot) throw 'Invalid slot';

        const nftContract = new Contract(nftAddress, ERC721, user.provider.getSigner() as ethers.Signer);
        const transferEnabled = await nftContract.isApprovedForAll(user.address, staker?.booster?.address);
        if (!transferEnabled) {
            const tx = await nftContract.setApprovalForAll(staker?.booster?.address, true);
            await tx.wait();
        }

        await boostMutation.mutateAsync({ nftAddress, nftId, slot: emptySlot.slot, statusFilter: filterType });
        await getSlots();
    }, [staker, user.wallet.isConnected, filterType, slots]);

    const handleUnstake = useCallback(async (nftAddress: string, nftId: string, slot: number) => {
        await unboostMutation.mutateAsync({ nftAddress, nftId, slot, statusFilter: filterType });
        await getSlots();
    }, [staker, user.wallet.isConnected, filterType]);

    const getSlots = async () => {
        if (!staker?.booster || !user.address) return [];

        const data = await staker.booster.getSlots(user.address);
        setSlots(data);
    }

    useEffect(() => {
        async function func() {
            await getSlots();
        }
        func();

    }, [staker?.booster, user.address]);

    return (
        <Box>
            <Box mb={2}>
                <Text fontSize='lg' fontWeight='bold'>Boosters</Text>
                <SimpleGrid columns={{base: 2, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 5}} gap={4}>
                    {slots.map((slot: any) => (
                        <BoostSlotCard
                            key={`${slot.slot}`}
                            slot={slot}
                            onUnstake={(slot) => handleUnstake(slot.nft.nftAddress, slot.nft.nftId, slot.slot)}
                            onSelect={(slot) => setSelectedSlot(slot)}
                            isSelected={selectedSlot?.slot === slot.slot}
                        />
                    ))}
                </SimpleGrid>
            </Box>
            <Text fontSize='lg' fontWeight='bold'>NFTs</Text>
            {nfts.length > 0 ? (
                <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6}} gap={4}>
                    {nfts
                        .filter((nft: any) => (filterType === StakingStatusFilters.ALL) ||
                            (filterType === StakingStatusFilters.STAKED && nft.isStaked) ||
                            (filterType === StakingStatusFilters.UNSTAKED && !nft.isStaked))
                        .map((nft: any) => (
                            <StakingNftCard
                                key={`${nft.nftAddress}${nft.nftId}`}
                                nft={nft}
                                isStaked={nft.isStaked}
                                onStake={(nftId) => handleStake(collectionAddress, nftId, selectedSlot)}
                                onUnstake={(nftId) => handleUnstake(collectionAddress, nftId, selectedSlot?.slot ?? 0)}
                            />
                        ))}
                </SimpleGrid>
            ) : (
                <Center>
                    No items found.
                </Center>
            )}
        </Box>
    )
}

const RewardsComponent = ({staker}: {staker: StakerWithRewards}) => {
    const user = useUser();
    const [executingClaim, setExecutingClaim] = useState(false);

    const fetcher = async () => {
        if (!user.address) return;
        const rewards = await staker.getRewards(user.address);
        return rewards;
    }

    const { data, error, status, refetch } = useQuery({
        queryKey: ['StakingRewards', user.address, staker.address.toLowerCase()],
        queryFn: fetcher,
        refetchOnWindowFocus: false,
        enabled: !!user.address && !!staker
    });

    const handleClaimRewards = useCallback(async () => {
        try {
            setExecutingClaim(true);
            if (!user.address || !user.wallet.isConnected) throw 'Not connected';
            const tx = await staker.claimRewards(user.address,  user.provider.getSigner()!);
            await tx.wait();
            await refetch();
        } finally {
            setExecutingClaim(false)
        }
    }, [setExecutingClaim, user.address, staker]);

    return (
        <Box ps={{base:4, lg:0}} my={2} w='full'>
            <Stack px={4} py={2} align='center' w='full' direction={{base: 'column', sm: 'row'}} className='card eb-nft__card'>
                <Box fontWeight='bold'>Pending Rewards:</Box>
                {status === 'pending' ? (
                  <Center>
                      <Spinner />
                  </Center>
                ) : status === "error" ? (
                    <Box>N/A</Box>
                ) : (
                    <HStack>
                        <Box>{ethers.utils.commify(round(data, 2))} {staker.rewardsSymbol}</Box>
                        {Number(data) > 0 && (
                            <Button
                                type="legacy"
                                onClick={handleClaimRewards}
                                isLoading={executingClaim}
                                disabled={executingClaim}
                            >
                                Claim
                            </Button>
                        )}
                    </HStack>
                )}
            </Stack>
        </Box>
    )
}
export default StakingTab;