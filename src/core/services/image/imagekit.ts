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
    const location = new URL(url);
    if(location.pathname.includes('.')){
      //try to use imagekit thumbnail (check for period it doesn't work if no extension)
      location.pathname += '/ik-thumbnail.jpg'
      return location.toString();
    }

    return '';
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

  appendMp4Extension(url: string | URL) {
    url = new URL(url);
    url.pathname = `${url.pathname}/ik-video.mp4`;
    return url.toString();
  }

  gifToMp4(url: string | URL) {
    url = new URL(url);
    url.pathname = `${url.pathname}/ik-gif-video.mp4`;
    return url.toString();
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
}

export default ImageKitProvider;

class ImageBuilder {
  url: string;
  trValues: any;

  constructor(url: string) {
    this.url = url;
    this.trValues = {};
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

  build() {
    if (isLocalEnv() && this.url?.startsWith('/')) return this.url;
    if(!this.url || this.url.startsWith('data')) return this.url;

    const cdn = appConfig('urls.cdn');
    const url = new URL(this.url, !this.url.includes(cdn) ? cdn : undefined);

    if (Object.entries(this.trValues).length > 0) {
      const mapped = Object.entries(this.trValues).map(([k,v]) => `${k}-${v}`);
      url.searchParams.set('tr', mapped.join());
    }

    return url.toString();
  }
}