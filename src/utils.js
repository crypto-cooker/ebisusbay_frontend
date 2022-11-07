import moment from 'moment';
import { ethers, utils } from 'ethers';
import blacklist from './core/configs/blacklist.json';
import attributes from './core/configs/attributes.json';
import { useEffect, useRef } from 'react';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node';
import { appConfig } from './Config';
import { hostedImage } from './helpers/image';
import {getProfile} from "@src/core/cms/endpoints/profile";

const drops = appConfig('drops');
const collections = appConfig('collections');

const gateway = 'https://mygateway.mypinata.cloud';

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
      Object.keys(mappings[category]).includes(str)) {
      return mappings[category][str];
    }
  }

  return makeHuman ? humanize(newStr) : newStr;
}

/**
 * Converts a number to use SI prefixed notation
 *
 * @param num
 * @returns {string|number}
 */
export function siPrefixedNumber(num) {
  // Twelve Zeroes for Trillions
  return Math.abs(Number(num)) >= 1.0e12
    ? (Math.abs(Number(num)) / 1.0e12).toFixed(2) + 'T'
    : // Nine Zeroes for Billions
    Math.abs(Number(num)) >= 1.0e9
      ? (Math.abs(Number(num)) / 1.0e9).toFixed(2) + 'B'
      : // Six Zeroes for Millions
    Math.abs(Number(num)) >= 1.0e6
      ? (Math.abs(Number(num)) / 1.0e6).toFixed(2) + 'M'
      : // Three Zeroes for Thousands
    Math.abs(Number(num)) >= 1.0e3
      ? (Math.abs(Number(num)) / 1.0e3).toFixed(2) + 'K'
      : Math.abs(Number(num));
}

export function shortAddress(address) {
  return shortString(address, 4, 3);
}

export function shortString(str, leftChars = 3, rightChars = 3) {
  if (!str) return '';
  if (str.length <= leftChars + rightChars) return str;

  return `${str.substring(0, leftChars)}...${str.substring(str.length - rightChars, str.length)}`;
}

export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
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

export function newlineText(text) {
  return text.split('\n').map((str, i) => <p key={i} className="mb-3">{str}</p>);
}

export const isCroniesDrop = (address) => {
  return isDrop(address, 'cronies');
};

export const isFounderDrop = (address) => {
  return isDrop(address, 'founding-member');
};

export const isFounderCollection = (address) => {
  const collection = collections.find((c) => caseInsensitiveCompare(c.address, address));
  return collection && ['vip-founding-member', 'founding-member'].includes(collection.slug);
};

export const isCrognomesDrop = (address) => {
  return isDrop(address, 'crognomes-member');
};

export const isCrognomidesDrop = (address) => {
  return isDrop(address, 'crognomides');
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

export const isDrop = (address, slug) => {
  const drop = drops.find((d) => d.slug === slug);
  return drop && caseInsensitiveCompare(drop.address, address);
};

export const isCollection = (address, slug) => {
  if (Array.isArray(slug)) {
    return collections.some((c) => slug.includes(c.slug) && caseInsensitiveCompare(c.address, address));
  }

  const collection = collections.find((c) => c.slug === slug);
  return collection && caseInsensitiveCompare(collection.address, address);
};

export const isCroCrowCollection = (address) => {
  return isCollection(address, 'cro-crow');
};

export const isCrognomidesCollection = (address) => {
  return isCollection(address, 'crognomides');
};

export const isMetapixelsCollection = (address) => {
  return isCollection(address, 'metapixels');
};

export const isSouthSideAntsCollection = (address) => {
  return isCollection(address, 'south-side-ants');
};

export const isAntMintPassCollection = (address) => {
  return isCollection(address, 'ant-mint-pass');
};

export const isCrosmocraftsPartsCollection = (address) => {
  return isCollection(address, 'crosmocrafts-parts');
};

export const isCrosmocraftsCollection = (address) => {
  return isCollection(address, 'crosmocrafts');
};

export const isWeirdApesCollection = (address) => {
  return isCollection(address, 'weird-apes-club');
};

export const isBabyWeirdApesCollection = (address) => {
  return isCollection(address, 'baby-weird-apes');
};

export const isLadyWeirdApesCollection = (address) => {
  return isCollection(address, 'lady-weird-apes');
};

export const isAnyWeirdApesCollection = (address) => {
  return isCollection(address, [
    'weird-apes-club',
    'baby-weird-apes',
    'lady-weird-apes'
  ]);
};

export const isCronosVerseCollection = (address) => {
  return isCollection(address, 'cronosverse');
};

export const isEvoSkullCollection = (address) => {
  return isCollection(address, 'evo-skull');
};

export const isCroSkullPetsCollection = (address) => {
  return isCollection(address, 'croskull-pets');
};

export const isCroniesCollection = (address) => {
  return isCollection(address, 'cronies');
};

export const isIcyValkyriesCollection = (address) => {
  return isCollection(address, 'icy-valkyries');
};

export const isCarkayousCollection = (address) => {
  return isCollection(address, 'carkayous');
};

export const isLazyHorseCollection = (address) => {
  return isCollection(address, 'lazy-horse');
};

export const isLazyHorsePonyCollection = (address) => {
  return isCollection(address, 'lazy-horse-pony');
};

export const isCnsCollection = (address) => {
  return isCollection(address, 'cronos-name-service');
};

export const isSscCollection = (address) => {
  return isCollection(address, 'ssc-access-cards');
};

export const isEbVipCollection = (address, id) => {
  const collection = collections.find((c) => c.slug === 'vip-founding-member');
  return collection &&
    caseInsensitiveCompare(collection.address, address) &&
    collection.id.toString() === id.toString();
};

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

    if (c.multiToken) {
      const ids = c.tokens?.map((t) => t.id) ?? [c.id];
      const matchesToken = ids.includes(parseInt(tokenId));
      return matchesAddress && matchesToken;
    }

    return matchesAddress;
  });
};

export const findCollectionFloor = (knownContract, collectionsStats) => {
  const collectionStats = collectionsStats.find((o) => {
    if (knownContract.multiToken && o.collection.indexOf('-') !== -1) {
      let parts = o.collection.split('-');
      return caseInsensitiveCompare(knownContract.address, parts[0]) && knownContract.id === parseInt(parts[1]);
    } else {
      return caseInsensitiveCompare(knownContract.address, o.collection);
    }
  });

  return collectionStats ? collectionStats.floorPrice : null;
};

export const round = (num, decimals) => {
  if (!decimals) return Math.round(num);

  const pow = Math.pow(10, decimals);
  return Math.round(num * pow) / pow;
};

export const convertIpfsResource = (resource, tooltip) => {
  if (!resource || typeof window === 'undefined') return;

  let gatewayTools = new IPFSGatewayTools();

  let linkedResource;
  if (resource.startsWith('ipfs')) {
    linkedResource = `${gateway}/ipfs/${resource.substring(7)}`;
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

export const getUserDisplayName = async (address) => {
  if (!address) return '';

  try {
    let profile = await getProfile(address);
    if (profile?.data) return profile.data.username;
  } catch (error) {
    return shortAddress(address);
  }

  return shortAddress(address);
};

export const isEmptyObj = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const rankingsLogoForCollection = (collection) => {
  let logo = '/img/logos/ebisu-technicolor.svg';
  if (!collection) hostedImage(logo, true);

  if (collection.metadata.rankings?.source === 'rarity_sniper') logo = '/img/logos/rarity-sniper.png';
  else if (collection.metadata.rankings?.source === 'provided') logo = collection.metadata.avatar;

  return hostedImage(logo, true);
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

export const pluralize = (val, word, plural = word + 's') => {
  const _pluralize = (num, word, plural = word + 's') =>
    [1, -1].includes(Number(num)) ? word : plural;
  if (typeof val === 'object') return (num, word) => _pluralize(num, word, val[word]);
  return _pluralize(val, word, plural);
};