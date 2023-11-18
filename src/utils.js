import moment from 'moment';
import blacklist from './core/configs/blacklist.json';
import attributes from './core/configs/attributes.json';
import {useEffect, useRef} from 'react';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import {appConfig} from './Config';
import {getProfile} from "@src/core/cms/endpoints/profile";
import {commify} from "ethers/lib/utils";
import brands from '../src/core/data/brands.json';
import ImageService from "@src/core/services/image";
import {ethers} from "ethers";

const config = appConfig();
const drops = config.drops;
const collections = config.collections;

const gateway = config.urls.cdn.ipfs;

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function isMobile() {
  if (typeof window !== 'undefined') {
    return window.matchMedia(`(max-width: 767px)`).matches;
  }
  return false;
}

export function isMdScreen() {
  if (typeof window !== 'undefined') {
    return window.matchMedia(`(max-width: 1199px)`).matches;
  }
  return false;
}

function currentYPosition() {
  if (typeof window === 'undefined') {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  if (typeof window === 'undefined') {
    return;
  }
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  if (typeof window === 'undefined') {
    return;
  }
  var elm = document.getElementById(elmID);
  if (!elmID || !elm) {
    return;
  }
  var startY = currentYPosition();
  var stopY = elmYPosition(elm);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  let difference = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').diff(moment(date, 'DD/MM/YYYY HH:mm:ss')) / 1000;

  if (difference < 60) return `${Math.floor(difference)} seconds`;
  else if (difference < 3600) return `${Math.floor(difference / 60)} minutes`;
  else if (difference < 86400) return `${Math.floor(difference / 3660)} hours`;
  else if (difference < 86400 * 30) return `${Math.floor(difference / 86400)} days`;
  else if (difference < 86400 * 30 * 12) return `${Math.floor(difference / 86400 / 30)} months`;
  else return `${(difference / 86400 / 30 / 12).toFixed(1)} years`;
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  if (typeof window === 'undefined') {
    return;
  }
  var params = {};
  var search = decodeURIComponent(window.location.href.slice(window.location.href.indexOf('?') + 1));
  var definitions = search.split('&');
  definitions.forEach(function (val, key) {
    var parts = val.split('=', 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(' ');
}

/**
 * Takes a string and makes it human readable
 * Removes underscores, adds spaces, etc...
 *
 * @param str
 * @returns {string}
 * @deprecated Use humanizeAdvanced instead
 */
export function humanize(str) {
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

export function humanizeAdvanced(s) {
  if (s === null || s === undefined) return '';
  if (!s) return s;

  // Insert spaces before uppercase letters that follow lowercase letters
  const spacedString = s.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Split string by space, hyphen, underscore
  const words = spacedString.split(/[\s\-_]/);

  // Capitalize first letter of each word and make rest lowercase
  const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return formattedWords.join(' ').trim();
}

/**
 * Extra formatting for collection attributes not caught by humanize(str)
 *
 * @param str
 * @param address
 * @param category
 * @param makeHuman
 * @returns {string|*}
 */
export function mapAttributeString(str, address, category, makeHuman = false) {
  const mappings = attributes[address];
  let newStr = str?.toString() ?? '';

  if (mappings) {
    if (Object.keys(mappings).includes(str) && typeof mappings[str] === 'string') {
      return mappings[str]
    }

    if (Object.keys(mappings).includes(category) &&
      typeof mappings[category] === 'object' &&
      Object.keys(mappings[category]).includes(str.toString())) {
      return mappings[category][str];
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
export function siPrefixedNumber(num, exclude = 5) {
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

export function shortAddress(address) {
  return shortString(address, 4, 3);
}

export function shortString(str, leftChars = 3, rightChars = 3) {
  if (!str) return '';
  if (str.length <= leftChars + rightChars) return str;

  return `${str.substring(0, leftChars)}...${str.substring(str.length - rightChars, str.length)}`;
}

export function username(identifier) {
  try {
    if (identifier.startsWith('0x') && !identifier.endsWith('.cro')) {
      return shortAddress(ethers.utils.getAddress(identifier));
    }
    return identifier;
  } catch (e) {
    return identifier;
  }
}

export function timeSince(timestamp) {
  if (!timestamp) return timestamp;

  timestamp = millisecondTimestamp(timestamp);
  const seconds = Math.floor(Math.abs((new Date() - timestamp) / 1000));
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

export function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? ' d ' : ' d ') : '';
  var hDisplay = h > 0 ? h + (h == 1 ? ' h ' : ' h ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' m ' : ' m ') : '';
  var sDisplay = s > 0 ? s + (s == 1 ? ' s' : ' s') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * @description create explorer url.
 * @param transactionHash 0x000
 */
export function openWithCronosExplorer(transactionHash = '') {
  if (typeof window === 'undefined') {
    return;
  }
  window.open(`https://cronoscan.com/tx/${transactionHash}`, '_blank');
}

export function createSuccessfulTransactionToastContent(transactionHash) {
  return (
    <span>
      Success!
      <span
        className="link-primary"
        style={{ paddingLeft: '1rem' }}
        onClick={() => openWithCronosExplorer(transactionHash)}
      >
        See details
      </span>
    </span>
  );
}

export function createSuccessfulAddCartContent(onClickView) {
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
export function caseInsensitiveCompare(str1, str2) {
  return str1?.toLowerCase() === str2?.toLowerCase();
}

export function ciEquals(str1, str2) {
  return caseInsensitiveCompare(str1, str2);
}

export function ciIncludes(array, str) {
  if (!array) return false;
  return array.map((item) => item.toLowerCase()).includes(str.toLowerCase());
}

export function newlineText(text) {
  return text.split('\n').map((str, i) => <p key={i} className="mb-3">{str}</p>);
}

export const isFounderDrop = (address) => {
  return isDrop(address, 'founding-member');
};

export const isMagBrewVikingsDrop = (address) => {
  return isDrop(address, 'mag-brew-vikings');
};

export const isCreaturesDrop = (address) => {
  return isDrop(address, 'creatures');
};

export const isFounderVipDrop = (address) => {
  return isDrop(address, 'vip-founding-member');
};

export const isCrosmocraftsPartsDrop = (address) => {
  return isDrop(address, 'crosmocrafts-parts');
};

export const isCmbDrop = (address) => {
  return isDrop(address, 'cronos-gorilla-business');
};

export const isCyberCloneDrop = (address) => {
  return isDrop(address, 'cyber-clone');
};

export const isBossFrogzDrop = (address) => {
  return isDrop(address, 'trooprz-boss-frogz');
};

export const isRyoshiVipDrop = (address) => {
  return isDrop(address, 'ryoshi-tales-vip');
};

export const isDrop = (address, slug) => {
  const drop = drops.find((d) => d.slug === slug);
  return drop && caseInsensitiveCompare(drop.address, address);
};

export const isCollection = (address, matchesSlug, matchesAddress) => {
  const slugs = Array.isArray(matchesSlug) ? matchesSlug : [matchesSlug];
  const addresses = Array.isArray(matchesAddress) ? matchesAddress : [matchesAddress];
  return (
    slugs.some((s) => caseInsensitiveCompare(s, address)) ||
    addresses.some((a) => caseInsensitiveCompare(a, address))
  );
};

export const isBrandCollection = (slug, matchesAddress) => {
  const brand = brands.find((b) => b.slug === slug);
  return brand && brand.collections.some((address) => caseInsensitiveCompare(address, matchesAddress));
};

export const isCroCrowCollection = (address) => {
  return isCollection(address, 'cro-crow', '0xe4ab77ed89528d90e6bcf0e1ac99c58da24e79d5');
};

export const isCrognomidesCollection = (address) => {
  return isCollection(address, 'crognomides', '0x9AE196176b528680B75C7aea2FBd72456FDFAE17');
};

export const isMetapixelsCollection = (address) => {
  return isCollection(address, 'metapixels', '0x19e1f891002240fbea77ccc2adb6e73b93b3b97a');
};

export const isSouthSideAntsCollection = (address) => {
  return isCollection(address, 'south-side-ants', '0x5219cA4b335bA51aB717E474F31D803381D09d24');
};

export const isAntMintPassCollection = (address) => {
  return isCollection(address, 'ant-mint-pass', '0x844DaCD5A52DB9368E6C606f739599598031da84');
};

export const isCrosmocraftsPartsCollection = (address) => {
  return isCollection(address, 'crosmocrafts-parts', '0xf49C94E09E506aCcbe553b673FEe4F44efb06D55');
};

export const isCrosmocraftsCollection = (address) => {
  return isCollection(address, 'crosmocrafts', '0xC6373d6F369A9FfE7D93B21F2A5b0E16291d996D');
};

export const isWeirdApesCollection = (address) => {
  return isCollection(address, 'weird-apes-club', '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44');
};

export const isBabyWeirdApesCollection = (address) => {
  return isCollection(address, 'baby-weird-apes', '0x89F7114C73d5cef7d7EDCbDb14DaA092EB2194c9');
};

export const isLadyWeirdApesCollection = (address) => {
  return isCollection(address, 'lady-weird-apes', '0xD316F2F1872648a376D8c0937db1b4b10D1Ef8b1');
};

export const isVoxelWeirdApesCollection = (address) => {
  return isCollection(address, 'voxel-weird-apes', '0xe02A74813053e96C5C98F817C0949E0B00728Ef6');
};

export const isAnyWeirdApesCollection = (address) => {
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

export const isCronosVerseCollection = (address) => {
  return isCollection(address, 'cronosverse', '0x0aCDA31Cf1F301a7Eb8f988D47F708FbA058F8f5');
};

export const isEvoSkullCollection = (address) => {
  return isCollection(address, 'evo-skull', '0xbf4E430cD0ce8b93d4760958fe4ae66cDaCDB6c6');
};

export const isCroSkullPetsCollection = (address) => {
  return isCollection(address, 'croskull-pets', '0xB77959DC7a12F7549ACC084Af01259Fc48813c89')||
    isCollection(address, 'croskull-pets-s2', '0x54655D5468f072D5bcE1577c4a46F701C28a41A7') ||
    isCollection(address, 'croskull-pets-s3', '0x31B378ac025a341839CD81C4D29A8457324D3EbC');
};

export const isCroniesCollection = (address) => {
  return isCollection(address, 'cronies', '0xD961956B319A10CBdF89409C0aE7059788A4DaBb');
};

export const isCarkayousCollection = (address) => {
  return isCollection(address, 'carkayous-feral-fish', '0x72af9c869a4759e6d50e9656c0741b395532c3dd');
};

export const isLazyHorseCollection = (address) => {
  return isCollection(address, 'lazy-horse', '0xD504ed871d33dbD4f56f523A37dceC86Ee918cb6');
};

export const isLazyHorsePonyCollection = (address) => {
  return isCollection(address, 'lazy-horse-pony', '0x7d0259070B5f513CA543afb6a906d42af5884B1B');
};

export const isCnsCollection = (address) => {
  return isCollection(address, 'cronos-name-service', '0x15F7A67075C8b0883c355814Aa4e6C1e19994Af3');
};

export const isSscCollection = (address) => {
  return isCollection(address, 'ssc-access-cards', '0x45Fe45e5623a129d652F15962d901C7B609e5194');
};

export const isCroskullSbtCollection = (address) => {
  return isCollection(address, 'croskull-soulbound-token', '0x0977Ee79F7f6BedE288DD0264C77B4A1b32C48e8');
};

export const isArgonautsBrandCollection = (address) => {
  return isBrandCollection('argonauts', address);
};

export const isEbVipCollection = (address, id) => {
  const collection = collections.find((c) => c.slug === 'founding-member');
  return collection &&
    caseInsensitiveCompare(collection.address, address) &&
    id?.toString() === '2';
};

export const isFoundingMemberCollection = (address, id) => {
  const collection = collections.find((c) => c.slug === 'founding-member');
  return collection &&
    caseInsensitiveCompare(collection.address, address);
};

export const isCronosGorillaBusinessCollection = (address) => {
  return isCollection(address, 'cronos-gorilla-business', '0xc843f18d5605654391e7eDBEa250f6838C3e8936');
};

export const isCroSwapQuartermastersCollection = (address) => {
  return isCollection(address, 'croswap-quartermasters', '0x333580e4B59E74243451c531c29121c02F8E3102');
};

export const isDynamicNftImageCollection = (address) => {
  if(!address) return false;
  if (isLandDeedsCollection(address)) return true;
  if (isHerosCollection(address)) return true;

  return false;
};

export const isLandDeedsCollection = (address) => {
  return isCollection(
    address,
    'izanamis-cradle-land-deeds',
    ['0xcF7C77967FaD74d0B5104Edd476db2C6913fb0e3', '0x1189C0A75e7965974cE7c5253eB18eC93F2DE4Ad']
  );
};
export const isHerosCollection = (address) => {
  return isCollection(
    address,
    'ryoshi-heroes',
    ['0xF098C2aD290f32c8666ace27222d3E65cECE43b9', '0x458073C0fb97e42d441778aE4beFc8c1180E513e']
  );
}

export const isVaultCollection = (address) => {
  return ciEquals(address, config.contracts.vaultNft);
}

export const isPlayingCardsCollection = (address) => {
  return isCollection(address, 'ryoshi-playing-cards', '0xd87838a982a401510255ec27e603b0f5fea98d24');
}

export const isRyoshiTalesCollection = (address) => {
  return isCollection(address, 'ryoshi-tales', ['0x562e3e2d3f69c53d5a5728e8d7f977f3de150e04', '0xCDC905b5cDaDE71BFd3540e632aeFfE99b9965E4']);
}

export const isKoban = (address, nftId) => {
  return isCollection(address, 'ryoshi-resources', '0xce3f4e59834b5B52B301E075C5B3D427B6884b3d') && nftId?.toString() === '1';
}

export const isBundle = (addressOrSlug) => {
  return caseInsensitiveCompare(addressOrSlug, config.contracts.bundle) || addressOrSlug === 'nft-bundles';
}

export const percentage = (partialValue, totalValue) => {
  if (!totalValue || totalValue === 0) return 0;
  return Math.floor((100 * partialValue) / totalValue);
};

export const relativePrecision = (num, minDecimals = 1) => {
  if (num < 0.001) {
    return Math.round(num * 10000) / 100;
  } else if (num < 0.01) {
    return Math.round(num * 1000) / 10;
  }

  const multiplier = minDecimals + 1;
  return Math.round(num * 100 * multiplier) /  multiplier;
};

export const sliceIntoChunks = (arr, chunkSize) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

/**
 * Lookup a collection by address instead of slug
 *
 * @param address
 * @param tokenId
 * @returns {*}
 */
export const findCollectionByAddress = (address, tokenId) => {
  return collections.find((c) => {
    const matchesAddress = caseInsensitiveCompare(c.address, address);
    if (!tokenId) return matchesAddress;

    if (c.multiToken && c.slug !== 'ryoshi-resources') {
      const ids = c.tokens?.map((t) => t.id) ?? [c.id];
      const matchesToken = ids.includes(parseInt(tokenId));
      return matchesAddress && matchesToken;
    }

    return matchesAddress;
  });
};

export const findCollectionFloor = (knownContract, collectionsStats) => {
  const collectionStats = collectionsStats.find((o) => {
    const address = o.address ?? o.address;
    if (knownContract.multiToken && address.indexOf('-') !== -1) {
      let parts = o.address.split('-');
      return caseInsensitiveCompare(knownContract.address, parts[0]) && knownContract.id === parseInt(parts[1]);
    } else {
      return caseInsensitiveCompare(knownContract.address, o.address);
    }
  });

  return collectionStats ? collectionStats.stats.total.floorPrice : null;
};

export const round = (num, decimals) => {
  if (!decimals) return Math.round(num);

  const pow = Math.pow(10, decimals);
  return Math.round(num * pow) / pow;
};

export const convertIpfsResource = (resource, tooltip) => {
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

export const isUserBlacklisted = (address) => {
  const users = blacklist.flatMap((record) => record.users);
  return users.some((bAddress) => caseInsensitiveCompare(address, bAddress));
};

export const isNftBlacklisted = (address, id) => {
  const collections = blacklist.flatMap((record) => record.tokens);
  return collections.some((collection) => {
    const matchesAddress = caseInsensitiveCompare(collection.address, address);
    const matchesSlug = collection.slug === address;
    const includesId = collection.ids.includes(parseInt(id));

    return (matchesSlug || matchesAddress) && includesId;
  });
};

export const devLog = (...params) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(params);
  }
};

/**
 * Better way to set an interval that works with React hooks
 * Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback
 * @param delay
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * Ensure that a timestamp is in milliseconds
 *
 * @param timestamp
 * @returns {number}
 */
export const millisecondTimestamp = (timestamp) => {
  if (timestamp.toString().length < 13) {
    return Number(`${timestamp}000`);
  }

  return Number(timestamp);
};

export const isEventValidNumber = (e) => {
  const re = /^[0-9\b]+$/;
  const validKeys = ['Backspace', 'Delete'];
  return e.key === '' || re.test(e.key) || validKeys.includes(e.key);
};

export const getSlugFromAddress = (address) => {
  const collection = collections.find((c) => c.address.toLowerCase() === address.toLowerCase());
  return collection?.slug;
};

export const getAddressFromSlug = (slug) => {
  const collection = collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  return collection?.address;
};

// can use web3.utils.isAddress tho
export const isAddress = (address) => {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
};

export const isEmptyObj = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const rankingsLogoForCollection = (collection) => {
  let logo = '/img/logos/ebisu-technicolor.svg';
  if (!collection) ImageService.translate(logo).avatar();

  if (collection.metadata.rankings?.source === 'rarity_sniper') logo = '/img/logos/rarity-sniper.png';
  else if (collection.metadata.rankings?.source === 'provided') logo = collection.metadata.avatar;

  return ImageService.translate(logo).avatar();
};
export const rankingsTitleForCollection = (collection) => {
  let title = `Ranking provided by Ebisu's Bay`;
  if (!collection) return title;

  if (collection.metadata.rankings?.source === 'rarity_sniper') title = `Ranking provided by Rarity Sniper`;
  else if (collection.metadata.rankings?.source === 'provided') title = `Ranking provided by ${collection.name}`;

  return title;
};
export const rankingsLinkForCollection = (collection, id) => {
  let link = null;
  if (!collection) return link;

  if (collection.metadata.rankings?.source === 'rarity_sniper')
    link = `https://raritysniper.com/${collection.metadata.rankings.slug}/${id}`;
  else if (collection.metadata.rankings?.source === 'provided' && collection.metadata.website)
    link = collection.metadata.website;

  return link;
};

export const buildTwitterUrl = (username) => {
  if (!username || username.startsWith('http')) return username;

  return `https://twitter.com/${username}`;
}

export const buildInstagramUrl = (username) => {
  if (!username || username.startsWith('http')) return username;

  return `https://instagram.com/${username}`;
}

export const isNumeric = (str) => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export const stripSpaces = (str) => {
  return str.replace(/\W/g, '');
}

export const appUrl = (path) => {
  return new URL(path, appConfig('urls.app'));
}

/**
 * Removes extra slashes from url path
 *
 * @param url
 */
export function cleanUrl(url) {
  return url.replace(/([^:])(\/\/+)/g, '$1/');
}

/**
 * Combines url components and cleans it
 *
 * @param components
 */
export function urlify(...components) {
  return cleanUrl(components.join('/'));
}

export const pluralize = (val, word, plural = word + 's') => {
  const _pluralize = (num, word, plural = word + 's') =>
    [1, -1].includes(Number(num)) ? word : plural;
  if (typeof val === 'object') return (num, word) => _pluralize(num, word, val[word]);
  return _pluralize(val, word, plural);
};

export const isGaslessListing = (listingId) => {
  return listingId && listingId.toString().startsWith('0x')
}

export const usdFormat = (num) => {
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

export const findNextLowestNumber = (array, value) => {
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
export const titleCase = (str) => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

export const knownErc20Token = (address) => {
  const value = Object.entries(config.tokens).find(([key, value]) => caseInsensitiveCompare(value.address, address));
  return value ? value[1] : null;
}

export const isFortuneToken = (address) => {
  return caseInsensitiveCompare(address, config.tokens.frtn.address);
}

export const isErc20Token = (address) => {
  return !!knownErc20Token(address);
}