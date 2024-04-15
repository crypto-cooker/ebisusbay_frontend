import {appConfig, isLocalEnv} from "../Config";
import {croSkullRedPotionImage, isCroSkullRedPotion, specialImageTransform} from "@market/helpers/hacks";
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

  if (useThumbnail) {
    return ImageService.translate(imgPath.toString()).avatar();
  }
  return ImageService.translate(imgPath.toString()).convert();
}
/**
 * Build a hosted image URL from our CDN that is fit for the NFT cards
 *
 * @param nftAddress
 * @param nftImage
 * @returns {string|*}
 */
export const nftCardUrl = (nftAddress, nftImage) => {
  if (isCroSkullRedPotion(nftAddress)) {
    return croSkullRedPotionImage();
  }
  if (!nftImage || nftImage.startsWith('data')) return nftImage;
  return ImageService.translate(specialImageTransform(nftAddress, nftImage)).nftCard();
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