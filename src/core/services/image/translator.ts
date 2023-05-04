import {appConfig, isLocalEnv} from "@src/Config";
import BunnyCdnProvider from "@src/core/services/image/bunny";
import {CdnProvider} from "@src/core/services/image/index";
import BunnyKitProvider from "@src/core/services/image/bunnykit";
import {urlify} from "@src/utils";
import {fallbackImageUrl} from "@src/core/constants";

const config = appConfig();

class ImageTranslator {
  url: string;
  provider!: CdnProvider;

  private constructor(url: string) {
    this.url = url;
  }

  static from(url: string) {
    const translator = new ImageTranslator(url);
    translator.provider = translator.determineBuilder(url);
    return translator;
  }

  static gif(url: string) {
    const translator = new ImageTranslator(url);
    translator.provider = new BunnyKitProvider(ImageTranslator.remapUrl(url, config.urls.cdn.proxy));
    return translator;
  }

  static bunnykit(url: string) {
    const translator = new ImageTranslator(url);

    let remappedUrl = url;

    if (url.includes('/img/') || !url.startsWith('http')) {
      remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.app);
    } else if (url.includes('/files/')) {
      remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.files);
    } else if (url.includes('/storage/')) {
      remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.storage);
    } else if (url.includes('/ipfs/')) {
      remappedUrl = ImageTranslator.remapUrl(url, `${config.urls.cdn.bunnykit}`);
    } else if (url.includes('/arweave/')) {
      remappedUrl = ImageTranslator.remapUrl(url, `${config.urls.cdn.bunnykit}`);
    } else if (url.includes('/proxy/')) {
      remappedUrl = ImageTranslator.remapUrl(url, `${config.urls.cdn.bunnykit}`);
    }

    translator.provider = new BunnyKitProvider(remappedUrl);

    return translator;
  }

  determineBuilder(url: string) {
    let provider!: CdnProvider;

    if (!url) url = fallbackImageUrl();

    // Bunny parameters don't work with URLs with no file extension
    const pattern = /\.[0-9a-z]+$/i;
    const hasFileExtension = pattern.test(url);

    if (url.includes('/img/') || !url.startsWith('http')) {
      const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.app);
      provider = new BunnyCdnProvider(remappedUrl);
    } else if (url.includes('/files/')) {
      const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.files);
      provider = new BunnyCdnProvider(remappedUrl);
    } else if (url.includes('/storage/')) {
      const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.storage);
      provider = new BunnyCdnProvider(remappedUrl);
    } else if (url.includes('/ipfs/')) {
      if (hasFileExtension) {
        const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.ipfs);
        provider = new BunnyCdnProvider(remappedUrl);
      } else {
        const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.bunnykit);
        provider = new BunnyKitProvider(remappedUrl);
      }
    } else if (url.includes('/arweave/')) {
      if (hasFileExtension) {
        const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.arweave);
        provider = new BunnyCdnProvider(remappedUrl);
      } else {
        const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.bunnykit);
        provider = new BunnyKitProvider(remappedUrl);
      }
    } else if (url.includes('/proxy/')) {
      if (hasFileExtension) {
        const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.proxy);
        provider = new BunnyCdnProvider(remappedUrl);
      } else {
        const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.bunnykit);
        provider = new BunnyKitProvider(remappedUrl);
      }
    }

    if (url.includes('.gif')) {
      const remappedUrl = ImageTranslator.remapUrl(url, config.urls.cdn.bunnykit);
      provider = new BunnyKitProvider(remappedUrl);
    }

    if (!provider) {
      provider = new BunnyCdnProvider(ImageTranslator.remapUrl(url, config.urls.cdn.app));
    }

    return provider;
  }

  static remapUrl(fromDomain: string, toDomain: string) {
    if (isLocalEnv() || !fromDomain.startsWith('http')) return urlify(toDomain, fromDomain);
    if(!fromDomain || fromDomain.startsWith('data')) return fromDomain;

    const remappableDomains: string[] = Object.values(config.urls.cdn);

    // Add any extra domains that need to be remapped
    remappableDomains.push('https://cdn.ebisusbay.com/storage/');

    return remappableDomains.reduce((prev, next) => {
      return prev.replace(next, toDomain);
    }, fromDomain);
  }
}

export default ImageTranslator;