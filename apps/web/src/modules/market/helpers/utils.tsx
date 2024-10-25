import moment from 'moment';
import blacklist from '../../../core/configs/blacklist.json';
import attributes from '../../../core/configs/attributes.json';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import {appConfig} from '@src/config';
import {commify, getAddress} from "ethers/lib/utils";
import brands from '../../../core/data/brands.json';
import ImageService from "@src/core/services/image";
import {ethers} from "ethers";
import {MouseEventHandler} from "react";
import Decimal from 'decimal.js-light';
import knownTokens from '@src/modules/dex/config/tokens.json';
import {getBlockExplorerLink} from "@dex/utils";
import { ChainId } from '@pancakeswap/chains';
import { MapiCollectionBlacklist } from '@src/core/services/api-service/mapi/types';

const config = appConfig();
const drops = config.drops;
const legacyCollections = config.legacyCollections;

const gateway = config.urls.cdn.ipfs;

export function getLengthOfTime(duration: number) {
  const timeUnits = [
    { unit: 'year', threshold: 86400 * 30 * 12, roundFunc: (val: number) => (val / 86400 / 30 / 12).toFixed(1) },
    { unit: 'month', threshold: 86400 * 30, roundFunc: (val: number) => Math.floor(val / 86400 / 30) },
    { unit: 'day', threshold: 86400, roundFunc: (val: number) => Math.floor(val / 86400) },
    { unit: 'hour', threshold: 3600, roundFunc: (val: number) => Math.floor(val / 3600) },
    { unit: 'minute', threshold: 60, roundFunc: (val: number) => Math.floor(val / 60) },
    { unit: 'second', threshold: 1, roundFunc: (val: number) => Math.floor(val) }
  ];

  for (const { unit, threshold, roundFunc } of timeUnits) {
    if (duration >= threshold) {
      const value = roundFunc(duration);
      return `${value} ${pluralize(Number(value), unit)}`;
    }
  }
}

/**
 * Takes a string and makes it human readable
 * Removes underscores, adds spaces, etc...
 *
 * @param str
 * @returns {string}
 * @deprecated Use humanizeAdvanced instead
 */
export function humanize(str?: string) {
  if (str === null || str === undefined) return '';
  if (!str) return str;

  str = str.toString();

  // Only split camel case if it's not completely uppercase
  if (str === str.toUpperCase()) {
    str = str[0].toUpperCase() + str.slice(1).toLowerCase();
  } else {
    str = str.split(/(?=[A-Z])/).join(' ');
  }

  let i,
    frags = str.split('_');
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

export function humanizeAdvanced(s?: string | number) {
  if (s === null || s === undefined) return '';
  if (!s) return s;
  if (typeof s !== 'string') s = s.toString();

  // Insert spaces before uppercase letters that follow lowercase letters
  const spacedString = s.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Split string by space, hyphen, underscore
  const words = spacedString.split(/[\s\-_]/);

  // Capitalize first letter of each word and make rest lowercase
  const formattedWords = words.map(word => capitalizeFirstLetter(word));

  return formattedWords.join(' ').trim();
}

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


/**
 * Extra formatting for collection attributes not caught by humanize(str)
 *
 * @param str
 * @param address
 * @param category
 * @param makeHuman
 * @returns {string|*}
 */
export function mapAttributeString(str: string, address?: string, category?: string, makeHuman?: boolean) {
  const mappings: {[key: string]: string | object} = attributes[address as keyof typeof attributes]
  let newStr = str?.toString() ?? '';

  if (mappings) {
    if (Object.keys(mappings).includes(str) && typeof mappings[str] === 'string') {
      return mappings[str]
    }

    if (category) {
      const potentialObj = mappings[category];
      if (Object.keys(mappings).includes(category) &&
        typeof potentialObj === 'object' &&
        Object.keys(mappings[category]).includes(str.toString())) {
        return potentialObj[str as keyof typeof potentialObj];
      }
    }
  }

  return makeHuman ? humanizeAdvanced(newStr) : newStr;
}

/**
 * Converts a number to use SI prefixed notation
 *
 * @param num
 * @param exclude
 * @returns {string|number}
 */
export function siPrefixedNumber(num?: number | string, exclude = 5) {
  if (!num) return 0;

  const wholeNumbers = Math.round(Number(num)).toString().length;
  const shouldPrefix = wholeNumbers > exclude;

  // Twelve Zeroes for Trillions
  return Math.abs(Number(num)) >= 1.0e12 && shouldPrefix
    ? Number((Math.abs(Number(num)) / 1.0e12).toFixed(2)) + 'T'
    : // Nine Zeroes for Billions
    Math.abs(Number(num)) >= 1.0e9 && shouldPrefix
      ? Number((Math.abs(Number(num)) / 1.0e9).toFixed(2)) + 'B'
      : // Six Zeroes for Millions
    Math.abs(Number(num)) >= 1.0e6 && shouldPrefix
      ? Number((Math.abs(Number(num)) / 1.0e6).toFixed(2)) + 'M'
      : // Three Zeroes for Thousands
    Math.abs(Number(num)) >= 1.0e3 && shouldPrefix
      ? Number((Math.abs(Number(num)) / 1.0e3).toFixed(2)) + 'K'
      : commify(Number(Math.abs(Number(num))));
}

export function shortAddress(address?: string | null) {
  return shortString(address, 4, 3);
}

export function shortString(str?: string | null, leftChars = 3, rightChars = 3) {
  if (!str) return '';
  if (str.length <= leftChars + rightChars) return str;

  return `${str.substring(0, leftChars)}...${str.substring(str.length - rightChars, str.length)}`;
}

export function username(identifier?: string) {
  if (!identifier) return '';

  try {
    if (identifier.startsWith('0x') && !identifier.endsWith('.cro')) {
      return shortAddress(ethers.utils.getAddress(identifier));
    }
    return identifier;
  } catch (e) {
    return identifier;
  }
}

export function timeSince(timestamp?: Date | number) {
  if (!timestamp) return timestamp;

  timestamp = millisecondTimestamp(timestamp);
  const seconds = Math.floor(Math.abs((Date.now() - timestamp) / 1000));
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} ${pluralize(interval, 'year')}`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} ${pluralize(interval, 'month')}`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} ${pluralize(interval, 'day')}`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} ${pluralize(interval, 'hour')}`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} ${pluralize(interval, 'minute')}`;
  }

  interval = Math.floor(seconds);
  return `${interval} ${pluralize(interval, 'second')}`;
}

export function secondsToDhms(totalSeconds: number, abbreviated = false) {
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Formatting the output based on abbreviated parameter
  let result = '';
  if (!abbreviated) {
    if (days > 0) result += `${days} ${pluralize(days, 'day')} `;
    if (hours > 0) result += `${hours} ${pluralize(hours, 'hour')} `;
    if (minutes > 0) result += `${minutes} ${pluralize(minutes, 'minute')} `;
    if (seconds > 0) result += `${seconds} ${pluralize(seconds, 'second')}`;
  } else {
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0) result += `${seconds}s`;
  }
  return result.trim();
}

/**
 * @description create explorer url.
 * @param transactionHash 0x000
 * @param chainId
 */
export function openWithExplorer(transactionHash = '', chainId?: number) {
  if (typeof window === 'undefined') {
    return;
  }
  window.open(getBlockExplorerLink(transactionHash, 'transaction', chainId ?? ChainId.CRONOS))
}

export function createSuccessfulTransactionToastContent(transactionHash: string, chainId?: number) {
  return (
    <span>
      Success!
      <span
        className="link-primary"
        style={{ paddingLeft: '1rem' }}
        onClick={() => openWithExplorer(transactionHash, chainId)}
      >
        See details
      </span>
    </span>
  );
}

export function createSuccessfulAddCartContent(onClickView: MouseEventHandler<HTMLSpanElement>) {
  return (
    <span>
      Added to cart
      <span
        className="link-primary"
        style={{ paddingLeft: '1rem' }}
        onClick={onClickView}
      >
        View cart
      </span>
    </span>
  );
}

/**
 *
 * Case insensitive comparison
 *
 * @param str1
 * @param str2
 * @returns {boolean}
 */
export function ciEquals(str1?: string, str2?: string) {
  return str1?.toLowerCase() === str2?.toLowerCase();
}

export function ciIncludes(array?: string[], str?: string) {
  if (!array || !str) return false;
  return array.map((item) => item.toLowerCase()).includes(str.toLowerCase());
}

export function newlineText(text: string) {
  return text.split('\n').map((str, i) => <p key={i} className="mb-3">{str}</p>);
}

export const isFounderDrop = (address: string) => {
  return isDrop(address, 'founding-member');
};

export const isCmbDrop = (address: string) => {
  return isDrop(address, 'cronos-gorilla-business');
};

export const isDrop = (address: string, slug: string) => {
  const drop = drops.find((d) => d.slug === slug);
  return drop && ciEquals(drop.address, address);
};

export const isCollection = (address: string, matchesSlug: string[] | string, matchesAddress: string[] | string) => {
  const slugs = Array.isArray(matchesSlug) ? matchesSlug : [matchesSlug];
  const addresses = Array.isArray(matchesAddress) ? matchesAddress : [matchesAddress];
  return (
    slugs.some((s) => ciEquals(s, address)) ||
    addresses.some((a) => ciEquals(a, address))
  );
};

export const isBrandCollection = (slug: string, matchesAddress: string) => {
  const brand = brands.find((b) => b.slug === slug);
  return brand && brand.collections.some((address) => ciEquals(address, matchesAddress));
};

export const isCroCrowCollection = (address: string) => {
  return isCollection(address, 'cro-crow', '0xe4ab77ed89528d90e6bcf0e1ac99c58da24e79d5');
};

export const isCrognomidesCollection = (address: string) => {
  return isCollection(address, 'crognomides', '0x9AE196176b528680B75C7aea2FBd72456FDFAE17');
};

export const isMetapixelsCollection = (address: string) => {
  return isCollection(address, 'metapixels', '0x19e1f891002240fbea77ccc2adb6e73b93b3b97a');
};

export const isSouthSideAntsCollection = (address: string) => {
  return isCollection(address, 'south-side-ants', '0x5219cA4b335bA51aB717E474F31D803381D09d24');
};

export const isAntMintPassCollection = (address: string) => {
  return isCollection(address, 'ant-mint-pass', '0x844DaCD5A52DB9368E6C606f739599598031da84');
};

export const isCrosmocraftsPartsCollection = (address: string) => {
  return isCollection(address, 'crosmocrafts-parts', '0xf49C94E09E506aCcbe553b673FEe4F44efb06D55');
};

export const isCrosmocraftsCollection = (address: string) => {
  return isCollection(address, 'crosmocrafts', '0xC6373d6F369A9FfE7D93B21F2A5b0E16291d996D');
};

export const isWeirdApesCollection = (address: string) => {
  return isCollection(address, 'weird-apes-club', '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44');
};

export const isBabyWeirdApesCollection = (address: string) => {
  return isCollection(address, 'baby-weird-apes', '0x89F7114C73d5cef7d7EDCbDb14DaA092EB2194c9');
};

export const isLadyWeirdApesCollection = (address: string) => {
  return isCollection(address, 'lady-weird-apes', '0xD316F2F1872648a376D8c0937db1b4b10D1Ef8b1');
};

export const isVoxelWeirdApesCollection = (address: string) => {
  return isCollection(address, 'voxel-weird-apes', '0xe02A74813053e96C5C98F817C0949E0B00728Ef6');
};

export const isAnyWeirdApesCollection = (address: string) => {
  return isCollection(
    address,
    [
      'weird-apes-club',
      'baby-weird-apes',
      'lady-weird-apes',
      'voxel-weird-apes'
    ],
    [
      '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44',
      '0x89F7114C73d5cef7d7EDCbDb14DaA092EB2194c9',
      '0xD316F2F1872648a376D8c0937db1b4b10D1Ef8b1',
      '0xe02A74813053e96C5C98F817C0949E0B00728Ef6'
    ]
  );
};

export const isCronosVerseCollection = (address: string) => {
  return isCollection(address, 'cronosverse', '0x0aCDA31Cf1F301a7Eb8f988D47F708FbA058F8f5');
};

export const isEvoSkullCollection = (address: string) => {
  return isCollection(address, 'evo-skull', '0xbf4E430cD0ce8b93d4760958fe4ae66cDaCDB6c6');
};

export const isCroSkullPetsCollection = (address: string) => {
  return isCollection(address, 'croskull-pets', '0xB77959DC7a12F7549ACC084Af01259Fc48813c89')||
    isCollection(address, 'croskull-pets-s2', '0x54655D5468f072D5bcE1577c4a46F701C28a41A7') ||
    isCollection(address, 'croskull-pets-s3', '0x31B378ac025a341839CD81C4D29A8457324D3EbC');
};

export const isCroniesCollection = (address: string) => {
  return isCollection(address, 'cronies', '0xD961956B319A10CBdF89409C0aE7059788A4DaBb');
};

export const isLazyHorseCollection = (address: string) => {
  return isCollection(address, 'lazy-horse', '0xD504ed871d33dbD4f56f523A37dceC86Ee918cb6');
};

export const isLazyHorsePonyCollection = (address: string) => {
  return isCollection(address, 'lazy-horse-pony', '0x7d0259070B5f513CA543afb6a906d42af5884B1B');
};

export const isCroskullSbtCollection = (address: string) => {
  return isCollection(address, 'croskull-soulbound-token', '0x0977Ee79F7f6BedE288DD0264C77B4A1b32C48e8');
};

export const isArgonautsBrandCollection = (address: string) => {
  return isBrandCollection('argonauts', address);
};

export const isEbVipCollection = (address: string, id?: string | number) => {
  const collection = legacyCollections.find((c) => c.slug === 'founding-member');
  return collection &&
    ciEquals(collection.address, address) &&
    id?.toString() === '2';
};

export const isFoundingMemberCollection = (address: string) => {
  const collection = legacyCollections.find((c) => c.slug === 'founding-member');
  return collection &&
    ciEquals(collection.address, address);
};

export const isCronosGorillaBusinessCollection = (address: string) => {
  return isCollection(address, 'cronos-gorilla-business', '0xc843f18d5605654391e7eDBEa250f6838C3e8936');
};

export const isCroSwapQuartermastersCollection = (address: string) => {
  return isCollection(address, 'croswap-quartermasters', '0x333580e4B59E74243451c531c29121c02F8E3102');
};

export const isRyoshiResourceToken = (address: string, id: string) => {
  return isCollection(address, 'ryoshi-resources', config.contracts.resources) && parseInt(id) === 2;
};

export const isDynamicNftImageCollection = (address: string) => {
  if(!address) return false;
  if (isLandDeedsCollection(address)) return true;
  if (isHeroesCollection(address)) return true;

  return false;
};

export const isLandDeedsCollection = (address: string) => {
  return isCollection(
    address,
    'izanamis-cradle-land-deeds',
    ['0xcF7C77967FaD74d0B5104Edd476db2C6913fb0e3', '0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad']
  );
};
export const isHeroesCollection = (address: string) => {
  return isCollection(
    address,
    'ryoshi-heroes',
    ['0xF098C2aD290f32c8666ace27222d3E65cECE43b9', '0x458073C0fb97e42d441778aE4beFc8c1180E513e']
  );
}

export const isVaultCollection = (address: string) => {
  return ciEquals(address, config.contracts.vaultNft);
}

export const isPlayingCardsCollection = (address: string) => {
  return isCollection(address, 'ryoshi-playing-cards', '0xd87838a982a401510255ec27e603b0f5fea98d24');
}

export const isRyoshiTalesCollection = (address: string) => {
  return isCollection(address, 'ryoshi-tales', ['0x562e3e2d3f69c53d5a5728e8d7f977f3de150e04', '0xCDC905b5cDaDE71BFd3540e632aeFfE99b9965E4']);
}

export const isKoban = (address: string, nftId?: string | number) => {
  return isCollection(address, 'ryoshi-resources', '0xce3f4e59834b5B52B301E075C5B3D427B6884b3d') && nftId?.toString() === '1';
}

export const isBundle = (addressOrSlug: string) => {
  return ciEquals(addressOrSlug, config.contracts.bundle) || addressOrSlug === 'nft-bundles';
}

export const isCollectionListable = (collection: any) => {
  if (!collection) return false;
  
  const listableStates = [MapiCollectionBlacklist.PENDING, MapiCollectionBlacklist.LISTABLE];

  // the "listable" property only used for legacy lookups in rpc_config. Remove when no longer needed
  return listableStates.includes(collection.blacklisted ?? collection.blacklist) || collection.listable;
}

export const percentage = (partialValue: number | string, totalValue: number | string) => {
  if (!totalValue || totalValue === 0) return 0;
  return Math.floor((100 * Number(partialValue)) / Number(totalValue));
};

export const relativePrecision = (num: number, minDecimals = 1) => {
  if (num < 0.001) {
    return Math.round(num * 10000) / 100;
  } else if (num < 0.01) {
    return Math.round(num * 1000) / 10;
  }

  const multiplier = minDecimals + 1;
  return Math.round(num * 100 * multiplier) /  multiplier;
};

/**
 * Lookup a collection by address instead of slug
 *
 * @param address
 * @param tokenId
 * @returns {*}
 */
export const findCollectionByAddress = (address: string, tokenId?: string) => {
  return legacyCollections.find((c) => {
    // const matchesAddress = ciEquals(c.address, address);
    // if (!tokenId) return matchesAddress;
    //
    // if (c.is1155 && c.slug !== 'ryoshi-resources') {
    //   const ids = c.tokens?.map((t: any) => t.id) ?? [c.id];
    //   const matchesToken = ids.includes(parseInt(tokenId));
    //   return matchesAddress && matchesToken;
    // }

    return ciEquals(c.address, address);
  });
};

export const round = (num?: number | string, decimals?: number) => {
  if (!num) return 0;
  if (typeof num === 'string') num = parseFloat(num);
  if (!decimals) return Math.round(num);

  const pow = Math.pow(10, decimals);
  return Math.round(num * pow) / pow;
};

export const convertIpfsResource = (resource: string, tooltip?: string) => {
  if (!resource) return;

  let gatewayTools = new IPFSGatewayTools();

  let linkedResource;
  if (resource.startsWith('ipfs')) {
    linkedResource = `${gateway}${resource.substring(7)}`;
  } else if (gatewayTools.containsCID(resource) && !resource.startsWith('ar')) {
    try {
      linkedResource = gatewayTools.convertToDesiredGateway(resource, gateway);
    } catch (error) {
      linkedResource = resource;
    }
  } else if (resource.startsWith('ar')) {
    if (typeof tooltip !== 'undefined') {
      linkedResource = `https://arweave.net/${tooltip.substring(5)}`;
    } else {
      linkedResource = `https://arweave.net/${resource.substring(5)}`;
    }
  } else {
    linkedResource = resource;
  }

  return linkedResource;
};

export const isUserBlacklisted = (address: string) => {
  const users = blacklist.flatMap((record) => record.users);
  return users.some((bAddress) => ciEquals(address, bAddress));
};

export const isNftBlacklisted = (address: string, id: string) => {
  const collections = blacklist.flatMap((record) => record.tokens);
  return collections.some((collection) => {
    const matchesAddress = ciEquals(collection.address, address);
    const matchesSlug = collection.slug === address;
    const includesId = collection.ids.includes(parseInt(id));

    return (matchesSlug || matchesAddress) && includesId;
  });
};

export const devLog = (...params: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(params);
  }
};



/**
 * Ensure that a timestamp is in milliseconds
 *
 * @param timestamp
 * @returns {number}
 */
export const millisecondTimestamp = (timestamp: Date | number) => {
  if (timestamp.toString().length < 13) {
    return Number(`${timestamp}000`);
  }

  return Number(timestamp);
};

export const isEventValidNumber = (e: any) => {
  const re = /^[0-9\b]+$/;
  const validKeys = ['Backspace', 'Delete'];
  return e.key === '' || re.test(e.key) || validKeys.includes(e.key);
};

// can use web3.utils.isAddress tho
export const isAddress = (value?: string) => {
  if (!value) {
    return false
  }
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return !!getAddress(value.toLowerCase())
  } catch {
    return false
  }
};

export const isEmptyObj = (obj?: {} | null) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const rankingsLogoForCollection = (collection: any) => {
  let logo = '/img/logos/ebisu-technicolor.svg';
  if (!collection) ImageService.translate(logo).avatar();

  if (collection.metadata.rankings?.source === 'rarity_sniper') logo = '/img/logos/rarity-sniper.png';
  else if (collection.metadata.rankings?.source === 'provided') logo = collection.metadata.avatar;

  return ImageService.translate(logo).avatar();
};
export const rankingsTitleForCollection = (collection: any) => {
  let title = `Ranking provided by Ebisu's Bay`;
  if (!collection) return title;

  if (collection.metadata.rankings?.source === 'rarity_sniper') title = `Ranking provided by Rarity Sniper`;
  else if (collection.metadata.rankings?.source === 'provided') title = `Ranking provided by ${collection.name}`;

  return title;
};
export const rankingsLinkForCollection = (collection: any, id?: string | number) => {
  let link = null;
  if (!collection) return link;

  if (collection.metadata.rankings?.source === 'rarity_sniper')
    link = `https://raritysniper.com/${collection.metadata.rankings.slug}/${id}`;
  else if (collection.metadata.rankings?.source === 'provided' && collection.metadata.website)
    link = collection.metadata.website;

  return link;
};

export const buildTwitterUrl = (username?: string) => {
  if (!username || username.startsWith('http')) return username;

  return `https://twitter.com/${username}`;
}

export const buildInstagramUrl = (username?: string) => {
  if (!username || username.startsWith('http')) return username;

  return `https://instagram.com/${username}`;
}

export const isNumeric = (str: number | string) => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export const stripSpaces = (str: string) => {
  return str.replace(/\W/g, '');
}

export const appUrl = (path: string | URL) => {
  return new URL(path, appConfig('urls.app'));
}

/**
 * Removes extra slashes from url path
 *
 * @param url
 */
export function cleanUrl(url: string) {
  return url.replace(/([^:])(\/\/+)/g, '$1/');
}

/**
 * Combines url components and cleans it
 *
 * @param components
 */
export function urlify(...components: any[]) {
  return cleanUrl(components.join('/'));
}

export const pluralize = (val: number, word: string, plural: string = word + 's'): string => {
  return [1, -1].includes(Number(val)) ? word : plural;
};


export const isGaslessListing = (listingId: string) => {
  return listingId && listingId.toString().startsWith('0x')
}

export const usdFormat = (num: number | string) => {
  if (typeof num === 'string') num = Number(num);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(num);
}

export const cacheBustingKey = (minutes = 5, date = Date.now()) => {
  const coeff = 1000 * 60 * minutes;
  return Math.round(date / coeff) * coeff;
}

export const findNextLowestNumber = (array: string[] | number[], value: string | number) => {
  array = array.map(Number); // coerce all elements to numbers
  value = +value; // coerce value to a number

  array.sort((a, b) => a - b);  // make sure array is sorted

  // If value is less than the smallest array value, return the smallest array value
  if (value <= array[0]) return array[0];

  for (let i = 1; i < array.length; i++) {
    if (array[i] >= value) {
      return array[i] === value ? array[i] : array[i - 1];
    }
  }

  // If value is greater than the largest array value, return the largest array value
  return array[array.length - 1];
}

/**
 * Converts a string to title case
 * @param str
 * @returns {*}
 */
export const titleCase = (str: string) => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

export const knownErc20Token = (address?: string) => {
  if (!address) return null;

  const value = knownTokens.tokens.find(token => ciEquals(token.address, address));
  return value ?? null;
}

export const isFortuneToken = (address: string) => {
  return ciEquals(address, config.tokens.frtn.address);
}

export const isErc20Token = (address: string) => {
  return !!knownErc20Token(address);
}

export const isNativeCro = (address: string) => {
  return ciEquals(address, ethers.constants.AddressZero);
}

export const isWrappedeCro = (address: string) => {
  return ciEquals(address, config.tokens.wcro.address);
}

export const uniqueNftId = (nft: any) => {
  if (!nft) return null;
  return `${nft.nftAddress ?? nft.address}${nft.nftId ?? nft.id}`;
}

export function abbreviateDecimal(decimalStr: string | number, zeroThreshold: number = 5, maxDigitsWithSubscript: number = 4, maxDigitsWithoutSubscript: number = 8): string {
  if (typeof decimalStr !== 'string') decimalStr = `${decimalStr}`;

  // Handle special cases for zero input
  if (new Decimal(decimalStr).isZero()) {
    return "0";
  }

  if (new Decimal(decimalStr).gte(1)) {
    return new Decimal(decimalStr).toFixed(2);
  }

  // Find the first non-zero digit after the decimal
  const firstNonZeroIndex = decimalStr.indexOf('.') + 1 + decimalStr.slice(decimalStr.indexOf('.') + 1).search(/[^0]/);

  // Calculate the number of zeros following the decimal point
  const zeroCount = firstNonZeroIndex - decimalStr.indexOf('.') - 1;

  if (zeroCount >= zeroThreshold) {
    // Use subscript notation
    const subscriptNumbers = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    const subscript = zeroCount.toString().split('').map(num => subscriptNumbers[parseInt(num)]).join('');
    const significantDigits = decimalStr.slice(firstNonZeroIndex, firstNonZeroIndex + maxDigitsWithSubscript);
    return `0.0${subscript}${significantDigits}`;
  } else {
    // Regular formatting, just truncate to the max digits without subscript
    const start = decimalStr.indexOf('.') + 1;
    // const end = start + zeroCount + maxDigitsWithoutSubscript;
    const regularDigits = decimalStr.slice(start, maxDigitsWithoutSubscript);
    return `0.${regularDigits}`;
  }
}

export const chunkArray = <T,>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) => {
    return array.slice(index * size, index * size + size);
  });
};

export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
}

export const hasDatePassedSeconds = (unixTimestamp: number) => {
  return getUnixTimestamp() > unixTimestamp;
}