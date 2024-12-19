import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ApiService } from '@src/core/services/api-service';
import { MapiCollectionBlacklist } from '@src/core/services/api-service/mapi/types';


export const useCollections = (search: string = '') => {
  const fetcher = useCallback( async ({pageParam = 1}:any) => {
    const pageSize = 250;
    return await ApiService.withoutKey().getCollections({
      page: pageParam,
      pageSize,
      sortBy: 'name',
      direction: 'asc',
      search,
      blacklist: [MapiCollectionBlacklist.LISTABLE, MapiCollectionBlacklist.UNLISTABLE]
    });
  },[search])

  const { data, error, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ['Collections', search],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  })
  return { data, error, fetchNextPage, hasNextPage, status }

}