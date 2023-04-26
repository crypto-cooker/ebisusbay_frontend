import {CdnProvider} from "@src/core/services/image/index";
import {appConfig, isLocalEnv} from "@src/Config";

class ImageKitProvider implements CdnProvider {

  blurred(url: string) {
    const kit = ImageBuilder.from(url)
      .setBlur(30)
      .setQuality(10);

    return kit.build();
  }

  thumbnail(url: string) {
    const kit = ImageBuilder.from(url);

    let useThumb = false;
    if (!this.hasFileExtension(kit.url)) {
      kit.addAppendage('ik-video.mp4');
      useThumb = true;
    }

    const location = new URL(kit.url);
    if(useThumb || location.pathname.includes('.')){
      kit.addAppendage('ik-thumbnail.jpg');
    }

    return kit.build();
  }

  nftCard(url: string) {
    const kit = ImageBuilder.from(url).setNamed('ml_card');
    return kit.build();
  }

  avatar(url: string) {
    const kit = ImageBuilder.from(url).setNamed('avatar');
    return kit.build();
  }

  banner(url: string) {
    const kit = ImageBuilder.from(url)
      .setWidth(1920)
      .setHeight(1080)
      .setCrop('at_max');

    return kit.build();
  }

  bannerPreview(url: string) {
    const kit = ImageBuilder.from(url).setNamed('wide_preview');
    return kit.build();
  }

  fixedWidth(url: string, width: number, height: number) {
    const kit = ImageBuilder.from(url)
      .setWidth(width)
      .setHeight(height)
      .setCrop('at_max');

    return kit.build();
  }

  gifToMp4(url: string | URL) {
    const kit = ImageBuilder.from(url.toString())
      .addAppendage('ik-gif-video.mp4');

    return kit.build();
  }

  convert(url: string) {
    return ImageBuilder.from(url).build();
  }

  custom(url: string, options: any) {
    const kit = ImageBuilder.from(url);
    if(options.width) kit.setWidth(options.width);
    if(options.height) kit.setHeight(options.height);
    if(options.blur) kit.setBlur(options.blur);
    if(options.quality) kit.setQuality(options.quality);
    if(options.crop) kit.setCrop(options.crop);
    if(options.named) kit.setNamed(options.named);

    return kit.build();
  }

  private appendMp4Extension(url: string | URL) {
    url = new URL(url);
    url.pathname = `${url.pathname}/ik-video.mp4`;
    return url.toString();
  }

  private hasFileExtension(url: string) {
    const filenameParts = url.split('?')[0].split('/');
    const filenamePart = filenameParts[filenameParts.length - 1];
    const fileExt = filenamePart.slice(filenamePart.lastIndexOf('.') + 1);
    return fileExt !== filenamePart && fileExt !== '';
  };
}

export default ImageKitProvider;

class ImageBuilder {
  url: string;
  trValues: any;
  appendages: string[];

  constructor(url: string) {
    this.url = this.specialTransform(url);
    this.trValues = {};
    this.appendages = [];
  }

  static from(url: string) {
    return new ImageBuilder(url);
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

  build() {
    if(!this.url || this.url.startsWith('data')) return this.url;

    const cdn = appConfig('urls.cdn');
    const fixedUrl = this.url.includes(cdn.primary) ? this.url.replace(cdn.primary, cdn.legacy) : this.url;

    if (isLocalEnv() && fixedUrl?.startsWith('/')) return fixedUrl;

    const baseUrl = !fixedUrl.includes(cdn.legacy) ? cdn.legacy : undefined;
    const url = new URL(fixedUrl, baseUrl);

    for (const appendage of this.appendages) {
      url.pathname += `/${appendage}`;
    }

    if (Object.entries(this.trValues).length > 0) {
      const mapped = Object.entries(this.trValues).map(([k,v]) => `${k}-${v}`);
      url.searchParams.set('tr', mapped.join());
    }

    return url.toString();
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