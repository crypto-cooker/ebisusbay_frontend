import {cleanUrl} from "@market/helpers/utils";
import {getAddress} from "viem";

/*
 * functions safe for edge-runtime,
 * typically copied from other parts of the stack but without dependency baggage
 */


/**
 * Combines url components and cleans it
 *
 * @param components
 */
export function urlify(...components: any[]) {
  return cleanUrl(components.join('/'));
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

/**
 * Rounds a number to nearest decimals, with added safety
 *
 * @param num
 * @param decimals
 */
export const round = (num?: number | string, decimals?: number) => {
  if (!num) return 0;
  if (typeof num === 'string') num = parseFloat(num);
  if (!decimals) return Math.round(num);

  const pow = Math.pow(10, decimals);
  return Math.round(num * pow) / pow;
};

/**
 * Checks if an address is a properly formatted 0x address
 * @param value
 */
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

/**
 * Commify a numeric value
 * copied from ethers
 *
 * @param value
 */
export function commify(value: string | number): string {
  const comps = String(value).split(".");

  if (comps.length > 2 || !comps[0].match(/^-?[0-9]*$/) || (comps[1] && !comps[1].match(/^[0-9]*$/)) || value === "." || value === "-.") {
    console.error("invalid value", "value", value);
  }

  // Make sure we have at least one whole digit (0 if none)
  let whole = comps[0];

  let negative = "";
  if (whole.substring(0, 1) === "-") {
    negative = "-";
    whole = whole.substring(1);
  }

  // Make sure we have at least 1 whole digit with no leading zeros
  while (whole.substring(0, 1) === "0") { whole = whole.substring(1); }
  if (whole === "") { whole = "0"; }

  let suffix = "";
  if (comps.length === 2) { suffix = "." + (comps[1] || "0"); }
  while (suffix.length > 2 && suffix[suffix.length - 1] === "0") {
    suffix = suffix.substring(0, suffix.length - 1);
  }

  const formatted = [];
  while (whole.length) {
    if (whole.length <= 3) {
      formatted.unshift(whole);
      break;
    } else {
      const index = whole.length - 3;
      formatted.unshift(whole.substring(index));
      whole = whole.substring(0, index);
    }
  }

  return negative + formatted.join(",") + suffix;
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