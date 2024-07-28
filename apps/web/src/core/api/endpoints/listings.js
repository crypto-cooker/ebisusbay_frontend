import {limitSizeOptions} from "../../../Components/components/constants/filter-options";
import {ListingsQuery} from "../queries/listings";
import {SortOption} from "../../../Components/Models/sort-option.model";
import {CollectionSortOption} from "../../../Components/Models/collection-sort-option.model";
import {appConfig} from "../../../config";
import {Axios} from "@src/core/http/axios";
import {listingState} from "@src/core/api/enums";

const config = appConfig();
const apiOld = {
  baseUrl: config.urls.api,
  listings: '/listings',
};
const api = Axios.create(config.urls.api);

// @todo refactor into something more generic
let abortController = null;

/**
 * @deprecated Use getListings
 * @param page
 * @param sort
 * @param filter
 * @param state
 * @param pagesize
 * @returns {Promise<{response: any, cancelled: boolean}|{response: *[], cancelled: boolean}>}
 */
export async function sortAndFetchListings(
  page,
  sort,
  filter,
  state,
  pagesize = limitSizeOptions.lg
) {
  let query = {
    state: state ?? 0,
    page: page,
    pageSize: pagesize,
    sortBy: 'listingTime',
    direction: 'desc'
  };
  if (filter && (filter instanceof ListingsQuery)) {
    query = { ...query, ...filter.toApi() };
  }

  if (sort && (sort instanceof SortOption || sort instanceof CollectionSortOption)) {
    query = { ...query, ...sort.toApi() };
  }

  if (filter.traits && Object.keys(filter.traits).length > 0) {
    query['traits'] = JSON.stringify(filter.traits);
  }

  if (filter.powertraits && Object.keys(filter.powertraits).length > 0) {
    query['powertraits'] = JSON.stringify(filter.powertraits);
  }

  const queryString = new URLSearchParams(query);

  const url = new URL(apiOld.listings, `${apiOld.baseUrl}`);
  const uri = `${url}?${queryString}`;

  //  Debugging
  const date = new Date();
  //  Debugging
  const time = `${date.getSeconds()}-${date.getMilliseconds()}`;
  //  Debugging
  const log = (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${time} ${message}`);
    }
  };

  try {
    log(`Ongoing call: ${!!abortController}`);

    if (abortController) {
      abortController.abort();
      log(`Cancelled previous call.`);
    }

    abortController = new AbortController();
    const { signal } = abortController;

    const response = await fetch(uri, { signal });

    abortController = null;
    log(`Went through.`);

    return { cancelled: false, response: await response.json() };
  } catch (error) {
    if (error && error.name === 'AbortError') {
      log(`Cancelled.`);
      return { cancelled: true, response: [] };
    }
    abortController = null;
    throw new TypeError(error);
  }
}

export const getListings = async (listingsQuery) => {
  let query = {
    state: listingState.ACTIVE,
    page: 1,
    pageSize: limitSizeOptions.lg,
    sortBy: 'listingId',
    direction: 'desc',
    ...listingsQuery.toApi()
  };

  const date = new Date();
  const time = `${date.getSeconds()}-${date.getMilliseconds()}`;
  const log = (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${time} ${message}`);
    }
  };

  try {
    log(`Ongoing call: ${!!abortController}`);

    if (abortController) {
      abortController.abort();
      log(`Cancelled previous call.`);
    }

    abortController = new AbortController();
    const { signal } = abortController;

    const response = await api.get(`listings`, {
      params:query,
      signal
    });

    abortController = null;
    return response;
  } catch (error) {
    if (error && error.name === 'AbortError') {
      log(`Cancelled.`);
      return { cancelled: true, response: [] };
    }
    abortController = null;
    throw error;
  }
}

export const getValidListings = async (listingsQuery) => {
  return api.get('listings/validate', {params: listingsQuery})
}