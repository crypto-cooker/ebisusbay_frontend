import ImageKitProvider from "@src/core/services/image/imagekit";
import BunnyCdnProvider from "@src/core/services/image/bunny";
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import {appConfig} from "@src/config";
import BunnyKitProvider from "@src/core/services/image/bunnykit";
import ImageTranslator from "@src/core/services/image/translator";

const config = appConfig();

export interface CdnProvider {
  blurred(): string;
  thumbnail(): string;
  nftCard(): string;
  avatar(): string;
  banner(): string;
  bannerPreview(): string;
  fixedWidth(width: number, height: number): string;
  gifToMp4(): string;
  convert(): string;
  custom(options: any): string;
}

class ImageService {

  static translate(url: string) {
    const translator = ImageTranslator.from(url);
    return translator.provider;
  }

  static gif(url: string): CdnProvider {
    const translator = ImageTranslator.gif(url);
    return translator.provider;
  }

  static bunnykit(url: string): CdnProvider {
    const translator = ImageTranslator.bunnykit(url);
    return translator.provider;
  }

  static apng(url: string): CdnProvider {
    const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.apng);
    const translator = ImageTranslator.from(remappedUrl);
    return translator.provider;
  }

  /**
   * Known public dir assets
   *
   * @param url
   */
  static staticAsset(url: string): CdnProvider {
    return new BunnyCdnProvider(ImageTranslator.remapUrl(url, config.urls.cdn.app));
  }
}
export default ImageService;