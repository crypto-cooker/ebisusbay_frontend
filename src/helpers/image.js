import {appConfig, isLocalEnv} from "../Config";
import {specialImageTransform} from "../hacks";
import ImageService from "@src/core/services/image";

/**
 * Build a hosted image URL from our CDN
 *
 * @param imgPath
 * @param useThumbnail
 * @returns {string}
 */
export const hostedImage = (imgPath, useThumbnail = false) => {
  if (isLocalEnv()) return imgPath;
  if (!imgPath) return imgPath;

  imgPath = imgPath.replace(/^\/+/g, '');
  const cdn = appConfig('urls.cdn');

  const imageUrl = new URL(imgPath, cdn);

  if (useThumbnail) {
    return ImageService.instance.provider.avatar(imageUrl.toString());
  }
  return ImageService.instance.provider.convert(imageUrl.toString());
}
/**
 * Build a hosted image URL from our CDN that is fit for the NFT cards
 *
 * @param nftAddress
 * @param nftImage
 * @returns {string|*}
 */
export const nftCardUrl = (nftAddress, nftImage) => {
  if (!nftImage || nftImage.startsWith('data')) return nftImage;
  return ImageService.withProvider('bunny').provider.nftCard(specialImageTransform(nftAddress, nftImage));
}

export const convertGateway = (imageUrl) => {
  if (imageUrl.startsWith('ipfs://')) {
    const link = imageUrl.split('://')[1];
    return `https://ipfs.io/ipfs/${link}`;
  }

  if (imageUrl.startsWith('https://gateway.ebisusbay.com')) {
    return imageUrl.replace('gateway.ebisusbay.com', 'ipfs.io');
  }

  return imageUrl;
}