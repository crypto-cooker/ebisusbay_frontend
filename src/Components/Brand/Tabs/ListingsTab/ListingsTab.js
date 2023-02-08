import React, {useCallback, useEffect, useState} from "react";
import {Center, Flex, Grid, GridItem, useBreakpointValue} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {useSelector} from "react-redux";
import {Form, Spinner} from "react-bootstrap";
import Filters from "@src/Components/Brand/Tabs/ListingsTab/Filters";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getListings} from "@src/core/api/endpoints/listings";
import {ListingsQuery} from "@src/core/api/queries/listings";
import InfiniteScroll from "react-infinite-scroll-component";
import ListingCard from "@src/Components/components/ListingCard";
import {isMetapixelsCollection} from "@src/utils";
import ListingBundleCard from "@src/Components/components/ListingBundleCard";
import {CollectionSortOption} from "@src/Components/Models/collection-sort-option.model";
import {sortOptions} from "@src/Components/components/constants/collection-sort-options";
import {getTheme} from "@src/Theme/theme";
import Select from "react-select";
import TaskBar from "@src/Components/Brand/Tabs/ListingsTab/TaskBar";
import useDebounce from "@src/core/hooks/useDebounce";

const MotionGrid = motion(Grid)

const ListingsTab = ({brand, collections}) => {
  const useMobileViews = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );
  const variants = {
    expand: { gridTemplateColumns: '275px 1fr' },
    collapse: { gridTemplateColumns: '0px 1fr' },
  }
  const [isFilterOpen, setIsFilterOpen] = useState(!useMobileViews);
  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState(null);
  const [search, setSearch] = useState(null);

  const fetcher = async ({ pageParam = 1 }) => {
    const query = new ListingsQuery({
      sortBy: sort?.key ?? undefined,
      direction: sort?.direction ?? undefined,
      collection: filter,
      search: search,
      page: pageParam
    });
    return await getListings(query);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(['BrandListings', brand.slug, filter, sort, search], fetcher, {
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].data.listings.length > 0 ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: Array.isArray(filter) && filter.length > 0
  })

  const loadMore = () => {
    fetchNextPage();
  };

  const handleCollectionFilter = (collectionAddresses) => {
    if (collectionAddresses.length < 1) {
      collectionAddresses = collections.map((c) => c.address);
    }
    setFilter(collectionAddresses);
  }

  const handleSort = (sortOption) => {
    setSort(sortOption);
  }

  const handleSearch = (value) => {
    setSearch(value);
  }

  useEffect(() => {
    setFilter(collections.map((c) => c.address));
  }, []);

  useEffect(() => {
    if (useMobileViews) {
      setIsFilterOpen(false);
    }
  }, [useMobileViews]);

  return (
    <Flex direction='column'>
      <TaskBar
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        onSearch={handleSearch}
        onSort={handleSort}
        collections={collections}
        onFilter={handleCollectionFilter}
      />
      <MotionGrid
        animate={isFilterOpen && !useMobileViews ? 'expand' : 'collapse'}
        variants={variants}
        gridTemplateColumns="0px 1fr"
        mt={2}
        gap={4}
      >
        <GridItem overflow='hidden'>
          <Filters collections={collections} onChange={handleCollectionFilter} />
        </GridItem>
        <GridItem >
          <InfiniteScroll
            dataLength={data?.pages ? data.pages.flat().length : 0}
            next={loadMore}
            hasMore={hasNextPage}
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
              <p>Error: {error.message}</p>
            ) : (
              <>
                {data.pages[0]?.data?.listings?.length > 0 ? (
                  <div className="card-group row g-3">
                    {data.pages.map((items, pageIndex) => (
                      <React.Fragment key={pageIndex}>
                        {items.data.listings.map((listing, index) => {
                          return (
                            <div
                              className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                              key={listing.listingId}
                            >
                              {!listing.nft.nfts ? (
                                <ListingCard
                                  listing={listing}
                                  imgClass="marketplace"
                                  watermark={
                                    isMetapixelsCollection(listing.nftAddress) ? '/img/collections/metapixels/avatar.png' : null
                                  }
                                />
                              ):(
                                <ListingBundleCard
                                  listing={listing}
                                  imgClass="marketplace"
                                  watermark={
                                    isMetapixelsCollection(listing.nftAddress) ? '/img/collections/metapixels/avatar.png' : null
                                  }
                                />
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <Center>
                    No listings found.
                  </Center>
                )}
              </>
            )}
          </InfiniteScroll>
        </GridItem>
      </MotionGrid>
    </Flex>
  )
}

export default ListingsTab;

export const SearchBar = ({onSearch}) => {
  const currentFilter = useSelector((state) => state.collection.query.filter);
  const [value, setValue] = useState('');
  const debouncedSearch = useDebounce(value, 500);

  const handleSearch = useCallback((event) => {
    const newValue = event.target.value;
    setValue(newValue)
  }, [setValue]);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Form.Control
      id="collection-search"
      type="text"
      placeholder="Search by name"
      onChange={handleSearch}
      style={{ marginBottom: 0, marginTop: 0 }}
      defaultValue={currentFilter.search}
    />
  )
}

export const SortDropdown = ({onSort}) => {
  const userTheme = useSelector((state) => state.user.theme);
  const selectDefaultSortValue = CollectionSortOption.default();
  const selectCollectionSortOptions = sortOptions;

  const customStyles = {
    option: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    singleValue: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
  };

  const handleSortChange = useCallback((sortOption) => {
    onSort(sortOption);
  }, []);

  return (
    <div className="items_filter" style={{ marginBottom: 0, marginTop: 0, maxWidth: 200}}>
      <div className="dropdownSelect two w-100 mr-0 mb-0">
        <Select
          styles={customStyles}
          placeholder={'Sort Listings...'}
          options={[CollectionSortOption.default(), ...selectCollectionSortOptions]}
          getOptionLabel={(option) => option.getOptionLabel}
          getOptionValue={(option) => option.getOptionValue}
          defaultValue={selectDefaultSortValue}
          onChange={handleSortChange}
        />
      </div>
    </div>
  )
}