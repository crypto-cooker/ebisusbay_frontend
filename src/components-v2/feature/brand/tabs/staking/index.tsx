import {Center, Flex, Grid, GridItem, SimpleGrid, Text, useBreakpointValue, VStack} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {caseInsensitiveCompare} from "@src/utils";
import {motion} from "framer-motion";
import {useQuery} from "@tanstack/react-query";
import {useAppSelector} from "@src/Store/hooks";
import {StakingStatusFilters} from "@src/components-v2/feature/brand/tabs/staking/types";
import StakingNftCard from "@src/components-v2/feature/brand/tabs/staking/staking-nft-card";
import {useStaker} from "@src/components-v2/feature/brand/tabs/staking/useStaker";
import Filters from "@src/components-v2/feature/brand/tabs/staking/filters";
import Button from "@src/Components/components/Button";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import Taskbar from "@src/components-v2/feature/brand/tabs/staking/taskbar";

const MotionGrid = motion(Grid);

const queryKey = 'BrandStakingTabNfts';


type StakingTabProps = {
    brand: any;
    collections: any;
}

const StakingTab = ({ brand, collections }: StakingTabProps) => {
    const dispatch = useDispatch();
    const { staker, stakeMutation, unstakeMutation } = useStaker(brand.slug);
    const user = useAppSelector((state) => state.user);
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
        if (filterType === StakingStatusFilters.STAKED) {
            return staker?.getStaked(user.address!, address);
        } else if (filterType === StakingStatusFilters.UNSTAKED) {
            return staker?.getUnstaked(user.address!, address);
        }
        return staker?.getAll(user.address!, address);
    }

    const { data, error, status } = useQuery(
        [queryKey, user.address, selectedAddress, filterType],
        () => fetcher(selectedAddress!),
        {
            refetchOnWindowFocus: false,
            enabled: !!user.address && !!selectedAddress
        }
    );

    const handleConnect = () => {
        if (!user.address) {
            if (user.needsOnboard) {
                const onboarding = new MetaMaskOnboarding();
                onboarding.startOnboarding();
            } else if (!user.address) {
                dispatch(connectAccount());
            } else if (!user.correctChain) {
                dispatch(chainConnect());
            }
        }
    };

    const handleCollectionFilter = useCallback((address: string) => {
        setSelectedAddress(address);
    }, [selectedAddress]);

    const handleStatusFilter = useCallback((status: StakingStatusFilters) => {
        setFilterType(status);
    }, [filterType]);

    const handleStake = useCallback(async (nftAddress: string, nftId: string) => {
        await stakeMutation.mutateAsync({ nftAddress, nftId, statusFilter: filterType });
    }, [staker, user.provider, filterType]);

    const handleUnstake = useCallback(async (nftAddress: string, nftId: string) => {
        await unstakeMutation.mutateAsync({ nftAddress, nftId, statusFilter: filterType });
    }, [staker, user.provider, filterType]);

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
                                    <div className="row">
                                        <div className="col-lg-12 text-center">
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </div>
                                    </div>
                                }
                            >
                                {status === "loading" ? (
                                    <div className="col-lg-12 text-center">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                ) : status === "error" ? (
                                    <p>Error: {(error as Error).message}</p>
                                ) : (
                                    <>
                                        {data.length > 0 ? (
                                            <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6}} gap={4}>
                                                {data
                                                    .filter((nft: any) => (filterType === StakingStatusFilters.ALL) ||
                                                        (filterType === StakingStatusFilters.STAKED && nft.isStaked) ||
                                                        (filterType === StakingStatusFilters.UNSTAKED && !nft.isStaked))
                                                    .map((nft: any) => (
                                                        <StakingNftCard
                                                            key={`${nft.nftAddress}${nft.nftId}`}
                                                            nft={nft}
                                                            isStaked={nft.isStaked}
                                                            onStake={(nftId) => handleStake(selectedAddress!, nftId)}
                                                            onUnstake={(nftId) => handleUnstake(selectedAddress!, nftId)}
                                                        />
                                                    ))}
                                            </SimpleGrid>
                                        ) : (
                                            <Center>
                                                No items found.
                                            </Center>
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

export default StakingTab;