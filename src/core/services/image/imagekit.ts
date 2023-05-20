import {CdnProvider} from "@src/core/services/image/index";

class ImageKitProvider implements CdnProvider {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  blurred() {
    const kit = ImageKitBuilder.from(this.url)
      .setBlur(30)
      .setQuality(10);

    return kit.build();
  }

  thumbnail() {
    const kit = ImageKitBuilder.from(this.url);

    // Deprecated, don't think IK needs double transforms anymore
    // let useThumb = false;
    // if (!this.hasFileExtension(kit.url)) {
    //   kit.addAppendage('ik-video.mp4');
    //   useThumb = true;
    // }
    //
    // const location = new URL(kit.url);
    // if(useThumb || location.pathname.includes('.')){
    //   kit.addAppendage('ik-thumbnail.jpg');
    // }

    kit.addAppendage('ik-thumbnail.jpg');

    return kit.build();
  }

  nftCard() {
    const kit = ImageKitBuilder.from(this.url).setNamed('ml_card');
    return kit.build();
  }

  avatar() {
    const kit = ImageKitBuilder.from(this.url).setNamed('avatar');
    return kit.build();
  }

  banner() {
    const kit = ImageKitBuilder.from(this.url)
      .setWidth(1920)
      .setHeight(1080)
      .setCrop('at_max');

    return kit.build();
  }

  bannerPreview() {
    const kit = ImageKitBuilder.from(this.url).setNamed('wide_preview');
    return kit.build();
  }

  fixedWidth(width: number, height: number) {
    const kit = ImageKitBuilder.from(this.url)
      .setWidth(width)
      .setHeight(height)
      .setCrop('at_max');

    return kit.build();
  }

  gifToMp4() {
    const kit = ImageKitBuilder.from(this.url)
      .addAppendage('ik-gif-video.mp4');

    return kit.build();
  }

  convert() {
    return ImageKitBuilder.from(this.url).build();
  }

  custom(options: any) {
    const kit = ImageKitBuilder.from(this.url);
    if(options.width) kit.setWidth(options.width);
    if(options.height) kit.setHeight(options.height);
    if(options.blur) kit.setBlur(options.blur);
    if(options.quality) kit.setQuality(options.quality);
    if(options.crop) kit.setCrop(options.crop);
    if(options.named) kit.setNamed(options.named);

    return kit.build();
  }

  private hasFileExtension(url: string) {
    const filenameParts = url.split('?')[0].split('/');
    const filenamePart = filenameParts[filenameParts.length - 1];
    const fileExt = filenamePart.slice(filenamePart.lastIndexOf('.') + 1);
    return fileExt !== filenamePart && fileExt !== '';
  };
}

export default ImageKitProvider;

export class ImageKitBuilder {
  url: string;
  trValues: any;
  appendages: string[];

  constructor(url: string) {
    this.url = this.specialTransform(url);
    this.trValues = {};
    this.appendages = [];
  }

  static from(url: string) {
    return new ImageKitBuilder(url);
  }

  setBlur(value: number) {
    this.setParam('bl', value);
    return this;
  }

  setQuality(value: number) {
    this.setParam('q', value);
    return this;
  }

  setWidth(value: number) {
    this.setParam('w', value);
    return this;
  }

  setHeight(value: number) {
    this.setParam('h', value);
    return this;
  }

  setCrop(value: string) {
    this.setParam('c', value);
    return this;
  }

  setNamed(value: string) {
    this.setParam('n', value);
    return this;
  }

  setParam(key: string, value: any) {
    this.trValues[key] = value;
    return this;
  }

  addAppendage(appendage: string) {
    this.appendages.push(appendage);
    return this;
  }

  build(url?: string): string {
    if (!url) url = this.url;
    if (!url) return '';

    const newUrl = new URL(url!);

    for (const appendage of this.appendages) {
      newUrl.pathname += `/${appendage}`;
    }

    // URLs can't accept any params if ik-video.mp4 is in the path
    const trExclusions = newUrl.toString().includes('ik-gif-video.mp4');

    if (!trExclusions && Object.entries(this.trValues).length > 0) {
      const mapped = Object.entries(this.trValues).map(([k,v]) => `${k}-${v}`);
      newUrl.searchParams.set('tr', mapped.join());
    }
    if (trExclusions) {
      newUrl.search = '';
    }

    return newUrl.toString();
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

  hasGifToMp4Appendage(url: URL | string) {
    if (!!url) {
      return url.toString().includes('ik-gif-video.mp4');
    }
    return this.appendages.includes('ik-gif-video.mp4');
  }
}