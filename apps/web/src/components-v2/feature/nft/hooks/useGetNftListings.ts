import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import NextApiService from "@src/core/services/api-service/next";
import {useState} from "react";
import {ApiService} from "@src/core/services/api-service";

const useGetNftListings = (initialParams: ListingsQueryParams) => {
  const [filters, setFilters] = useState<ListingsQueryParams>({
    pageSize: 25,
    ...initialParams
  });

  const changeFilters = (newFilter: any) => {
    setFilters({...filters, ...newFilter});
  }

  const getNftListings = async (additionalParams: ListingsQueryParams) => {
    let params: ListingsQueryParams = {
      ...filters,
      ...additionalParams
    };

    return ApiService.withoutKey().getListings(params);
  }

  return [filters, getNftListings, changeFilters] as const
}

export default useGetNftListings;