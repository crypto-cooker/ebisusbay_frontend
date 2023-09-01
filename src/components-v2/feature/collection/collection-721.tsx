import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {Box, Button, Center, Flex, Heading, Spinner, Text, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import MintingButton from "@src/Components/Collection/MintingButton";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import SocialsBar from "@src/Components/Collection/SocialsBar";
import {useRouter} from "next/router";
import CollectionInfoBar from "@src/Components/components/CollectionInfoBar";
import {
  caseInsensitiveCompare,
  isBundle,
  isCnsCollection,
  isCronosGorillaBusinessCollection,
  isCronosVerseCollection,
  isCrosmocraftsCollection,
  isLandDeedsCollection
} from "@src/utils";
import useGetStakingPlatform from "@src/hooks/useGetStakingPlatform";
import CollectionListingsGroup from "@src/Components/components/CollectionListingsGroup";
import CollectionBundlesGroup from "@src/Components/components/CollectionBundlesGroup";
import SalesCollection from "@src/Components/components/SalesCollection";
import CollectionCronosverse from "@src/Components/Collection/Custom/Cronosverse";
import DynastiesLands from "@src/components-v2/feature/ryoshi-dynasties/game/areas/lands";
import {CnsRegistration} from "@src/Components/Collection/Custom/CnsRegistration";
import {pushQueryString} from "@src/helpers/query";
import styled from "styled-components";
import CollectionFilterContainer from "@src/components-v2/feature/collection/collection-filter-container";
import InfiniteScroll from "react-infinite-scroll-component";
import {CollectionNftsGroup} from "@src/components-v2/feature/collection/collection-groups";
import {getCollectionMetadata, getCollectionPowertraits, getCollectionTraits} from "@src/core/api";
import {getCollections} from "@src/core/api/next/collectioninfo";
import useDebounce from "@src/core/hooks/useDebounce";
import Taskbar from "@src/components-v2/feature/collection/taskbar";
import MakeCollectionOfferDialog from "@src/components-v2/shared/dialogs/make-collection-offer";
import InstantSellDialog from "@src/Components/Offer/Dialogs/InstantSellDialog";
import SweepFloorDialog from "@src/Components/Collection/CollectionTaskBar/SweepFloorDialog";

const tabs = {
  items: 'items',
  bundles: 'bundles',
  activity: 'activity',
  map: 'map',
  dynastiesMap: 'dynastiesMap',
  cns: 'cns'
};

const defaultQueryParams = {
  sortBy: 'price',
  direction: 'asc'
};

const NegativeMargin = styled.div`
  margin-left: -1.75rem !important;
  margin-right: -1.75rem !important;
`;

const ThemedBackground = styled.div`
  background: ${({ theme }) => theme.colors.bgColor1}
`;

interface Collection721Props {
  collection: any;
  initialQuery: FullCollectionsQueryParams;
  activeDrop?: any;
}

// TODO fix
const hasRank = false;
const isUsingListingsFallback = false;

const Collection721 = ({ collection, initialQuery, activeDrop = null}: Collection721Props) => {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<FullCollectionsQueryParams>(initialQuery ?? defaultQueryParams);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [openMenu, setOpenMenu] = useState(tabs.items);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerms, setSearchTerms] = useState<string>();
  const debouncedSearch = useDebounce(searchTerms, 500);

  const { isOpen: isOpenCollectionOfferDialog, onOpen: onOpenCollectionOfferDialog, onClose: onCloseCollectionOfferDialog } = useDisclosure();
  const { isOpen: isOpenInstantSellDialog, onOpen: onOpenInstantSellDialog, onClose: onCloseInstantSellDialog } = useDisclosure();
  const { isOpen: isOpenSweepDialog, onOpen: onOpenSweepDialog, onClose: onCloseSweepDialog } = useDisclosure();

  const useMobileMenu = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' },
  );
  const { stakingPlatform } = useGetStakingPlatform(collection.address);
  const emptyFunction = () => {};

  const { data: items, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery(
    ['Collection', collection.address, queryParams],
    async ({ pageParam = 1 }) => {
      const params: FullCollectionsQueryParams = {
        page: pageParam,
        ...queryParams
      }
      const data = await nextApiService.getCollectionItems(collection.address, params);
      setTotalCount(data.totalCount!);

      return data;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  );
  const { data: collectionStats } = useQuery({
    queryKey: ['CollectionStats', collection.address],
    queryFn: () => getStats(collection, null, collection.mergedAddresses),
    refetchOnWindowFocus: false
  });

  const handleBtnClick = (key: string) => (e: any) => {
    setOpenMenu(key);

    if (key === tabs.items) {
      resetFilters();
    }

    pushQueryString(router, {
      slug: router.query.slug,
      tab: key
    });
  };

  const handleMintingButtonClick = () => {
    if (activeDrop.redirect) {
      window.open(activeDrop.redirect, '_blank');
    } else {
      router.push(`/drops/${activeDrop.slug}`)
    }
  }

  const resetFilters = (preservedQuery?: any) => {
    setQueryParams({
      ...defaultQueryParams as { sortBy: 'price', direction: 'asc' },
      address: collection.address,
    });
  }

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerms('');
  }, []);

  useEffect(() => {
    setQueryParams({...queryParams, search: debouncedSearch});
  }, [debouncedSearch]);

  const content = useMemo(() => {
    return status === 'loading' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === 'error' ? (
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : items?.pages.map((page) => page.data).flat().length > 0 ? (
      <>
        {isUsingListingsFallback ? (
          <CollectionListingsGroup
            listings={items}
            canLoadMore={hasNextPage ?? false}
            loadMore={fetchNextPage}
            showLoadMore={true}
            address={null}
            collectionMetadata={null}
          />
        ) : (
          <CollectionNftsGroup
            data={items}
            canLoadMore={hasNextPage ?? false}
            loadMore={fetchNextPage}
            fullWidth={false}
            listable={collection.listable}
            is1155={collection.is1155}
          />
        )}
      </>
    ) : (
      <Box textAlign='center' mt={8}>
        <Text>No results found</Text>
      </Box>
    );
  }, [items, error, status, collection, hasNextPage]);

  return (
    <Box>
      <Box as='section'
         id="profile_banner"
         className="jumbotron breadcumb no-bg"
         style={{
           backgroundImage: `url(${!!collection.metadata.banner ? ImageService.translate(collection.metadata.banner).banner() : ''})`,
           backgroundPosition: '50% 50%',
         }}
      >
        <Box className='mainbreadcumb'></Box>
      </Box>

      <Box as='section' className="gl-legacy container d_coll no-top no-bottom">
        <Box className="profile_avatar">
          <Box className="d_profile_img">
            {collection.metadata.avatar ? (
              <img src={ImageService.translate(collection.metadata.avatar).fixedWidth(150, 150)} alt={collection.name} />
            ) : (
              <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
            )}
            {collection.verification.verified && (
              <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
            )}
          </Box>
        </Box>
        <Box className="profile_name">
          <Flex justify="center" align="center" mb={4}>
            <Heading as="h4" size="md" my="auto">
              {collection.name}
            </Heading>
            {activeDrop && (
              <MintingButton onClick={handleMintingButtonClick} />
            )}
          </Flex>
          <CollectionVerificationRow
            doxx={collection.verification?.doxx}
            kyc={collection.verification?.kyc}
            escrow={collection.verification?.escrow}
            creativeCommons={collection.verification?.creativeCommons}
            center={true}
          />
          {collection.metadata.description && (
            <Box>
              <Text noOfLines={showFullDescription ? 0 : 2}>{collection.metadata.description}</Text>
              {collection.metadata.description.length > 255 && (
                <Button variant="link" onClick={() => setShowFullDescription(!showFullDescription)}>
                  See {showFullDescription ? 'less' : 'more'}
                  {showFullDescription ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
              )}
            </Box>
          )}
          <Box className="fs-4 mt-2">
            <SocialsBar address={collection.address} socials={collection.metadata} />
          </Box>
        </Box>
      </Box>

      <Box mt={8}>
        {collectionStats && (
          <div className="row">
            {hasRank && collection.metadata.rarity === 'rarity_sniper' && (
              <div className="row">
                <div className="col-lg-8 col-sm-10 mx-auto text-center mb-3" style={{ fontSize: '0.8em' }}>
                  Rarity scores and ranks provided by{' '}
                  <a href="https://raritysniper.com/" target="_blank" rel="noreferrer">
                    <span className="color">Rarity Sniper</span>
                  </a>
                </div>
              </div>
            )}
            <CollectionInfoBar collectionStats={collectionStats} hideFloor={!collection.listable} />
            {collection.address.toLowerCase() === '0x7D5f8F9560103E1ad958A6Ca43d49F954055340a'.toLowerCase() && (
              <div className="row m-3">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '1.2em' }}>
                  {'  '} Please visit{' '}
                  <a href="/collection/weird-apes-club-v2">
                    <span className="color">here </span>
                  </a>
                  for the newer, migrated contract
                </div>
              </div>
            )}
            {isCrosmocraftsCollection(collection.address) && (
              <div className="row">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  Got Crosmocraft parts?{' '}
                  <a href="/build-ship">
                    <span className="color">build your Crosmocraft!</span>
                  </a>
                </div>
              </div>
            )}
            {!!stakingPlatform && (
              <div className="row">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  NFTs from this collection can be staked at{' '}
                  <a href={stakingPlatform.url} target="_blank" rel="noreferrer">
                    <span className="color">{stakingPlatform.name}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </Box>
      <Box className="de_tab">
        <ul className="de_nav mb-2">
          <li className={`tab ${openMenu === tabs.items ? 'active' : ''} my-1`}>
            <span onClick={handleBtnClick(tabs.items)}>Items</span>
          </li>
          {!isBundle(collection.address) && (
            <li className={`tab ${openMenu === tabs.bundles ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.bundles)}>Bundles</span>
            </li>
          )}
          <li className={`tab ${openMenu === tabs.activity ? 'active' : ''} my-1`}>
            <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
          </li>
          {isCronosVerseCollection(collection.address) && (
            <li className={`tab ${openMenu === tabs.map ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.map)}>Map</span>
            </li>
          )}
          {isCnsCollection(collection.address) && (
            <li className={`tab ${openMenu === tabs.cns ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.cns)}>Register Domain</span>
            </li>
          )}
          {isLandDeedsCollection(collection.address) && (
            <li className={`tab ${openMenu === tabs.dynastiesMap ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.dynastiesMap)}>Map</span>
            </li>
          )}
        </ul>

        <Box className="de_tab_content" px={2}>
          {openMenu === tabs.items && (
            <>
              <ThemedBackground className="row position-sticky pt-2" style={{top: 74, zIndex: 5}}>
                <Taskbar
                  collection={collection}
                  onFilterToggle={() => setFiltersVisible(!filtersVisible)}
                  onSortToggle={() => setMobileSortVisible(!mobileSortVisible)}
                  onSearch={(search: string) => setSearchTerms(search)}
                  onSort={(sort: string, direction: string) => setQueryParams({...queryParams, sortBy: sort as any, direction: direction as any})}
                  filtersVisible={filtersVisible}
                  onChangeViewType={() => {}}
                  viewType={'grid-sm'}
                  onOpenCollectionOfferDialog={onOpenCollectionOfferDialog}
                  onOpenInstantSellDialog={onOpenInstantSellDialog}
                  onOpenSweepDialog={onOpenSweepDialog}
                />
              </ThemedBackground>
              <CollectionFilterContainer
                queryParams={queryParams}
                collection={collection}
                onFilter={(newParams) => setQueryParams(newParams)}
                filtersVisible={filtersVisible}
                useMobileMenu={useMobileMenu ?? false}
                onMobileMenuClose={() => setFiltersVisible(false)}
                totalCount={totalCount}
              >
                <InfiniteScroll
                  dataLength={items?.pages ? items.pages.flat().length : 0}
                  next={fetchNextPage}
                  hasMore={hasNextPage ?? false}
                  style={{ overflow: 'hidden' }}
                  loader={
                    <Center>
                      <Spinner />
                    </Center>
                  }
                >
                  {content}
                </InfiniteScroll>
              </CollectionFilterContainer>
            </>
          )}
          {openMenu === tabs.bundles && (
            <div className="tab-2 onStep fadeIn container">
              <CollectionBundlesGroup
                collection={collection}
              />
            </div>
          )}
          {openMenu === tabs.activity && (
            <div className="tab-2 onStep fadeIn container">
              <SalesCollection cacheName="collection" collectionId={collection.address} />
            </div>
          )}
          {openMenu === tabs.map && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <CollectionCronosverse collection={collection} />
            </NegativeMargin>
          )}
          {openMenu === tabs.dynastiesMap && (
            <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
              <DynastiesLands onBack={emptyFunction} />
            </NegativeMargin>
          )}
          {openMenu === tabs.cns && (
            <CnsRegistration />
          )}
        </Box>
      </Box>

      {isOpenCollectionOfferDialog && (
        <MakeCollectionOfferDialog
          isOpen={isOpenCollectionOfferDialog}
          onClose={onCloseCollectionOfferDialog}
          collection={collection}
        />
      )}

      {isOpenInstantSellDialog && (
        <InstantSellDialog
          isOpen={isOpenInstantSellDialog}
          onClose={onCloseInstantSellDialog}
          collection={collection}
        />
      )}

      {isOpenSweepDialog && (
        <SweepFloorDialog
          isOpen={isOpenSweepDialog}
          onClose={onCloseSweepDialog}
          collection={collection}
          activeFilters={queryParams}
          fullscreen={useMobileMenu}
        />
      )}
    </Box>
  );

}


export default Collection721;

export const getStats = async (collection: any, id = null, extraAddresses = null) => {
  try {
    const mergedAddresses = extraAddresses ? [collection.address, ...extraAddresses] : collection.address;
    var response;
    if (id != null) {
      const newStats = await getCollectionMetadata(mergedAddresses, null, {
        type: 'tokenId',
        value: id,
      });
      response = {
        collections: newStats.data.collections.map((sCollection: any) => (
          {
            collection: collection.address,
            totalSupply: sCollection.totalSupply,
            totalVolume: sCollection.stats.total.volume,
            numberOfSales: sCollection.stats.total.complete,
            averageSalePrice: sCollection.stats.total.avgSalePrice ?? sCollection.stats.total.avg_sale_price,
            numberActive: sCollection.stats.total.active,
            floorPrice: sCollection.stats.total.floorPrice ?? sCollection.stats.total.floor_price,
            owners: sCollection.holders
          }
        ))
      };
    } else if (Array.isArray(mergedAddresses)) {
      const newStats = await getCollections({address: mergedAddresses.join(',')});
      response = {
        collections: newStats.data.collections.map((sCollection: any) => (
          {
            collection: collection.address,
            totalSupply: sCollection.totalSupply,
            totalVolume: sCollection.stats.total.volume,
            numberOfSales: sCollection.stats.total.complete,
            averageSalePrice: sCollection.stats.total.avgSalePrice ?? sCollection.stats.total.avg_sale_price,
            numberActive: sCollection.stats.total.active,
            floorPrice: sCollection.stats.total.floorPrice ?? sCollection.stats.total.floor_price,
            owners: sCollection.holders
          }
        ))
      }
    } else {
      const newStats = await getCollections({address: mergedAddresses});
      const sCollection = newStats.data.collections[0];
      response = {
        collections: [
          {
            collection: mergedAddresses,
            totalSupply: sCollection.totalSupply,
            totalVolume: sCollection.stats.total.volume,
            numberOfSales: sCollection.stats.total.complete,
            averageSalePrice: sCollection.stats.total.avgSalePrice ?? sCollection.stats.total.avg_sale_price,
            numberActive: sCollection.stats.total.active,
            floorPrice: sCollection.stats.total.floorPrice ?? sCollection.stats.total.floor_price,
            owners: sCollection.holders
          }
        ]
      };
    }
    const traits = await getCollectionTraits(collection.address);
    const powertraits = collection.powertraits ? await getCollectionPowertraits(collection.address) : null;

    let remainingStats: {traits: any, powertraits: any, totalSupply?: number} = {
      traits: traits,
      powertraits: powertraits,
    };
    if (isCronosGorillaBusinessCollection(collection.address)) {
      remainingStats.totalSupply = 4000;
    }

    return {
      ...combineStats(response.collections, collection.address),
      ...remainingStats,
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Combine stats if a collection tracks multiple contracts
 *
 * @param collectionStats stats returned from the API
 * @param anchor primary collection address in which to merge the stats
 * @returns {*}
 */
const combineStats = (collectionStats: any, anchor: string) => {
  const anchoredStats = collectionStats.find((c: any) => caseInsensitiveCompare(c.collection, anchor));
  if (collectionStats.length === 0) return anchoredStats;

  const combined = collectionStats.reduce((a: any, b: any) => {
    return {
      numberActive: parseInt(a.numberActive) + parseInt(b.numberActive),
      volume1d: parseInt(a.volume1d) + parseInt(b.volume1d),
      volume7d: parseInt(a.volume7d) + parseInt(b.volume7d),
      volume30d: parseInt(a.volume30d) + parseInt(b.volume30d),
      totalVolume: parseInt(a.totalVolume) + parseInt(b.totalVolume),
      numberOfSales: parseInt(a.numberOfSales) + parseInt(b.numberOfSales),
      sales1d: parseInt(a.sales1d) + parseInt(b.sales1d),
      sales7d: parseInt(a.sales7d) + parseInt(b.sales7d),
      sales30d: parseInt(a.sales30d) + parseInt(b.sales30d),
      totalRoyalties: parseInt(a.totalRoyalties) + parseInt(b.totalRoyalties),
      floorPrice: parseInt(a.floorPrice) < parseInt(b.floorPrice) ? parseInt(a.floorPrice) : parseInt(b.floorPrice),
      averageSalePrice: (parseInt(a.averageSalePrice) + parseInt(b.averageSalePrice)) / 2,
    };
  });

  return { ...anchoredStats, ...combined };
};