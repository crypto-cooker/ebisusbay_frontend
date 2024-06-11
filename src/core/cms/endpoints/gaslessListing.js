import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const upsertListing = async (listing) => {
  try {
    const response = await api.post('gasless-listing', listing);

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const cancelListing = async (listingIds) => {
  try {
    const response = await api.delete('gasless-listing', {
      params: {
        listingIds,
        express: false
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const expressCancelListing = async (listingIds, address, signature) => {
  try {
    const response = await api.delete('gasless-listing/express-cancel', {
      params: {
        listingIds,
        express: true,
        address,
        signature
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const getServerSignature = async (address, listingIds, recipientAddress, executor) => {
  try {
    const response = await api.get('gasless-listing/validator', {
      params: {
        address,
        listingIds,
        recipient: recipientAddress,
        executor
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;
  }
}

