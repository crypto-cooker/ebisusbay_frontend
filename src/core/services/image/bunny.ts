import {CdnProvider} from "@src/core/services/image/index";
import {isLocalEnv} from "@src/Config";

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

    let str = this.url;
    if (this.params.toString() !== '') {
      str += `?${this.params}`;
    }

    const url = new URL(str, 'https://cdn.lotusgalaxy.io/');

    return url.toString();
  }
}