import {appConfig} from "@src/Config";
import {
  isMetapixelsCollection
} from "@src/utils";
import {Contract} from "ethers";
import {MetaPixelsAbi} from "@src/Contracts/Abis";
import * as Sentry from "@sentry/react";
import {getNftFromFile} from "@src/core/api";
import {Axios} from "@src/core/http/axios";

const config = appConfig();
const api = Axios.create(config.urls.api);
const endpoint = 'nft';

export async function getNft(collectionId, nftId) {
  try {
    const queryString = new URLSearchParams({
      collection: collectionId.toLowerCase(),
      tokenId: nftId,
    });

    const result = (await api.get(endpoint, {params: queryString}))?.data;

    if (!result?.nft) {
      result.nft = await getNftFromFile(collectionId, nftId);
    }

    const isMetaPixels = isMetapixelsCollection(collectionId);
    if (isMetaPixels) {
      const contract = new Contract(collectionId, MetaPixelsAbi, readProvider);
      const data = await contract.lands(nftId);
      const plotSize = `${data.xmax - data.xmin + 1}x${data.ymax - data.ymin + 1}`;
      const plotCoords = `(${data.xmin}, ${data.ymin})`;
      result.nft.description = `Metaverse Pixel plot at ${plotCoords} with a ${plotSize} size`;
    }
    return result;
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return await getNftFromFile(collectionId, nftId) ?? {status: 404};
  }
}