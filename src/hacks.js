import {hostedImage} from "./helpers/image";
import { caseInsensitiveCompare } from './utils';
import { imageDomains } from './Config';
import ImageService from "@src/core/services/image";

export function isCroSkullRedPotion(address) {
  return caseInsensitiveCompare(address, '0x508378E99F5527Acb6eB4f0fc22f954c5783e5F9');
}

export function croSkullRedPotionImage() {
  return 'https://cdn.ebisusbay.com/files/0x508378e99f5527acb6eb4f0fc22f954c5783e5f9/images/redpotion.gif';
}

export function specialImageTransform(address, defaultImage) {
  if (isCroSkullRedPotion(address)) {
    return croSkullRedPotionImage();
  }

  if (!defaultImage || defaultImage === '/img/nft-placeholder.webp') {
    return hostedImage('/img/nft-placeholder.webp');
  }

  const filteredDomains = imageDomains.filter((domain) => defaultImage.includes(domain));
  if (filteredDomains.length) {
    return defaultImage;
  }

  return defaultImage;
}

