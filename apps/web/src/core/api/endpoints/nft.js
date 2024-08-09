import {appConfig} from "@src/config";
import {isMetapixelsCollection} from "@market/helpers/utils";
import {Contract, ethers} from "ethers";
import {MetaPixelsAbi} from "@src/global/contracts/Abis";
import * as Sentry from "@sentry/react";
import {getNftFromFile} from "@src/core/api";
import {Axios} from "@src/core/http/axios";

const config = appConfig();
const api = Axios.create(config.urls.api);
const endpoint = 'nft';

export async function getNft(collectionId, nftId, chainId) {
  try {
    const queryString = {
      collection: collectionId.toLowerCase(),
      tokenId: nftId,
      chain: chainId
    };

    const result = (await api.get(endpoint, {params: queryString}))?.data;

    if (!result?.nft) {
      result.nft = await getNftFromFile(collectionId, nftId);
    }

    result.nft = await mapCollectionDetails(collectionId, nftId, result.nft);

    return result;
  } catch (error) {
    Sentry.captureException(error);
    const nft = await getNftFromFile(collectionId, nftId);
    return nft ? {nft} : {status: 404};
  }
}

export async function getNfts(collectionId, nftIds) {
  try {
    const queryString = {
      collection: collectionId.toLowerCase(),
      tokenId: nftIds.join(','),
    };

    return (await api.get(endpoint, {params: queryString}))?.data;
  } catch (error) {
    Sentry.captureException(error);
    return {status: 404};
  }
}

/**
 * Iterates through any collections that require special mappings
 *
 * @param collectionId
 * @param nftId
 * @param nft
 * @returns {Promise<*>}
 */
async function mapCollectionDetails(collectionId, nftId, nft) {
  if (isMetapixelsCollection(collectionId)) {
    await mapMetapixelsDetails(collectionId, nftId, nft);
  }

  return nft;
}

/**
 * Adds a custom description for Metapixels plots
 *
 * @param collectionId
 * @param nftId
 * @param nft
 * @returns {Promise<*>}
 */
async function mapMetapixelsDetails(collectionId, nftId, nft) {
  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  const contract = new Contract(collectionId, MetaPixelsAbi, readProvider);
  const data = await contract.lands(nftId);
  const plotSize = `${data.xmax - data.xmin + 1}x${data.ymax - data.ymin + 1}`;
  const plotCoords = `(${data.xmin}, ${data.ymin})`;
  nft.description = `Metaverse Pixel plot at ${plotCoords} with a ${plotSize} size`;

  return nft;
}