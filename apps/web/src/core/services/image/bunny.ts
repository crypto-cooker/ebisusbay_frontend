import {CdnProvider} from "@src/core/services/image/index";

class BunnyCdnProvider implements CdnProvider {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  avatar(): string {
    return BunnyBuilder.from(this.url)
      .setWidth(50)
      .setHeight(50)
      .build();
  }

  banner(): string {
    return BunnyBuilder.from(this.url)
      .setWidth(1920)
      .setHeight(1080)
      .build();
  }

  bannerPreview(): string {
    return BunnyBuilder.from(this.url)
      .setWidth(600)
      .setHeight(338)
      .build();
  }

  blurred(): string {
    return BunnyBuilder.from(this.url)
      .setBlur(80)
      .build();
  }

  fixedWidth(width: number, height: number): string {
    return BunnyBuilder.from(this.url)
      .setWidth(width)
      .setHeight(height)
      .build();
  }

  nftCard(): string {
    return BunnyBuilder.from(this.url)
      .setWidth(350)
      // .setHeight(350) // doesn't have an equivalent at_max
      .build();
  }

  thumbnail(): string {
    return BunnyBuilder.from(this.url)
      .setWidth(440)
      .setHeight(440)
      .build();
  }

  gifToMp4() {
    return BunnyBuilder.from(this.url).build();
  }

  convert() {
    return BunnyBuilder.from(this.url).build();
  }

  custom(options: any) {
    const builder = BunnyBuilder.from(this.url);
    if(options.width) builder.setWidth(options.width);
    if(options.height) builder.setHeight(options.height);
    if(options.blur) builder.setBlur(options.blur);
    return builder.build();
  }
}

export default BunnyCdnProvider;

export class BunnyBuilder {
  params: URLSearchParams;
  url: string;

  constructor(url: string) {
    this.params = new URLSearchParams();
    this.url = url;
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

  build(url?: string): string {
    if (!url) url = this.url;
    if (!url) return '';

    const newUrl = new URL(url!);

    if (this.params.toString() !== '') {
      for (const [key, value] of this.params.entries()) {
        newUrl.searchParams.set(key, value);
      }
    }

    return newUrl.toString();
  }
}