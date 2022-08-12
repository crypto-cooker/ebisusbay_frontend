import { CNS, TextRecords } from '@cnsdomains/core';
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
    const cnsProfile = {};
    cnsProfile.name = await cns.getName(address);
    if (cnsProfile.name) {
      const name = cns.name(cnsProfile.name);
      cnsProfile.twitter = await name.getText(TextRecords.Twitter);
      cnsProfile.discord = await name.getText(TextRecords.Discord);
      cnsProfile.instagram = await name.getText(TextRecords.Instagram);
      cnsProfile.email = await name.getText(TextRecords.Email);
      cnsProfile.url = await name.getText(TextRecords.Url);
      return cnsProfile;
    }
  } catch (e) {
    console.log('cns error', e);
  }
};
