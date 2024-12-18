import { useInfiniteQuery } from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import { useCallback, useState } from "react";
import { PagedList } from "@src/core/services/api-service/paginated-list";
import { Collection } from "@src/components-v2/shared/filter-container/filters/collection-filter";



export const useCollections = (search: string = '') => {
  const fetcher = useCallback( async ({pageParam = 1}:any) => {
    const pageSize = 10;
    const res = await nextApiService.getFilteredCollection({
      page: pageParam,
      pageSize,
      search
    })
    return new PagedList<Collection>(res.collections, pageParam, res.collections.length >= pageSize)
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