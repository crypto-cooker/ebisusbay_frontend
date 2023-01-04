import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: 'http://localhost:4000/api/',
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

export const cancelListing = async (signature, address, nonce, collectionAddress, tokenId) => {
  try {
    const response = await api.delete('gasless-listing', {
      params: {
        signature,
        address,
        nonce,
        collectionAddress,
        tokenId
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

export const buyListing = async (signature, address, listing) => {
  try {
    const response = await api.patch('gasless-listing/buy', {collectionAddress: listing.nftAddress, tokenId: listing.nftId, nonce: listing.nonce}, {
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

export const getServerSignature = async (signature, address, listings) => {
  try {
    const response = await api.get('gasless-listing/validator', {
      params: {
        signature,
        address,
        listings: listings.map(({ token: collectionAddress, id: tokenId, nonce }) => ({
          collectionAddress,
          tokenId,
          nonce
        }))
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw e;

  }
}

