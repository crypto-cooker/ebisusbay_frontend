import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: config.urls.cms,
});

export const createListing = async (signature, address, listing) => {
  try {
    const response = await api.post('gasless-listing', listing, {
      params: {
        signature,
        address
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const updateListing = async (signature, address, listing) => {
  try {
    const response = await api.patch('gasless-listing', listing, {
      params: {
        signature,
        address
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const cancelListing = async (signature, address, listingId) => {
  try {
    const response = await api.delete('gasless-listing', {
      params: {
        signature,
        address,
        listingId
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const buyListing = async (signature, address, listings) => {
  try {
    const response = await api.patch('gasless-listing/buy', {listings}, {
      params: {
        signature,
        address
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const getServerSignature = async (signature, address, listings, fee) => {
  try {
    const response = await api.get('gasless-listing/validator', {
      params: {
        fee,
        address,
        signature,
        listings: listings.map(({ address: collectionAddress, id: tokenId, nonce, listingId: id }) => ({
          collectionAddress,
          tokenId,
          nonce,
          id
        }))
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

