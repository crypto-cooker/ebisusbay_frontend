import {CNS, TextRecords} from '@cnsdomains/core';
import { ethers } from 'ethers';
import {appConfig} from "../Config";

const config = appConfig()
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export const getCnsNames = async (addresses) => {
  const cns = new CNS(config.chain.id, readProvider);
  const names = [];
  await Promise.all(addresses.map(async (address) => names[address] = await cns.getName(address)));
  return names;
};

/**
 * Get a single or multiple CNS names
 *
 * @param address
 * @returns {Promise<string|Awaited<unknown>[]>}
 */
export const getCnsName = async (address) => {
  if (!address) return '';
  const cns = new CNS(config.chain.id, readProvider);
  return await cns.getName(address);
};

export const getCnsInfo = async (address) => {
  if (!address || !readProvider) return;

  try {
    const cns = new CNS(config.chain.id, readProvider);
    const profile = await cns.getProfile(address);
    if (profile) {
      return {
        name: profile.name,
        twitter: profile.socials[TextRecords.Twitter],
        instagram: profile.socials[TextRecords.Instagram],
        discord: profile.socials[TextRecords.Discord],
        telegram: profile.socials[TextRecords.Telegram],
        email: profile.socials[TextRecords.Email],
        url: profile.socials[TextRecords.Url],
      };
    }
  } catch (e) {
    console.log('cns error', e);
  }
};
