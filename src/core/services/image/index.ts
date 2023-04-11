import ImageKitProvider from "@src/core/services/image/imagekit";
import BunnyCdnProvider from "@src/core/services/image/bunny";

export interface CdnProvider {
  blurred(url: string): string;
  thumbnail(url: string): string;
  nftCard(url: string): string;
  avatar(url: string): string;
  banner(url: string): string;
  bannerPreview(url: string): string;
  fixedWidth(url: string, width: number, height: number): string;
  appendMp4Extension(url: string): string;
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
}

const instance = new ImageService();
export default ImageService;