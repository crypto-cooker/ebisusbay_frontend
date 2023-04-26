import {CdnProvider} from "@src/core/services/image/index";
import {appConfig, isLocalEnv} from "@src/Config";

class BunnyCdnProvider implements CdnProvider {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  avatar(url: string): string {
    return BunnyBuilder.from(url, this.baseUrl)
      .setWidth(50)
      .setHeight(50)
      .build();
  }

  banner(url: string): string {
    return BunnyBuilder.from(url, this.baseUrl)
      .setWidth(1920)
      .setHeight(1080)
      .build();
  }

  bannerPreview(url: string): string {
    return BunnyBuilder.from(url, this.baseUrl)
      .setWidth(600)
      .setHeight(338)
      .build();
  }

  blurred(url: string): string {
    return BunnyBuilder.from(url, this.baseUrl)
      .setBlur(80)
      .build();
  }

  fixedWidth(url: string, width: number, height: number): string {
    return BunnyBuilder.from(url, this.baseUrl)
      .setWidth(width)
      .setHeight(height)
      .build();
  }

  nftCard(url: string): string {
    return BunnyBuilder.from(url, this.baseUrl)
      .setWidth(350)
      .setHeight(350)
      .build();
  }

  thumbnail(url: string): string {
    return BunnyBuilder.from(url, this.baseUrl)
      .setWidth(440)
      .setHeight(440)
      .build();
  }

  gifToMp4(url: string) {
    return BunnyBuilder.from(url, this.baseUrl).build();
  }

  convert(url: string) {
    return BunnyBuilder.from(url, this.baseUrl).build();
  }

  custom(url: string, options: any) {
    const builder = BunnyBuilder.from(url, this.baseUrl);
    if(options.width) builder.setWidth(options.width);
    if(options.height) builder.setHeight(options.height);
    if(options.blur) builder.setBlur(options.blur);
    return builder.build();
  }
}

export default BunnyCdnProvider;

class BunnyBuilder {
  url: string;
  baseUrl: string;
  params: URLSearchParams;

  constructor(url: string, baseUrl: string) {
    this.url = url;
    this.baseUrl = baseUrl;
    this.params = new URLSearchParams();
  }

  static from(url: string, baseUrl: string) {
    return new BunnyBuilder(url, baseUrl);
  }

  setBlur(value: number) {
    this.params.set('blur', value.toString());
    return this;
  }

  setWidth(value: number) {
    this.params.set('width', value.toString());
    return this;
  }

  setHeight(value: number) {
    this.params.set('height', value.toString());
    return this;
  }

  build() {
    if (isLocalEnv() && this.url?.startsWith('/')) return this.url;
    if(!this.url || this.url.startsWith('data')) return this.url;

    const cdn = appConfig('urls.cdn');
    let str = this.url.includes(cdn.legacy) ? this.url.replace(cdn.legacy, this.baseUrl) : this.url;

    if (this.params.toString() !== '') {
      str += `?${this.params}`;
    }

    const url = new URL(str, this.baseUrl);

    return url.toString();
  }
}