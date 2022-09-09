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
        twitter: profile.resolver.socials[TextRecords.Twitter],
        instagram: profile.resolver.socials[TextRecords.Instagram],
        discord: profile.resolver.socials[TextRecords.Discord],
        telegram: profile.resolver.socials[TextRecords.Telegram],
        email: profile.resolver.socials[TextRecords.Email],
        url: profile.resolver.socials[TextRecords.Url],
        description: profile.resolver.socials[TextRecords.Description]
      };
    }
  } catch (e) {
    console.log('cns error', e);
  }
};
