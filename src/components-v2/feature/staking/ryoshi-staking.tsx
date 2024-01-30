import React, {memo, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Box, Center, Heading, Spinner, Text, VStack} from "@chakra-ui/react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {appConfig} from "@src/Config";
import InfiniteScroll from "react-infinite-scroll-component";
import RyoshiStakingNftCard from "@src/components-v2/feature/staking/ryoshi-staking-nft-card";
import {addToCart, clearCart, removeFromCart, setCartContext} from "@src/GlobalState/ryoshi-staking-cart-slice";
import {sortAndFetchCollectionDetails} from "@src/core/api/endpoints/fullcollections";
import {FullCollectionsQuery} from "@src/core/api/queries/fullcollections";
import {CollectionSortOption} from "@src/Components/Models/collection-sort-option.model";
import Link from "next/link";
import nextApiService from "@src/core/services/api-service/next";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {ApiService} from "@src/core/services/api-service";
import {useUser} from "@src/components-v2/useUser";

const ryoshiCollectionAddress = appConfig('collections').find((c: any) => c.slug === 'ryoshi-tales-vip').address;
const displayTypes = {
  staked: 'staked',
  unstaked: 'unstaked'
};

const RyoshiStaking = () => {
  const dispatch = useDispatch();
  const user = useUser();
  const [displayType, setDisplayType] = useState(displayTypes.staked)

  const handleDisplayTypeClick = (value: string) => {
    setDisplayType(value);
  }

  const connectWalletPressed = () => {
    user.connect();
  };

  useEffect(() => {
    dispatch(clearCart());
    const context = displayType === displayTypes.staked ? 'unstake' : 'stake';
    dispatch(setCartContext(context))
  }, [displayType])

  return (
    <Box>
      <Heading>Ryoshi Tales VIP Staking</Heading>
      <Text>Stake any of your Ryoshi Tales VIP NFTs below and enjoy rewards generated through platform sales. </Text>

      {user.address ? (
        <>
          <Box mt={4}>
            <ul className="activity-filter">
              <li id="sale" className={displayType === displayTypes.staked ? 'active' : ''} onClick={() => handleDisplayTypeClick(displayTypes.staked)}>
                Staked
              </li>
              <li id="sale" className={displayType === displayTypes.unstaked ? 'active' : ''} onClick={() => handleDisplayTypeClick(displayTypes.unstaked)}>
                Unstaked
              </li>
            </ul>
          </Box>
          {displayType === displayTypes.unstaked && (
            <UnstakedRyoshiNftList />
          )}
          {displayType === displayTypes.staked && (
            <StakedRyoshiList />
          )}
          <Box mt={4} textAlign="center">
            Looking for more Ryoshi VIPs to stake? Swap a Legacy VIP on the&nbsp;
            <Link href="/drops/ryoshi-tales-vip">
              <span className="color cursor-pointer fw-bold">drop page</span>
            </Link>, or pick some up on the&nbsp;
            <Link href="/collection/ryoshi-tales-vip">
              <span className="color cursor-pointer fw-bold">secondary market</span>
            </Link>
          </Box>
        </>
      ) : (
        <VStack mt={4}>
          <Box>Connect wallet below to start staking</Box>
          <PrimaryButton
            onClick={connectWalletPressed}
          >
            Connect
          </PrimaryButton>
        </VStack>
      )}

    </Box>
  );
};

export default memo(RyoshiStaking);

const UnstakedRyoshiNftList = () => {
  const dispatch = useDispatch();
  const user = useUser();

  const fetcher = async ({ pageParam = 1 }) => {
    return await nextApiService.getWallet(user.address!, {
      page: pageParam,
      collection: [ryoshiCollectionAddress],
    });
  };

  const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['UserUnstakedRyoshiNfts', user.address],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });


  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <div className="d-flex">
      <div className="flex-fill">
        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={loadMore}
          hasMore={hasNextPage ?? false}
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
            <p>Error: {(error as any).message}</p>
          ) : (
            <>
              <div className="card-group row g-3">
                {data.pages[0]?.data?.length > 0 ? (
                  <>
                    {data.pages.map((items, index) => (
                      <React.Fragment key={index}>
                        {items.data.map((nft, index) => {
                          return (
                            <div
                              className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                              key={`${nft.nftAddress}-${nft.nftId}-${index}`}
                            >
                              <RyoshiStakingNftCard
                                nft={nft}
                                canStake={true}
                                isStaked={false}
                                onAddToCartButtonPressed={() => dispatch(addToCart(nft))}
                                onRemoveFromCartButtonPressed={() => dispatch(removeFromCart(nft))}
                              />
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <Center>
                    No unstaked Ryoshi VIPs found.
                  </Center>
                )}
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}

const StakedRyoshiList = () => {
  const dispatch = useDispatch();
  const user = useUser();

  const fetcher = async ({ pageParam = 1 }) => {
    const stakedRyoshis = await ApiService.withoutKey().getStakedRyoshi(user.address!);
    const ids = stakedRyoshis?.ryoshiStaked ?? [];
    if (ids.length === 0) return [];

    const query = FullCollectionsQuery.createApiQuery({address: ryoshiCollectionAddress, token: ids});
    const sort = CollectionSortOption.fromJson({
      id: 'rank-asc',
      key: 'rank',
      direction: 'asc',
      label: 'Rare to Common',
    });
    const data = await sortAndFetchCollectionDetails(pageParam, sort, query);

    // TODO: temporary shim. remove this when there is proper object mapping for Full Collections tokens
    data.response.nfts = data.response.nfts?.map((nft: any) => {
      return {
        ...nft,
        nftAddress: nft.address,
        nftId: nft.id,
      }
    });

    return data.response;
  };

  const {data, error, fetchNextPage, hasNextPage, status} = useInfiniteQuery({
    queryKey: ['UserStakedRyoshiNfts', user.address],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].nfts?.length > 0 ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: !!user.address
  });

  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <div className="d-flex">
      <div className="flex-fill">
        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={loadMore}
          hasMore={hasNextPage ?? false}
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
            <p>Error: {(error as any).message}</p>
          ) : (
            <>
              <div className="card-group row g-3">
                {data.pages[0]?.nfts?.length > 0 ? (
                  <>
                    {data.pages.map((items, index) => (
                      <React.Fragment key={index}>
                        {items.nfts?.map((nft: any, index: number) => {
                          return (
                            <div
                              className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                              key={`${nft.address}-${nft.id}-${index}`}
                            >
                              <RyoshiStakingNftCard
                                nft={nft}
                                canStake={true}
                                isStaked={true}
                                onAddToCartButtonPressed={() => dispatch(addToCart(nft))}
                                onRemoveFromCartButtonPressed={() => dispatch(removeFromCart(nft))}
                              />
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <Center>
                    No staked Ryoshi VIPs found.
                  </Center>
                )}
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
