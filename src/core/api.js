import { BigNumber, Contract, ethers } from 'ethers';
import * as Sentry from '@sentry/react';
import moment from 'moment';

import { ERC1155, ERC721, MetaPixelsAbi, SouthSideAntsReadAbi } from '../Contracts/Abis';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import { dataURItoBlob } from '../Store/utils';
import { SortOption } from '../Components/Models/sort-option.model';
import { CollectionSortOption } from '../Components/Models/collection-sort-option.model';
import { limitSizeOptions } from '../Components/components/constants/filter-options';
import {
  caseInsensitiveCompare,
  convertIpfsResource,
  findCollectionByAddress,
  isAntMintPassCollection, isBundle, isCroniesCollection, isCroskullSbtCollection, isGaslessListing,
  isMetapixelsCollection,
  isNftBlacklisted,
  isSouthSideAntsCollection,
  isUserBlacklisted,
  isWeirdApesCollection,
} from '../utils';
import { getAntMintPassMetadata, getWeirdApesStakingStatus } from './api/chain';
import { fallbackImageUrl } from './constants';
import {appConfig} from "../Config";
import {FullCollectionsQuery} from "./api/queries/fullcollections";
import {ListingsQuery} from "./api/queries/listings";
import {getQuickWallet} from "./api/endpoints/wallets";


import Constants from '../constants'
import useFeatureFlag from '../hooks/useFeatureFlag';
import { getCollections } from "@src/core/api/next/collectioninfo";

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


const { Features } = Constants;
const newEndpointEnabled = useFeatureFlag(Features.GET_COLLECTION_NEW_ENDPOINT);

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
  if(newEndpointEnabled){
    const data = await getCollections(query);
    return data.data;
  }
  else{
    return await (await fetch(uri)).json();
  }
}

export async function getCollectionSummary(address) {
  address = Array.isArray(address)
    ? address.map((c) => ethers.utils.getAddress(c.toLowerCase()))
    : ethers.utils.getAddress(address.toLowerCase());

  const query = { address };
  const queryString = new URLSearchParams(query);
  const uri = `${api.baseUrl}${api.collectionSummary}?${queryString}`;
  return await (await fetch(uri)).json();
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
    const internalUri = new URL(`/files/${contractAddress.toLowerCase()}/rarity.json`, `${config.urls.cdn.files}`);

    return await (await fetch(internalUri)).json();
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


export async function getUnfilteredListingsForAddress(walletAddress, walletProvider, page, sort = null) {
  let query = {
    seller: walletAddress,
    state: 0,
    pageSize: 25,
    page: page,
    sortBy: 'listingTime',
    direction: 'asc',
  };
  if (sort) query = {...query, ...sort};

  // const signer = walletProvider.getSigner();

  try {
    const signer = walletProvider.getSigner();

    const queryString = new URLSearchParams(query);
    const url = new URL(api.unfilteredListings, `${api.baseUrl}`);
    const response = await fetch(`${url}?${queryString}`);
    let json = await response.json();
    const listings = json.listings || [];

    //  array of {id, address} wallet nfts
    const quickWallet = await getQuickWallet(walletAddress, {pageSize: 1000});
    const walletNfts = quickWallet.data.map((nft) => {
      return { id: nft.nftId, address: nft.nftAddress };
    });

    const filteredListings = listings
      .map((item) => {
        const { listingId, price, nft, purchaser, valid, state, is1155, nftAddress, invalid } = item;
        const { name, image, rank } = nft || {};

        const listingTime = item.listingTime;
        const id = item.nftId;
        const isInWallet = !!walletNfts.find((walletNft) => caseInsensitiveCompare(walletNft.address, nftAddress) && walletNft.id === id);
        const listed = true;

        const isMetaPixels = isMetapixelsCollection(nftAddress);
        const readContract = (() => {
          if (is1155) {
            return new Contract(nftAddress, ERC1155, signer);
          }
          if (isMetaPixels) {
            return new Contract(nftAddress, MetaPixelsAbi, signer);
          }
          return new Contract(nftAddress, ERC721, signer);
        })();

        const writeContract = (() => {
          if (is1155) {
            return new Contract(nftAddress, ERC1155, signer);
          }
          if (isMetaPixels) {
            return new Contract(nftAddress, MetaPixelsAbi, signer);
          }
          return new Contract(nftAddress, ERC721, signer);
        })();

        readContract.connect(readProvider);
        writeContract.connect(signer);

        return {
          contract: writeContract,
          address: nftAddress,
          id,
          image,
          name,
          state,
          listingTime,
          listed,
          isInWallet,
          listingId,
          price,
          purchaser,
          rank,
          valid: valid && isInWallet,
          invalid: invalid || !isInWallet,
          useIframe: isMetaPixels,
          nft,
          iframeSource: isMetaPixels ? `https://www.metaversepixels.app/grid?id=${id}&zoom=3` : null,
        };
      })
      .sort((x) => (x.valid ? 1 : -1));

    json.listings = filteredListings;

    return filteredListings;
  } catch (error) {
    console.log('error fetching sales for: ' + walletAddress);
    console.log(error);

    return [];
  }
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

export async function getNftRankings(contractAddress, nftIds) {
  const commaIds = [].concat(nftIds).join(',');

  let query = {
    collection: contractAddress,
    tokenId: commaIds,
  };

  const queryString = new URLSearchParams(query);
  const url = new URL(api.nft, `${api.baseUrl}`);
  const response = await fetch(`${url}?${queryString}`);
  let json = await response.json();

  if (json.data) {
    return json.data.map((o) => {
      return {
        id: o.nft?.nftId ?? 0,
        rank: o.nft?.rank ?? 0,
      };
    });
  } else if (json.nft) {
    return [
      {
        id: json.nft.nftId,
        rank: json.nft.rank,
      },
    ];
  } else {
    return [];
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

async function getAllListingsForUser(walletAddress) {
  let listings = [];
  let chunkParams = { complete: false, pageSize: 100, curPage: 1 };
  while (!chunkParams.complete) {
    const queryString = new URLSearchParams({
      state: 0,
      page: chunkParams.curPage,
      pageSize: chunkParams.pageSize,
      seller: walletAddress,
    });
    const url = new URL(api.listings, `${api.baseUrl}`);
    const listingsReponse = await (await fetch(`${url}?${queryString}`)).json();

    // Workaround in testnet in case testnet doesn't return the correct response
    const responseListings = listingsReponse.listings ?? [];

    listings = [...listings, ...responseListings];
    chunkParams.complete = responseListings.length < chunkParams.pageSize;
    chunkParams.curPage++;
  }

  return listings;
}

/**
 * @deprecated - use nextApiService instead
 */
export async function getNftsForAddress2(walletAddress, walletProvider, page, collectionAddresses) {
  let query = { page };
  if (collectionAddresses && collectionAddresses.length > 0) {
    query.collection = collectionAddresses.join(',');
  }

  const quickWallet = await getQuickWallet(walletAddress, query);
  if (!quickWallet.data) return [];

  const results = quickWallet.data;

  // Determine before filters if there is a next page to avoid page cutoffs
  const hasNextPage = results.length > 0;

  let zeroMatched = false;
  for (const nft of results) {
    const matchedContract = findCollectionByAddress(nft.nftAddress, nft.nftId);
    if (matchedContract) zeroMatched = true;
  }

  if (!zeroMatched && results.length > 0) {
    return {
      hasNextPage,
      nfts: []
    };
  }

  const signer = walletProvider?.getSigner();
  const walletBlacklisted = isUserBlacklisted(walletAddress);

  let listings = await getAllListingsForUser(walletAddress);

  //  Helper function
  const getListing = (address, id) => {
    return listings.find((listing) => {
      const sameId = parseInt(listing.nftId) === parseInt(id);
      const sameAddress = caseInsensitiveCompare(listing.nftAddress, address);
      return sameId && sameAddress;
    });
  };
  const writeContracts = [];
  const mappedResults = await Promise.all(
    results
      .filter((nft) => {
        if(isBundle(nft.nftAddress) && nft.metadata?.nfts) return true
        const matchedContract = findCollectionByAddress(nft.nftAddress, nft.nftId);
        if (!matchedContract) return false;

        const hasBalance = !matchedContract.multiToken || parseInt(nft.balance) > 0;

        return matchedContract && hasBalance;
      })
      .map(async (nft) => {
        if(isBundle(nft.nftAddress)) {

          const listed = !!getListing(nft.nftAddress, nft.nftId);
          const listingId = listed ? getListing(nft.nftAddress, nft.nftId).listingId : null;
          const price = listed ? getListing(nft.nftAddress, nft.nftId).price : null;

          return {
            address: nft.nftAddress,
            description: nft.metadata?.description,
            id: nft.nftId,
            name: nft.name,
            nfts: nft.nfts,
            slug: nft.slug,
            listed,
            listingId,
            price,
            canSell: true,
            listable: true,
          }
        } else {
          const knownContract = findCollectionByAddress(nft.nftAddress, nft.nftId);

        let key = knownContract.address;
        if (knownContract.multiToken) {
          key = `${key}${knownContract.id}`;
        }
        const writeContract = signer ?
          (writeContracts[key] ??
          new Contract(knownContract.address, knownContract.multiToken ? ERC1155 : ERC721, signer)) : null;
        writeContracts[key] = writeContract;

        const listing = getListing(knownContract.address, nft.nftId);
        const listingId = !!listing ? listing.listingId : null;
        const price = !!listing ? listing.price : null;
        const isGasless = !!listing && isGaslessListing(listing.listingId);
        const expirationDate = !!listing ? listing.expirationDate : null;

        if (isAntMintPassCollection(nft.nftAddress)) {
          const metadata = await getAntMintPassMetadata(nft.nftAddress, nft.nftId);
          if (metadata) nft = { ...nft, ...metadata };
        }

          let image;
          let name = nft.name;
          try {
            if (nft.image_aws || nft.image) {
              image = nft.image_aws ?? nft.image;
            } else if (nft.token_uri) {
              if (typeof nft.token_uri === 'string') {
                const json = await (await fetch(nft.token_uri)).json();
                image = convertIpfsResource(json.image);
                if (json.name) name = json.name;
              } else if (typeof nft.token_uri === 'object') {
                image = nft.token_uri.image;
              }
            } else {
              image = fallbackImageUrl();
            }
          } catch (e) {
            image = fallbackImageUrl();
            console.log(e);
          }
          if (!image) image = fallbackImageUrl();

          const video = nft.animation_url ?? (image.split('.').pop() === 'mp4' ? image : null);

          let isStaked = false;
          let canTransfer = true;
          let canSell = true;
          if (isWeirdApesCollection(nft.nftAddress)) {
            const staked = await getWeirdApesStakingStatus(nft.nftAddress, nft.nftId);
            if (staked) {
              canTransfer = false;
              canSell = false;
              isStaked = true;
            }
          }

          if (walletBlacklisted || isNftBlacklisted(nft.nftAddress, nft.nftId)) {
            canTransfer = false;
            canSell = false;
          }

        return {
          id: nft.nftId,
          name: name,
          description: nft.description,
          properties: nft.properties && nft.properties.length > 0 ? nft.properties : nft.attributes,
          image: image,
          video: video,
          count: nft.balance,
          address: knownContract.address,
          contract: writeContract,
          multiToken: knownContract.multiToken,
          rank: nft.rank,
          listable: knownContract.listable,
          listed: !!listing,
          listingId,
          price,
          expirationDate,
          canSell: canSell,
          canTransfer: canTransfer,
          isStaked: isStaked,
          isGaslessListing: isGasless
        };
      }})
  );

  return {
    hasNextPage,
    nfts: mappedResults
  }
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
