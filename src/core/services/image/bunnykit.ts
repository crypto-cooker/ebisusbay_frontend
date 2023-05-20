import {CdnProvider} from "@src/core/services/image/index";
import {BunnyBuilder} from "@src/core/services/image/bunny";
import ImageKitProvider, {ImageKitBuilder} from "@src/core/services/image/imagekit";

class BunnyKitProvider implements CdnProvider {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  avatar(): string {
    return BunnyKitBuilder.from(this.url)
      .setWidth(50)
      .setHeight(50)
      .build();
  }

  banner(): string {
    return BunnyKitBuilder.from(this.url)
      .setWidth(1920)
      .setHeight(1080)
      .build();
  }

  bannerPreview(): string {
    return BunnyKitBuilder.from(this.url)
      .setWidth(600)
      .setHeight(338)
      .build();
  }

  blurred(): string {
    return BunnyKitBuilder.from(this.url)
      .setBlur(80)
      .build();
  }

  fixedWidth(width: number, height: number): string {
    return BunnyKitBuilder.from(this.url)
      .setWidth(width)
      .setHeight(height)
      .build();
  }

  nftCard(): string {
    return BunnyKitBuilder.from(this.url)
      .setWidth(350)
      // .setHeight(350) // doesn't have an equivalent at_max
      .build();
  }

  thumbnail(): string {
    return new ImageKitProvider(this.url).thumbnail();
  }

  gifToMp4() {
    return new ImageKitProvider(this.url).gifToMp4();
  }

  convert() {
    return BunnyKitBuilder.from(this.url).build();
  }

  custom(options: any) {
    const builder = BunnyKitBuilder.from(this.url);
    if(options.width) builder.setWidth(options.width);
    if(options.height) builder.setHeight(options.height);
    if(options.blur) builder.setBlur(options.blur);
    return builder.build();
  }
}

export default BunnyKitProvider;

class BunnyKitBuilder {
  url: string;
  params: URLSearchParams;

  ikBuilder: ImageKitBuilder;
  bunnyBuilder: BunnyBuilder;

  constructor(url: string) {
    this.url = this.specialTransform(url);
    this.params = new URLSearchParams();

    this.ikBuilder = new ImageKitBuilder(url);
    this.bunnyBuilder = new BunnyBuilder(url);
  }

  static from(url: string) {
    return new BunnyKitBuilder(url);
  }

  setBlur(value: number) {
    this.ikBuilder.setBlur(value);
    this.bunnyBuilder.setBlur(value);
    return this;
  }

  setWidth(value: number) {
    this.ikBuilder.setWidth(value);
    this.bunnyBuilder.setWidth(value);
    return this;
  }

  setHeight(value: number) {
    this.ikBuilder.setHeight(value);
    this.bunnyBuilder.setHeight(value);
    return this;
  }

  build() {
    // First build the ImageKit URL
    let url = this.ikBuilder.build();

    // Then build the Bunny URL
    // Bunny params will not work if video appendages from imagekit are present
    const excludeBunny = this.ikBuilder.hasGifToMp4Appendage(url);
    if (!excludeBunny) {
      url = this.bunnyBuilder.build(url.toString());
    }

    return url;
  }

  private specialTransform(url: string) {
    if (!url) return url;

    if (url.toLowerCase().includes('/QmTeJ3UYT6BG8v4Scy9E3W9cxEq6TCeg5SiuLKNFXbsW87'.toLowerCase())) {
      return url.replace('/QmTeJ3UYT6BG8v4Scy9E3W9cxEq6TCeg5SiuLKNFXbsW87', '/QmX97CwY2NcmPmdS6XtcqLFMV2JGEjnEWjxBQbj4Q6NC2i.mp4');
    }

    if (url.toLowerCase().includes('/QmX97CwY2NcmPmdS6XtcqLFMV2JGEjnEWjxBQbj4Q6NC2i'.toLowerCase())) {
      return url.replace('/QmX97CwY2NcmPmdS6XtcqLFMV2JGEjnEWjxBQbj4Q6NC2i', '/QmX97CwY2NcmPmdS6XtcqLFMV2JGEjnEWjxBQbj4Q6NC2i.mp4');
    }

    return url;
  }
}