import ImageKitProvider from "@src/core/services/image/imagekit";
import BunnyCdnProvider from "@src/core/services/image/bunny";
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import {appConfig} from "@src/Config";

export interface CdnProvider {
  blurred(url: string): string;
  thumbnail(url: string): string;
  nftCard(url: string): string;
  avatar(url: string): string;
  banner(url: string): string;
  bannerPreview(url: string): string;
  fixedWidth(url: string, width: number, height: number): string;
  gifToMp4(url: string): string;
  convert(url: string): string;
  custom(url: string, options: any): string;
}

class ImageService {
  public provider: CdnProvider;

  constructor() {
    this.provider = new ImageKitProvider(appConfig('urls.cdn.bunnykit'));
  }

  static get instance() {
    return instance;
  }

  static withProvider(provider: 'imagekit' | 'bunny') {
    const service = new ImageService();
    if (provider === 'imagekit') {
      service.provider = new ImageKitProvider(appConfig('urls.cdn.bunnykit'));
    } else if (provider === 'bunny') {
      service.provider = new BunnyCdnProvider(appConfig('urls.cdn.primary'));
    }
    return service;
  }

  static get proxy(): CdnProvider {
    return new CdnProxy();
  }

  static get staticAsset(): CdnProvider {
    return new BunnyCdnProvider(appConfig('urls.cdn.assets'));
  }
}

const instance = new ImageService();
export default ImageService;

class CdnProxy implements CdnProvider {
  private readonly bunny: BunnyCdnProvider;
  private readonly imagekit: ImageKitProvider;

  constructor() {
    this.bunny = new BunnyCdnProvider(appConfig('urls.cdn.primary'));
    this.imagekit = new ImageKitProvider(appConfig('urls.cdn.bunnykit'));
  }

  avatar(url: string): string {
    return this.imagekit.avatar(url);
  }

  banner(url: string): string {
    return this.imagekit.banner(url)
  }

  bannerPreview(url: string): string {
    return this.imagekit.bannerPreview(url);
  }

  blurred(url: string): string {
    return this.restrictedCdn(url).blurred(url);
  }

  convert(url: string): string {
    return this.restrictedCdn(url).convert(url);
  }

  custom(url: string, options: any): string {
    return this.imagekit.custom(url, options);
  }

  fixedWidth(url: string, width: number, height: number): string {
    return this.restrictedCdn(url).fixedWidth(url, width, height);
  }

  gifToMp4(url: string): string {
    return this.imagekit.gifToMp4(url);
  }

  nftCard(url: string): string {
    return this.restrictedCdn(url).nftCard(url);
  }

  thumbnail(url: string): string {
    return this.imagekit.thumbnail(url);
  }

  /**
   * Currently only supporting Bunny for IPFS
   *
   * @param url
   */
  restrictedCdn(url: string): CdnProvider {
    if (!url) return this.bunny;

    let gatewayTools = new IPFSGatewayTools();
    const isIpfs = gatewayTools.containsCID(url).containsCid;

    const containsProxy = url.includes('/proxy/');

    let isGif = false;
    try {
      isGif = new URL(url).pathname.endsWith('.gif');
    } catch (e) {
      // ignore
    }

    return isIpfs && !containsProxy && !isGif ? this.bunny : this.imagekit;
  }
}