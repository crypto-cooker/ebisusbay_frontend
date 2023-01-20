import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const createListing = async (listing) => {
  try {
    const response = await api.post('gasless-listing', listing);

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const updateListing = async (listing) => {
  try {
    const response = await api.patch('gasless-listing', listing);

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
        listingIds
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const getServerSignature = async (address, listingIds) => {
  try {
    const response = await api.get('gasless-listing/validator', {
      params: {
        address,
        listingIds
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;
  }
}

