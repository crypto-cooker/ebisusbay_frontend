import {CdnProvider} from "@src/core/services/image/index";
import {appConfig, isLocalEnv} from "@src/Config";

class BunnyCdnProvider implements CdnProvider {
  avatar(url: string): string {
    return BunnyBuilder.from(url)
      .setWidth(50)
      .setHeight(50)
      .build();
  }

  banner(url: string): string {
    return BunnyBuilder.from(url)
      .setWidth(1920)
      .setHeight(1080)
      .build();
  }

  bannerPreview(url: string): string {
    return BunnyBuilder.from(url)
      .setWidth(600)
      .setHeight(338)
      .build();
  }

  blurred(url: string): string {
    return BunnyBuilder.from(url)
      .setBlur(80)
      .build();
  }

  fixedWidth(url: string, width: number, height: number): string {
    return BunnyBuilder.from(url)
      .setWidth(width)
      .setHeight(height)
      .build();
  }

  nftCard(url: string): string {
    return BunnyBuilder.from(url)
      .setWidth(350)
      .setHeight(350)
      .build();
  }

  thumbnail(url: string): string {
    return BunnyBuilder.from(url)
      .setWidth(440)
      .setHeight(440)
      .build();
  }

  appendMp4Extension(url: string) {
    return BunnyBuilder.from(url).build();
  }

  gifToMp4(url: string) {
    return BunnyBuilder.from(url).build();
  }

  convert(url: string) {
    return BunnyBuilder.from(url).build();
  }

  custom(url: string, options: any) {
    const builder = BunnyBuilder.from(url);
    if(options.width) builder.setWidth(options.width);
    if(options.height) builder.setHeight(options.height);
    if(options.blur) builder.setBlur(options.blur);
    return builder.build();
  }
}

export default BunnyCdnProvider;

class BunnyBuilder {
  url: string;
  params: URLSearchParams;

  constructor(url: string) {
    this.url = url;
    this.params = new URLSearchParams();
  }

  static from(url: string) {
    return new BunnyBuilder(url);
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

    // const oldCdns = ['https://cdn.ebisusbay.com/', 'https://cdn.ebisusbay.biz/', 'https://cdn.ebisusbay.biz/test/'];
    // const newCdn = 'https://cdn2.ebisusbay.com/';
    // const isCdnUrl = oldCdns.some(cdn => this.url.includes(cdn));
    // this.url = oldCdns.reduce((p, n) => p.replace(n, newCdn), this.url);
    // const url = new URL(`${this.url}?${this.params}`, !isCdnUrl ? newCdn : undefined);
    //
    // return url.toString();

    return this.url.toString();
  }
}