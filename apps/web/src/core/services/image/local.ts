import {CdnProvider} from "@src/core/services/image/index";

class LocalCdnProvider implements CdnProvider {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  avatar(): string {
    return this.url;
  }

  banner(): string {
    return this.url;
  }

  bannerPreview(): string {
    return this.url;
  }

  blurred(): string {
    return this.url;
  }

  fixedWidth(width: number, height: number): string {
    return this.url;
  }

  nftCard(): string {
    return this.url;
  }

  thumbnail(): string {
    return this.url;
  }

  gifToMp4() {
    return this.url;
  }

  convert() {
    return this.url;
  }

  custom(options: any) {
    return this.url;
  }
}

export default LocalCdnProvider;