import React, {useMemo} from 'react';
import ResponsiveNftListingsTable, {
  SortKeys
} from "@src/components-v2/shared/responsive-table/responsive-nft-listings-table";
import {toast} from "react-toastify";
import {createSuccessfulAddCartContent} from "@src/utils";
import {useInfiniteQuery} from "@tanstack/react-query";
import useGetNftListings from "@src/components-v2/feature/nft/hooks/useGetNftListings";
import {ListingState} from "@src/core/services/api-service/types";
import {Center, Spinner} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import useCart from "@src/hooks/use-cart";

interface ListingsProps {
  nft: any;
}

const ListingsTab = ({ nft }: ListingsProps) => {
  const cart = useCart();
  const [filters, getNftListings, changeFilters] = useGetNftListings({
    collection: [nft.nftAddress],
    tokenId: [nft.nftId],
    state: ListingState.ACTIVE,
    sortBy: 'price',
    direction: 'asc'
  });

  const handleAddToCart = (listing: any) => {
    if (!listing || !listing.listingId) return;

    cart.addItem({
      listingId: listing.listingId,
      name: nft.name,
      image: nft.image,
      price: listing.price,
      address: listing.nftAddress,
      id: listing.nftId,
      rank: nft.rank,
      amount: listing.amount,
      currency: listing.currency
    });
    toast.success(createSuccessfulAddCartContent(() => cart.openCart()));
  };

  const fetcher = ({ pageParam = 1}) => {
    return getNftListings({page: pageParam});
  }

  const {data, error, fetchNextPage, hasNextPage, status,} = useInfiniteQuery({
    queryKey: ['NftListings', filters],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

  const sortCollections = (sortBy: string) => {
    let direction = 'desc';

    if (filters.sortBy?.includes(sortBy) && filters.direction == 'desc') {
      direction = 'asc'
    }
    console.log('SORT', sortBy, direction, filters)
    changeFilters({ sortBy, direction });
  }

  const content = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <ResponsiveNftListingsTable
        data={data}
        onSort={sortCollections}
        primarySort={filters.sortBy as SortKeys}
        onAddToCart={handleAddToCart}
      />
    )
  }, [data, status]);

  return (
    <div className='listing-tab'>
      {status === 'pending' || (data && data.pages[0]?.data.length > 0) ? (
        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          height={400}
          loader={
            <Center>
              <Spinner />
            </Center>
          }
        >
          {content}
        </InfiniteScroll>
      ) : (
        <>
          <span>No listings found for this item</span>
        </>
      )}
    </div>
  );
}

export default ListingsTab;