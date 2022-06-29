import { CNS, TextRecords } from '@cnsdomains/core';
import config from '../Assets/networks/rpc_config.json';
import { ethers } from 'ethers';

const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);

export const getCnsNames = async (addresses) => {
  const cns = new CNS(config.chain_id, readProvider);
  return await Promise.all(addresses.map(async (address) => await cns.getName(address)));
};

export const getCnsName = async (address) => {
  if (!address) return '';

  return getCnsNames([address]);
};

export const getCnsInfo = async (address) => {
  if (!address || !readProvider) return;

  try {
    const cns = new CNS(config.chain_id, readProvider);
    const cnsProfile = {};
    cnsProfile.name = await cns.getName(address);
    if (cnsProfile.name) {
      cnsProfile.twitter = await cns.name(cnsProfile.name).getText(TextRecords.Twitter);
      cnsProfile.avatar = await cns.name(cnsProfile.name).getText(TextRecords.Avatar);
      cnsProfile.discord = await cns.name(cnsProfile.name).getText(TextRecords.Discord);
      cnsProfile.telegram = await cns.name(cnsProfile.name).getText(TextRecords.Telegram);
      cnsProfile.instagram = await cns.name(cnsProfile.name).getText(TextRecords.Instagram);
      cnsProfile.email = await cns.name(cnsProfile.name).getText(TextRecords.Email);
      cnsProfile.url = await cns.name(cnsProfile.name).getText(TextRecords.Url);

      return cnsProfile;
    }
  } catch (e) {
    console.log('cns error', e);
  }
};
