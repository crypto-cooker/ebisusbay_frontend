import ImageKitProvider from "@src/core/services/image/imagekit";
import BunnyCdnProvider from "@src/core/services/image/bunny";
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';

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
    this.provider = new ImageKitProvider();
  }

  static get instance() {
    return instance;
  }

  static withProvider(provider: 'imagekit' | 'bunny') {
    const service = new ImageService();
    if (provider === 'imagekit') {
      service.provider = new ImageKitProvider();
    } else if (provider === 'bunny') {
      service.provider = new BunnyCdnProvider();
    }
    return service;
  }

  static get proxy(): CdnProvider {
    return new CdnProxy();
  }
}

const instance = new ImageService();
export default ImageService;

class CdnProxy implements CdnProvider {
  private readonly bunny: BunnyCdnProvider;
  private readonly imagekit: ImageKitProvider;

  constructor() {
    this.bunny = new BunnyCdnProvider();
    this.imagekit = new ImageKitProvider();
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
    url = this.cdnUrl(url);
    return this.restrictedCdn(url).blurred(url);
  }

  convert(url: string): string {
    url = this.cdnUrl(url);
    return this.restrictedCdn(url).convert(url);
  }

  custom(url: string, options: any): string {
    return this.imagekit.custom(url, options);
  }

  fixedWidth(url: string, width: number, height: number): string {
    url = this.cdnUrl(url);
    return this.restrictedCdn(url).fixedWidth(url, width, height);
  }

  gifToMp4(url: string): string {
    return this.imagekit.gifToMp4(url);
  }

  nftCard(url: string): string {
    url = this.cdnUrl(url);
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
    let gatewayTools = new IPFSGatewayTools();
    const isIpfs = gatewayTools.containsCID(url).containsCid;

    const containsProxy = url.includes('/proxy/');

    return isIpfs && !containsProxy ? this.bunny : this.imagekit;
  }

  cdnUrl(url: string) {
    if (this.restrictedCdn(url) === this.imagekit) {
      return url;
    }
    const oldCdns = ['https://cdn.ebisusbay.com/', 'https://cdn.ebisusbay.biz/', 'https://cdn.ebisusbay.biz/test/'];
    const newCdn = 'https://cdn.lotusgalaxy.io/';
    url = oldCdns.reduce((p, n) => p.replace(n, newCdn), url);
    return url;
  }
}