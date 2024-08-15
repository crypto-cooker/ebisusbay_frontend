import { ethers } from 'ethers';
import {appConfig} from "../../../config";
import CROID, { getCroidAddress } from '@cronosid/croidjs'

const config = appConfig()
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

/**
 * Get a Cronos ID name from a 0x address
 *
 * @param name
 * @returns {Promise<string>}
 */
export const getCroidAddressFromName = async (name: string) => {
  if (!name || !readProvider) return;

  const croid = new CROID({ provider: readProvider, croidAddress: getCroidAddress(config.chain.id)});
  const address = await croid.name(name).getAddress();
  if (address === ethers.constants.AddressZero) {
    return undefined;
  }

  return address;
}

/**
 * Get various profile information for a given address
 *
 * @param address
 * @returns {Promise<{twitter: *, discord: *, name: string, telegram: *, description: *, instagram: *, email: *, url: *}>}
 */
export const getCroidInfo = async (address: string) => {
  if (!address || !readProvider) return;

  try {
    const croid = new CROID({ provider: readProvider, croidAddress: getCroidAddress(config.chain.id)});
    const profile = await croid.getName(address);

    if (profile) {
      return {
        name: profile.name,
      };
    }
  } catch (e) {
    console.log('CROID error', e);
  }
};

/**
 * Check if a value matches the format of a Cronos domain
 *
 * @param value
 * @returns {*}
 */
export const isCroName = (value: string) => {
  return value.endsWith('.cro');
}
