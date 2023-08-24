import React, {useMemo, useState} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {
  Box,
  Center,
  Spinner,
  Text
} from "@chakra-ui/react";

const tabs = {
  items: 'items',
  bundles: 'bundles',
  activity: 'activity',
  map: 'map',
  dynastiesMap: 'dynastiesMap',
  cns: 'cns'
};

interface Collection721Props {
  collection: any;
  initialQuery: FullCollectionsQueryParams;
  activeDrop?: any;
}

const Collection721 = ({ collection, initialQuery, activeDrop = null}: Collection721Props) => {
  const [queryParams, setQueryParams] = useState<FullCollectionsQueryParams>(initialQuery ?? {
    sortBy: 'price',
    direction: 'asc'
  });

  const fetcher = async ({ pageParam = 1 }) => {
    const params: FullCollectionsQueryParams = {
      page: pageParam,
      ...queryParams
    }
    return nextApiService.getCollectionItems(collection.address, params);
  };

  const {data, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery(
    ['Collection', collection.address, initialQuery],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  )

  const content = useMemo(() => {
    return status === 'loading' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === 'error' ? (
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : (
      <>
        Content!
      </>
    )
  }, []);

  return (
    <Box>
      <Text>Here is yo content</Text>
      {content}
    </Box>
  );

}


export default Collection721;