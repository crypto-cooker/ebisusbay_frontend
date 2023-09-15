import {BigNumber, Contract, ethers} from 'ethers';
import * as Sentry from '@sentry/react';

import {ERC1155, ERC721, MetaPixelsAbi} from '../Contracts/Abis';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import {dataURItoBlob} from '../Store/utils';
import {CollectionSortOption} from '../Components/Models/collection-sort-option.model';
import {
  caseInsensitiveCompare,
  convertIpfsResource,
  isAntMintPassCollection,
  isCroniesCollection,
  isCroskullSbtCollection,
  isMetapixelsCollection,
} from '../utils';
import {appConfig} from "../Config";
import {FullCollectionsQuery} from "./api/queries/fullcollections";
import {getCollections} from "@src/core/api/next/collectioninfo";
import {ApiService} from "@src/core/services/api-service";
import NextApiService from "@src/core/services/api-service/next";

const config = appConfig();
let gatewayTools = new IPFSGatewayTools();
const gateway = config.urls.cdn.ipfs;
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const knownContracts = config.collections;

const api = {
  baseUrl: config.urls.api,
  listings: '/listings',
  collections: '/collections',
  marketData: '/marketdata',
  nft: '/nft',
  auctions: '/auctions',
  unfilteredListings: '/unfilteredlistings',
  collectionSummary: '/collection/summary',
  collectionDetails: '/fullcollections',
  wallets: '/wallets',
  leaders: 'getLeaders',
};

export default api;

//  just for sortAndFetchListings function
let abortController = null;

export async function getListing(listingId) {
  try {
    const uri = `${api.baseUrl}${api.listings}?listingId=${listingId}`;
    var rawListing = await (await fetch(uri)).json();

    rawListing = rawListing['listings'][0];

    const isMetaPixels = isMetapixelsCollection(rawListing['nftAddress']);
    if (isMetaPixels) {
      const contract = new Contract(rawListing['nftAddress'], MetaPixelsAbi, readProvider);
      const data = await contract.lands(rawListing['nftId']);
      const plotSize = `${data.xmax - data.xmin + 1}x${data.ymax - data.ymin + 1}`;
      const plotCoords = `(${data.xmin}, ${data.ymin})`;
      rawListing['nft'].description = `Metaverse Pixel plot at ${plotCoords} with a ${plotSize} size`;
    }

    const listing = {
      listingId: rawListing['listingId'],
      nftId: rawListing['nftId'],
      seller: rawListing['seller'],
      nftAddress: rawListing['nftAddress'],
      price: rawListing['price'],
      fee: rawListing['fee'],
      is1155: rawListing['is1155'],
      state: rawListing['state'],
      purchaser: rawListing['purchaser'],
      listingTime: rawListing['listingTime'],
      saleTime: rawListing['saleTime'],
      endingTime: rawListing['endingTime'],
      royalty: rawListing['royalty'],
      nft: rawListing['nft'],
      useIframe: isMetaPixels,
      iframeSource: isMetaPixels ? `https://www.metaversepixels.app/grid?id=${rawListing['nftId']}&zoom=3` : null,
    };
    return listing;
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

export async function getMarketMetadata() {
  const uri = `${api.baseUrl}${api.marketData}`;

  return await (await fetch(uri)).json();
}

export async function getCollectionMetadata(contractAddress, sort, filter) {
  let query = {
    sortBy: 'totalVolume',
    direction: 'desc',
    pageSize: 1000
  };
  if (filter != null) query[filter.type] = filter.value;
  if (sort != null && sort.type != null) {
    const sortProps = {
      sortBy: sort.type,
      direction: sort.direction,
    };
    query = { ...query, ...sortProps };
  }
  if (contractAddress != null) {
    query['address'] = Array.isArray(contractAddress)
      ? contractAddress.map((c) => ethers.utils.getAddress(c.toLowerCase()))
      : ethers.utils.getAddress(contractAddress.toLowerCase());
  }

  const queryString = new URLSearchParams(query);

  const uri = `${api.baseUrl}${api.collections}?${queryString}`;
  const data = await getCollections(query);
  return data.data;
}

/**
 * @deprecated use function in ./fullcollections
 */
export async function sortAndFetchCollectionDetails(
  page,
  sort,
  filter,
  pageSize = 50
) {
  let query = {
    page: page,
    pageSize: pageSize ?? 50,
    sortBy: 'id',
    direction: 'desc',
  };

  if (filter && filter instanceof FullCollectionsQuery) {
    query = { ...query, ...filter.toApi() };
  }

  if (sort && sort instanceof CollectionSortOption) {
    query = { ...query, ...sort.toApi() };
  }

  if (filter.traits && Object.keys(filter.traits).length > 0) {
    query['traits'] = JSON.stringify(filter.traits);
  }

  if (filter.powertraits && Object.keys(filter.powertraits).length > 0) {
    query['powertraits'] = JSON.stringify(filter.powertraits);
  }

  const queryString = new URLSearchParams(query);

  const url = new URL(api.collectionDetails, `${api.baseUrl}`);
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

export async function getCollectionTraits(contractAddress) {
  try {
    const result = await ApiService.withoutKey().getCollectionTraits(contractAddress);
    if (Object.keys(result).length > 0) {
      return result;
    }

    // Below is deprecated, consider removing entirely
    const fallback = new URL(`/files/${contractAddress.toLowerCase()}/rarity.json`, `${config.urls.cdn.files}`);

    return await (await fetch(fallback)).json();
  } catch (error) {
    console.log(error);
  }

  return null;
}

export async function getCollectionPowertraits(contractAddress) {
  try {
    const internalUri = new URL(`/files/${contractAddress.toLowerCase()}/powertraits.json`, `${config.urls.cdn.files}`);

    return await (await fetch(internalUri)).json();
  } catch (error) {
    console.log(error);
  }

  return null;
}

export async function getNftSalesForAddress(walletAddress, page, sort = null) {
  let query = {
    seller: walletAddress,
    state: 1,
    pageSize: 25,
    page: page,
    sortBy: 'saleTime',
    direction: 'desc',
  };
  if (sort) query = {...query, ...sort};

  try {
    const queryString = new URLSearchParams(query);
    const url = new URL(api.unfilteredListings, `${api.baseUrl}`);
    const result = await (await fetch(`${url}?${queryString}`)).json();

    return result.listings ?? [];
  } catch (error) {
    console.log('error fetching sales for: ' + walletAddress);
    console.log(error);
    Sentry.captureException(error);

    return [];
  }
}

export async function getNftFromFile(collectionId, nftId) {
  try {
    const isMetaPixels = isMetapixelsCollection(collectionId);

    let nft;
    try {
      const internalUri = `https://app.ebisusbay.com/files/${collectionId.toLowerCase()}/metadata/${nftId}.json`;

      return await (await fetch(internalUri)).json();
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
    var canTransfer = true;
    var canSell = true;
    if (isCroniesCollection(collectionId)) {
      const contract = new Contract(collectionId, ERC721, readProvider);
      let uri = await contract.tokenURI(nftId);

      const json = Buffer.from(uri.split(',')[1], 'base64');
      const parsed = JSON.parse(json);
      const name = parsed.name;
      const image = dataURItoBlob(parsed.image, 'image/svg+xml');
      const desc = parsed.description;
      const properties = []; //(parsed.properties) ? parsed.properties : parsed.attributes;
      nft = {
        name: name,
        image: URL.createObjectURL(image),
        description: desc,
        properties: properties,
        canTransfer: canTransfer,
        canSell: canSell,
      };
    } else if (isMetaPixels) {
      const contract = new Contract(collectionId, MetaPixelsAbi, readProvider);
      const uri = await contract.lands(nftId);

      const numberId = nftId instanceof BigNumber ? nftId.toNumber() : nftId;
      const image = `${uri.image}`.startsWith('https://')
        ? uri.image
        : `https://ipfs.metaversepixels.app/ipfs/${uri.image}`;
      const description = uri.detail;
      const name = `MetaPixels ${numberId}`;
      const properties = {};
      nft = {
        name,
        image,
        description,
        properties,
        useIframe: true,
        iframeSource: `https://www.metaversepixels.app/grid?id=${numberId}&zoom=3`,
        canTransfer: canTransfer,
        canSell: canSell,
      };
    } else {
      const isMultiToken =
        knownContracts.findIndex((x) => caseInsensitiveCompare(x.address, collectionId) && x.multiToken) > -1;

      let uri;
      var contract;
      if (isMultiToken) {
        contract = new Contract(collectionId, ERC1155, readProvider);
        uri = await contract.uri(nftId);
      } else {
        contract = new Contract(collectionId, ERC721, readProvider);
        uri = await contract.tokenURI(nftId);
      }

      if (isAntMintPassCollection(collectionId)) {
        uri = 'https://gateway.pinata.cloud/ipfs/QmWLqeupPQsb4MTtJFjxEniQ1F67gpQCzuszwhZHFx6rUM';
      }

      if (gatewayTools.containsCID(uri)) {
        try {
          uri = gatewayTools.convertToDesiredGateway(uri, gateway);
        } catch (error) {
          // console.log(error);
        }
      }
      let json;

      if (uri.includes('unrevealed')) {
        return null;
      } else {
        json = await (await fetch(uri)).json();
      }
      let image;
      if (gatewayTools.containsCID(json.image)) {
        try {
          image = gatewayTools.convertToDesiredGateway(json.image, gateway);
        } catch (error) {
          image = json.image;
        }
      } else {
        image = json.image;
      }
      const video = convertIpfsResource(json.animation_url, json.tooltip);

      let isStaked = false;
      if (caseInsensitiveCompare(collectionId, '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44') ||
        caseInsensitiveCompare(collectionId, '0x490A0b87191f678af7926043c59f040D4968033c')) {
        if (await contract.stakedApes(nftId)) {
          canTransfer = false;
          canSell = false;
          isStaked = true;
        }
      }
      if (isCroskullSbtCollection(collectionId)) {
        canTransfer = false;
        canSell = false;
      }
      const properties = json.properties && Array.isArray(json.properties) ? json.properties : json.attributes;
      nft = {
        name: json.name,
        image: image,
        video: video ?? null,
        description: json.description,
        properties: properties ? properties : [],
        canTransfer: canTransfer,
        canSell: canSell,
        isStaked: isStaked,
      };
    }

    return nft;
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

export async function sortAndFetchAuctions(page) {
  const url = new URL(api.auctions, `${api.baseUrl}`);
  return await (await fetch(url)).json();
}

export async function getAuction(hash, index) {
  try {
    let queryString = new URLSearchParams({
      auctionHash: hash,
      auctionIndex: index,
    });

    const url = new URL(api.auctions, `${api.baseUrl}`);
    const uri = `${url}?${queryString}`;
    var rawListing = await (await fetch(uri)).json();

    return rawListing['auctions'][0];
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
}

/**
 * Page loop to get all NFTs for a user
 *
 * @param walletAddress
 * @param query
 * @returns {Promise<[]>}
 */
async function getAllNftsForUser(walletAddress, query) {
  let data = [];
  let chunkParams = { complete: false, pageSize: 100, curPage: 1 };
  while (!chunkParams.complete) {
    const walletNfts = await NextApiService.getWallet(
      walletAddress,
      {
        pageSize: 100,
        ...query
      }
    );

    data = [...data, ...walletNfts.data];
    chunkParams.complete = walletNfts.data.length < chunkParams.pageSize;
    chunkParams.curPage++;
  }

  return data;
}

export async function getLeaders(timeframe) {
  const urls = [
    `${api.baseUrl}${api.leaders}?sortBy=totalVolume&direction=desc${timeframe ? `&timeframe=${timeframe}` : ''}`,
    `${api.baseUrl}${api.leaders}?sortBy=buyVolume&direction=desc${timeframe ? `&timeframe=${timeframe}` : ''}`,
    `${api.baseUrl}${api.leaders}?sortBy=saleVolume&direction=desc${timeframe ? `&timeframe=${timeframe}` : ''}`,
    `${api.baseUrl}${api.leaders}?sortBy=highestSale&direction=desc${timeframe ? `&timeframe=${timeframe}` : ''}`,
  ];
  // map every url to the promise of the fetch
  let requests = urls.map((url) => fetch(url));

  // Promise.all waits until all jobs are resolved
  return Promise.all(requests).then((responses) => Promise.all(responses.map((r) => r.json())));
}
