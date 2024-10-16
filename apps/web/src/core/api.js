import {BigNumber, Contract, ethers} from 'ethers';
import * as Sentry from '@sentry/react';

import {ERC1155, ERC721, MetaPixelsAbi} from '../global/contracts/Abis';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import {
  ciEquals,
  convertIpfsResource,
  isAntMintPassCollection,
  isCroniesCollection,
  isCroskullSbtCollection,
  isMetapixelsCollection,
} from '@market/helpers/utils';
import {appConfig} from "../config";
import {getCollections} from "@src/core/api/next/collectioninfo";
import {ApiService} from "@src/core/services/api-service";
import NextApiService from "@src/core/services/api-service/next";

const config = appConfig();
let gatewayTools = new IPFSGatewayTools();
const gateway = config.urls.cdn.ipfs;
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const knownContracts = config.legacyCollections;

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

export async function getCollectionTraits(contractAddress, chainId) {
  try {
    const result = await ApiService.withoutKey().getCollectionTraits(contractAddress, chainId);
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
      const is1155 =
        knownContracts.findIndex((x) => ciEquals(x.address, collectionId) && x.is1155) > -1;

      let uri;
      var contract;
      if (is1155) {
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
      if (ciEquals(collectionId, '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44') ||
        ciEquals(collectionId, '0x490A0b87191f678af7926043c59f040D4968033c')) {
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

export function dataURItoBlob(dataURI, type) {
  // convert base64 to raw binary data held in a string
  let byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  // let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  let bb = new Blob([ab], { type: type });
  return bb;
}
