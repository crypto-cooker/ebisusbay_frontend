import {ethers} from "ethers";
import {hostedImage} from "../helpers/image";

export const fallbackImageUrl = () => {
  return hostedImage('/img/nft-placeholder.webp');
}
export const txExtras = {
  gasPrice: ethers.utils.parseUnits('5000', 'gwei')
}
